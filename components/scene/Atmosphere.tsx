"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SkyState } from "@/lib/timeOfDay";
import { getSkyState } from "@/lib/timeOfDay";
import { useTimeStore } from "@/lib/store";
import type { SceneQuality } from "@/components/scene/GrassField";

const starVertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  attribute float aWarmth;
  varying float vWarmth;
  varying float vTwinkle;
  varying float vSize;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    vWarmth = aWarmth;
    vSize = aSize;
    // Modern organic scintillation with shimmering micro-frequencies
    float wave1 = sin(uTime * 1.6 + aPhase);
    float wave2 = sin(uTime * 3.4 + aPhase * 3.7);
    vTwinkle = 0.76 + 0.24 * (wave1 * 0.7 + wave2 * 0.3);
    gl_PointSize = aSize * (0.88 + 0.22 * wave1);
  }
`;

const starFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying float vWarmth;
  varying float vTwinkle;
  varying float vSize;

  void main() {
    if (uOpacity <= 0.002) discard;

    vec2 point = (gl_PointCoord - 0.5) * 2.0;
    float dist = length(point);

    // 1. Modern crisp diamond core
    float core = exp(-dist * 5.0);
    // 2. Soft celestial halo
    float halo = exp(-dist * 2.2) * 0.4;

    // 3. Subtle modern 4-point cross diffraction flare on prominent bright stars
    float crossSpike = 0.0;
    if (vSize > 4.5) {
      float axisX = exp(-abs(point.x) * 16.0) * exp(-abs(point.y) * 2.2);
      float axisY = exp(-abs(point.y) * 16.0) * exp(-abs(point.x) * 2.2);
      crossSpike = max(axisX, axisY) * 0.55;
    }

    float brightness = (core * 1.65 + halo + crossSpike) * vTwinkle * uOpacity;
    if (brightness < 0.01) discard;

    // 4. Modern celestial stellar palette:
    // Pure Sirius white, diamond blue-white, crystalline cyan, and warm topaz gold
    vec3 siriusWhite = vec3(1.0, 1.0, 1.0);
    vec3 diamondBlue = vec3(0.72, 0.88, 1.0);
    vec3 cosmicGold  = vec3(1.0, 0.92, 0.76);
    vec3 violetPearl = vec3(0.92, 0.84, 1.0);

    vec3 starColor = mix(diamondBlue, cosmicGold, vWarmth);
    if (vWarmth > 0.8) {
      starColor = mix(cosmicGold, violetPearl, (vWarmth - 0.8) / 0.2);
    }

    // Blend in Sirius pure white core for crisp modern brilliance
    vec3 finalColor = mix(starColor, siriusWhite, core * 0.75) * (1.1 + core * 1.8);

    gl_FragColor = vec4(finalColor, min(1.0, brightness * 1.3));
    #include <colorspace_fragment>
  }
`;

const cloudFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float cloud = texture2D(uMap, vUv).a;
    float alpha = cloud * uOpacity;
    if (alpha < 0.008) discard;
    gl_FragColor = vec4(uTint, alpha);
    #include <colorspace_fragment>
  }
`;

const nebulaFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec4 nebula = texture2D(uMap, vUv);
    gl_FragColor = vec4(nebula.rgb, nebula.a * uOpacity);
    #include <colorspace_fragment>
  }
`;

function seeded(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function createStarGeometry(
  count: number,
  width: number,
  height: number,
) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const warmth = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (seeded(index + 1) - 0.5) * width * 1.1;
    positions[index * 3 + 1] =
      (seeded(index + 500) * 0.6 - 0.08) * height;
    positions[index * 3 + 2] = 0;

    // Multi-tier celestial hierarchy for clear and modern star field:
    const tier = seeded(index + 900);
    let size = 2.4 + tier * 2.2; // base crisp stars: 2.4 - 4.6px
    if (tier > 0.92) {
      // Major bright planetary & stellar beacons:
      size = 6.2 + seeded(index + 1100) * 3.8; // 6.2 - 10px
    } else if (tier > 0.74) {
      // Prominent constellation stars:
      size = 4.2 + seeded(index + 1100) * 2.0; // 4.2 - 6.2px
    }

    sizes[index] = size;
    phases[index] = seeded(index + 1200) * Math.PI * 2;
    warmth[index] = seeded(index + 1500);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aWarmth", new THREE.BufferAttribute(warmth, 1));
  return geometry;
}

function createCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = 640;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Tidak dapat membuat tekstur awan.");

  for (let cluster = 0; cluster < 12; cluster += 1) {
    const centerX = cluster * 142 - 80;
    const centerY = 275 + (seeded(cluster + 1600) - 0.5) * 110;
    const puffCount = 5 + Math.floor(seeded(cluster + 1700) * 5);

    for (let puff = 0; puff < puffCount; puff += 1) {
      const radiusX = 54 + seeded(cluster * 13 + puff + 1800) * 88;
      const radiusY = 36 + seeded(cluster * 17 + puff + 1900) * 48;
      const x = centerX + (puff - puffCount / 2) * 38;
      const y = centerY + (seeded(cluster * 19 + puff + 2000) - 0.5) * 46;

      context.save();
      context.translate(x, y);
      context.scale(1, radiusY / radiusX);
      const cloud = context.createRadialGradient(0, 0, radiusX * 0.08, 0, 0, radiusX);
      cloud.addColorStop(0, "rgba(255, 255, 255, 0.66)");
      cloud.addColorStop(0.52, "rgba(255, 255, 255, 0.36)");
      cloud.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = cloud;
      context.beginPath();
      context.arc(0, 0, radiusX, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    const underside = context.createRadialGradient(
      centerX,
      centerY + 35,
      4,
      centerX,
      centerY + 35,
      150,
    );
    underside.addColorStop(0, "rgba(255, 255, 255, 0.24)");
    underside.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = underside;
    context.fillRect(centerX - 155, centerY - 5, 310, 100);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

function createNebulaTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Tidak dapat membuat tekstur nebula.");

  for (let cloud = 0; cloud < 18; cloud += 1) {
    const x = cloud * 67 - 220;
    const y = 246 + Math.sin(cloud * 1.4) * 82;
    const radius = 85 + seeded(cloud + 2200) * 125;
    const haze = context.createRadialGradient(x, y, 4, x, y, radius);
    haze.addColorStop(0, "rgba(158, 130, 255, 0.18)");
    haze.addColorStop(0.58, "rgba(101, 134, 239, 0.1)");
    haze.addColorStop(1, "rgba(95, 120, 230, 0)");
    context.fillStyle = haze;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function OrbGlow({
  color,
  intensity,
  size,
  renderOrder,
}: {
  color: string;
  intensity: React.MutableRefObject<number>;
  size: number;
  renderOrder: number;
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
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            float distanceToCenter = length((vUv - 0.5) * 2.0);
            float halo = exp(-distanceToCenter * 3.2);
            float core = exp(-distanceToCenter * 9.0);
            float alpha = max(halo * 0.28, core * 0.56) * uIntensity;
            gl_FragColor = vec4(uColor * (halo * 0.8 + core * 1.6), alpha);
            #include <colorspace_fragment>
          }
        `,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity.current },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [color, intensity],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame(() => {
    material.uniforms.uIntensity.value = intensity.current;
  });

  return (
    <mesh
      position={[0, 0, -0.01]}
      renderOrder={renderOrder}
      scale={[size, size, 1]}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

function CelestialBody({
  color,
  diskSize,
  renderOrder,
  intensity,
  position,
}: {
  color: string;
  diskSize: number;
  renderOrder: number;
  intensity: React.MutableRefObject<number>;
  position: React.MutableRefObject<readonly [number, number, number]>;
}) {
  const group = useRef<THREE.Group>(null);
  const diskMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [color],
  );

  useEffect(() => () => diskMaterial.dispose(), [diskMaterial]);

  useFrame(() => {
    if (group.current) group.current.position.set(...position.current);
    diskMaterial.opacity = intensity.current;
  });

  return (
    <group ref={group}>
      <OrbGlow
        color={color}
        intensity={intensity}
        size={diskSize * 3.6}
        renderOrder={renderOrder}
      />
      <mesh renderOrder={renderOrder + 0.01} scale={[diskSize, diskSize, 1]}>
        <circleGeometry args={[0.5, 48]} />
        <primitive attach="material" object={diskMaterial} />
      </mesh>
    </group>
  );
}

function skyHour() {
  const now = new Date();
  const wallClock =
    now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const store = useTimeStore.getState();
  return store.getTimeOfDay(wallClock, performance.now());
}

export function Atmosphere({ quality }: { quality: SceneQuality }) {
  const viewport = useThree((state) => state.viewport);
  const cloudPlane = useRef<THREE.Mesh>(null);
  const starMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [],
  );
  const cloudTexture = useMemo(createCloudTexture, []);
  const cloudMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: cloudFragmentShader,
        uniforms: {
          uMap: { value: cloudTexture },
          uTint: { value: new THREE.Color() },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [cloudTexture],
  );
  const nebulaTexture = useMemo(createNebulaTexture, []);
  const nebulaMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: nebulaFragmentShader,
        uniforms: {
          uMap: { value: nebulaTexture },
          uOpacity: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [nebulaTexture],
  );

  const moonIntensity = useRef(0);
  const sunIntensity = useRef(0);
  const planetIntensity = useRef(0);
  const moonPosition = useRef<readonly [number, number, number]>([0, 0, -8]);
  const sunPosition = useRef<readonly [number, number, number]>([0, 0, -8]);
  const planetPosition = useRef<readonly [number, number, number]>([0, 0, -8]);
  const starCount = quality === "low" ? 360 : quality === "medium" ? 760 : 1400;
  const starGeometry = useMemo(
    () => createStarGeometry(starCount, viewport.width, viewport.height),
    [starCount, viewport.height, viewport.width],
  );

  useEffect(
    () => () => {
      starGeometry.dispose();
      starMaterial.dispose();
      cloudMaterial.dispose();
      cloudTexture.dispose();
      nebulaMaterial.dispose();
      nebulaTexture.dispose();
    },
    [
      cloudMaterial,
      cloudTexture,
      nebulaMaterial,
      nebulaTexture,
      starGeometry,
      starMaterial,
    ],
  );

  useFrame((state) => {
    const sky: SkyState = getSkyState(skyHour());
    const tint = new THREE.Color().setRGB(...sky.lightColor);
    const horizon = new THREE.Color().setRGB(...sky.horizonColor);
    tint.lerp(horizon, sky.sun > 0.01 ? 0.12 : 0.46);
    cloudMaterial.uniforms.uTint.value.copy(tint);
    cloudMaterial.uniforms.uOpacity.value = sky.clouds * 1.08;
    nebulaMaterial.uniforms.uOpacity.value = sky.nebula * 1.8;

    starMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    starMaterial.uniforms.uOpacity.value = sky.stars;

    moonIntensity.current = sky.moon;
    sunIntensity.current = sky.sun;
    planetIntensity.current = sky.stars;
    moonPosition.current = [
      (sky.moonPosition[0] - 0.5) * viewport.width,
      (sky.moonPosition[1] - 0.5) * viewport.height,
      -8.2,
    ];
    sunPosition.current = [
      (sky.sunPosition[0] - 0.5) * viewport.width,
      (sky.sunPosition[1] - 0.5) * viewport.height,
      -8.2,
    ];
    planetPosition.current = [
      (0.23 - 0.5) * viewport.width,
      (0.7 - 0.5) * viewport.height,
      -8.25,
    ];

    if (cloudPlane.current) {
      cloudPlane.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.025) * viewport.width * 0.012;
    }
  });

  return (
    <>
      <mesh
        ref={cloudPlane}
        position={[0, 0, -9.2]}
        renderOrder={0.5}
        scale={[viewport.width, viewport.height, 1]}
        material={cloudMaterial}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
      <mesh
        position={[0, 0, -9.15]}
        renderOrder={0.55}
        scale={[viewport.width, viewport.height, 1]}
        material={nebulaMaterial}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
      <points
        geometry={starGeometry}
        material={starMaterial}
        renderOrder={0.7}
        position={[0, 0, -8.5]}
      />
      <CelestialBody
        color="#fff1c6"
        diskSize={viewport.height * 0.045}
        intensity={sunIntensity}
        position={sunPosition}
        renderOrder={0.62}
      />
      <CelestialBody
        color="#e4edff"
        diskSize={viewport.height * 0.036}
        intensity={moonIntensity}
        position={moonPosition}
        renderOrder={0.64}
      />
      <CelestialBody
        color="#c9d7ff"
        diskSize={viewport.height * 0.009}
        intensity={planetIntensity}
        position={planetPosition}
        renderOrder={0.68}
      />
    </>
  );
}
