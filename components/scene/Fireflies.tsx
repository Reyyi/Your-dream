"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTimeStore } from "@/lib/store";
import { getSkyState } from "@/lib/timeOfDay";
import type { SceneQuality } from "@/components/scene/GrassField";

const fireflyVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uNight;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aBasePos;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float t = uTime * aSpeed + aPhase;
    vec3 pos = aBasePos;
    pos.x += sin(t * 0.75) * 0.4 + cos(t * 0.3) * 0.15;
    // Gentle upward drift ascending from the grass and shrubs
    float rise = mod(t * 0.14, 1.3) - 0.2;
    pos.y += rise + cos(t * 0.6) * 0.12 + sin(t * 1.2) * 0.06;
    pos.z += sin(t * 0.45) * 0.12;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Organic pulsing glow
    float blink = pow(sin(t * 2.1) * 0.5 + 0.5, 2.5);
    vAlpha = (0.2 + blink * 0.8) * uNight;
    vColor = aColor;
    gl_PointSize = (8.0 + blink * 10.0);
  }
`;

const fireflyFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float dist = length(p);
    if (dist > 0.5 || vAlpha < 0.01) discard;

    float core = exp(-dist * 12.0);
    float halo = exp(-dist * 4.2) * 0.45;
    float alpha = (core + halo) * vAlpha;

    gl_FragColor = vec4(vColor * (core * 2.0 + halo), alpha);
    #include <colorspace_fragment>
  }
`;

function seeded(index: number) {
  const value = Math.sin(index * 137.1 + 421.7) * 43758.5453;
  return value - Math.floor(value);
}

export function Fireflies({ quality }: { quality: SceneQuality }) {
  const viewport = useThree((state) => state.viewport);
  const count = quality === "low" ? 16 : quality === "medium" ? 26 : 38;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    const groundY = -viewport.height * 0.42;

    for (let i = 0; i < count; i++) {
      // Clustered more towards the ground lamp and grass
      const x = (seeded(i + 1) - 0.42) * viewport.width * 0.9;
      const y = groundY + seeded(i + 200) * viewport.height * 0.42;
      const z = -0.3 + seeded(i + 400) * 0.6;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      phases[i] = seeded(i + 600) * Math.PI * 2;
      speeds[i] = 0.6 + seeded(i + 800) * 0.8;

      // Color variation: lime-gold, warm amber, soft twilight gold
      const randColor = seeded(i + 950);
      if (randColor < 0.58) {
        colors[i * 3] = 0.86;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 0.42;
      } else if (randColor < 0.85) {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.84;
        colors[i * 3 + 2] = 0.38;
      } else {
        colors[i * 3] = 0.96;
        colors[i * 3 + 1] = 0.93;
        colors[i * 3 + 2] = 0.68;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aBasePos", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: fireflyVertexShader,
      fragmentShader: fireflyFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uNight: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    return { geometry: geo, material: mat };
  }, [count, viewport.height, viewport.width]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock =
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, performance.now());
    const sky = getSkyState(hour);

    // Fireflies emerge during evening and night (stars > 0.1 or twilight)
    const nightIntensity = Math.max(0, Math.min(1, sky.stars * 1.2 + (1 - sky.sun) * 0.4 - 0.25));

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uNight.value = nightIntensity;
  });

  return (
    <points
      geometry={geometry}
      material={material}
      renderOrder={15}
    />
  );
}
