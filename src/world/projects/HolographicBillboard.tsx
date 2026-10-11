// Holographic billboard renderer.

import { Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

import type { BillboardAccent, BillboardMount } from "./projectSlots";

interface HolographicBillboardProps {
  title: string;

  position: [number, number, number];

  rotationY: number;

  width: number;
  height: number;

  accent: BillboardAccent;
  mount: BillboardMount;
}

const ACCENT_COLORS = {
  cyan: "#00eaff",
  magenta: "#ff2bd6",
  purple: "#9d62ff",
} as const;

export default function HolographicBillboard({
  title,
  position,
  rotationY,
  width,
  height,
  accent: accentName,
  mount,
}: HolographicBillboardProps) {
  const accent = ACCENT_COLORS[accentName];

  const glowColor = useMemo(
    () => new THREE.Color(accent).multiplyScalar(3.4),
    [accent],
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* MOUNTING STRUCTURE. */}

      {mount === "facade" && (
        <FacadeMount width={width} height={height} color={glowColor} />
      )}

      {mount === "blade" && (
        <BladeMount width={width} height={height} color={glowColor} />
      )}

      {mount === "rooftop" && (
        <RooftopMount width={width} height={height} color={glowColor} />
      )}

      {/* COMMON PROJECT PANEL. */}

      <ProjectPanel
        title={title}
        width={width}
        height={height}
        accent={accent}
        glowColor={glowColor}
      />
    </group>
  );
}

/* PROJECT PANEL. */

interface ProjectPanelProps {
  title: string;
  width: number;
  height: number;
  accent: string;
  glowColor: THREE.Color;
}

function ProjectPanel({
  title,
  width,
  height,
  accent,
  glowColor,
}: ProjectPanelProps) {
  const frameThickness = 0.5;
  const frameDepth = 0.4;

  return (
    <group>
      {/* DOUBLE-SIDED SCREEN. */}

      <mesh>
        <planeGeometry args={[width, height]} />

        <meshBasicMaterial
          color="#101825"
          transparent={false}
          depthWrite={true}
          depthTest={true}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* Darkening layer */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width * 0.97, height * 0.94]} />

        <meshBasicMaterial
          color="#060a13"
          transparent
          opacity={0.75}
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* Accent wash */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 0.95, height * 0.9]} />

        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.035}
          toneMapped={false}
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* FRAME. */}

      <FramePiece
        position={[0, height / 2, 0.04]}
        size={[width + 0.25, frameThickness, frameDepth]}
        color={glowColor}
      />

      <FramePiece
        position={[0, -height / 2, 0.04]}
        size={[width + 0.25, frameThickness, frameDepth]}
        color={glowColor}
      />

      <FramePiece
        position={[-width / 2, 0, 0.04]}
        size={[frameThickness, height, frameDepth]}
        color={glowColor}
      />

      <FramePiece
        position={[width / 2, 0, 0.04]}
        size={[frameThickness, height, frameDepth]}
        color={glowColor}
      />

      {/* CORNERS. */}

      <Corner position={[-width / 2, height / 2, 0.1]} color={glowColor} />

      <Corner position={[width / 2, height / 2, 0.1]} color={glowColor} />

      <Corner position={[-width / 2, -height / 2, 0.1]} color={glowColor} />

      <Corner position={[width / 2, -height / 2, 0.1]} color={glowColor} />

      {/* FRONT CONTENT. */}

      <PanelContent
        title={title}
        width={width}
        height={height}
        accent={accent}
      />

      {/* =========================
          BACK CONTENT

          Separate copy rotated 180°.

          This means:
          - front reads correctly
          - back reads correctly
          - no mirrored PROJECT_01
          ========================= */}

      <group rotation={[0, Math.PI, 0]}>
        <PanelContent
          title={title}
          width={width}
          height={height}
          accent={accent}
        />
      </group>
    </group>
  );
}

/* PANEL CONTENT. */

interface PanelContentProps {
  title: string;
  width: number;
  height: number;
  accent: string;
}

// Split long titles at a word boundary into at most two balanced lines.
// Short titles remain on one line.
function getTitleLines(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length < 3 || title.length <= 22) return title;

  let bestIndex = 1;
  let bestDifference = Infinity;
  for (let i = 1; i < words.length; i++) {
    const first = words.slice(0, i).join(" ");
    const second = words.slice(i).join(" ");
    const difference = Math.abs(first.length - second.length);
    if (difference < bestDifference) {
      bestDifference = difference;
      bestIndex = i;
    }
  }
  return `${words.slice(0, bestIndex).join(" ")}\n${words.slice(bestIndex).join(" ")}`;
}

// Troika creates text geometry asynchronously; measure the actual result
// and scale it down only if it exceeds the safe interior rectangle.
function fitTextInsidePanel(
  mesh: THREE.Mesh,
  availableWidth: number,
  availableHeight: number,
) {
  mesh.geometry.computeBoundingBox();
  const bounds = mesh.geometry.boundingBox;
  if (!bounds) return;

  const textWidth = bounds.max.x - bounds.min.x;
  const textHeight = bounds.max.y - bounds.min.y;
  if (textWidth <= 0 || textHeight <= 0) return;

  mesh.scale.setScalar(
    Math.min(1, availableWidth / textWidth, availableHeight / textHeight),
  );
}

function PanelContent({ title, width, height, accent }: PanelContentProps) {
  const displayTitle = getTitleLines(title);
  const isTwoLines = displayTitle.includes("\n");

  return (
    <group>
      <Text
        position={[0, height * 0.1, 0.14]}
        fontSize={Math.min(2.05, width * 0.125, height * 0.3)}
        lineHeight={1.15}
        letterSpacing={0.005}
        textAlign="center"
        whiteSpace="nowrap"
        onSync={(mesh) =>
          fitTextInsidePanel(
            mesh,
            width * 0.8,
            height * (isTwoLines ? 0.48 : 0.3),
          )
        }
        color="#f4fbff"
        outlineWidth={0.012}
        outlineColor={accent}
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
        material-side={THREE.FrontSide}
        material-fog={false}
      >
        {displayTitle}
      </Text>

      <Text
        position={[0, -height * 0.28, 0.14]}
        fontSize={Math.min(0.44, width * 0.028)}
        letterSpacing={0.065}
        whiteSpace="nowrap"
        onSync={(mesh) => fitTextInsidePanel(mesh, width * 0.72, height * 0.1)}
        color={accent}
        anchorX="center"
        anchorY="middle"
        material-toneMapped={false}
        material-side={THREE.FrontSide}
        material-fog={false}
      >
        TARGET // ARCHIVE NODE
      </Text>

      <mesh position={[0, -height * 0.39, 0.14]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.28, 0.28, 0.05]} />
        <meshBasicMaterial
          color={accent}
          wireframe
          toneMapped={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}

/* FACADE MOUNT. */

function FacadeMount({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: THREE.Color;
}) {
  return (
    <group>
      <mesh position={[0, 0, -0.22]}>
        <boxGeometry args={[width * 0.82, height * 0.8, 0.18]} />

        <meshBasicMaterial color="#090d14" fog={false} />
      </mesh>

      <MountNode
        position={[-width * 0.34, height * 0.32, -0.18]}
        color={color}
      />

      <MountNode
        position={[width * 0.34, height * 0.32, -0.18]}
        color={color}
      />

      <MountNode
        position={[-width * 0.34, -height * 0.32, -0.18]}
        color={color}
      />

      <MountNode
        position={[width * 0.34, -height * 0.32, -0.18]}
        color={color}
      />
    </group>
  );
}

/* BLADE / SIDE MOUNT. */

function BladeMount({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: THREE.Color;
}) {
  return (
    <group>
      <mesh position={[-width / 2 - 0.42, 0, -0.05]}>
        <boxGeometry args={[0.34, height * 1.18, 0.5]} />

        <meshBasicMaterial color="#080c13" fog={false} />
      </mesh>

      <mesh position={[-width / 2 - 0.16, height * 0.32, -0.08]}>
        <boxGeometry args={[0.7, 0.24, 0.45]} />

        <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      </mesh>

      <mesh position={[-width / 2 - 0.16, -height * 0.32, -0.08]}>
        <boxGeometry args={[0.7, 0.24, 0.45]} />

        <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      </mesh>

      <mesh position={[-width / 2 - 0.42, height * 0.59, -0.05]}>
        <boxGeometry args={[0.5, 0.2, 0.6]} />

        <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      </mesh>
    </group>
  );
}

/* ROOFTOP MOUNT. */

function RooftopMount({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color: THREE.Color;
}) {
  const legDistance = width * 0.33;

  return (
    <group>
      <mesh position={[-legDistance, -height / 2 - 1.4, -0.1]}>
        <boxGeometry args={[0.34, 2.8, 0.5]} />

        <meshBasicMaterial color="#090d14" fog={false} />
      </mesh>

      <mesh position={[legDistance, -height / 2 - 1.4, -0.1]}>
        <boxGeometry args={[0.34, 2.8, 0.5]} />

        <meshBasicMaterial color="#090d14" fog={false} />
      </mesh>

      <mesh position={[0, -height / 2 - 0.15, -0.1]}>
        <boxGeometry args={[width * 0.82, 0.28, 0.5]} />

        <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      </mesh>

      <MountNode
        position={[-legDistance, -height / 2 - 2.82, -0.1]}
        color={color}
      />

      <MountNode
        position={[legDistance, -height / 2 - 2.82, -0.1]}
        color={color}
      />
    </group>
  );
}

/* HELPERS. */

interface FramePieceProps {
  position: [number, number, number];

  size: [number, number, number];

  color: THREE.Color;
}

function FramePiece({ position, size, color }: FramePieceProps) {
  return (
    <mesh position={position} frustumCulled={false} renderOrder={10}>
      <boxGeometry args={size} />

      <meshBasicMaterial
        color={color}
        toneMapped={false}
        fog={false}
        depthWrite={false}
        depthTest
      />
    </mesh>
  );
}

function Corner({
  position,
  color,
}: {
  position: [number, number, number];

  color: THREE.Color;
}) {
  return (
    <mesh position={position} frustumCulled={false} renderOrder={10}>
      <boxGeometry args={[0.7, 0.7, 0.4]} />

      <meshBasicMaterial
        color={color}
        toneMapped={false}
        fog={false}
        depthWrite={false}
        depthTest
      />
    </mesh>
  );
}

function MountNode({
  position,
  color,
}: {
  position: [number, number, number];

  color: THREE.Color;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.5, 0.38]} />

      <meshBasicMaterial color={color} toneMapped={false} fog={false} />
    </mesh>
  );
}
