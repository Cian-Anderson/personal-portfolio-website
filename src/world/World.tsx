// Portfolio world scene.

import { Canvas } from "@react-three/fiber";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

import Spaceship from "./spaceship/Spaceship";
import CockpitHUD from "./ui/cockpit/CockpitHUD";
import CameraRig from "./camera/CameraRig";
import NeonGrid from "./environment/NeonGrid";
import Environment from "./environment/Environment";
import SpaceBackdrop from "./environment/SpaceBackdrop";
import CockpitMenu from "./ui/cockpit/menu/CockpitMenu";
import ProjectViewerOverlay from "./ui/project/ProjectViewerOverlay";

export default function World() {
  return (
    <>
      <Canvas
        dpr={[1, 1.75]}
        camera={{
          position: [0, 5, 16],
          fov: 65,
          near: 0.1,
          far: 500,
        }}
        gl={{
          antialias: true,
        }}
      >
        <color attach="background" args={["#02030a"]} />

        <fog attach="fog" args={["#02030a", 60, 170]} />

        {/* SPACE */}
        <SpaceBackdrop />

        {/* WORLD */}
        <NeonGrid />

        <Environment />

        <Spaceship />

        <CameraRig />

        {/* Keep HUD in the scene. */}

        <CockpitHUD />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Cockpit menu. */}
      <CockpitMenu />

      {/* Project viewer. */}
      <ProjectViewerOverlay />
    </>
  );
}