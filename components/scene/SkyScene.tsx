"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { PerformanceMonitor } from "@react-three/drei";
import { allSceneLayers } from "@/lib/layers.config";
import { LayerPlane } from "@/components/scene/LayerPlane";
import { Atmosphere } from "@/components/scene/Atmosphere";
import {
  ParallaxLayer,
  ParallaxSmoothing,
  ResponsiveSceneCamera,
  useParallaxControls,
} from "@/components/scene/Parallax";
import type { ParallaxState } from "@/components/scene/Parallax";
import { GroundLamp } from "@/components/scene/GroundLamp";
import { GrassField } from "@/components/scene/GrassField";
import type { SceneQuality } from "@/components/scene/GrassField";
import { PaperWash } from "@/components/scene/PaperWash";
import { getSkyState } from "@/lib/timeOfDay";
import { useTimeStore } from "@/lib/store";
import skyFragmentShader from "@/shaders/sky.frag";
import skyVertexShader from "@/shaders/sky.vert";

function SkyBackdrop() {
  const viewport = useThree((state) => state.viewport);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: skyVertexShader,
        fragmentShader: skyFragmentShader,
        side: THREE.FrontSide,
        uniforms: {
          uFog: { value: 0 },
          uSkyTop: { value: new THREE.Color() },
          uHorizon: { value: new THREE.Color() },
          uLight: { value: new THREE.Color() },
        },
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock =
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const time = store.getTimeOfDay(wallClock, performance.now());
    const sky = getSkyState(time);
    const uniforms = material.uniforms;

    uniforms.uFog.value = sky.fog;
    uniforms.uSkyTop.value.setRGB(...sky.topColor);
    uniforms.uHorizon.value.setRGB(...sky.horizonColor);
    uniforms.uLight.value.setRGB(...sky.lightColor);
  });

  return (
    <mesh
      position={[0, 0, -10]}
      renderOrder={0}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <primitive attach="material" object={material} />
    </mesh>
  );
}

function SceneEffects({ quality }: { quality: SceneQuality }) {
  return (
    <EffectComposer multisampling={0}>
      {quality !== "low" && (
        <Bloom
          intensity={quality === "medium" ? 0.22 : 0.28}
          luminanceThreshold={0.68}
          luminanceSmoothing={0.22}
        />
      )}
      <Vignette offset={0.28} darkness={0.34} />
      {quality === "high" && <Noise opacity={0.025} />}
    </EffectComposer>
  );
}

function SceneLayers({
  parallax,
  quality,
  availableLayerIds,
}: {
  parallax: React.MutableRefObject<ParallaxState>;
  quality: SceneQuality;
  availableLayerIds: string[];
}) {
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      {allSceneLayers
        .filter((layer) => ["mountains_far", "hills_mid", "hills_near", "frame_leaves"].includes(layer.id))
        .map((layer) => (
          <ParallaxLayer key={layer.id} depth={layer.depth} state={parallax}>
            <LayerPlane
              config={layer}
              assetAvailable={availableLayerIds.includes(layer.id)}
              viewportHeight={viewport.height}
              viewportWidth={viewport.width}
            />
          </ParallaxLayer>
        ))}
      <GroundLamp
        parallax={parallax}
        availableLayerIds={availableLayerIds}
        viewportHeight={viewport.height}
        viewportWidth={viewport.width}
      />
      <GrassField
        quality={quality}
        parallax={parallax}
        availableLayerIds={availableLayerIds}
        viewportHeight={viewport.height}
        viewportWidth={viewport.width}
      />
    </>
  );
}

export default function SkyScene({
  availableLayerIds,
}: {
  availableLayerIds: string[];
}) {
  const [quality, setQuality] = useState<SceneQuality>("high");
  const { state: parallax, showPermissionButton, requestOrientationPermission } =
    useParallaxControls();

  return (
    <div className="absolute inset-0">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 10], zoom: 400, near: 0.1, far: 120 }}
        dpr={quality === "low" ? 1 : quality === "medium" ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        onCreated={({ gl }) => {
          if (!(gl instanceof THREE.WebGLRenderer)) {
            throw new Error("Langit Pelita memerlukan renderer WebGL 2.");
          }
        }}
      >
        <ResponsiveSceneCamera />
        <PerformanceMonitor
          onDecline={() => setQuality("medium")}
          onFallback={() => setQuality("low")}
          onIncline={() => setQuality("high")}
        />
        <ParallaxSmoothing state={parallax} />
        <SkyBackdrop />
        <Atmosphere quality={quality} />
        <SceneLayers
          availableLayerIds={availableLayerIds}
          parallax={parallax}
          quality={quality}
        />
        <PaperWash />
        <SceneEffects quality={quality} />
      </Canvas>
      {showPermissionButton && (
        <button
          className="pointer-events-auto absolute right-5 top-20 z-20 rounded-full border border-white/35 bg-slate-900/35 px-3 py-2 text-[0.65rem] text-white/80 backdrop-blur-md transition-colors hover:bg-slate-900/60"
          onClick={() => void requestOrientationPermission()}
          type="button"
        >
          aktifkan gerak perangkat
        </button>
      )}
    </div>
  );
}
