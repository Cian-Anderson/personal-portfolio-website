// Neon floor grid.

import { Grid } from "@react-three/drei";

import { WORLD_CONFIG } from "../worldConfig";

export default function NeonGrid() {
  return (
    <Grid
      position={[0, 0, 0]}
      args={[WORLD_CONFIG.gridSize, WORLD_CONFIG.gridSize]}
      cellSize={1}
      cellThickness={0.5}
      cellColor="#00d9ff"
      sectionSize={10}
      sectionThickness={1.2}
      sectionColor="#ff2bd6"
      /*
       * Keep the grid finite.
       *
       * 300 × 300 means:
       * X = -150 -> +150
       * Z = -150 -> +150
       *
       * Beyond that is empty space.
       */
      infiniteGrid={false}
      /*
       * Push the distance fade far beyond the
       * actual floor so the physical edge of
       * the grid determines where it ends.
       */
      fadeDistance={1000}
      fadeStrength={1}
    />
  );
}