"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTimeStore } from "@/lib/store";
import { getSkyState } from "@/lib/timeOfDay";
import { soundscape } from "@/lib/soundscape";

// --- GLSL Shaders for Modern Cinematic Shooting Star ---

// 1. Tapered Volumetric Plasma Ribbon Shader
const trailVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const trailFragmentShader = /* glsl */ `
  uniform vec3 uHeadColor;
  uniform vec3 uMidColor;
  uniform vec3 uTailColor;
  uniform float uOpacity;
  uniform float uFlash;
  varying vec2 vUv;

  void main() {
    // Lateral distance from center spine (0 at center, 1 at edge)
    float lateral = abs(vUv.y - 0.5) * 2.0;
    if (lateral > 1.0) discard;

    // Volumetric cylindrical glow falloff
    float lateralGlow = exp(-lateral * lateral * 4.2);
    float lateralCore = exp(-lateral * 18.0);

    // Longitudinal falloff (0 at tail tip, 1 at head)
    float longitudinal = smoothstep(0.0, 0.42, vUv.x);

    // Color gradient along ionized plasma trail
    vec3 trailColor = mix(uTailColor, uMidColor, smoothstep(0.0, 0.65, vUv.x));
    trailColor = mix(trailColor, uHeadColor, smoothstep(0.65, 1.0, vUv.x));

    // High dynamic range glow for postprocessing bloom
    vec3 finalColor = trailColor * (lateralGlow * 1.5 + lateralCore * 2.8);
    finalColor *= (1.0 + uFlash * 1.7);

    float alpha = (lateralGlow * 0.72 + lateralCore * 0.28) * longitudinal * uOpacity;
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(finalColor, alpha);
    #include <colorspace_fragment>
  }
`;

// 2. Head Incandescent Flare & Diffraction Spikes Shader
const headVertexShader = /* glsl */ `
  uniform float uSize;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = uSize;
  }
`;

const headFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uFlash;

  void main() {
    vec2 p = (gl_PointCoord - vec2(0.5)) * 2.0;
    float dist = length(p);
    if (dist > 1.0) discard;

    // Blinding incandescent white core
    float core = exp(-dist * 16.0);
    // Soft outer celestial halo
    float halo = exp(-dist * 3.4) * 0.55;

    // Diamond cross diffraction spikes (anamorphic flare)
    float spikeX = exp(-abs(p.x) * 26.0) * exp(-abs(p.y) * 2.2);
    float spikeY = exp(-abs(p.y) * 26.0) * exp(-abs(p.x) * 2.2);
    float spikes = (spikeX + spikeY) * 0.48;

    vec3 col = (vec3(1.0, 1.0, 1.0) * core * 3.8 + uColor * (halo + spikes * 1.6));
    col *= (1.0 + uFlash * 2.2);

    float alpha = (core * 2.2 + halo + spikes) * uOpacity;
    if (alpha < 0.005) discard;

    gl_FragColor = vec4(col, min(1.0, alpha));
    #include <colorspace_fragment>
  }
`;

// 3. Stardust Sparks Particle Shader
const sparkVertexShader = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = aSize;
  }
`;

const sparkFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 p = (gl_PointCoord - vec2(0.5)) * 2.0;
    float dist = length(p);
    if (dist > 1.0 || vAlpha < 0.01) discard;

    float spark = exp(-dist * 5.5);
    gl_FragColor = vec4(uColor * 2.2, spark * vAlpha);
    #include <colorspace_fragment>
  }
`;

// Natural Celestial Meteor Color Palettes
const METEOR_PALETTES = [
  {
    // Diamond Ice & Ionized Cerulean (Magnesium / Nickel high-velocity bolide)
    head: new THREE.Color(1.6, 2.0, 2.5),
    mid: new THREE.Color(0.42, 0.84, 1.0),
    tail: new THREE.Color(0.2, 0.35, 0.88),
    spark: new THREE.Color(0.75, 0.95, 1.0),
  },
  {
    // Golden Amber & Solar Flame (Perseids / Geminids style)
    head: new THREE.Color(2.5, 2.2, 1.5),
    mid: new THREE.Color(1.0, 0.82, 0.45),
    tail: new THREE.Color(0.92, 0.42, 0.16),
    spark: new THREE.Color(1.0, 0.9, 0.62),
  },
  {
    // Emerald Aurora Fireball (Mesospheric oxygen ionization)
    head: new THREE.Color(1.7, 2.5, 2.0),
    mid: new THREE.Color(0.32, 0.96, 0.72),
    tail: new THREE.Color(0.18, 0.48, 0.92),
    spark: new THREE.Color(0.65, 1.0, 0.82),
  },
];

const TRAIL_SEGMENTS = 28;
const MAX_SPARKS = 32;

export function ShootingStar() {
  const viewport = useThree((state) => state.viewport);
  const [active, setActive] = useState(false);

  // Trajectory state
  const stateRef = useRef({
    active: false,
    progress: 0,
    speed: 1.15,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    curveOffset: 0,
    tailLengthProgress: 0.32,
    baseWidth: 0.07,
    flashStrength: 0.9,
    paletteIndex: 0,
    lastFired: performance.now() + 6000,
    nextInterval: 14000 + Math.random() * 16000,
  });

  // Sparks simulation data pool
  const sparksRef = useRef(
    Array.from({ length: MAX_SPARKS }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0.45,
      size: 4,
    })),
  );

  // 1. Trail Ribbon Geometry & Material
  const { trailGeometry, trailMaterial } = useMemo(() => {
    const vertexCount = (TRAIL_SEGMENTS + 1) * 2;
    const indexCount = TRAIL_SEGMENTS * 6;

    const positions = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = new Uint16Array(indexCount);

    for (let i = 0; i < TRAIL_SEGMENTS; i++) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const v2 = (i + 1) * 2;
      const v3 = (i + 1) * 2 + 1;
      indices[i * 6 + 0] = v0;
      indices[i * 6 + 1] = v1;
      indices[i * 6 + 2] = v2;
      indices[i * 6 + 3] = v1;
      indices[i * 6 + 4] = v3;
      indices[i * 6 + 5] = v2;
    }

    for (let i = 0; i <= TRAIL_SEGMENTS; i++) {
      const s = i / TRAIL_SEGMENTS;
      uvs[i * 4 + 0] = s;
      uvs[i * 4 + 1] = 0.0;
      uvs[i * 4 + 2] = s;
      uvs[i * 4 + 3] = 1.0;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      uniforms: {
        uHeadColor: { value: new THREE.Color(1.6, 2.0, 2.5) },
        uMidColor: { value: new THREE.Color(0.42, 0.84, 1.0) },
        uTailColor: { value: new THREE.Color(0.2, 0.35, 0.88) },
        uOpacity: { value: 0 },
        uFlash: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });

    return { trailGeometry: geo, trailMaterial: mat };
  }, []);

  // 2. Head Flare Geometry & Material
  const { headGeometry, headMaterial } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, -7.95]), 3),
    );

    const mat = new THREE.ShaderMaterial({
      vertexShader: headVertexShader,
      fragmentShader: headFragmentShader,
      uniforms: {
        uSize: { value: 28 },
        uColor: { value: new THREE.Color(0.6, 0.85, 1.0) },
        uOpacity: { value: 0 },
        uFlash: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    return { headGeometry: geo, headMaterial: mat };
  }, []);

  // 3. Stardust Sparks Geometry & Material
  const { sparkGeometry, sparkMaterial } = useMemo(() => {
    const positions = new Float32Array(MAX_SPARKS * 3);
    const alphas = new Float32Array(MAX_SPARKS);
    const sizes = new Float32Array(MAX_SPARKS);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: sparkVertexShader,
      fragmentShader: sparkFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0.75, 0.95, 1.0) },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    return { sparkGeometry: geo, sparkMaterial: mat };
  }, []);

  // Cleanup geometries & materials
  useEffect(() => {
    return () => {
      trailGeometry.dispose();
      trailMaterial.dispose();
      headGeometry.dispose();
      headMaterial.dispose();
      sparkGeometry.dispose();
      sparkMaterial.dispose();
    };
  }, [
    trailGeometry,
    trailMaterial,
    headGeometry,
    headMaterial,
    sparkGeometry,
    sparkMaterial,
  ]);

  // Trigger a meteor streak with natural physics and varied trajectories
  const launchShootingStar = useCallback(() => {
    const st = stateRef.current;
    const w = viewport.width;
    const h = viewport.height;

    // Pick trajectory type:
    // 0: classic diagonal high-sweep from upper-right to mid-left
    // 1: sweeping from upper-left to mid-right
    // 2: long shallow celestial grazer
    const trajType = Math.floor(Math.random() * 3);

    if (trajType === 0) {
      st.startX = (0.15 + Math.random() * 0.35) * w;
      st.startY = (0.28 + Math.random() * 0.22) * h;
      st.endX = st.startX - (0.55 + Math.random() * 0.3) * w;
      st.endY = st.startY - (0.35 + Math.random() * 0.25) * h;
    } else if (trajType === 1) {
      st.startX = (-0.45 + Math.random() * 0.25) * w;
      st.startY = (0.32 + Math.random() * 0.2) * h;
      st.endX = st.startX + (0.6 + Math.random() * 0.3) * w;
      st.endY = st.startY - (0.32 + Math.random() * 0.22) * h;
    } else {
      // Shallow celestial grazer
      st.startX = (0.35 + Math.random() * 0.15) * w;
      st.startY = (0.36 + Math.random() * 0.12) * h;
      st.endX = st.startX - (0.75 + Math.random() * 0.2) * w;
      st.endY = st.startY - (0.18 + Math.random() * 0.14) * h;
    }

    st.curveOffset = (Math.random() - 0.5) * 0.08 * h;
    st.speed = 1.05 + Math.random() * 0.35; // ~0.8 to 1.0s flight
    st.tailLengthProgress = 0.28 + Math.random() * 0.12;
    st.baseWidth = Math.max(0.045, h * 0.026);
    st.flashStrength = 0.7 + Math.random() * 0.6;
    st.paletteIndex = Math.floor(Math.random() * METEOR_PALETTES.length);

    // Apply color palette
    const pal = METEOR_PALETTES[st.paletteIndex];
    trailMaterial.uniforms.uHeadColor.value.copy(pal.head);
    trailMaterial.uniforms.uMidColor.value.copy(pal.mid);
    trailMaterial.uniforms.uTailColor.value.copy(pal.tail);
    headMaterial.uniforms.uColor.value.copy(pal.mid);
    sparkMaterial.uniforms.uColor.value.copy(pal.spark);

    // Reset sparks
    sparksRef.current.forEach((sp) => {
      sp.active = false;
    });

    st.active = true;
    st.progress = 0;
    st.lastFired = performance.now();
    setActive(true);

    // Play subtle celestial chime
    soundscape.playMeteorChime();
  }, [
    viewport.width,
    viewport.height,
    trailMaterial,
    headMaterial,
    sparkMaterial,
  ]);

  // Listen for user click on "bintang jatuh ☄"
  useEffect(() => {
    const handleManualShoot = () => {
      launchShootingStar();
    };

    window.addEventListener("yourdream:shoot_star", handleManualShoot);
    return () => {
      window.removeEventListener("yourdream:shoot_star", handleManualShoot);
    };
  }, [launchShootingStar]);

  useFrame((_, delta) => {
    const now = performance.now();
    const st = stateRef.current;
    const store = useTimeStore.getState();
    const clock = new Date();
    const wallClock =
      clock.getHours() + clock.getMinutes() / 60 + clock.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, now);
    const sky = getSkyState(hour);

    // Automatic spawn in night/twilight when stars are visible
    const isNight = sky.stars > 0.25;
    if (!st.active && isNight && now - st.lastFired > st.nextInterval) {
      launchShootingStar();
      st.nextInterval = 16000 + Math.random() * 20000;
    }

    if (!st.active) {
      if (active) setActive(false);
      return;
    }

    // Advance flight progress
    st.progress += delta * st.speed;

    if (st.progress >= 1.0) {
      st.active = false;
      setActive(false);
      return;
    }

    const p = st.progress;

    // Trajectory vector
    const dx = st.endX - st.startX;
    const dy = st.endY - st.startY;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;
    const perpX = -dirY;
    const perpY = dirX;

    // Helper to evaluate trajectory at parameter t
    const getPosAt = (t: number) => {
      const clampedT = Math.max(0, Math.min(1, t));
      const curve = Math.sin(clampedT * Math.PI) * st.curveOffset;
      return {
        x: st.startX + dx * clampedT + perpX * curve,
        y: st.startY + dy * clampedT + perpY * curve,
      };
    };

    // Head position
    const headTau = Math.min(1.0, p * 1.08);
    const headPos = getPosAt(headTau);

    // Tail progress
    const currentTailLength =
      st.tailLengthProgress * (p < 0.22 ? p / 0.22 : p > 0.78 ? (1.0 - p) / 0.22 : 1.0);
    const tailTau = Math.max(0.0, headTau - currentTailLength);

    // Natural atmospheric flash / ablation spike at mid-flight
    const flashDist = Math.abs(p - 0.52);
    const flash = Math.exp(-Math.pow(flashDist / 0.09, 2)) * st.flashStrength;

    // Overall alpha envelope (graceful entry and burn-out)
    const entryFade = Math.min(1.0, p / 0.12);
    const exitFade = Math.min(1.0, (1.0 - p) / 0.18);
    const opacity = entryFade * exitFade;

    // 1. Update Ribbon Trail Geometry
    const positions = trailGeometry.attributes.position.array as Float32Array;

    for (let i = 0; i <= TRAIL_SEGMENTS; i++) {
      const s = i / TRAIL_SEGMENTS; // 0 = tail, 1 = head
      const segTau = tailTau + (headTau - tailTau) * s;
      const pt = getPosAt(segTau);

      // Width profile: needle-thin at tail, expanding with power curve towards head
      const widthFactor = Math.pow(s, 1.8);
      const halfWidth = st.baseWidth * widthFactor * (1.0 + flash * 0.45);

      // Left vertex
      positions[i * 6 + 0] = pt.x + perpX * halfWidth;
      positions[i * 6 + 1] = pt.y + perpY * halfWidth;
      positions[i * 6 + 2] = -8.0;

      // Right vertex
      positions[i * 6 + 3] = pt.x - perpX * halfWidth;
      positions[i * 6 + 4] = pt.y - perpY * halfWidth;
      positions[i * 6 + 5] = -8.0;
    }
    trailGeometry.attributes.position.needsUpdate = true;

    trailMaterial.uniforms.uOpacity.value = opacity;
    trailMaterial.uniforms.uFlash.value = flash;

    // 2. Update Head Flare
    const headPositions = headGeometry.attributes.position.array as Float32Array;
    headPositions[0] = headPos.x;
    headPositions[1] = headPos.y;
    headPositions[2] = -7.95;
    headGeometry.attributes.position.needsUpdate = true;

    headMaterial.uniforms.uOpacity.value = opacity;
    headMaterial.uniforms.uFlash.value = flash;
    headMaterial.uniforms.uSize.value = (28 + flash * 24) * (viewport.height / 2.7);

    // 3. Update Stardust Sparks
    const sparks = sparksRef.current;
    const sparkPositions = sparkGeometry.attributes.position.array as Float32Array;
    const sparkAlphas = sparkGeometry.attributes.aAlpha.array as Float32Array;
    const sparkSizes = sparkGeometry.attributes.aSize.array as Float32Array;

    // Emit new sparks during active burn
    if (p < 0.85 && Math.random() < 0.85) {
      const inactiveSpark = sparks.find((sp) => !sp.active);
      if (inactiveSpark) {
        inactiveSpark.active = true;
        inactiveSpark.x = headPos.x - dirX * (Math.random() * 0.05);
        inactiveSpark.y = headPos.y - dirY * (Math.random() * 0.05);
        // Drift backward with slight lateral ejection
        const driftSpeed = 0.25 + Math.random() * 0.35;
        const lateralJitter = (Math.random() - 0.5) * 0.16;
        inactiveSpark.vx = -dirX * driftSpeed + perpX * lateralJitter;
        inactiveSpark.vy = -dirY * driftSpeed + perpY * lateralJitter;
        inactiveSpark.maxLife = 0.35 + Math.random() * 0.25;
        inactiveSpark.life = inactiveSpark.maxLife;
        inactiveSpark.size = 3.5 + Math.random() * 4.5;
      }
    }

    // Step physics on active sparks
    for (let i = 0; i < MAX_SPARKS; i++) {
      const sp = sparks[i];
      if (sp.active) {
        sp.life -= delta;
        if (sp.life <= 0) {
          sp.active = false;
          sparkAlphas[i] = 0;
        } else {
          sp.x += sp.vx * delta;
          sp.y += sp.vy * delta;
          sp.vx *= 0.94; // Air drag deceleration
          sp.vy *= 0.94;

          const lifeRatio = sp.life / sp.maxLife;
          sparkPositions[i * 3 + 0] = sp.x;
          sparkPositions[i * 3 + 1] = sp.y;
          sparkPositions[i * 3 + 2] = -7.98;

          sparkAlphas[i] = Math.pow(lifeRatio, 1.4) * opacity * (0.8 + Math.random() * 0.2);
          sparkSizes[i] = sp.size * (0.4 + lifeRatio * 0.6);
        }
      } else {
        sparkAlphas[i] = 0;
      }
    }

    sparkGeometry.attributes.position.needsUpdate = true;
    sparkGeometry.attributes.aAlpha.needsUpdate = true;
    sparkGeometry.attributes.aSize.needsUpdate = true;
  });

  return (
    <group renderOrder={0.78} visible={active}>
      {/* 1. Volumetric Tapered Plasma Ribbon */}
      <mesh geometry={trailGeometry} material={trailMaterial} />

      {/* 2. Intense Incandescent Head Flare & Diamond Spikes */}
      <points geometry={headGeometry} material={headMaterial} />

      {/* 3. Trailing Stardust Spark Particles */}
      <points geometry={sparkGeometry} material={sparkMaterial} />
    </group>
  );
}
