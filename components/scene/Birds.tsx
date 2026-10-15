"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTimeStore } from "@/lib/store";
import { getSkyState } from "@/lib/timeOfDay";

// Individual bird definition with natural offset in V-formation
interface BirdSpec {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  scale: number;
  flapSpeed: number;
  phase: number;
  glideOffset: number;
}

const FLOCK_SPECS: BirdSpec[] = [
  { offsetX: 0.0, offsetY: 0.0, offsetZ: 0.0, scale: 1.0, flapSpeed: 6.8, phase: 0.0, glideOffset: 0.0 },
  { offsetX: -0.22, offsetY: -0.09, offsetZ: -0.02, scale: 0.92, flapSpeed: 7.1, phase: 0.8, glideOffset: 0.4 },
  { offsetX: 0.24, offsetY: -0.08, offsetZ: -0.01, scale: 0.94, flapSpeed: 6.9, phase: 1.4, glideOffset: 0.8 },
  { offsetX: -0.44, offsetY: -0.19, offsetZ: -0.04, scale: 0.86, flapSpeed: 7.3, phase: 2.1, glideOffset: 1.2 },
  { offsetX: 0.46, offsetY: -0.18, offsetZ: -0.03, scale: 0.88, flapSpeed: 7.0, phase: 2.8, glideOffset: 1.6 },
  { offsetX: -0.66, offsetY: -0.29, offsetZ: -0.06, scale: 0.80, flapSpeed: 7.5, phase: 3.5, glideOffset: 2.0 },
  { offsetX: 0.68, offsetY: -0.27, offsetZ: -0.05, scale: 0.82, flapSpeed: 7.2, phase: 4.1, glideOffset: 2.4 },
];

function SingleBird({
  spec,
  material,
}: {
  spec: BirdSpec;
  material: THREE.Material;
}) {
  const birdGroupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  // Reusable wing geometry: slender organic tapered wing
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.04, 0.025, 0.09, 0.032); // Wing tip
    shape.quadraticCurveTo(0.045, -0.01, 0, -0.018); // Trailing edge
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  // Reusable bird body: slender aerodynamic silhouette
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.024); // Beak
    shape.quadraticCurveTo(0.01, 0.0, 0.008, -0.028); // Right tail
    shape.lineTo(-0.008, -0.028); // Left tail
    shape.quadraticCurveTo(-0.01, 0.0, 0, 0.024); // Back to beak
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  useEffect(() => {
    return () => {
      wingGeometry.dispose();
      bodyGeometry.dispose();
    };
  }, [wingGeometry, bodyGeometry]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Natural flapping cycle: periods of rhythmic flapping interspersed with graceful gliding
    const glideCycle = Math.sin(t * 0.65 + spec.glideOffset);
    const isGliding = glideCycle > 0.45;
    const flapAmp = isGliding ? 0.08 : 0.48;
    const wingAngle = Math.sin(t * spec.flapSpeed + spec.phase) * flapAmp;

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = -wingAngle - 0.08;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = wingAngle + 0.08;
    }

    if (birdGroupRef.current) {
      // Subtle vertical bobbing synced with wing thrust
      birdGroupRef.current.position.y = spec.offsetY + Math.sin(t * spec.flapSpeed + spec.phase) * 0.008;
      // Slight pitch tilt when gliding vs flapping
      birdGroupRef.current.rotation.z = Math.sin(t * 0.5 + spec.phase) * 0.04;
    }
  });

  return (
    <group
      ref={birdGroupRef}
      position={[spec.offsetX, spec.offsetY, spec.offsetZ]}
      scale={[spec.scale, spec.scale, spec.scale]}
    >
      {/* Bird Body */}
      <mesh geometry={bodyGeometry} material={material} renderOrder={0.65} />

      {/* Left Wing (Anchored at Body Left Edge) */}
      <group position={[-0.006, 0, 0]}>
        <mesh
          ref={leftWingRef}
          geometry={wingGeometry}
          material={material}
          renderOrder={0.65}
          scale={[-1, 1, 1]} // Mirrored for left wing
        />
      </group>

      {/* Right Wing (Anchored at Body Right Edge) */}
      <group position={[0.006, 0, 0]}>
        <mesh
          ref={rightWingRef}
          geometry={wingGeometry}
          material={material}
          renderOrder={0.65}
        />
      </group>
    </group>
  );
}

export function Birds() {
  const viewport = useThree((state) => state.viewport);
  const flockRef = useRef<THREE.Group>(null);
  const currentOpacity = useRef(0);

  // Common basic material with smooth dynamic opacity and sky-reactive tint
  const birdMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#252c38"),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      birdMaterial.dispose();
    };
  }, [birdMaterial]);

  useFrame((state, delta) => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, performance.now());
    const sky = getSkyState(hour);

    // Birds appear during pagi (05:00 - 10:59), siang (11:00 - 14:59), and sore (15:00 - 18:59)
    // Birds gracefully fade out at malam (19:00 - 04:59)
    const isDaytime = hour >= 5.0 && hour < 19.0;
    const targetOpacity = isDaytime ? 0.88 : 0.0;

    currentOpacity.current = THREE.MathUtils.damp(
      currentOpacity.current,
      targetOpacity,
      1.8,
      delta,
    );

    const isVisible = currentOpacity.current > 0.005;
    if (flockRef.current) flockRef.current.visible = isVisible;

    if (isVisible) {
      birdMaterial.opacity = currentOpacity.current;

      // React to sky light: deep slate during noon, warm dusky plum during sunrise/sunset
      if (sky.sun < 0.25 || (hour >= 16.5 && hour < 19.0)) {
        birdMaterial.color.setRGB(0.24, 0.16, 0.22); // Warm dusky senja silhouette
      } else {
        birdMaterial.color.setRGB(0.14, 0.17, 0.22); // Classic deep daytime silhouette
      }

      const t = state.clock.elapsedTime;
      // Gentle horizontal drift from left to right across the sky
      const cycleWidth = viewport.width * 1.5;
      const speed = 0.12; // Gentle peaceful gliding pace
      const posX = (((t * speed) % cycleWidth) - cycleWidth * 0.5);

      // Subtle undulating flight path (wave height)
      const posY = viewport.height * 0.24 + Math.sin(t * 0.18) * (viewport.height * 0.05);

      if (flockRef.current) {
        flockRef.current.position.set(posX, posY, -7.9);
      }
    }
  });

  return (
    <group ref={flockRef} visible={false}>
      {FLOCK_SPECS.map((spec, index) => (
        <SingleBird key={index} spec={spec} material={birdMaterial} />
      ))}
    </group>
  );
}
