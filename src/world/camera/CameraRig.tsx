import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useShipStore } from "../../stores/useShipStore";
import { useViewStore } from "../../stores/useViewStore";

const INTRO_HOLD_TIME = 1;
const CAMERA_TRANSITION_TIME = 2.4;

const COCKPIT_LOCAL_POSITION = new THREE.Vector3(0, 0.5, -0.72);

const COCKPIT_LOOK_UP = THREE.MathUtils.degToRad(0);

// Cinematic camera configuration.
const EXIT_CAMERA_START_DISTANCE = 13;
const EXIT_CAMERA_END_DISTANCE = 9;
const EXIT_CAMERA_START_HEIGHT = 3;
const EXIT_CAMERA_END_HEIGHT = 3.5;

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export default function CameraRig() {
  const introElapsed = useRef(0);

  const shipPosition = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());

  const flightRotation = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  const cockpitPosition = useRef(new THREE.Vector3());
  const cockpitForward = useRef(new THREE.Vector3());
  const cockpitLookTarget = useRef(new THREE.Vector3());

  const cockpitRotation = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  const chasePosition = useRef(new THREE.Vector3());
  const chaseLookTarget = useRef(new THREE.Vector3());

  const blendedPosition = useRef(new THREE.Vector3());
  const blendedLookTarget = useRef(new THREE.Vector3());

  // Reusable vectors for the portal camera.
  const flatForward = useRef(new THREE.Vector3());
  const orbitRight = useRef(new THREE.Vector3());
  const orbitOffset = useRef(new THREE.Vector3());
  const orbitPosition = useRef(new THREE.Vector3());
  const orbitLookTarget = useRef(new THREE.Vector3());

  // Used to snap to chase after the cinematic.
  const cinematicJustFinished = useRef(false);

  const entryCameraStart = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    useViewStore.getState().reset();
  }, []);

  // ==========================================
  // MANUAL VIEW TOGGLE
  // ==========================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "KeyC" || event.repeat) {
        return;
      }

      const viewState = useViewStore.getState();
      const shipState = useShipStore.getState();

      if (
        !viewState.introComplete ||
        shipState.entryCinematic !== null ||
        shipState.exitCinematic !== null
      ) {
        return;
      }

      viewState.toggleView();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Run after the flight hook so we see its
  // updated ship position and animation timer.
  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);

    const shipState = useShipStore.getState();

    const [x, y, z] = shipState.position;
    const yaw = shipState.yaw;
    const pitch = shipState.pitch;

    shipPosition.current.set(x, y, z);

    // ==========================================
    // SHIP DIRECTION
    // ==========================================

    flightRotation.current.set(pitch, yaw, 0, "YXZ");

    forward.current
      .set(0, 0, -1)
      .applyEuler(flightRotation.current)
      .normalize();

    // ==========================================
    // COCKPIT CAMERA
    // ==========================================

    cockpitPosition.current
      .copy(COCKPIT_LOCAL_POSITION)
      .applyEuler(flightRotation.current)
      .add(shipPosition.current);

    cockpitRotation.current.set(pitch + COCKPIT_LOOK_UP, yaw, 0, "YXZ");

    cockpitForward.current
      .set(0, 0, -1)
      .applyEuler(cockpitRotation.current)
      .normalize();

    cockpitLookTarget.current
      .copy(cockpitPosition.current)
      .addScaledVector(cockpitForward.current, 20);

    // ==========================================
    // NORMAL CHASE CAMERA
    // ==========================================

    chasePosition.current
      .copy(shipPosition.current)
      .addScaledVector(forward.current, -9);

    chasePosition.current.y += 3.5;

    chaseLookTarget.current
      .copy(shipPosition.current)
      .addScaledVector(forward.current, 6);

    chaseLookTarget.current.y += 0.4;

    // ==========================================
    // BILLBOARD DIGITAL ENTRY CAMERA
    // ==========================================

    const entry = shipState.entryCinematic;

    if (entry) {
      // Capture the camera's exact position when
      // the cinematic first begins.
      if (!entryCameraStart.current) {
        entryCameraStart.current = camera.position.clone();
      }

      const progress = THREE.MathUtils.clamp(
        entry.elapsed / entry.duration,
        0,
        1,
      );

      const push = THREE.MathUtils.smoothstep(progress, 0, 1);

      // The camera gradually closes in on the ship
      // as both travel through the billboard.
      const endPosition = shipPosition.current
        .clone()
        .addScaledVector(forward.current, -1.2);

      endPosition.y += 0.4;

      // Start at the camera's REAL position,
      // regardless of the current flight speed.
      camera.position.lerpVectors(entryCameraStart.current, endPosition, push);

      const lookTarget = shipPosition.current
        .clone()
        .addScaledVector(forward.current, 8);

      camera.lookAt(lookTarget);

      return;
    }

    // Reset after leaving the entry cinematic.
    entryCameraStart.current = null;

    // ==========================================
    // BILLBOARD EXIT CINEMATIC
    // ==========================================

    const cinematic = shipState.exitCinematic;

    if (cinematic) {
      const progress = THREE.MathUtils.clamp(
        cinematic.elapsed / cinematic.duration,
        0,
        1,
      );

      const eased = easeInOutCubic(progress);

      // Horizontal ship direction.
      flatForward.current.copy(forward.current).setY(0).normalize();

      // Right-hand direction for the orbit.
      orbitRight.current.set(-flatForward.current.z, 0, flatForward.current.x);

      // Orbit from in front of the nose
      // to behind the engines.
      const angle = eased * Math.PI;

      const distance = THREE.MathUtils.lerp(
        EXIT_CAMERA_START_DISTANCE,
        EXIT_CAMERA_END_DISTANCE,
        eased,
      );

      const height = THREE.MathUtils.lerp(
        EXIT_CAMERA_START_HEIGHT,
        EXIT_CAMERA_END_HEIGHT,
        eased,
      );

      orbitOffset.current
        .copy(flatForward.current)
        .multiplyScalar(Math.cos(angle) * distance);

      orbitOffset.current.addScaledVector(
        orbitRight.current,
        Math.sin(angle) * distance,
      );

      orbitPosition.current.copy(shipPosition.current).add(orbitOffset.current);

      orbitPosition.current.y += height;

      // At the start, look at the ship.
      // At the end, look ahead as chase does.
      orbitLookTarget.current
        .copy(shipPosition.current)
        .addScaledVector(flatForward.current, 6 * eased);

      orbitLookTarget.current.y += 0.4;

      camera.position.copy(orbitPosition.current);
      camera.lookAt(orbitLookTarget.current);

      cinematicJustFinished.current = true;

      // The camera owns the completion.
      // It has now rendered the final frame.
      if (progress >= 1) {
        camera.position.copy(chasePosition.current);
        camera.lookAt(chaseLookTarget.current);

        useShipStore.getState().finishExitCinematic();
      }

      return;
    }

    // ==========================================
    // NORMAL CAMERA HANDOFF
    // ==========================================

    let viewState = useViewStore.getState();

    // Startup sequence.
    if (!viewState.introComplete && viewState.viewMode === "chase") {
      introElapsed.current += dt;

      if (introElapsed.current >= INTRO_HOLD_TIME) {
        viewState.setViewMode("cockpit");
        viewState = useViewStore.getState();
      }
    }

    // Existing cockpit/chase transition.
    const targetProgress = viewState.viewMode === "chase" ? 1 : 0;

    let progress = viewState.transitionProgress;

    if (progress !== targetProgress) {
      const direction = targetProgress > progress ? 1 : -1;

      progress += direction * (dt / CAMERA_TRANSITION_TIME);

      if (direction > 0) {
        progress = Math.min(progress, targetProgress);
      } else {
        progress = Math.max(progress, targetProgress);
      }

      useViewStore.getState().setTransitionProgress(progress);
    }

    // Intro complete.
    if (
      !viewState.introComplete &&
      viewState.viewMode === "cockpit" &&
      progress <= 0
    ) {
      useViewStore.getState().completeIntro();
    }

    // Full cockpit mode.
    if (progress <= 0) {
      cinematicJustFinished.current = false;

      camera.position.copy(cockpitPosition.current);
      camera.lookAt(cockpitLookTarget.current);

      return;
    }

    // Full chase mode.
    if (progress >= 1) {
      if (cinematicJustFinished.current) {
        // No camera drift after the portal exit.
        camera.position.copy(chasePosition.current);
        cinematicJustFinished.current = false;
      } else {
        const smoothing = 1 - Math.exp(-5 * delta);

        camera.position.lerp(chasePosition.current, smoothing);
      }

      camera.lookAt(chaseLookTarget.current);
      return;
    }

    // Blended cockpit/chase camera.
    const easedProgress = easeInOutCubic(progress);

    blendedPosition.current.lerpVectors(
      cockpitPosition.current,
      chasePosition.current,
      easedProgress,
    );

    blendedLookTarget.current.lerpVectors(
      cockpitLookTarget.current,
      chaseLookTarget.current,
      easedProgress,
    );

    camera.position.copy(blendedPosition.current);
    camera.lookAt(blendedLookTarget.current);
  }, 1);

  return null;
}
