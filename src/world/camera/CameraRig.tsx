// Camera motion rig.

import { useFrame } from "@react-three/fiber";

import { useEffect, useRef } from "react";

import * as THREE from "three";

import { useShipStore } from "../../stores/useShipStore";

import { useViewStore } from "../../stores/useViewStore";

// View config.
const INTRO_HOLD_TIME = 1;

// Camera timing.
const CAMERA_TRANSITION_TIME = 2.4;

// Pilot eye position.
const COCKPIT_LOCAL_POSITION = new THREE.Vector3(0, 0.5, -0.72);

// Cockpit angle.
const COCKPIT_LOOK_UP = THREE.MathUtils.degToRad(0);

// Easing.
function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
}

export default function CameraRig() {
  const introElapsed = useRef(0);

  // =========================
  // SHIP
  // =========================

  const shipPosition = useRef(new THREE.Vector3());

  const forward = useRef(new THREE.Vector3());

  const flightRotation = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  // =========================
  // COCKPIT
  // =========================

  const cockpitPosition = useRef(new THREE.Vector3());

  const cockpitForward = useRef(new THREE.Vector3());

  const cockpitLookTarget = useRef(new THREE.Vector3());

  const cockpitRotation = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  // =========================
  // CHASE
  // =========================

  const chasePosition = useRef(new THREE.Vector3());

  const chaseLookTarget = useRef(new THREE.Vector3());

  // =========================
  // BLENDED CAMERA
  // =========================

  const blendedPosition = useRef(new THREE.Vector3());

  const blendedLookTarget = useRef(new THREE.Vector3());

  // =========================
  // INITIALISE
  // =========================

  useEffect(() => {
    useViewStore.getState().reset();
  }, []);

  // =========================
  // MANUAL VIEW TOGGLE
  // =========================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "KeyC" || event.repeat) {
        return;
      }

      const viewState = useViewStore.getState();

      /*
       * Don't interrupt the
       * automatic startup sequence.
       */
      if (!viewState.introComplete) {
        return;
      }

      viewState.toggleView();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // =========================
  // FRAME
  // =========================

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.05);

    const shipState = useShipStore.getState();

    const [x, y, z] = shipState.position;

    const yaw = shipState.yaw;

    const pitch = shipState.pitch;

    shipPosition.current.set(x, y, z);

    // =========================
    // SHIP DIRECTION
    // =========================

    flightRotation.current.set(pitch, yaw, 0, "YXZ");

    forward.current
      .set(0, 0, -1)
      .applyEuler(flightRotation.current)
      .normalize();

    // =========================
    // COCKPIT POSITION
    // =========================

    cockpitPosition.current
      .copy(COCKPIT_LOCAL_POSITION)
      .applyEuler(flightRotation.current)
      .add(shipPosition.current);

    // =========================
    // COCKPIT VIEW
    // =========================

    cockpitRotation.current.set(pitch + COCKPIT_LOOK_UP, yaw, 0, "YXZ");

    cockpitForward.current
      .set(0, 0, -1)
      .applyEuler(cockpitRotation.current)
      .normalize();

    cockpitLookTarget.current
      .copy(cockpitPosition.current)
      .addScaledVector(cockpitForward.current, 20);

    // =========================
    // CHASE POSITION
    // =========================

    /*
     * This is your existing
     * third-person camera.
     */
    chasePosition.current.copy(shipPosition.current);

    chasePosition.current.addScaledVector(forward.current, -9);

    chasePosition.current.y += 3.5;

    // =========================
    // CHASE TARGET
    // =========================

    chaseLookTarget.current.copy(shipPosition.current);

    chaseLookTarget.current.addScaledVector(forward.current, 6);

    chaseLookTarget.current.y += 0.4;

    let viewState = useViewStore.getState();

    // =========================
    // AUTOMATIC INTRO
    // =========================

    if (!viewState.introComplete && viewState.viewMode === "chase") {
      introElapsed.current += dt;

      if (introElapsed.current >= INTRO_HOLD_TIME) {
        viewState.setViewMode("cockpit");

        viewState = useViewStore.getState();
      }
    }

    // =========================
    // TRANSITION PROGRESS
    // =========================

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

    // =========================
    // INTRO FINISHED
    // =========

    if (
      !viewState.introComplete &&
      viewState.viewMode === "cockpit" &&
      progress <= 0
    ) {
      useViewStore.getState().completeIntro();
    }

    // =========================
    // FULL COCKPIT MODE
    // =========================

    if (progress <= 0) {
      camera.position.copy(cockpitPosition.current);

      camera.lookAt(cockpitLookTarget.current);

      return;
    }

    // =========================
    // FULL CHASE MODE
    // =========================

    if (progress >= 1) {
      /*
       * Preserve the smoothing you
       * already had in CameraRig.
       */
      const positionSmoothing = 1 - Math.exp(-5 * delta);

      camera.position.lerp(chasePosition.current, positionSmoothing);

      camera.lookAt(chaseLookTarget.current);

      return;
    }

    // =========================
    // BETWEEN THE TWO
    // =========================

    /*
     * Camera movement begins immediately
     * when transitionProgress leaves 0,
     * and ends exactly when it reaches 0
     * again on the way back into cockpit view.
     */
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
  });

  return null;
}