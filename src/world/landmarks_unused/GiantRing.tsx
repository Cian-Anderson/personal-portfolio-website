// Unused ring landmark.

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface GiantRingProps {
  position?: [number, number, number];
}

export default function GiantRing({ position = [0, 21, -95] }: GiantRingProps) {
  const innerRing = useRef<THREE.Mesh>(null);
  const coreRing = useRef<THREE.Mesh>(null);

  const cyan = useMemo(() => new THREE.Color("#00eaff").multiplyScalar(3), []);

  const magenta = useMemo(
    () => new THREE.Color("#ff2bd6").multiplyScalar(3),
    [],
  );

  useFrame((_, delta) => {
    if (innerRing.current) {
      innerRing.current.rotation.z += delta * 0.08;
    }

    if (coreRing.current) {
      coreRing.current.rotation.z -= delta * 0.13;
    }
  });

  return (
    <group position={position}>
      {/* OUTER STRUCTURAL RING. */}

      <mesh>
        <torusGeometry args={[18, 1.6, 12, 96]} />

        <meshBasicMaterial color="#070912" />
      </mesh>

      {/* Cyan wireframe shell */}
      <mesh>
        <torusGeometry args={[18.05, 1.68, 10, 96]} />

        <meshBasicMaterial color={cyan} wireframe toneMapped={false} />
      </mesh>

      {/* INNER MAGENTA RING. */}

      <mesh ref={innerRing}>
        <torusGeometry args={[14.2, 0.24, 8, 72]} />

        <meshBasicMaterial color={magenta} toneMapped={false} />
      </mesh>

      {/* INNER CYAN RING. */}

      <mesh ref={coreRing} rotation={[0.15, 0.1, 0]}>
        <torusGeometry args={[10.8, 0.14, 8, 64]} />

        <meshBasicMaterial color={cyan} toneMapped={false} />
      </mesh>

      {/* OUTER SUPPORT BLOCKS. */}

      <SupportBlock position={[0, 18, 0]} rotation={[0, 0, 0]} />

      <SupportBlock position={[0, -18, 0]} rotation={[0, 0, 0]} />

      <SupportBlock position={[18, 0, 0]} rotation={[0, 0, Math.PI / 2]} />

      <SupportBlock position={[-18, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}

interface SupportBlockProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

function SupportBlock({ position, rotation }: SupportBlockProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[5, 2.6, 3]} />

        <meshBasicMaterial color="#090812" />
      </mesh>

      <mesh>
        <boxGeometry args={[5.08, 2.68, 3.08]} />

        <meshBasicMaterial
          color="#00eaff"
          wireframe
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}