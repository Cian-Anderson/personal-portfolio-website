// Space backdrop.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

const PLANET_GLOW = 0.5;

/* Space backdrop. */
const BODY_RENDER_ORDER = -1100;
const DETAIL_RENDER_ORDER = -1090;

function dimGlow(color: [number, number, number]): [number, number, number] {
  return [
    color[0] * PLANET_GLOW,
    color[1] * PLANET_GLOW,
    color[2] * PLANET_GLOW,
  ];
}

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  baseColor: string;
  glowColor: [number, number, number];
  wireOpacity?: number;
}

function Planet({ position, radius, baseColor, glowColor }: PlanetProps) {
  return (
    <group position={position}>
      {/* SOLID BODY. */}

      <mesh renderOrder={BODY_RENDER_ORDER}>
        <sphereGeometry args={[radius, 32, 24]} />

        <meshBasicMaterial
          color={baseColor}
          fog={false}
          /*
           * Backdrop objects never interact
           * with the world depth buffer.
           */
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* WIREFRAME. */}

      <mesh renderOrder={DETAIL_RENDER_ORDER}>
        <sphereGeometry args={[radius + 0.2, 20, 14]} />

        <meshBasicMaterial
          color={dimGlow(glowColor)}
          wireframe
          toneMapped={false}
          fog={false}
          /*
           * IMPORTANT:
           *
           * Do NOT make this transparent.
           *
           * Transparent materials are rendered
           * after opaque world geometry, which
           * caused the planet to reappear through
           * distant skyscrapers.
           */
          transparent={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface RingedPlanetProps {
  position: [number, number, number];
  radius: number;
  rotation?: [number, number, number];
}

function RingedPlanet({
  position,
  radius,
  rotation = [1.15, 0.15, 0.2],
}: RingedPlanetProps) {
  return (
    <group position={position}>
      {/* PLANET BODY. */}

      <mesh renderOrder={BODY_RENDER_ORDER}>
        <sphereGeometry args={[radius, 32, 24]} />

        <meshBasicMaterial
          color="#24103d"
          fog={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* PLANET WIREFRAME. */}

      <mesh renderOrder={DETAIL_RENDER_ORDER}>
        <sphereGeometry args={[radius + 0.2, 20, 14]} />

        <meshBasicMaterial
          color={dimGlow([1.7, 0.1, 3])}
          wireframe
          toneMapped={false}
          fog={false}
          transparent={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* MAIN RING. */}

      <mesh rotation={rotation} renderOrder={DETAIL_RENDER_ORDER}>
        <torusGeometry
          args={[radius * 1.5, Math.max(0.5, radius * 0.045), 8, 96]}
        />

        <meshBasicMaterial
          color={dimGlow([3, 0.15, 4])}
          toneMapped={false}
          fog={false}
          transparent={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>

      {/* OUTER RING. */}

      <mesh rotation={rotation} renderOrder={DETAIL_RENDER_ORDER}>
        <torusGeometry
          args={[radius * 1.7, Math.max(0.2, radius * 0.015), 6, 96]}
        />

        <meshBasicMaterial
          color={dimGlow([0.7, 0.14, 2.1])}
          toneMapped={false}
          fog={false}
          transparent={false}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface MoonProps {
  position: [number, number, number];
  radius?: number;
  color?: string;
}

function Moon({ position, radius = 6, color = "#45104f" }: MoonProps) {
  return (
    <mesh position={position} renderOrder={BODY_RENDER_ORDER}>
      <sphereGeometry args={[radius, 16, 12]} />

      <meshBasicMaterial
        color={color}
        fog={false}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function SpaceBackdrop() {
  const backdrop = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (!backdrop.current) return;

    /*
     * The backdrop follows camera POSITION,
     * but not camera rotation.
     *
     * This keeps these bodies visually
     * extremely distant.
     */
    backdrop.current.position.copy(camera.position);
  });

  return (
    <group ref={backdrop}>
      {/* STAR FIELD. */}

      <Stars
        radius={260}
        depth={90}
        count={4000}
        factor={2}
        saturation={0.75}
        fade
        speed={0.07}
      />

      {/* HUGE / LOW LANDMARKS. */}

      <RingedPlanet
        position={[165, 68, -215]}
        radius={31}
        rotation={[1.12, 0.15, 0.28]}
      />

      <Planet
        position={[-220, 55, -85]}
        radius={25}
        baseColor="#061923"
        glowColor={[0, 2.8, 4]}
      />

      <Planet
        position={[70, 45, 230]}
        radius={28}
        baseColor="#270a2d"
        glowColor={[3.2, 0.05, 2.2]}
      />

      {/* MEDIUM LANDMARKS. */}

      <RingedPlanet
        position={[-155, 105, 205]}
        radius={19}
        rotation={[0.9, -0.45, -0.15]}
      />

      <Planet
        position={[225, 135, 35]}
        radius={16}
        baseColor="#071729"
        glowColor={[0.1, 1.6, 3.7]}
      />

      <Planet
        position={[-235, 145, 70]}
        radius={13}
        baseColor="#260e34"
        glowColor={[2.7, 0.1, 3.3]}
      />

      {/* HIGH SKY. */}

      <Planet
        position={[20, 215, -60]}
        radius={18}
        baseColor="#10102b"
        glowColor={[1.4, 0.25, 4]}
      />

      <Planet
        position={[-120, 190, -175]}
        radius={9}
        baseColor="#061923"
        glowColor={[0, 2.2, 3.2]}
      />

      <Planet
        position={[150, 225, 125]}
        radius={6}
        baseColor="#2b1231"
        glowColor={[2.2, 0.1, 2.7]}
      />

      {/* MOONS. */}

      <Moon position={[-60, 110, -235]} radius={5} />

      <Moon position={[100, 165, -200]} radius={3.5} color="#171037" />

      <Moon position={[-210, 85, 145]} radius={7} color="#351041" />

      <Moon position={[205, 75, 150]} radius={4} color="#0c2530" />
    </group>
  );
}