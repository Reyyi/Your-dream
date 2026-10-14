"use client";

import { Component, Suspense, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { LayerConfig } from "@/lib/layers.config";
import { createLayerPlaceholder } from "@/lib/layerPlaceholder";
import { getLayerTint } from "@/lib/layerAppearance";
import { getSkyState } from "@/lib/timeOfDay";
import { useTimeStore } from "@/lib/store";
import layerFragmentShader from "@/shaders/layer.frag";
import layerVertexShader from "@/shaders/layer.vert";
import { getLayerLayout } from "@/lib/layerLayout";

type LayerPlaneProps = {
  config: LayerConfig;
  viewportWidth: number;
  viewportHeight: number;
  assetAvailable?: boolean;
  fallback?: ReactNode;
};

function LitLayer({
  config,
  texture,
  viewportWidth,
  viewportHeight,
}: LayerPlaneProps & { texture: THREE.Texture }) {
  const layout = getLayerLayout(config, viewportWidth, viewportHeight);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: layerVertexShader,
        fragmentShader: layerFragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uMap: { value: texture },
          uTint: { value: new THREE.Color(1, 1, 1) },
          uFogColor: { value: new THREE.Color() },
          uFog: { value: 0 },
          uTime: { value: 0 },
          uEdgeNoise: { value: 0.08 },
        },
      }),
    [texture],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock =
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, performance.now());
    const sky = getSkyState(hour);
    const uniforms = material.uniforms;

    uniforms.uTint.value.setRGB(...getLayerTint(hour, sky));
    uniforms.uFogColor.value.setRGB(...sky.horizonColor);
    uniforms.uFog.value = sky.fog * config.fog;
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      position={layout.position}
      renderOrder={config.renderOrder}
      scale={[layout.width, layout.height, 1]}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

type LayerErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type LayerErrorBoundaryState = {
  failed: boolean;
};

class LayerErrorBoundary extends Component<
  LayerErrorBoundaryProps,
  LayerErrorBoundaryState
> {
  state: LayerErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): LayerErrorBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function PlaceholderPlane({
  config,
  viewportWidth,
  viewportHeight,
}: LayerPlaneProps) {
  const texture = useMemo(() => {
    const canvas = createLayerPlaceholder(config.id);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.needsUpdate = true;
    return result;
  }, [config.id]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <LitLayer
      config={config}
      texture={texture}
      viewportHeight={viewportHeight}
      viewportWidth={viewportWidth}
    />
  );
}

function LoadedImagePlane({
  config,
  viewportWidth,
  viewportHeight,
}: LayerPlaneProps) {
  const texture = useTexture(config.path);
  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(
    () => () => {
      useTexture.clear(config.path);
      texture.dispose();
    },
    [config.path, texture],
  );

  return (
    <LitLayer
      config={config}
      texture={texture}
      viewportHeight={viewportHeight}
      viewportWidth={viewportWidth}
    />
  );
}

export function LayerPlane(props: LayerPlaneProps) {
  const placeholder = (
    <PlaceholderPlane
      config={props.config}
      viewportHeight={props.viewportHeight}
      viewportWidth={props.viewportWidth}
    />
  );

  const fallback = props.fallback ?? placeholder;
  if (!props.assetAvailable) return fallback;

  return (
    <LayerErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <LoadedImagePlane {...props} />
      </Suspense>
    </LayerErrorBoundary>
  );
}
