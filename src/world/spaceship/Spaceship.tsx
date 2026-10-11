// Ship instance.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import ShipModel from "./ShipModel";
import { useShipFlight } from "./useShipFlight";

import { useViewStore } from "../../stores/useViewStore";

export default function Spaceship() {
  const ship = useRef<THREE.Group>(null);

  const externalModel = useRef<THREE.Group>(null);

  const { speedMode, isThrusting } = useShipFlight(ship);

  useFrame(() => {
    if (!externalModel.current) {
      return;
    }

    const progress = useViewStore.getState().transitionProgress;

    /*
     * Hide the external spacecraft
     * shortly before the camera
     * physically reaches it.
     */
    externalModel.current.visible = progress > 0.16;
  });

  return (
    <group ref={ship} position={[0, 1.5, 8]}>
      <group ref={externalModel}>
        <ShipModel speedMode={speedMode} isThrusting={isThrusting} />
      </group>
    </group>
  );
}