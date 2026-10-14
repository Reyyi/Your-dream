"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWeatherStore } from "@/lib/weatherStore";
import type { SceneQuality } from "@/components/scene/GrassField";

// ──────────────────────────────────────────────────────────
// 1. Shaders for Rain Streaks & Splashes
// ──────────────────────────────────────────────────────────

const rainVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uHeight;
  uniform float uWidth;
  uniform float uSpeed;
  uniform float uSlant;
  attribute float aInitialX;
  attribute float aInitialY;
  attribute float aSpeedVariation;
  attribute float aLength;
  attribute float aVertexIndex; // 0 = head, 1 = tail
  varying float vVertexIndex;
  varying float vAlpha;

  void main() {
    vVertexIndex = aVertexIndex;
    
    // Continuous downward loop
    float speed = uSpeed * aSpeedVariation;
    float currentY = mod(aInitialY - uTime * speed, uHeight) - (uHeight * 0.5);
    
    // Slant calculation
    float currentX = aInitialX + currentY * uSlant;
    
    // Streak extension from head to tail
    vec3 pos = vec3(currentX, currentY, position.z);
    if (aVertexIndex > 0.5) {
      pos.y += aLength;
      pos.x -= aLength * uSlant;
    }

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    
    // Soft fade at top and bottom bounds
    float normalizedY = (currentY / (uHeight * 0.5));
    float edgeFade = 1.0 - smoothstep(0.7, 0.98, abs(normalizedY));
    vAlpha = edgeFade;
  }
`;

const rainFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying float vVertexIndex;
  varying float vAlpha;

  void main() {
    float headToTail = 1.0 - vVertexIndex * 0.85;
    float alpha = headToTail * vAlpha * uOpacity * 0.55;
    if (alpha < 0.005) discard;

    vec3 rainColor = vec3(0.78, 0.88, 1.0);
    gl_FragColor = vec4(rainColor, alpha);
    #include <colorspace_fragment>
  }
`;

// ──────────────────────────────────────────────────────────
// 2. Shaders for Volumetric Mountain Fog
// ──────────────────────────────────────────────────────────

const fogVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform float uDriftSpeed;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * uDriftSpeed;

    // Layered flowing sine waves simulating drifting mountain vapor
    float wave1 = sin(uv.x * 2.8 + t * 0.7) * 0.12;
    float wave2 = cos(uv.x * 4.6 - t * 0.5 + uv.y * 1.5) * 0.08;
    float wave3 = sin(uv.x * 7.2 + t * 1.1) * 0.04;
    
    float waveOffset = wave1 + wave2 + wave3;
    float heightFade = smoothstep(0.08, 0.45, uv.y + waveOffset) * smoothstep(0.92, 0.5, uv.y + waveOffset);
    
    // Horizontal edge softness
    float edgeFade = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
    
    float alpha = heightFade * edgeFade * uOpacity * 0.38;
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

// ──────────────────────────────────────────────────────────
// 3. Shaders for Ionospheric Aurora Curtains
// ──────────────────────────────────────────────────────────

const auroraVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.14;

    // Dynamic wave curves across the upper sky
    float x = uv.x * 3.5;
    float wave = sin(x + t) * 0.16 + sin(x * 2.2 - t * 1.3) * 0.08 + cos(x * 0.8 + t * 0.6) * 0.1;
    
    // Vertical curtain bounds
    float curtain = smoothstep(0.12, 0.5, uv.y + wave * 0.35) * (1.0 - smoothstep(0.55, 0.95, uv.y));
    
    // Vertical starlight fold ribbons
    float folds = pow(0.5 + 0.5 * sin(uv.x * 32.0 + sin(uv.y * 7.0 + t * 2.0) * 2.5), 2.2);
    float glow = curtain * (0.65 + 0.35 * folds) * uOpacity;

    if (glow < 0.005) discard;

    // Aurora palette: emerald base -> sapphire mid -> violet crest
    vec3 emerald = vec3(0.2, 0.95, 0.68);
    vec3 sapphire = vec3(0.22, 0.68, 0.98);
    vec3 violet = vec3(0.78, 0.4, 0.98);

    vec3 color = mix(emerald, sapphire, smoothstep(0.2, 0.55, uv.y));
    color = mix(color, violet, smoothstep(0.55, 0.88, uv.y));

    gl_FragColor = vec4(color * (1.0 + folds * 0.4), glow * 0.72);
    #include <colorspace_fragment>
  }
`;

// ──────────────────────────────────────────────────────────
// Component: WeatherEffects
// ──────────────────────────────────────────────────────────

export function WeatherEffects({ quality }: { quality: SceneQuality }) {
  const viewport = useThree((state) => state.viewport);
  const weather = useWeatherStore((state) => state.weather);

  const rainOpacity = useRef(0);
  const fogOpacity = useRef(0);
  const auroraOpacity = useRef(0);

  // 1. Rain Geometry & Material
  const rainStreakCount = quality === "low" ? 180 : quality === "medium" ? 320 : 450;

  const { rainGeometry, rainMaterial } = useMemo(() => {
    const positions = new Float32Array(rainStreakCount * 2 * 3);
    const initialX = new Float32Array(rainStreakCount * 2);
    const initialY = new Float32Array(rainStreakCount * 2);
    const speedVariation = new Float32Array(rainStreakCount * 2);
    const length = new Float32Array(rainStreakCount * 2);
    const vertexIndex = new Float32Array(rainStreakCount * 2);

    const w = viewport.width * 1.4;
    const h = viewport.height * 1.5;

    for (let i = 0; i < rainStreakCount; i++) {
      const x = (Math.random() - 0.5) * w;
      const y = (Math.random() - 0.5) * h;
      const spd = 0.85 + Math.random() * 0.35;
      const len = 0.08 + Math.random() * 0.12;
      const z = -1.2 + (Math.random() - 0.5) * 1.2;

      // Vertex 0: Head
      const idx0 = i * 2;
      positions[idx0 * 3] = x;
      positions[idx0 * 3 + 1] = y;
      positions[idx0 * 3 + 2] = z;
      initialX[idx0] = x;
      initialY[idx0] = y;
      speedVariation[idx0] = spd;
      length[idx0] = len;
      vertexIndex[idx0] = 0;

      // Vertex 1: Tail
      const idx1 = i * 2 + 1;
      positions[idx1 * 3] = x;
      positions[idx1 * 3 + 1] = y + len;
      positions[idx1 * 3 + 2] = z;
      initialX[idx1] = x;
      initialY[idx1] = y;
      speedVariation[idx1] = spd;
      length[idx1] = len;
      vertexIndex[idx1] = 1;
    }

    const indices = new Uint16Array(rainStreakCount * 2);
    for (let i = 0; i < rainStreakCount * 2; i++) {
      indices[i] = i;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aInitialX", new THREE.BufferAttribute(initialX, 1));
    geo.setAttribute("aInitialY", new THREE.BufferAttribute(initialY, 1));
    geo.setAttribute("aSpeedVariation", new THREE.BufferAttribute(speedVariation, 1));
    geo.setAttribute("aLength", new THREE.BufferAttribute(length, 1));
    geo.setAttribute("aVertexIndex", new THREE.BufferAttribute(vertexIndex, 1));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: rainVertexShader,
      fragmentShader: rainFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uHeight: { value: h },
        uWidth: { value: w },
        uSpeed: { value: 4.8 },
        uSlant: { value: -0.1 },
        uOpacity: { value: 0 },
      },
    });

    return { rainGeometry: geo, rainMaterial: mat };
  }, [rainStreakCount, viewport.height, viewport.width]);

  // 2. Fog Materials
  const fogMaterialDeep = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fogVertexShader,
        fragmentShader: fogFragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color("#4a5568") },
          uDriftSpeed: { value: 0.08 },
        },
      }),
    [],
  );

  const fogMaterialMid = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fogVertexShader,
        fragmentShader: fogFragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color("#2d3748") },
          uDriftSpeed: { value: 0.12 },
        },
      }),
    [],
  );

  // 3. Aurora Material
  const auroraMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: auroraVertexShader,
        fragmentShader: auroraFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },
      }),
    [],
  );

  useEffect(() => {
    return () => {
      rainGeometry.dispose();
      rainMaterial.dispose();
      fogMaterialDeep.dispose();
      fogMaterialMid.dispose();
      auroraMaterial.dispose();
    };
  }, [rainGeometry, rainMaterial, fogMaterialDeep, fogMaterialMid, auroraMaterial]);

  // Dynamic animation and lerp transitions
  useFrame((state, delta) => {
    const targetRain = weather === "rain" ? 1.0 : 0.0;
    const targetFog = weather === "fog" ? 1.0 : 0.0;
    const targetAurora = weather === "aurora" ? 1.0 : 0.0;

    // Smooth dampening for smooth cinematic transitions
    rainOpacity.current = THREE.MathUtils.damp(rainOpacity.current, targetRain, 2.2, delta);
    fogOpacity.current = THREE.MathUtils.damp(fogOpacity.current, targetFog, 2.0, delta);
    auroraOpacity.current = THREE.MathUtils.damp(auroraOpacity.current, targetAurora, 2.0, delta);

    const time = state.clock.elapsedTime;

    // Update Rain
    if (rainOpacity.current > 0.005) {
      rainMaterial.uniforms.uTime.value = time;
      rainMaterial.uniforms.uOpacity.value = rainOpacity.current;
    }

    // Update Fog
    if (fogOpacity.current > 0.005) {
      fogMaterialDeep.uniforms.uTime.value = time;
      fogMaterialDeep.uniforms.uOpacity.value = fogOpacity.current * 0.9;
      fogMaterialMid.uniforms.uTime.value = time;
      fogMaterialMid.uniforms.uOpacity.value = fogOpacity.current * 0.75;
    }

    // Update Aurora
    if (auroraOpacity.current > 0.005) {
      auroraMaterial.uniforms.uTime.value = time;
      auroraMaterial.uniforms.uOpacity.value = auroraOpacity.current;
    }
  });

  return (
    <>
      {/* Aurora Curtain in the upper ionosphere */}
      <mesh
        position={[0, viewport.height * 0.18, -8.3]}
        renderOrder={0.6}
        scale={[viewport.width * 1.25, viewport.height * 0.75, 1]}
        material={auroraMaterial}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Deep Mountain Valley Fog Layer */}
      <mesh
        position={[0, -viewport.height * 0.05, -5.5]}
        renderOrder={1.5}
        scale={[viewport.width * 1.35, viewport.height * 0.6, 1]}
        material={fogMaterialDeep}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Mid Hills Mist Layer */}
      <mesh
        position={[0, -viewport.height * 0.18, -2.8]}
        renderOrder={2.5}
        scale={[viewport.width * 1.3, viewport.height * 0.5, 1]}
        material={fogMaterialMid}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Rain Streaks in Foreground and Midground */}
      <lineSegments
        geometry={rainGeometry}
        material={rainMaterial}
        renderOrder={4.0}
      />
    </>
  );
}
