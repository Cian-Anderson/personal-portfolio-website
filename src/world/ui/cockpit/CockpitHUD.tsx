// Cockpit HUD.

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useViewStore } from "../../../stores/useViewStore";

// Visual settings.
const HUD_DISTANCE = 1;

const NEON_CYAN = new THREE.Color(0, 1.0, 1.35);
const NEON_MAGENTA = new THREE.Color(1.3, 0.024, 1.06);

const HULL = "#040710";
const HULL_ALT = "#120619";

const SCREEN_BED = "#050913";
const SCREEN_BED_ALT = "#090d1a";

const HUD_LINE_WIDTH = 2.2;

// Top bar geometry.
const TOP_BAR_BOTTOM = 8;

type ScreenPoint = [number, number];

// Screen conversion.
function screenToPlane(point: ScreenPoint): [number, number] {
  const [x, y] = point;

  return [x / 50 - 1, 1 - y / 50];
}

// Solid panel.
function SolidPanel({
  points,
  fill = HULL,
  renderOrder = 1000,
}: {
  points: ScreenPoint[];
  fill?: string;
  renderOrder?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();

    const first = screenToPlane(points[0]);

    shape.moveTo(first[0], first[1]);

    for (let i = 1; i < points.length; i++) {
      const point = screenToPlane(points[i]);

      shape.lineTo(point[0], point[1]);
    }

    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [points]);

  return (
    <mesh geometry={geometry} renderOrder={renderOrder} frustumCulled={false}>
      <meshBasicMaterial
        color={fill}
        side={THREE.DoubleSide}
        toneMapped={false}
        fog={false}
        transparent
        opacity={1}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// Neon line.
function NeonLine({
  start,
  end,
  color,
  renderOrder,
  lineWidth = HUD_LINE_WIDTH,
  z = 0.03,
}: {
  start: ScreenPoint;
  end: ScreenPoint;
  color: THREE.Color;
  renderOrder: number;
  lineWidth?: number;
  z?: number;
}) {
  const startPoint = screenToPlane(start);
  const endPoint = screenToPlane(end);

  return (
    <Line
      points={[
        [startPoint[0], startPoint[1], z],
        [endPoint[0], endPoint[1], z],
      ]}
      color={color}
      lineWidth={lineWidth}
      toneMapped={false}
      fog={false}
      transparent
      opacity={1}
      depthTest={false}
      depthWrite={false}
      frustumCulled={false}
      renderOrder={renderOrder}
    />
  );
}

export default function CockpitHUD() {
  const hud = useRef<THREE.Group>(null);

  const { camera } = useThree();

  useFrame(() => {
    if (!hud.current) {
      return;
    }

    const progress = useViewStore.getState().transitionProgress;

    hud.current.visible = progress <= 0.001;

    if (!hud.current.visible) {
      return;
    }

    hud.current.position.copy(camera.position);

    hud.current.quaternion.copy(camera.quaternion);

    if (camera instanceof THREE.PerspectiveCamera) {
      const halfHeight =
        Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * HUD_DISTANCE;

      const halfWidth = halfHeight * camera.aspect;

      hud.current.scale.set(halfWidth, halfHeight, 1);
    }
  });

  return (
    <group ref={hud}>
      <group position={[0, 0, -HUD_DISTANCE]}>
        {/* UPPER COCKPIT. */}

        <SolidPanel
          fill={HULL_ALT}
          points={[
            [0, 0],
            [7, 0],
            [7, TOP_BAR_BOTTOM],
            [4, TOP_BAR_BOTTOM + 3],
            [0, TOP_BAR_BOTTOM + 5],
          ]}
        />

        <SolidPanel
          fill={HULL_ALT}
          points={[
            [93, 0],
            [100, 0],
            [100, TOP_BAR_BOTTOM + 5],
            [96, TOP_BAR_BOTTOM + 3],
            [93, TOP_BAR_BOTTOM],
          ]}
        />

        <SolidPanel
          points={[
            [7, 0],
            [93, 0],
            [93, TOP_BAR_BOTTOM],
            [7, TOP_BAR_BOTTOM],
          ]}
        />

        {/* WINDSCREEN BASE. */}

        <SolidPanel
          fill={HULL_ALT}
          points={[
            [37, 67],
            [63, 67],
            [82, 70],
            [18, 70],
          ]}
        />

        {/* MAIN DASHBOARD. */}

        <SolidPanel
          points={[
            [18, 70],
            [82, 70],
            [84, 91],
            [16, 91],
          ]}
        />

        {/* LOWER COCKPIT. */}

        <SolidPanel
          fill={HULL_ALT}
          points={[
            [16, 91],
            [84, 91],
            [84, 110],
            [16, 110],
          ]}
        />

        <SolidPanel
          points={[
            [0, 72],
            [18, 70],
            [16, 91],
            [0, 94],
          ]}
        />

        <SolidPanel
          fill={HULL_ALT}
          points={[
            [0, 94],
            [16, 91],
            [16, 110],
            [0, 110],
          ]}
        />

        <SolidPanel
          points={[
            [82, 70],
            [100, 72],
            [100, 94],
            [84, 91],
          ]}
        />

        <SolidPanel
          fill={HULL_ALT}
          points={[
            [84, 91],
            [100, 94],
            [100, 110],
            [84, 110],
          ]}
        />

        {/* UPPER CYAN FRAME. */}

        <NeonLine
          start={[7, 0]}
          end={[7, TOP_BAR_BOTTOM]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[7, TOP_BAR_BOTTOM]}
          end={[4, TOP_BAR_BOTTOM + 3]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[4, TOP_BAR_BOTTOM + 3]}
          end={[0, TOP_BAR_BOTTOM + 5]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[93, 0]}
          end={[93, TOP_BAR_BOTTOM]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[93, TOP_BAR_BOTTOM]}
          end={[96, TOP_BAR_BOTTOM + 3]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[96, TOP_BAR_BOTTOM + 3]}
          end={[100, TOP_BAR_BOTTOM + 5]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[7, TOP_BAR_BOTTOM]}
          end={[93, TOP_BAR_BOTTOM]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        {/* WINDSCREEN BASE. */}

        <NeonLine
          start={[37, 67]}
          end={[63, 67]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[63, 67]}
          end={[82, 70]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[82, 70]}
          end={[18, 70]}
          color={NEON_CYAN}
          renderOrder={7400}
        />

        <NeonLine
          start={[18, 70]}
          end={[37, 67]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        {/* MAIN DASHBOARD EDGES. */}

        <NeonLine
          start={[18, 70]}
          end={[16, 91]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[16, 91]}
          end={[84, 91]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[84, 91]}
          end={[82, 70]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        {/* LOWER DASH. */}

        <NeonLine
          start={[16, 91]}
          end={[16, 110]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[84, 91]}
          end={[84, 110]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[0, 72]}
          end={[18, 70]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[16, 91]}
          end={[0, 94]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[82, 70]}
          end={[100, 72]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[100, 94]}
          end={[84, 91]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        {/* RECESSED DASHBOARD SCREEN. */}

        {/* Outer recess */}
        <SolidPanel
          fill={SCREEN_BED}
          renderOrder={7000}
          points={[
            [22.7, 70.7],
            [77.3, 70.7],
            [78.75, 85.7],
            [21.25, 85.7],
          ]}
        />

        {/* Inner screen surface */}
        <SolidPanel
          fill={SCREEN_BED_ALT}
          renderOrder={7001}
          points={[
            [24.0, 72.2],
            [76.0, 72.2],
            [77.15, 84.2],
            [22.85, 84.2],
          ]}
        />

        {/* SCREEN OUTER FRAME. */}

        <NeonLine
          start={[22.7, 70.7]}
          end={[77.3, 70.7]}
          color={NEON_CYAN}
          renderOrder={7100}
          lineWidth={2.4}
          z={0.076}
        />

        <NeonLine
          start={[77.3, 70.7]}
          end={[78.75, 85.7]}
          color={NEON_CYAN}
          renderOrder={7100}
          lineWidth={2.4}
          z={0.076}
        />

        <NeonLine
          start={[78.75, 85.7]}
          end={[21.25, 85.7]}
          color={NEON_CYAN}
          renderOrder={7100}
          lineWidth={2.4}
          z={0.076}
        />

        <NeonLine
          start={[21.25, 85.7]}
          end={[22.7, 70.7]}
          color={NEON_CYAN}
          renderOrder={7100}
          lineWidth={2.4}
          z={0.076}
        />

        {/* SCREEN INNER FRAME. */}

        <NeonLine
          start={[24.0, 72.2]}
          end={[76.0, 72.2]}
          color={NEON_MAGENTA}
          renderOrder={7101}
          lineWidth={1.5}
          z={0.077}
        />

        <NeonLine
          start={[76.0, 72.2]}
          end={[77.15, 84.2]}
          color={NEON_MAGENTA}
          renderOrder={7101}
          lineWidth={1.5}
          z={0.077}
        />

        <NeonLine
          start={[77.15, 84.2]}
          end={[22.85, 84.2]}
          color={NEON_MAGENTA}
          renderOrder={7101}
          lineWidth={1.5}
          z={0.077}
        />

        <NeonLine
          start={[22.85, 84.2]}
          end={[24.0, 72.2]}
          color={NEON_MAGENTA}
          renderOrder={7101}
          lineWidth={1.5}
          z={0.077}
        />

        {/* Magenta screen accent */}
        <NeonLine
          start={[57.5, 84.2]}
          end={[72.5, 84.2]}
          color={NEON_MAGENTA}
          renderOrder={7102}
          lineWidth={2.6}
          z={0.078}
        />

        {/* MAGENTA GLASS FRAME. */}

        <NeonLine
          start={[7, TOP_BAR_BOTTOM]}
          end={[30, 38]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />

        <NeonLine
          start={[93, TOP_BAR_BOTTOM]}
          end={[70, 38]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />

        <NeonLine
          start={[30, 38]}
          end={[70, 38]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />

        <NeonLine
          start={[30, 38]}
          end={[37, 67]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />

        <NeonLine
          start={[70, 38]}
          end={[63, 67]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />

        <NeonLine
          start={[37, 67]}
          end={[63, 67]}
          color={NEON_CYAN}
          renderOrder={5000}
        />

        <NeonLine
          start={[30, 38]}
          end={[18, 70]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />

        <NeonLine
          start={[70, 38]}
          end={[82, 70]}
          color={NEON_MAGENTA}
          renderOrder={6000}
        />
      </group>
    </group>
  );
}