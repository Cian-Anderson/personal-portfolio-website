// World config constants.

export const WORLD_CONFIG = {
  // =========================
  // FLOOR
  // =========================

  // Visible neon floor:
  // 300 × 300 world units.
  gridSize: 300,

  // One small grid square = 1 world unit.
  // Allow the ship two grid squares beyond
  // the visible floor before hitting the boundary.
  boundaryPadding: 10,

  // =========================
  // VERTICAL LIMITS
  // =========================

  // Lowest the ship can fly.
  minHeight: 1,

  // Highest the ship can fly.
  maxHeight: 90,
} as const;

// Visible floor runs from:
// -150 → +150
export const WORLD_HALF_SIZE =
  WORLD_CONFIG.gridSize / 2;

// Actual flight boundary runs from:
// -152 → +152
export const WORLD_BOUNDARY =
  WORLD_HALF_SIZE +
  WORLD_CONFIG.boundaryPadding;
