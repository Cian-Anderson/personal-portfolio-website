// Flight tuning config.

export type SpeedMode =
  | "normal"
  | "fast"
  | "veryFast"
  | "fastest";

export const SPEED_MODES: SpeedMode[] = [
  "normal",
  "fast",
  "veryFast",
  "fastest",
];

export const FLIGHT_CONFIG = {
  // =========================
  // MOVEMENT
  // =========================

speeds: {
  normal: 14,
  fast: 24,
  veryFast: 34,
  fastest: 45,
},

  reverseSpeed: 7,

  // How quickly the ship reaches the selected speed
  // while W is held.
  accelerationResponse: 3.2,

  // How slowly the ship coasts back toward zero
  // after W is released.
  // Lower = longer glide.
  decelerationResponse: 0.85,

  // Response when actively holding S.
  reverseResponse: 6,

  // Snap microscopic movement to zero.
  stopSpeed: 0.08,

  // =========================
  // LEFT / RIGHT
  // =========================

  yawSpeed: 2,

  bankAngle: 0.3,
  bankResponse: 6,

  // =========================
  // UP / DOWN
  // =========================

  maxPitch: Math.PI * (50 / 180),

  maxPitchSpeed: 1.25,

  // Higher = quicker pitch response from Space/Ctrl.
  pitchInputResponse: 7,

  pitchReleaseDelay: 0.14,

  pitchReleaseDamping: 8,

  autoLevelResponse: 2.2,

  autoLevelStrength: 1.35,

  autoLevelMaxSpeed: 0.7,
} as const;
