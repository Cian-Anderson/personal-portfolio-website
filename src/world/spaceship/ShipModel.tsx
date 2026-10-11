// Ship geometry model.

import { useMemo } from "react";
import { Edges, Line, Trail } from "@react-three/drei";
import * as THREE from "three";
import type { SpeedMode } from "./flightConfig";

// Colors.
const NEON_CYAN = new THREE.Color(0, 2.2, 3.2);
const NEON_MAGENTA = new THREE.Color(3, 0.05, 2.4);

const COLORS = {
  hull: "#040710",
  hullSecondary: "#080d18",
  wing: "#120619",
  cockpit: "#2a0b36",

  cyan: "#20eaff",
  magenta: "#ff2bd6",
  orange: "#ff6a25",
};

// Lofted body.
interface LoftSection {
  z: number;
  halfWidth: number;
  bottomY: number;
  topY: number;
}

function createLoftGeometry(sections: LoftSection[]) {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];

  const triangle = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
  ) => {
    positions.push(...a, ...b, ...c);
  };

  for (let i = 0; i < sections.length - 1; i++) {
    const a = sections[i];
    const b = sections[i + 1];

    const aLT: [number, number, number] = [-a.halfWidth, a.topY, a.z];

    const aRT: [number, number, number] = [a.halfWidth, a.topY, a.z];

    const aLB: [number, number, number] = [-a.halfWidth, a.bottomY, a.z];

    const aRB: [number, number, number] = [a.halfWidth, a.bottomY, a.z];

    const bLT: [number, number, number] = [-b.halfWidth, b.topY, b.z];

    const bRT: [number, number, number] = [b.halfWidth, b.topY, b.z];

    const bLB: [number, number, number] = [-b.halfWidth, b.bottomY, b.z];

    const bRB: [number, number, number] = [b.halfWidth, b.bottomY, b.z];

    // Top
    triangle(aLT, aRT, bRT);
    triangle(aLT, bRT, bLT);

    // Bottom
    triangle(aLB, bRB, aRB);
    triangle(aLB, bLB, bRB);

    // Left
    triangle(aLB, aLT, bLT);
    triangle(aLB, bLT, bLB);

    // Right
    triangle(aRT, aRB, bRB);
    triangle(aRT, bRB, bRT);
  }

  // Front
  const front = sections[0];

  triangle(
    [-front.halfWidth, front.bottomY, front.z],
    [front.halfWidth, front.bottomY, front.z],
    [front.halfWidth, front.topY, front.z],
  );

  triangle(
    [-front.halfWidth, front.bottomY, front.z],
    [front.halfWidth, front.topY, front.z],
    [-front.halfWidth, front.topY, front.z],
  );

  // Rear
  const rear = sections[sections.length - 1];

  triangle(
    [-rear.halfWidth, rear.bottomY, rear.z],
    [rear.halfWidth, rear.topY, rear.z],
    [rear.halfWidth, rear.bottomY, rear.z],
  );

  triangle(
    [-rear.halfWidth, rear.bottomY, rear.z],
    [-rear.halfWidth, rear.topY, rear.z],
    [rear.halfWidth, rear.topY, rear.z],
  );

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  geometry.computeVertexNormals();

  return geometry;
}

// Wings.
function createWingGeometry(
  points: Array<[number, number, number]>,
  thickness: number,
) {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];

  const top = points.map(([x, y, z]) => [x, y + thickness / 2, z] as const);

  const bottom = points.map(([x, y, z]) => [x, y - thickness / 2, z] as const);

  const triangles = [
    [0, 1, 2],
    [0, 2, 3],
  ];

  for (const tri of triangles) {
    for (const index of tri) {
      positions.push(...top[index]);
    }
  }

  for (const tri of triangles) {
    for (let i = 2; i >= 0; i--) {
      positions.push(...bottom[tri[i]]);
    }
  }

  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;

    const a = top[i];
    const b = top[next];
    const c = bottom[next];
    const d = bottom[i];

    positions.push(
      ...a,
      ...b,
      ...c,

      ...a,
      ...c,
      ...d,
    );
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  geometry.computeVertexNormals();

  return geometry;
}

// Weapon pod.
function WeaponPod({ x }: { x: number }) {
  const podGeometry = useMemo(
    () =>
      createLoftGeometry([
        {
          z: -0.62,
          halfWidth: 0.09,
          bottomY: -0.06,
          topY: 0.06,
        },
        {
          z: -0.08,
          halfWidth: 0.13,
          bottomY: -0.09,
          topY: 0.09,
        },
        {
          z: 0.52,
          halfWidth: 0.1,
          bottomY: -0.07,
          topY: 0.06,
        },
      ]),
    [],
  );

  // Left wing slopes one way,
  // right wing mirrors it.
  const side = x < 0 ? -1 : 1;

  return (
    <group position={[x, -0.3, 0.51]} rotation={[0, 0, -side * 0.14]}>
      {/* Mounting pylon */}
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.11, 0.12, 0.22]} />

        <meshBasicMaterial color={COLORS.hullSecondary} />

        <Edges color={NEON_CYAN} lineWidth={1.1} />
      </mesh>

      {/* Main weapon pod */}
      <mesh geometry={podGeometry}>
        <meshBasicMaterial
          color={COLORS.hullSecondary}
          side={THREE.DoubleSide}
        />

        <Edges color={NEON_CYAN} lineWidth={1.2} />
      </mesh>

      {/* Forward muzzle */}
      <mesh position={[0, 0, -0.67]}>
        <boxGeometry args={[0.14, 0.14, 0.09]} />

        <meshBasicMaterial color={COLORS.hullSecondary} />

        <Edges color={NEON_MAGENTA} lineWidth={1.1} />
      </mesh>
    </group>
  );
}

// Speed trails.
interface TrailSettings {
  engineWidth: number;
  engineVisible: number;

  wingWidth: number;
  wingVisible: number;
}

const TRAIL_SETTINGS: Record<SpeedMode, TrailSettings> = {
  normal: {
    engineWidth: 0.13,
    engineVisible: 0.26,

    wingWidth: 0.055,
    wingVisible: 0.2,
  },

  fast: {
    engineWidth: 0.18,
    engineVisible: 0.48,

    wingWidth: 0.075,
    wingVisible: 0.42,
  },

  veryFast: {
    engineWidth: 0.24,
    engineVisible: 0.72,

    wingWidth: 0.1,
    wingVisible: 0.7,
  },

  fastest: {
    engineWidth: 0.31,
    engineVisible: 1,

    wingWidth: 0.13,
    wingVisible: 1,
  },
};

function trailAttenuation(visibleFraction: number) {
  return (t: number) => {
    const cutoff = 1 - visibleFraction;

    if (t <= cutoff) {
      return 0;
    }

    const visibleT = (t - cutoff) / visibleFraction;

    return visibleT * visibleT;
  };
}
const ENGINE_TRAIL_COLOR = new THREE.Color(4.2, 0.55, 0.05);

const WING_TRAIL_COLOR = new THREE.Color(3.0, 0.04, 2.5);

function TrailAnchor({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.01, 4, 4]} />

      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function ShipTrails({
  speedMode,
  isThrusting,
}: {
  speedMode: SpeedMode;
  isThrusting: boolean;
}) {
  const settings = TRAIL_SETTINGS[speedMode];

  return (
    <group visible={isThrusting}>
      {/* Engine trails */}
      <Trail
        width={settings.engineWidth}
        length={7}
        color={ENGINE_TRAIL_COLOR}
        attenuation={trailAttenuation(settings.engineVisible)}
      >
        <TrailAnchor position={[-0.73, -0.015, 1.82]} />
      </Trail>

      <Trail
        width={settings.engineWidth}
        length={7}
        color={ENGINE_TRAIL_COLOR}
        attenuation={trailAttenuation(settings.engineVisible)}
      >
        <TrailAnchor position={[0.73, -0.015, 1.82]} />
      </Trail>

      {/* Rear wing-tip trails */}
      <Trail
        width={settings.wingWidth}
        length={4.4}
        color={WING_TRAIL_COLOR}
        attenuation={trailAttenuation(settings.wingVisible)}
      >
        <TrailAnchor position={[-2.95, -0.28, 1.6]} />
      </Trail>

      <Trail
        width={settings.wingWidth}
        length={4.4}
        color={WING_TRAIL_COLOR}
        attenuation={trailAttenuation(settings.wingVisible)}
      >
        <TrailAnchor position={[2.95, -0.28, 1.6]} />
      </Trail>
    </group>
  );
}

export default function ShipModel({
  speedMode,
  isThrusting,
}: {
  speedMode: SpeedMode;
  isThrusting: boolean;
}) {
  // =========================
  // NARROWER SR-71 STYLE HULL
  // =========================

  const hullGeometry = useMemo(
    () =>
      createLoftGeometry([
        // Long needle nose
        {
          z: -3.2,
          halfWidth: 0.025,
          bottomY: -0.04,
          topY: 0.01,
        },

        {
          z: -2.65,
          halfWidth: 0.11,
          bottomY: -0.07,
          topY: 0.06,
        },

        {
          z: -2.05,
          halfWidth: 0.22,
          bottomY: -0.1,
          topY: 0.12,
        },

        // Cockpit area
        {
          z: -1.4,
          halfWidth: 0.34,
          bottomY: -0.12,
          topY: 0.2,
        },

        // Main fuselage
        {
          z: -0.65,
          halfWidth: 0.47,
          bottomY: -0.13,
          topY: 0.26,
        },

        // Wing-root shoulder
        {
          z: 0.15,
          halfWidth: 0.62,
          bottomY: -0.13,
          topY: 0.27,
        },

        // Rear
        {
          z: 0.85,
          halfWidth: 0.56,
          bottomY: -0.11,
          topY: 0.2,
        },

        {
          z: 1.5,
          halfWidth: 0.4,
          bottomY: -0.08,
          topY: 0.11,
        },
      ]),
    [],
  );

  // =========================
  // LOW COCKPIT HUMP
  // =========================

  const cockpitGeometry = useMemo(
    () =>
      createLoftGeometry([
        {
          z: -1.8,
          halfWidth: 0.055,
          bottomY: 0.11,
          topY: 0.14,
        },

        {
          z: -1.4,
          halfWidth: 0.13,
          bottomY: 0.18,
          topY: 0.28,
        },

        {
          z: -0.95,
          halfWidth: 0.19,
          bottomY: 0.25,
          topY: 0.36,
        },

        {
          z: -0.52,
          halfWidth: 0.15,
          bottomY: 0.25,
          topY: 0.3,
        },

        {
          z: -0.2,
          halfWidth: 0.06,
          bottomY: 0.22,
          topY: 0.24,
        },
      ]),
    [],
  );

  // =========================
  // WINGS
  // =========================

  const leftWingGeometry = useMemo(
    () =>
      createWingGeometry(
        [
          // inner front
          [-0.62, 0.02, -0.38],

          // outer front
          [-1.9, -0.18, 0.05],

          // outer rear / tip
          [-2.95, -0.28, 1.6],

          // inner rear
          [-0.62, 0.02, 0.72],
        ],
        0.08,
      ),
    [],
  );

  const rightWingGeometry = useMemo(
    () =>
      createWingGeometry(
        [
          [0.62, 0.02, -0.38],

          [1.9, -0.18, 0.05],

          [2.95, -0.28, 1.6],

          [0.62, 0.02, 0.72],
        ],
        0.08,
      ),
    [],
  );

  // =========================
  // ENGINE NACELLES
  // =========================

  const nacelleGeometry = useMemo(
    () =>
      createLoftGeometry([
        // Front section begins tucked into the hull/wing root
        {
          z: -0.45,
          halfWidth: 0.14,
          bottomY: -0.07,
          topY: 0.12,
        },

        // Thickest middle section
        {
          z: 0.2,
          halfWidth: 0.2,
          bottomY: -0.1,
          topY: 0.2,
        },

        // Rear section narrows slightly
        {
          z: 0.95,
          halfWidth: 0.18,
          bottomY: -0.09,
          topY: 0.16,
        },

        // Tail / nozzle housing
        {
          z: 1.55,
          halfWidth: 0.14,
          bottomY: -0.07,
          topY: 0.11,
        },
      ]),
    [],
  );

  // =========================
  // ENGINE ROOT FAIRINGS
  // =========================
  //
  // These bridge the central hull/wing roots into the engine nacelles so
  // the engines read as part of the aircraft rather than separate pods.
  const engineFairingGeometry = useMemo(
    () =>
      createLoftGeometry([
        // Thin forward blend into the wing root
        {
          z: -0.6,
          halfWidth: 0.1,
          bottomY: -0.06,
          topY: 0.08,
        },

        // Fairing rises and widens as it reaches the nacelle
        {
          z: -0.15,
          halfWidth: 0.17,
          bottomY: -0.08,
          topY: 0.16,
        },

        // Merge into the engine body
        {
          z: 0.4,
          halfWidth: 0.2,
          bottomY: -0.09,
          topY: 0.19,
        },

        // Taper gently into the rear half of the nacelle
        {
          z: 0.95,
          halfWidth: 0.17,
          bottomY: -0.08,
          topY: 0.14,
        },
      ]),
    [],
  );

  return (
    <group>
      {/* MAIN BODY. */}

      <mesh geometry={hullGeometry}>
        <meshBasicMaterial color={COLORS.hull} side={THREE.DoubleSide} />

        {/* ONLY THE ACTUAL OUTER EDGES */}
        <Edges threshold={20} color={NEON_CYAN} lineWidth={1.5} />
      </mesh>

      {/* COCKPIT. */}

      <mesh geometry={cockpitGeometry}>
        <meshBasicMaterial color={COLORS.cockpit} side={THREE.DoubleSide} />

        <Edges threshold={18} color={NEON_MAGENTA} lineWidth={1.4} />
      </mesh>

      {/* WINGS. */}

      <mesh geometry={leftWingGeometry}>
        <meshBasicMaterial color={COLORS.wing} side={THREE.DoubleSide} />

        <Edges threshold={15} color={NEON_MAGENTA} lineWidth={1.4} />
      </mesh>

      <mesh geometry={rightWingGeometry}>
        <meshBasicMaterial color={COLORS.wing} side={THREE.DoubleSide} />

        <Edges threshold={15} color={NEON_MAGENTA} lineWidth={1.4} />
      </mesh>

      {/* =====================
          CENTRE SPINE

          This breaks up the large dark
          top surface without wireframe.
          ===================== */}

      <Line
        points={[
          [0, 0.01, -3.05],
          [0, 0.08, -2.35],
          [0, 0.16, -1.65],
          [0, 0.24, -0.95],
          [0, 0.27, -0.2],
          [0, 0.24, 0.55],
          [0, 0.16, 1.32],
        ]}
        color={NEON_CYAN}
        lineWidth={1}
        toneMapped={false}
      />

      {/* LEFT CHINE / PANEL LINE. */}

      <Line
        points={[
          [-0.12, 0.08, -2.45],
          [-0.3, 0.18, -1.55],
          [-0.46, 0.28, -0.55],
          [-0.56, 0.28, 0.25],
          [-0.46, 0.2, 1.05],
        ]}
        color={NEON_CYAN}
        lineWidth={0.8}
        toneMapped={false}
      />

      {/* RIGHT CHINE / PANEL LINE. */}

      <Line
        points={[
          [0.12, 0.08, -2.45],
          [0.3, 0.18, -1.55],
          [0.46, 0.28, -0.55],
          [0.56, 0.28, 0.25],
          [0.46, 0.2, 1.05],
        ]}
        color={NEON_CYAN}
        lineWidth={0.8}
        toneMapped={false}
      />

      {/* =====================
          ENGINE ROOT FAIRINGS

          These overlap the hull/wing roots and the front of each nacelle.
          The overlap is intentional: it visually blends the parts together
          into one continuous strike-craft silhouette.
          ===================== */}

      <mesh
        geometry={engineFairingGeometry}
        position={[-0.57, -0.015, 0.02]}
        rotation={[0, 0, -0.08]}
      >
        <meshBasicMaterial
          color={COLORS.hullSecondary}
          side={THREE.DoubleSide}
        />

        <Edges threshold={18} color={NEON_CYAN} lineWidth={1.05} />
      </mesh>

      <mesh
        geometry={engineFairingGeometry}
        position={[0.57, -0.015, 0.02]}
        rotation={[0, 0, 0.08]}
      >
        <meshBasicMaterial
          color={COLORS.hullSecondary}
          side={THREE.DoubleSide}
        />

        <Edges threshold={18} color={NEON_CYAN} lineWidth={1.05} />
      </mesh>

      {/* =====================
          ENGINE NACELLES

          Tucked close enough to the centre body to feel integrated,
          while the rear ends still project past the hull.
          ===================== */}

      <mesh geometry={nacelleGeometry} position={[-0.73, -0.025, 0.2]}>
        <meshBasicMaterial
          color={COLORS.hullSecondary}
          side={THREE.DoubleSide}
        />

        <Edges threshold={16} color={NEON_CYAN} lineWidth={1.2} />
      </mesh>

      <mesh geometry={nacelleGeometry} position={[0.73, -0.025, 0.2]}>
        <meshBasicMaterial
          color={COLORS.hullSecondary}
          side={THREE.DoubleSide}
        />

        <Edges threshold={16} color={NEON_CYAN} lineWidth={1.2} />
      </mesh>

      {/* EXHAUSTS. */}

      <mesh position={[-0.73, -0.015, 1.78]}>
        <boxGeometry args={[0.24, 0.14, 0.07]} />

        <meshBasicMaterial color={[3, 0.2, 0.03]} toneMapped={false} />
      </mesh>

      <mesh position={[0.73, -0.015, 1.78]}>
        <boxGeometry args={[0.24, 0.14, 0.07]} />

        <meshBasicMaterial color={[3, 0.2, 0.03]} toneMapped={false} />
      </mesh>

      {/* WEAPONS. */}

      <WeaponPod x={-1.55} />
      <WeaponPod x={1.55} />

      {/* SPEED / ENGINE TRAILS. */}

      <ShipTrails speedMode={speedMode} isThrusting={isThrusting} />
    </group>
  );
}