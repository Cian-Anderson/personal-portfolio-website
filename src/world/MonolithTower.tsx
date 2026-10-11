// City tower mesh.

import { Edges } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface MonolithTowerProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  accent: string;
}

export default function MonolithTower({
  position,
  width,
  depth,
  height,
  accent,
}: MonolithTowerProps) {
  const glowColor = useMemo(
    () => new THREE.Color(accent).multiplyScalar(2.8),
    [accent],
  );

  return (
    <group position={position}>
      {/* MAIN TOWER. */}

      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />

        <meshBasicMaterial
          color="#03050b"
          polygonOffset
          polygonOffsetFactor={2}
          polygonOffsetUnits={2}
        />

        <Edges color={glowColor} lineWidth={1.25} />
      </mesh>

      {/* HEAVIER BASE. */}

      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[width + 1.8, 2.5, depth + 1.8]} />

        <meshBasicMaterial
          color="#070912"
          polygonOffset
          polygonOffsetFactor={2}
          polygonOffsetUnits={2}
        />

        <Edges color={glowColor} lineWidth={1} />
      </mesh>
    </group>
  );
}