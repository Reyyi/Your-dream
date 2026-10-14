"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWeatherStore } from "@/lib/weatherStore";
import type { SceneQuality } from "@/components/scene/GrassField";

// ──────────────────────────────────────────────────────────
// 1. Shaders for Rain Streaks
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
  attribute float aVertexIndex;
  varying float vVertexIndex;
  varying float vAlpha;

  void main() {
    vVertexIndex = aVertexIndex;
    
    float speed = uSpeed * aSpeedVariation;
    float currentY = mod(aInitialY - uTime * speed, uHeight) - (uHeight * 0.5);
    float currentX = aInitialX + currentY * uSlant;
    
    vec3 pos = vec3(currentX, currentY, position.z);
    if (aVertexIndex > 0.5) {
      pos.y += aLength;
      pos.x -= aLength * uSlant;
    }

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    
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
// 2. Shaders for Volumetric Smoky Mountain Fog
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
  uniform vec3 uBaseColor;
  uniform vec3 uHighlightColor;
  uniform float uDriftSpeed;
  uniform float uScale;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // 4-octave Fractional Brownian Motion for rolling smoke clouds
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
    for (int i = 0; i < 4; ++i) {
      v += a * valueNoise(p);
      p = rot * p * 2.1 + vec2(2.3, 1.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * uDriftSpeed;

    // Domain coordinate with horizontal drift and scale
    vec2 coord = uv * vec2(uScale * 2.4, uScale) + vec2(t, 0.0);

    // Domain warping for turbulent fluid smoke eddies
    float q1 = fbm(coord);
    float q2 = fbm(coord + vec2(3.2, 1.5) - t * 0.25);
    vec2 warpedCoord = coord + vec2(q1, q2) * 1.5;

    float smoke = fbm(warpedCoord);

    // Altitude profile: dense in the lower region, curling upward
    float verticalMask = smoothstep(0.02, 0.32, uv.y) * smoothstep(0.98, 0.44, uv.y);
    
    // Horizontal fade at canvas borders
    float horizontalMask = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);

    // Combined volumetric density
    float density = smoothstep(0.25, 0.82, smoke) * verticalMask * horizontalMask;
    float alpha = density * uOpacity * 0.58;

    if (alpha < 0.005) discard;

    // Volumetric shadow inside deep pockets, highlight on edges
    vec3 col = mix(uBaseColor, uHighlightColor, smoothstep(0.3, 0.75, smoke));

    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

// ──────────────────────────────────────────────────────────
// 3. Shaders for Realistic Aurora Borealis
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
  uniform float uCurtainOffset;
  uniform float uSpeed;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * uSpeed + uCurtainOffset;

    // 1. Fluid undulating geomagnetic curtain wave
    float wave1 = sin(uv.x * 2.6 + t * 0.85) * 0.22;
    float wave2 = sin(uv.x * 5.4 - t * 1.25 + uv.y * 1.8) * 0.1;
    float wave3 = cos(uv.x * 1.4 + t * 0.45) * 0.15;
    float curtainCenter = 0.32 + wave1 + wave2 + wave3;

    // Vertical curtain span (sharp lower border and tall diffuse upper glow)
    float distFromBase = uv.y - curtainCenter;
    
    // Sharp lower border (classic 100km atomic oxygen cutoff)
    float lowerBorder = smoothstep(-0.06, 0.08, distFromBase);
    // Tall diffuse upper fringe fading into space
    float upperFringe = 1.0 - smoothstep(0.08, 0.6, distFromBase);
    float curtainShape = lowerBorder * upperFringe;

    if (curtainShape <= 0.002) discard;

    // 2. S-Curve Fold Accumulation (Perspective Drapery)
    float foldFactor = 1.0 + 2.4 * pow(abs(cos(uv.x * 3.2 + t * 0.55)), 4.0);

    // 3. Vertical Magnetic Dipole Rays (Filament Striations)
    float ray1 = sin(uv.x * 64.0 + sin(uv.y * 8.0 + t * 2.8) * 3.2);
    float ray2 = cos(uv.x * 108.0 - t * 3.6 + uv.y * 16.0);
    float rayStructure = pow(0.5 + 0.5 * (ray1 * 0.65 + ray2 * 0.35), 2.6);

    // 4. Subtle Solar Wind Pulsation (~3Hz micro-shimmer)
    float microPulse = 0.88 + 0.12 * sin(t * 4.6 + uv.x * 24.0);

    // Total luminosity
    float luminosity = curtainShape * foldFactor * (0.55 + 0.45 * rayStructure) * microPulse * uOpacity;
    if (luminosity < 0.005) discard;

    // 5. Authentic Natural Aurora Spectrum (Stratified by Altitude)
    float h = clamp((distFromBase + 0.05) / 0.55, 0.0, 1.0);

    // Realistic atomic emission spectrum:
    vec3 pinkFringe   = vec3(1.0, 0.32, 0.68);  // Nitrogen molecular pink at lowest edge
    vec3 emeraldCore  = vec3(0.06, 1.0, 0.48);  // 557.7 nm Oxygen green (brightest core)
    vec3 turquoiseMid = vec3(0.12, 0.88, 0.98); // Turquoise ionization transition
    vec3 violetHigh   = vec3(0.78, 0.3, 0.98);  // High altitude violet
    vec3 crimsonPeak  = vec3(0.96, 0.18, 0.42); // 630 nm high oxygen red tips

    vec3 color;
    if (h < 0.12) {
      color = mix(pinkFringe, emeraldCore, h / 0.12);
    } else if (h < 0.45) {
      color = mix(emeraldCore, turquoiseMid, (h - 0.12) / 0.33);
    } else if (h < 0.78) {
      color = mix(turquoiseMid, violetHigh, (h - 0.45) / 0.33);
    } else {
      color = mix(violetHigh, crimsonPeak, (h - 0.78) / 0.22);
    }

    // HDR color boost on bright folds for postprocessing bloom
    vec3 finalColor = color * (1.1 + foldFactor * 0.4);

    gl_FragColor = vec4(finalColor, luminosity * 0.85);
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

  // 2. Volumetric Smoky Mountain Fog Materials (3 distinct parallax depths)
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
          uBaseColor: { value: new THREE.Color("#2c3545") },
          uHighlightColor: { value: new THREE.Color("#8897ac") },
          uDriftSpeed: { value: 0.04 },
          uScale: { value: 1.8 },
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
          uBaseColor: { value: new THREE.Color("#1e2634") },
          uHighlightColor: { value: new THREE.Color("#a2b0c3") },
          uDriftSpeed: { value: 0.07 },
          uScale: { value: 2.2 },
        },
      }),
    [],
  );

  const fogMaterialMeadow = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fogVertexShader,
        fragmentShader: fogFragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uBaseColor: { value: new THREE.Color("#18212d") },
          uHighlightColor: { value: new THREE.Color("#b9c8db") },
          uDriftSpeed: { value: 0.09 },
          uScale: { value: 2.6 },
        },
      }),
    [],
  );

  // 3. Realistic Aurora Materials (Primary and Secondary Curtains)
  const auroraMaterialPrimary = useMemo(
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
          uCurtainOffset: { value: 0.0 },
          uSpeed: { value: 0.16 },
        },
      }),
    [],
  );

  const auroraMaterialSecondary = useMemo(
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
          uCurtainOffset: { value: 3.2 },
          uSpeed: { value: 0.11 },
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
      fogMaterialMeadow.dispose();
      auroraMaterialPrimary.dispose();
      auroraMaterialSecondary.dispose();
    };
  }, [
    rainGeometry,
    rainMaterial,
    fogMaterialDeep,
    fogMaterialMid,
    fogMaterialMeadow,
    auroraMaterialPrimary,
    auroraMaterialSecondary,
  ]);

  // Dynamic animation and lerp transitions
  useFrame((state, delta) => {
    const targetRain = weather === "rain" ? 1.0 : 0.0;
    const targetFog = weather === "fog" ? 1.0 : 0.0;
    const targetAurora = weather === "aurora" ? 1.0 : 0.0;

    // Smooth dampening for cinematic transitions
    rainOpacity.current = THREE.MathUtils.damp(rainOpacity.current, targetRain, 2.2, delta);
    fogOpacity.current = THREE.MathUtils.damp(fogOpacity.current, targetFog, 1.8, delta);
    auroraOpacity.current = THREE.MathUtils.damp(auroraOpacity.current, targetAurora, 1.8, delta);

    const time = state.clock.elapsedTime;

    // Update Rain
    if (rainOpacity.current > 0.005) {
      rainMaterial.uniforms.uTime.value = time;
      rainMaterial.uniforms.uOpacity.value = rainOpacity.current;
    }

    // Update Volumetric Smoky Fog
    if (fogOpacity.current > 0.005) {
      fogMaterialDeep.uniforms.uTime.value = time;
      fogMaterialDeep.uniforms.uOpacity.value = fogOpacity.current * 0.95;

      fogMaterialMid.uniforms.uTime.value = time;
      fogMaterialMid.uniforms.uOpacity.value = fogOpacity.current * 0.85;

      fogMaterialMeadow.uniforms.uTime.value = time;
      fogMaterialMeadow.uniforms.uOpacity.value = fogOpacity.current * 0.7;
    }

    // Update Multi-Layer Aurora Curtains
    if (auroraOpacity.current > 0.005) {
      auroraMaterialPrimary.uniforms.uTime.value = time;
      auroraMaterialPrimary.uniforms.uOpacity.value = auroraOpacity.current;

      auroraMaterialSecondary.uniforms.uTime.value = time;
      auroraMaterialSecondary.uniforms.uOpacity.value = auroraOpacity.current * 0.75;
    }
  });

  return (
    <>
      {/* Aurora Layer 2 (Secondary Ethereal Curtain behind) */}
      <mesh
        position={[0, viewport.height * 0.22, -8.45]}
        renderOrder={0.58}
        scale={[viewport.width * 1.35, viewport.height * 0.82, 1]}
        material={auroraMaterialSecondary}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Aurora Layer 1 (Primary Dancing Magnetic Curtain) */}
      <mesh
        position={[0, viewport.height * 0.16, -8.2]}
        renderOrder={0.62}
        scale={[viewport.width * 1.3, viewport.height * 0.78, 1]}
        material={auroraMaterialPrimary}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Deep Mountain Valley Smoke Layer */}
      <mesh
        position={[0, -viewport.height * 0.04, -5.8]}
        renderOrder={1.5}
        scale={[viewport.width * 1.45, viewport.height * 0.65, 1]}
        material={fogMaterialDeep}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Mid Hills Rolling Fog Bank Layer */}
      <mesh
        position={[0, -viewport.height * 0.16, -2.8]}
        renderOrder={2.5}
        scale={[viewport.width * 1.38, viewport.height * 0.55, 1]}
        material={fogMaterialMid}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>

      {/* Meadow Low Ground Creeping Mist Layer */}
      <mesh
        position={[0, -viewport.height * 0.24, -0.5]}
        renderOrder={3.2}
        scale={[viewport.width * 1.32, viewport.height * 0.42, 1]}
        material={fogMaterialMeadow}
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
