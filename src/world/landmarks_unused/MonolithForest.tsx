// Unused monolith forest.

import { Edges } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface MonolithForestProps {
  position?: [number, number, number];
}

interface MonolithData {
  x: number;
  z: number;
  height: number;
  width: number;
  depth: number;
  rotation?: number;
  color: "cyan" | "magenta";
}

/*
 * These are deliberately spaced much further apart than before.
 *
 * The ship is roughly 6 units wide, so most flight gaps here are
 * around 10–18+ clear units rather than the cramped 4–6 unit gaps
 * from the first version.
 */
const MONOLITHS: MonolithData[] = [
  // =========================
  // FRONT ROW
  // =========================

  {
    x: -30,
    z: -30,
    height: 40,
    width: 7,
    depth: 8,
    rotation: 0.06,
    color: "cyan",
  },
  {
    x: -8,
    z: -34,
    height: 54,
    width: 8,
    depth: 8,
    rotation: -0.04,
    color: "magenta",
  },
  {
    x: 18,
    z: -31,
    height: 36,
    width: 7,
    depth: 9,
    rotation: 0.08,
    color: "cyan",
  },
  {
    x: 40,
    z: -27,
    height: 48,
    width: 9,
    depth: 8,
    rotation: -0.05,
    color: "magenta",
  },

  // =========================
  // SECOND ROW
  // =========================

  {
    x: -42,
    z: -7,
    height: 50,
    width: 8,
    depth: 8,
    rotation: -0.07,
    color: "magenta",
  },
  {
    x: -19,
    z: -9,
    height: 32,
    width: 7,
    depth: 10,
    rotation: 0.05,
    color: "cyan",
  },
  {
    x: 7,
    z: -5,
    height: 58,
    width: 9,
    depth: 9,
    rotation: -0.03,
    color: "cyan",
  },
  {
    x: 32,
    z: -8,
    height: 41,
    width: 8,
    depth: 10,
    rotation: 0.06,
    color: "magenta",
  },

  // =========================
  // THIRD ROW
  // =========================

  {
    x: -33,
    z: 19,
    height: 60,
    width: 9,
    depth: 8,
    rotation: 0.03,
    color: "cyan",
  },
  {
    x: -7,
    z: 18,
    height: 39,
    width: 8,
    depth: 9,
    rotation: -0.06,
    color: "magenta",
  },
  {
    x: 20,
    z: 21,
    height: 52,
    width: 8,
    depth: 8,
    rotation: 0.05,
    color: "cyan",
  },
  {
    x: 45,
    z: 17,
    height: 34,
    width: 7,
    depth: 10,
    rotation: -0.08,
    color: "magenta",
  },

  // =========================
  // BACK ROW
  // =========================

  {
    x: -45,
    z: 43,
    height: 44,
    width: 8,
    depth: 9,
    rotation: 0.07,
    color: "magenta",
  },
  {
    x: -20,
    z: 46,
    height: 57,
    width: 9,
    depth: 8,
    rotation: -0.04,
    color: "cyan",
  },
  {
    x: 9,
    z: 44,
    height: 37,
    width: 8,
    depth: 9,
    rotation: 0.04,
    color: "magenta",
  },
  {
    x: 36,
    z: 46,
    height: 55,
    width: 9,
    depth: 9,
    rotation: -0.05,
    color: "cyan",
  },
];

export default function MonolithForest({
  position = [-55, 0, -65],
}: MonolithForestProps) {
  const cyan = useMemo(() => new THREE.Color(0, 2.4, 3.3), []);

  const magenta = useMemo(() => new THREE.Color(3, 0.05, 2.4), []);

  return (
    <group position={position}>
      {MONOLITHS.map((monolith, index) => {
        const edgeColor = monolith.color === "cyan" ? cyan : magenta;

        return (
          <group
            key={index}
            position={[monolith.x, 0, monolith.z]}
            rotation={[0, monolith.rotation ?? 0, 0]}
          >
            {/* Main dark monolith */}
            <mesh position={[0, monolith.height / 2, 0]}>
              <boxGeometry
                args={[monolith.width, monolith.height, monolith.depth]}
              />

              <meshBasicMaterial color="#03050b" />

              <Edges color={edgeColor} lineWidth={1.3} />
            </mesh>

            {/* Slightly wider base */}
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[monolith.width + 2, 2, monolith.depth + 2]} />

              <meshBasicMaterial color="#060711" />

              <Edges color={edgeColor} lineWidth={1} />
            </mesh>

            {/* Upper glowing band */}
            <mesh
              position={[0, monolith.height * 0.72, monolith.depth / 2 + 0.03]}
            >
              <boxGeometry args={[monolith.width * 0.72, 0.3, 0.08]} />

              <meshBasicMaterial color={edgeColor} toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {/* High connecting structures.
          These are deliberately high enough
          that they don't ruin the main flight lanes. */}

      <HighBridge position={[-19, 36, -20]} length={22} color={magenta} />

      <HighBridge position={[19, 43, 7]} length={24} color={cyan} />

      <HighBridge position={[-6, 48, 34]} length={25} color={magenta} />
    </group>
  );
}

interface HighBridgeProps {
  position: [number, number, number];
  length: number;
  color: THREE.Color;
}

function HighBridge({ position, length, color }: HighBridgeProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={[length, 1.2, 2]} />

      <meshBasicMaterial color="#050711" />

      <Edges color={color} lineWidth={1.2} />
    </mesh>
  );
}