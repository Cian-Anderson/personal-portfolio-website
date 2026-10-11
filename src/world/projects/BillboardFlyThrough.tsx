import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useShipStore } from "../../stores/useShipStore";
import { useProjectStore } from "../../stores/useProjectStore";
import { useViewStore } from "../../stores/useViewStore";

interface BillboardFlyThroughProps {
  projectId: string;
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
}

const EXIT_DISTANCE = 5;

export default function BillboardFlyThrough({
  projectId,
  position,
  rotationY,
  width,
  height,
}: BillboardFlyThroughProps) {
  const previousPosition = useRef<THREE.Vector3 | null>(null);
  const armed = useRef(true);

  const exitPosition = useRef<[number, number, number] | null>(null);

  const exitYaw = useRef(0);

  const center = useRef(new THREE.Vector3(...position));

  const normal = useRef(
    new THREE.Vector3(0, 0, 1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationY,
    ),
  );

  useEffect(() => {
    return useProjectStore.subscribe((state, previousState) => {
      if (
        previousState.viewerOpen &&
        !state.viewerOpen &&
        exitPosition.current !== null
      ) {
        const shipStore = useShipStore.getState();

        shipStore.requestTeleport(exitPosition.current, exitYaw.current);

        shipStore.startExitCinematic();

        exitPosition.current = null;
        previousPosition.current = null;
        armed.current = false;
      }
    });
  }, []);

  useFrame(() => {
    const shipState = useShipStore.getState();
    const viewer = useProjectStore.getState();
    const view = useViewStore.getState();

    const current = new THREE.Vector3(...shipState.position);

    const previous = previousPosition.current;
    previousPosition.current = current;

    if (!previous) return;

    if (
      viewer.viewerOpen ||
      shipState.entryCinematic !== null ||
      shipState.exitCinematic !== null ||
      shipState.teleportRequest !== null ||
      !view.introComplete ||
      view.viewMode !== "chase" ||
      view.transitionProgress < 0.999
    ) {
      return;
    }

    const previousDistance = previous
      .clone()
      .sub(center.current)
      .dot(normal.current);

    const currentDistance = current
      .clone()
      .sub(center.current)
      .dot(normal.current);

    if (Math.abs(currentDistance) > 4) {
      armed.current = true;
    }

    if (!armed.current) return;

    // Trigger the entry animation before the
    // ship actually intersects the billboard.
    //
    // 3 world units in front of the surface.
    const ENTRY_TRIGGER_DISTANCE = 3;

    const previousApproachDistance = Math.abs(previousDistance);

    const currentApproachDistance = Math.abs(currentDistance);

    // Only trigger while approaching the panel,
    // not while moving away from it.
    if (currentApproachDistance >= previousApproachDistance) {
      return;
    }

    // The ship must have entered the approach zone.
    if (
      previousApproachDistance > ENTRY_TRIGGER_DISTANCE &&
      currentApproachDistance <= ENTRY_TRIGGER_DISTANCE
    ) {
      // Continue to the intersection bounds check below.
    } else {
      return;
    }

    const denominator = previousDistance - currentDistance;

    if (Math.abs(denominator) < 0.000001) {
      return;
    }

    const triggerPlaneDistance =
      previousDistance >= 0 ? ENTRY_TRIGGER_DISTANCE : -ENTRY_TRIGGER_DISTANCE;

    const t = (previousDistance - triggerPlaneDistance) / denominator;

    if (t < 0 || t > 1) return;

    const intersection = previous.clone().lerp(current, t);

    const local = intersection
      .sub(center.current)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotationY);

    if (Math.abs(local.x) > width / 2 || Math.abs(local.y) > height / 2) {
      return;
    }

    armed.current = false;

    // Save the return position on the entry side.
    const outward = normal.current.clone();

    if (previousDistance < 0) {
      outward.negate();
    }

    const exit = center.current.clone().addScaledVector(outward, EXIT_DISTANCE);

    exitPosition.current = [exit.x, exit.y, exit.z];

    exitYaw.current = Math.atan2(-outward.x, -outward.z);

    // ==========================================
    // PRESERVE ACTUAL APPROACH TRAJECTORY
    // ==========================================

    // The ship's current orientation determines
    // its travel direction, not the billboard.

    const approachDirection = new THREE.Vector3(0, 0, -1)
      .applyEuler(new THREE.Euler(shipState.pitch, shipState.yaw, 0, "YXZ"))
      .normalize();

    // Use the ship's actual position.
    // No snapping to the billboard centre.
    const start = current.clone();

    // Start the cinematic from the actual
    // position and continue in the same direction.
    shipState.startEntryCinematic(
      projectId,
      [start.x, start.y, start.z],
      [approachDirection.x, approachDirection.y, approachDirection.z],
    );
  });

  return null;
}
