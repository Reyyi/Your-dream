"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneSprites } from "@/lib/layers.config";
import type { ParallaxState } from "@/components/scene/Parallax";
import { ParallaxLayer } from "@/components/scene/Parallax";
import { getLayerTint } from "@/lib/layerAppearance";
import { getSkyState } from "@/lib/timeOfDay";
import { useTimeStore } from "@/lib/store";
import { LayerPlane } from "@/components/scene/LayerPlane";

export type SceneQuality = "low" | "medium" | "high";

const grassConfig = sceneSprites.find((sprite) => sprite.id === "grass_front")!;

const grassVertexShader = /* glsl */ `
  #include <common>
  uniform float uTime;
  uniform float uWind;
  attribute float aPhase;
  varying float vBladeHeight;

  void main() {
    vec3 transformed = position;
    vBladeHeight = uv.y;
    float breeze = sin(uTime * 1.7 + aPhase) * 0.7
      + sin(uTime * 0.83 + aPhase * 1.73) * 0.3;
    transformed.x += breeze * uWind * smoothstep(0.0, 1.0, uv.y);
    #include <project_vertex>
  }
`;

const grassFragmentShader = /* glsl */ `
  uniform vec3 uTint;
  varying float vBladeHeight;

  void main() {
    vec3 tip = vec3(0.68, 0.69, 0.44) * uTint;
    vec3 root = vec3(0.19, 0.32, 0.25) * uTint;
    vec3 color = mix(root, tip, smoothstep(0.05, 1.0, vBladeHeight));
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function seeded(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function createBladeGeometry(count: number) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [-0.5, 0, 0, 0.5, 0, 0, 0.08, 1, 0],
      3,
    ),
  );
  geometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.58, 1], 2),
  );
  geometry.setIndex([0, 1, 2]);
  const phases = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    phases[index] = seeded(index) * Math.PI * 2;
  }
  geometry.setAttribute(
    "aPhase",
    new THREE.InstancedBufferAttribute(phases, 1),
  );
  geometry.computeVertexNormals();
  return geometry;
}

function makeShrubPositions(viewportWidth: number) {
  return [
    [-viewportWidth * 0.42, -0.76, -1.7, 1.05],
    [-viewportWidth * 0.31, -0.79, -1.55, 0.85],
    [viewportWidth * 0.38, -0.74, -1.65, 1.18],
    [viewportWidth * 0.47, -0.78, -1.5, 0.92],
  ] as const;
}

function Shrub({
  position,
  scale,
  phase,
  parallax,
}: {
  position: readonly [number, number, number];
  scale: number;
  phase: number;
  parallax: React.MutableRefObject<ParallaxState>;
}) {
  const plant = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (plant.current) {
      plant.current.rotation.z = parallax.current.reducedMotion
        ? 0
        : Math.sin(state.clock.elapsedTime * 0.55 + phase) * 0.018;
    }
  });

  return (
    <group ref={plant} position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.022, 0.035, 0.25, 5]} />
        <meshBasicMaterial color="#514b3e" />
      </mesh>
      <mesh position={[-0.065, 0.24, 0.005]}>
        <sphereGeometry args={[0.13, 7, 6]} />
        <meshBasicMaterial color="#4f6850" />
      </mesh>
      <mesh position={[0.055, 0.3, 0.01]}>
        <sphereGeometry args={[0.15, 7, 6]} />
        <meshBasicMaterial color="#657552" />
      </mesh>
      <mesh position={[0.14, 0.2, 0.005]}>
        <sphereGeometry args={[0.11, 7, 6]} />
        <meshBasicMaterial color="#536a4f" />
      </mesh>
    </group>
  );
}

function GrassInstances({
  quality,
  viewportWidth,
  viewportHeight,
  parallax,
}: {
  quality: SceneQuality;
  viewportWidth: number;
  viewportHeight: number;
  parallax: React.MutableRefObject<ParallaxState>;
}) {
  const count = quality === "low" ? 80 : quality === "medium" ? 220 : 440;
  const geometry = useMemo(() => createBladeGeometry(440), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: grassVertexShader,
        fragmentShader: grassFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uWind: { value: 1.3 },
          uTint: { value: new THREE.Color(1, 1, 1) },
        },
        side: THREE.DoubleSide,
      }),
    [],
  );
  const grass = useMemo(() => {
    const mesh = new THREE.InstancedMesh(geometry, material, 440);
    mesh.renderOrder = grassConfig.renderOrder + 1;
    return mesh;
  }, [geometry, material]);

  useEffect(() => {
    grass.count = count;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let index = 0; index < 440; index += 1) {
      position.set(
        (seeded(index + 1) - 0.5) * viewportWidth * 1.3,
        -viewportHeight * 0.49 + seeded(index + 500) * 0.1,
        grassConfig.position[2],
      );
      rotation.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        (seeded(index + 200) - 0.5) * 0.8,
      );
      const bladeSize = 0.55 + seeded(index + 800) * 0.65;
      scale.set(0.025 + seeded(index + 1000) * 0.035, bladeSize * 0.36, 1);
      matrix.compose(position, rotation, scale);
      grass.setMatrixAt(index, matrix);
    }
    grass.instanceMatrix.needsUpdate = true;
    grass.computeBoundingSphere();
  }, [count, grass, viewportHeight, viewportWidth]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock =
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, performance.now());
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uWind.value = parallax.current.reducedMotion ? 0 : 1.3;
    material.uniforms.uTint.value.setRGB(
      ...getLayerTint(hour, getSkyState(hour)),
    );
  });

  return <primitive object={grass} dispose={null} />;
}

export function GrassField({
  quality,
  parallax,
  viewportWidth,
  viewportHeight,
  availableLayerIds,
}: {
  quality: SceneQuality;
  parallax: React.MutableRefObject<ParallaxState>;
  viewportWidth: number;
  viewportHeight: number;
  availableLayerIds: string[];
}) {
  const shrubPositions = useMemo(
    () => makeShrubPositions(viewportWidth),
    [viewportWidth],
  );

  return (
    <>
      <ParallaxLayer depth={grassConfig.depth} state={parallax} lockY={true}>
        <LayerPlane
          config={grassConfig}
          assetAvailable={availableLayerIds.includes(grassConfig.id)}
          viewportHeight={viewportHeight}
          viewportWidth={viewportWidth}
        />
        <GrassInstances
          quality={quality}
          parallax={parallax}
          viewportHeight={viewportHeight}
          viewportWidth={viewportWidth}
        />
      </ParallaxLayer>
      {shrubPositions.map(([x, y, z, size], index) => (
        <ParallaxLayer
          key={index}
          depth={grassConfig.depth * 0.78}
          state={parallax}
          lockY={true}
        >
          <Shrub
            phase={index * 1.7}
            position={[x, y, z]}
            parallax={parallax}
            scale={size}
          />
        </ParallaxLayer>
      ))}
    </>
  );
}
