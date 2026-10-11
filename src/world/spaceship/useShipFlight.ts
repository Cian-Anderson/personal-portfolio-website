/* eslint-disable react-hooks/immutability */

import { useRef, useState, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useKeyboard } from "../../hooks/useKeyboard";
import { useShipStore } from "../../stores/useShipStore";
import { useViewStore } from "../../stores/useViewStore";

import {
  FLIGHT_CONFIG as FLIGHT,
  SPEED_MODES,
  type SpeedMode,
} from "./flightConfig";
import {
  WORLD_BOUNDARY,
  WORLD_CONFIG,
} from "../worldConfig";

/**
 * Smoothly moves one number toward another.
 *
 * Unlike a normal lerp with a fixed percentage,
 * this behaves consistently at different frame rates.
 */
function smoothTowards(
  current: number,
  target: number,
  response: number,
  delta: number,
) {
  const smoothing = 1 - Math.exp(-response * delta);

  return THREE.MathUtils.lerp(
    current,
    target,
    smoothing,
  );
}

export function useShipFlight(
  ship: RefObject<THREE.Group | null>,
) {
  const keys = useKeyboard();

  // =========================
  // FLIGHT STATE
  // =========================

  const yaw = useRef(0);
  const pitch = useRef(0);

  // Persistent three-stage speed selector.
  const speedModeRef = useRef<SpeedMode>("normal");
  const shiftWasDown = useRef(false);

  const [speedMode, setSpeedMode] =
    useState<SpeedMode>("normal");

  // Current signed forward speed.
  // This gives the ship momentum when W is released.
  const forwardSpeed = useRef(0);

  // Visual state for engine/wing trails.
  // This remains active while the ship is still coasting.
  const thrustingRef = useRef(false);
  const [isThrusting, setIsThrusting] =
    useState(false);

  /**
   * Pitch now has velocity.
   *
   * This is what gives us:
   *
   * press Space
   *      ↓
   * slow pitch
   *      ↓
   * faster
   *      ↓
   * full turning speed
   */
  const pitchVelocity = useRef(0);

  /**
   * Tracks how long it has been since
   * Space/Ctrl was released.
   */
  const pitchReleaseTimer = useRef(0);

  // =========================
  // REUSABLE THREE OBJECTS
  // =========================

  const forward = useRef(
    new THREE.Vector3(),
  );

  const flightRotation = useRef(
    new THREE.Euler(
      0,
      0,
      0,
      "YXZ",
    ),
  );

  const setTransform = useShipStore(
    (state) => state.setTransform,
  );

  useFrame((_, delta) => {
    if (!ship.current) return;

    // Prevent giant movement jumps if the tab
    // freezes for a moment.
    const dt = Math.min(delta, 0.05);

    // =========================
    // INPUT
    // =========================

    const movingForward =
    !!keys.current.KeyW;

    const movingBackward =
    !!keys.current.KeyS;

    const turningLeft =
    !!keys.current.KeyA;

    const turningRight =
    !!keys.current.KeyD;

    const pitchingUp =
    !!keys.current.Space;

    const pitchingDown =
    !!keys.current.ControlLeft ||
    !!keys.current.ControlRight;

    const shiftDown =
    !!keys.current.ShiftLeft ||
    !!keys.current.ShiftRight;

    // =========================
    // VIEW / MENU LOCK
    // =========================

    const viewState =
      useViewStore.getState();

    /*
    * Flight is only available when:
    *
    * - the startup intro is finished
    * - chase mode is selected
    * - the camera has completely
    *   reached the chase position
    */
    const flightEnabled =
      viewState.introComplete &&
      viewState.viewMode ===
        "chase" &&
      viewState.transitionProgress >=
        0.999;

    if (!flightEnabled) {
      /*
      * Stop any momentum when entering
      * cockpit/menu mode.
      */
      forwardSpeed.current = 0;

      pitchVelocity.current = 0;

      pitchReleaseTimer.current = 0;

      /*
      * Prevent holding Shift while
      * inside the menu from causing
      * an unwanted speed-mode change
      * when returning to flight.
      */
      shiftWasDown.current =
        shiftDown;

      // Stop trails immediately.
      if (
        thrustingRef.current
      ) {
        thrustingRef.current =
          false;

        setIsThrusting(
          false,
        );
      }

      /*
      * Gently remove visual bank.
      *
      * The cockpit camera uses yaw
      * and pitch, so we want the ship
      * level by the time we're fully
      * inside the cockpit.
      */
      ship.current.rotation.z =
        smoothTowards(
          ship.current.rotation.z,
          0,
          FLIGHT.bankResponse,
          dt,
        );

      ship.current.rotation.order =
        "YXZ";

      ship.current.rotation.x =
        pitch.current;

      ship.current.rotation.y =
        yaw.current;

      /*
      * Keep the global transform
      * synchronized even though
      * we're not flying.
      */
      setTransform(
        [
          ship.current.position.x,
          ship.current.position.y,
          ship.current.position.z,
        ],
        yaw.current,
        pitch.current,
      );

      return;
    }

    // =========================
    // SPEED SHIFT
    // =========================

    // One Shift press = one step:
    // normal -> fast -> fastest -> normal.
    if (
      shiftDown &&
      !shiftWasDown.current
    ) {
      const currentIndex =
        SPEED_MODES.indexOf(
          speedModeRef.current,
        );

      const nextIndex =
        (currentIndex + 1) %
        SPEED_MODES.length;

      const nextMode =
        SPEED_MODES[nextIndex];

      speedModeRef.current =
        nextMode;

      setSpeedMode(nextMode);
    }

    shiftWasDown.current =
      shiftDown;

    // =========================
    // YAW
    // =========================

    if (turningLeft) {
      yaw.current +=
        FLIGHT.yawSpeed * dt;
    }

    if (turningRight) {
      yaw.current -=
        FLIGHT.yawSpeed * dt;
    }

    // =========================
    // PITCH INPUT
    // =========================

    /**
     *  1 = nose upward
     * -1 = nose downward
     *  0 = no pitch command
     */
    const pitchInput =
      Number(pitchingUp) -
      Number(pitchingDown);

    // =========================
    // PLAYER IS HOLDING
    // SPACE / CTRL
    // =========================

    if (pitchInput !== 0) {
      // Player has taken control again,
      // so cancel the release timer.
      pitchReleaseTimer.current = 0;

      /**
       * Instead of immediately changing
       * pitch at full speed, establish a
       * desired rotational velocity.
       */
      const targetPitchVelocity =
        pitchInput *
        FLIGHT.maxPitchSpeed;

      /**
       * Smoothly accelerate toward that
       * rotational velocity.
       *
       * This creates the ramp-up.
       */
      pitchVelocity.current =
        smoothTowards(
          pitchVelocity.current,
          targetPitchVelocity,
          FLIGHT.pitchInputResponse,
          dt,
        );
    }

    // =========================
    // PLAYER RELEASED
    // SPACE / CTRL
    // =========================

    else {
      pitchReleaseTimer.current += dt;

      // -------------------------
      // SHORT COAST PERIOD
      // -------------------------

      if (
        pitchReleaseTimer.current <
        FLIGHT.pitchReleaseDelay
      ) {
        /**
         * Don't start levelling yet.
         *
         * Just gently bleed away the
         * rotational momentum.
         *
         * This gives that tiny pause
         * after releasing the key.
         */
        pitchVelocity.current =
          smoothTowards(
            pitchVelocity.current,
            0,
            FLIGHT.pitchReleaseDamping,
            dt,
          );
      }

      // -------------------------
      // AUTO LEVEL
      // -------------------------

      else {
        /**
         * If we're at +30 degrees:
         *
         * levelError = -30 degrees
         *
         * If we're at -20:
         *
         * levelError = +20
         */
        const levelError =
          -pitch.current;

        /**
         * The further away from flat we are,
         * the stronger the desired correction.
         */
        let desiredLevelVelocity =
          levelError *
          FLIGHT.autoLevelStrength;

        /**
         * Don't allow auto-level to rotate
         * the ship too quickly.
         */
        desiredLevelVelocity =
          THREE.MathUtils.clamp(
            desiredLevelVelocity,
            -FLIGHT.autoLevelMaxSpeed,
            FLIGHT.autoLevelMaxSpeed,
          );

        /**
         * We don't instantly use that correction.
         *
         * We smoothly accelerate toward it.
         *
         * Therefore auto-level itself also
         * ramps up rather than snapping on.
         */
        pitchVelocity.current =
          smoothTowards(
            pitchVelocity.current,
            desiredLevelVelocity,
            FLIGHT.autoLevelResponse,
            dt,
          );
      }
    }

    // =========================
    // APPLY PITCH VELOCITY
    // =========================

    pitch.current +=
      pitchVelocity.current * dt;

    // =========================
    // LIMIT PITCH
    // =========================

    pitch.current =
      THREE.MathUtils.clamp(
        pitch.current,
        -FLIGHT.maxPitch,
        FLIGHT.maxPitch,
      );

    /**
     * If we're already pointing as far
     * upward as allowed, don't continue
     * accumulating upward velocity.
     */
    if (
      pitch.current >=
        FLIGHT.maxPitch &&
      pitchVelocity.current > 0
    ) {
      pitchVelocity.current = 0;
    }

    /**
     * Same when pointing downward.
     */
    if (
      pitch.current <=
        -FLIGHT.maxPitch &&
      pitchVelocity.current < 0
    ) {
      pitchVelocity.current = 0;
    }

    // =========================
    // SNAP MICROSCOPIC VALUES
    // =========================

    /**
     * When we're basically horizontal,
     * stop calculations causing tiny
     * visible wobbling forever.
     */
    if (
      pitchInput === 0 &&
      pitchReleaseTimer.current >=
        FLIGHT.pitchReleaseDelay &&
      Math.abs(pitch.current) <
        0.001 &&
      Math.abs(
        pitchVelocity.current,
      ) < 0.01
    ) {
      pitch.current = 0;
      pitchVelocity.current = 0;
    }

    // =========================
    // FLIGHT DIRECTION
    // =========================

    /**
     * Convert yaw + pitch into the
     * direction the nose is facing.
     */
    flightRotation.current.set(
      pitch.current,
      yaw.current,
      0,
      "YXZ",
    );

    forward.current
      .set(0, 0, -1)
      .applyEuler(
        flightRotation.current,
      )
      .normalize();

    // =========================
    // THRUST
    // =========================

    // Pick the speed the ship is trying to reach.
    let targetForwardSpeed = 0;
    let speedResponse: number =
      FLIGHT.decelerationResponse;

    if (movingForward) {
      targetForwardSpeed =
        FLIGHT.speeds[
          speedModeRef.current
        ];

      speedResponse =
        FLIGHT.accelerationResponse;
    } else if (movingBackward) {
      targetForwardSpeed =
        -FLIGHT.reverseSpeed;

      speedResponse =
        FLIGHT.reverseResponse;
    }

    // Smooth acceleration and, importantly,
    // a much slower coast when W is released.
    forwardSpeed.current =
      smoothTowards(
        forwardSpeed.current,
        targetForwardSpeed,
        speedResponse,
        dt,
      );

    if (
      !movingForward &&
      !movingBackward &&
      Math.abs(forwardSpeed.current) <
        FLIGHT.stopSpeed
    ) {
      forwardSpeed.current = 0;
    }

    // Keep trails alive while the ship still has
    // meaningful forward momentum after W is released.
    const trailsActive =
      forwardSpeed.current > 0.5;

    if (
      trailsActive !==
      thrustingRef.current
    ) {
      thrustingRef.current =
        trailsActive;

      setIsThrusting(
        trailsActive,
      );
    }

    // Movement now happens from the current speed
    // every frame, not only while W/S are held.
    if (forwardSpeed.current !== 0) {
      ship.current.position.addScaledVector(
        forward.current,
        forwardSpeed.current * dt,
      );
    }

    // =========================
    // WORLD BOUNDARIES
    // =========================

    // Left / right boundary.
    ship.current.position.x =
      THREE.MathUtils.clamp(
        ship.current.position.x,
        -WORLD_BOUNDARY,
        WORLD_BOUNDARY,
      );

    // Forward / backward boundary.
    ship.current.position.z =
      THREE.MathUtils.clamp(
        ship.current.position.z,
        -WORLD_BOUNDARY,
        WORLD_BOUNDARY,
      );

    // Floor / sky boundary.
    ship.current.position.y =
      THREE.MathUtils.clamp(
        ship.current.position.y,
        WORLD_CONFIG.minHeight,
        WORLD_CONFIG.maxHeight,
      );

    // =========================
    // VISUAL BANK
    // =========================

    let targetBank = 0;

    if (turningLeft) {
      targetBank =
        FLIGHT.bankAngle;
    }

    if (turningRight) {
      targetBank =
        -FLIGHT.bankAngle;
    }

    const bank = smoothTowards(
      ship.current.rotation.z,
      targetBank,
      FLIGHT.bankResponse,
      dt,
    );

    // =========================
    // APPLY VISUAL ROTATION
    // =========================

    ship.current.rotation.order =
      "YXZ";

    ship.current.rotation.x =
      pitch.current;

    ship.current.rotation.y =
      yaw.current;

    ship.current.rotation.z =
      bank;

    // =========================
    // GLOBAL STATE
    // =========================

    setTransform(
      [
        ship.current.position.x,
        ship.current.position.y,
        ship.current.position.z,
      ],
      yaw.current,
      pitch.current,
    );
  });

  return {
    speedMode,
    isThrusting,
  };
}
