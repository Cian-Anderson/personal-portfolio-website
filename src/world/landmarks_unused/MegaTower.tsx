// Unused mega tower.

import { Edges } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface MegaTowerProps {
  position?: [number, number, number];
}

export default function MegaTower({ position = [62, 0, -62] }: MegaTowerProps) {
  const cyan = useMemo(() => new THREE.Color(0, 2.5, 3.5), []);

  const magenta = useMemo(() => new THREE.Color(3.2, 0.05, 2.4), []);

  return (
    <group position={position}>
      {/* =========================
          LOWER LEGS

          There is intentionally a
          gap between these so the
          player can fly through.
          ========================= */}

      <TowerBlock position={[-4.5, 5, 0]} size={[4, 10, 6]} edgeColor={cyan} />

      <TowerBlock position={[4.5, 5, 0]} size={[4, 10, 6]} edgeColor={cyan} />

      {/* Lower bridge */}
      <TowerBlock
        position={[0, 11.5, 0]}
        size={[13, 3, 6]}
        edgeColor={magenta}
      />

      {/* CENTRAL BODY. */}

      <TowerBlock position={[0, 18, 0]} size={[9, 10, 8]} edgeColor={cyan} />

      {/* Side arms */}
      <TowerBlock position={[-8, 22, 0]} size={[7, 2, 4]} edgeColor={magenta} />

      <TowerBlock position={[8, 22, 0]} size={[7, 2, 4]} edgeColor={magenta} />

      {/* Floating upper section */}
      <TowerBlock position={[0, 29, 0]} size={[7, 6, 7]} edgeColor={magenta} />

      {/* Thin connector */}
      <TowerBlock position={[0, 34, 0]} size={[2.5, 5, 2.5]} edgeColor={cyan} />

      {/* CROWN. */}

      <TowerBlock position={[0, 39, 0]} size={[11, 3, 5]} edgeColor={magenta} />

      <TowerBlock position={[0, 44, 0]} size={[4, 8, 4]} edgeColor={cyan} />

      {/* Top antenna */}
      <mesh position={[0, 50, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 8, 8]} />

        <meshBasicMaterial color={magenta} toneMapped={false} />
      </mesh>

      <mesh position={[0, 54.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.12, 6, 32]} />

        <meshBasicMaterial color={cyan} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface TowerBlockProps {
  position: [number, number, number];
  size: [number, number, number];
  edgeColor: THREE.Color;
}

function TowerBlock({ position, size, edgeColor }: TowerBlockProps) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />

      <meshBasicMaterial color="#050710" />

      <Edges color={edgeColor} lineWidth={1.4} />
    </mesh>
  );
}