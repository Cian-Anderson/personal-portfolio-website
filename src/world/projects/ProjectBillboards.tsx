// Project billboards.

import * as THREE from "three";

import { CITY_TOWERS, type GeneratedTower } from "../city/cityTowers";

import HolographicBillboard from "./HolographicBillboard";

import BillboardFlyThrough from "./BillboardFlyThrough";

import { PROJECTS } from "../../projects/projectRegistry";

import {
  PROJECT_SLOTS,
  type BillboardFace,
  type ProjectSlotData,
} from "./projectSlots";

/*
 * Blade signs should be major landmarks.
 *
 * Project 01 is roughly 20 units wide,
 * so the blade signs now deliberately
 * live in the same visual size range.
 */
const BLADE_TARGET_WIDTH = 18;
const BLADE_MIN_WIDTH = 13;

const MAX_ROOFTOP_TOWER_HEIGHT = 45;

/*
 * Keep some breathing room between a blade
 * billboard and the next building.
 */
const BLADE_CLEARANCE_MARGIN = 3;

interface BillboardTransform {
  position: [number, number, number];

  rotationY: number;

  width: number;
  height: number;
}

/* BASIC FACE HELPERS. */

function getFaceWidth(face: BillboardFace, tower: GeneratedTower) {
  return face === "+x" || face === "-x" ? tower.depth : tower.width;
}

function getFacadeRotation(face: BillboardFace) {
  switch (face) {
    case "+x":
      return Math.PI / 2;

    case "-x":
      return -Math.PI / 2;

    case "+z":
      return 0;

    case "-z":
      return Math.PI;
  }
}

/*
 * Blade billboards are perpendicular
 * to the building wall.
 *
 * Local +X points AWAY from the building.
 *
 * That makes positioning much easier:
 *
 * building │ [mount] ===== PROJECT =====>
 */
function getBladeRotation(face: BillboardFace) {
  switch (face) {
    case "+x":
      return 0;

    case "-x":
      return Math.PI;

    case "+z":
      return -Math.PI / 2;

    case "-z":
      return Math.PI / 2;
  }
}

function getFacePosition(
  face: BillboardFace,
  tower: GeneratedTower,
  y: number,
  offset: number,
): [number, number, number] {
  const [x, , z] = tower.position;

  switch (face) {
    case "+x":
      return [x + tower.width / 2 + offset, y, z];

    case "-x":
      return [x - tower.width / 2 - offset, y, z];

    case "+z":
      return [x, y, z + tower.depth / 2 + offset];

    case "-z":
      return [x, y, z - tower.depth / 2 - offset];
  }
}

/* BUILDING BOUNDS. */

function getTowerBounds(tower: GeneratedTower) {
  return {
    minX: tower.position[0] - tower.width / 2,

    maxX: tower.position[0] + tower.width / 2,

    minZ: tower.position[2] - tower.depth / 2,

    maxZ: tower.position[2] + tower.depth / 2,
  };
}

/* BLADE CLEARANCE. */

/*
 * Find how far we can travel outward from
 * one tower face before hitting another
 * building.
 *
 * Because roads are axis-aligned, this is
 * straightforward and reliable.
 */
function getBladeClearance(tower: GeneratedTower, face: BillboardFace) {
  const current = getTowerBounds(tower);

  let nearest = Infinity;

  for (const other of CITY_TOWERS) {
    if (other.id === tower.id) {
      continue;
    }

    const bounds = getTowerBounds(other);

    // =========================
    // +X
    // =========================

    if (face === "+x") {
      /*
       * Does the other building overlap
       * our centre line along Z?
       */
      const overlapsZ =
        tower.position[2] >= bounds.minZ - 0.5 &&
        tower.position[2] <= bounds.maxZ + 0.5;

      if (overlapsZ && bounds.minX >= current.maxX) {
        nearest = Math.min(nearest, bounds.minX - current.maxX);
      }
    }

    // =========================
    // -X
    // =========================

    if (face === "-x") {
      const overlapsZ =
        tower.position[2] >= bounds.minZ - 0.5 &&
        tower.position[2] <= bounds.maxZ + 0.5;

      if (overlapsZ && bounds.maxX <= current.minX) {
        nearest = Math.min(nearest, current.minX - bounds.maxX);
      }
    }

    // =========================
    // +Z
    // =========================

    if (face === "+z") {
      const overlapsX =
        tower.position[0] >= bounds.minX - 0.5 &&
        tower.position[0] <= bounds.maxX + 0.5;

      if (overlapsX && bounds.minZ >= current.maxZ) {
        nearest = Math.min(nearest, bounds.minZ - current.maxZ);
      }
    }

    // =========================
    // -Z
    // =========================

    if (face === "-z") {
      const overlapsX =
        tower.position[0] >= bounds.minX - 0.5 &&
        tower.position[0] <= bounds.maxX + 0.5;

      if (overlapsX && bounds.maxZ <= current.minZ) {
        nearest = Math.min(nearest, current.minZ - bounds.maxZ);
      }
    }
  }

  /*
   * If there is no building in that direction,
   * there's effectively plenty of room.
   */
  if (nearest === Infinity) {
    return BLADE_TARGET_WIDTH + BLADE_CLEARANCE_MARGIN;
  }

  return nearest;
}

/* TRANSFORM. */

function getBillboardTransform(
  slot: ProjectSlotData,
  tower: GeneratedTower,
): BillboardTransform | null {
  const faceWidth = getFaceWidth(slot.face, tower);

  /* ROOFTOP. */

  if (slot.mount === "rooftop") {
    if (tower.height > MAX_ROOFTOP_TOWER_HEIGHT) {
      console.warn(
        `Skipping slot ${slot.id}: ${tower.id} is too tall for a rooftop billboard.`,
      );

      return null;
    }

    const width = THREE.MathUtils.clamp(faceWidth * slot.widthScale, 12, 19);

    const height = THREE.MathUtils.clamp(width / 2.2, 5, 8);

    return {
      position: [
        tower.position[0],
        tower.height + height / 2 + 3,
        tower.position[2],
      ],

      rotationY: getFacadeRotation(slot.face),

      width,
      height,
    };
  }

  /* BLADE. */

  if (slot.mount === "blade") {
    const clearance = getBladeClearance(tower, slot.face);

    /*
     * Billboard must fit before the next
     * tower, while keeping some empty space.
     */
    const safeWidth = clearance - BLADE_CLEARANCE_MARGIN;

    /*
     * These particular billboards have been
     * deliberately placed on open faces, so
     * they should hit the full 18-unit target.
     *
     * The clamp is still here as protection.
     */
    const width = Math.min(BLADE_TARGET_WIDTH, safeWidth);

    if (width < BLADE_MIN_WIDTH) {
      console.warn(
        [
          `Skipping slot ${slot.id}.`,
          `The ${slot.face} face of`,
          `${tower.id} only has`,
          `${clearance.toFixed(1)}`,
          `units of clearance.`,
        ].join(" "),
      );

      return null;
    }

    /*
     * Give blades a nice substantial height,
     * comparable to Project 01.
     */
    const height = THREE.MathUtils.clamp(width / 2.35, 6, 8);

    const desiredY = tower.height * slot.heightRatio;

    const y = THREE.MathUtils.clamp(
      desiredY,
      height / 2 + 4,
      tower.height - height / 2 - 3,
    );

    /*
     * Centre is half its width away from
     * the wall.
     *
     * Therefore its inner edge sits right
     * beside the building and its entire
     * body projects into the road.
     */
    const outwardDistance = width / 2 + 0.35;

    return {
      position: getFacePosition(slot.face, tower, y, outwardDistance),

      rotationY: getBladeRotation(slot.face),

      width,
      height,
    };
  }

  /* FACADE. */

  const width = THREE.MathUtils.clamp(faceWidth * slot.widthScale, 9, 20);

  const height = THREE.MathUtils.clamp(width / 2.2, 4.5, 8.5);

  const desiredY = tower.height * slot.heightRatio;

  const y = THREE.MathUtils.clamp(
    desiredY,
    height / 2 + 3,
    tower.height - height / 2 - 3,
  );

  return {
    position: getFacePosition(slot.face, tower, y, 0.28),

    rotationY: getFacadeRotation(slot.face),

    width,
    height,
  };
}

/* RENDER. */

export default function ProjectBillboards() {
  return (
    <group>
      {PROJECTS.map((project) => {
        if (!project.world) {
          return null;
        }

        const slot = PROJECT_SLOTS.find(
          (candidate) => candidate.id === project.world?.slot,
        );

        if (!slot) {
          console.warn(
            `No world slot found for project ${project.id}: ${project.world.slot}`,
          );

          return null;
        }

        const tower = CITY_TOWERS.find(
          (candidate) => candidate.id === slot.towerId,
        );

        if (!tower) {
          console.warn(`No tower found for slot ${slot.id}: ${slot.towerId}`);

          return null;
        }

        const transform = getBillboardTransform(slot, tower);

        if (!transform) {
          return null;
        }

        return (
          <group key={project.id}>
            <HolographicBillboard
              title={project.title}
              position={transform.position}
              rotationY={transform.rotationY}
              width={transform.width}
              height={transform.height}
              accent={project.world.accent ?? "cyan"}
              mount={slot.mount}
            />

            <BillboardFlyThrough
              projectId={project.id}
              position={transform.position}
              rotationY={transform.rotationY}
              width={transform.width}
              height={transform.height}
            />
          </group>
        );
      })}
    </group>
  );
}
