"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { LayerPlane } from "@/components/scene/LayerPlane";
import type { ParallaxState } from "@/components/scene/Parallax";
import { sceneSprites } from "@/lib/layers.config";
import { getLayerLayout } from "@/lib/layerLayout";
import { useTimeStore } from "@/lib/store";

const lampConfig = sceneSprites.find((sprite) => sprite.id === "street_lamp")!;

function eveningIntensity(hour: number) {
  const smooth = (from: number, to: number, value: number) => {
    const amount = THREE.MathUtils.clamp((value - from) / (to - from), 0, 1);
    return amount * amount * (3 - 2 * amount);
  };

  if (hour >= 16.4) return smooth(16.4, 18.5, hour);
  if (hour < 5.1) return 1 - smooth(4.2, 5.1, hour);
  return 0;
}

function Glow({
  position,
  size,
  parallax,
}: {
  position: readonly [number, number, number];
  size: readonly [number, number];
  parallax: React.MutableRefObject<ParallaxState>;
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uIntensity;
          uniform float uPulse;
          varying vec2 vUv;
          void main() {
            vec2 centered = (vUv - 0.5) * (2.0 / uPulse);
            float radius = dot(centered, centered);
            float halo = exp(-radius * 4.0);
            float core = exp(-radius * 22.0);
            float alpha = max(halo * 0.34, core);
            vec3 color = vec3(1.0, 0.57, 0.2) * (halo * 1.1 + core * 3.0);
            gl_FragColor = vec4(color * uIntensity, alpha * uIntensity);
            #include <colorspace_fragment>
          }
        `,
        uniforms: {
          uIntensity: { value: 0 },
          uPulse: { value: 1 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock =
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, performance.now());
    const reducedMotion = parallax.current.reducedMotion;
    const pulse = reducedMotion
      ? 1
      : 1 + Math.sin(state.clock.elapsedTime * 1.6 + position[0]) * 0.035;
    const flicker = reducedMotion
      ? 1
      : 0.97 + Math.sin(state.clock.elapsedTime * 2.2 + position[0]) * 0.025;
    material.uniforms.uIntensity.value = eveningIntensity(hour) * flicker;
    material.uniforms.uPulse.value = pulse;
  });

  return (
    <mesh
      position={position}
      renderOrder={lampConfig.renderOrder + 1}
      scale={[size[0], size[1], 1]}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

export function GroundLamp({
  parallax,
  availableLayerIds,
  viewportWidth,
  viewportHeight,
}: {
  parallax: React.MutableRefObject<ParallaxState>;
  availableLayerIds: string[];
  viewportWidth: number;
  viewportHeight: number;
}) {
  const groundY = -viewportHeight * 0.43;
  const lampConfigAtEdge = {
    ...lampConfig,
    position: [viewportWidth * 0.42, groundY, lampConfig.position[2]] as const,
  };
  const layout = getLayerLayout(lampConfigAtEdge, viewportWidth, viewportHeight);
  const x = viewportWidth * 0.42;
  const z = layout.position[2];
  const groundedConfig = {
    ...lampConfigAtEdge,
    position: [x, groundY + layout.height * 0.46, z] as const,
  };
  const glowX = x - layout.width * 0.09;
  const glowY = groundY + layout.height * 0.68;

  return (
    <>
      <LayerPlane
        config={groundedConfig}
        assetAvailable={availableLayerIds.includes(lampConfig.id)}
        viewportHeight={viewportHeight}
        viewportWidth={viewportWidth}
      />
      <Glow
        position={[glowX, glowY, z + 0.04]}
        size={[layout.height * 0.65, layout.height * 0.72]}
        parallax={parallax}
      />
      <Glow
        position={[glowX, groundY + 0.01, z + 0.035]}
        size={[layout.height * 1.15, layout.height * 0.24]}
        parallax={parallax}
      />
    </>
  );
}
