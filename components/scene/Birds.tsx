"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTimeStore } from "@/lib/store";
import { getSkyState } from "@/lib/timeOfDay";

// Distant flock bird spec: small offsets, individual flap timing and subtle scale variations
interface DistantBirdSpec {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  scale: number;
  flapOffset: number; // Individual timing for wing flap bursts
  flapSpeed: number;
  bankBias: number;
}

const DISTANT_FLOCK: DistantBirdSpec[] = [
  // Lead bird
  { offsetX: 0.0, offsetY: 0.0, offsetZ: 0.0, scale: 1.0, flapOffset: 0.0, flapSpeed: 6.2, bankBias: 0.02 },
  // Wingman left
  { offsetX: -0.065, offsetY: -0.024, offsetZ: -0.01, scale: 0.92, flapOffset: 1.8, flapSpeed: 6.5, bankBias: 0.01 },
  // Wingman right
  { offsetX: 0.072, offsetY: -0.022, offsetZ: 0.01, scale: 0.95, flapOffset: 3.4, flapSpeed: 6.1, bankBias: -0.01 },
  // Trailing left
  { offsetX: -0.135, offsetY: -0.052, offsetZ: -0.02, scale: 0.85, flapOffset: 2.2, flapSpeed: 6.8, bankBias: 0.03 },
  // Trailing right
  { offsetX: 0.145, offsetY: -0.048, offsetZ: 0.02, scale: 0.88, flapOffset: 4.6, flapSpeed: 6.3, bankBias: -0.02 },
];

function DistantBird({
  spec,
  material,
  flightDirection,
}: {
  spec: DistantBirdSpec;
  material: THREE.Material;
  flightDirection: number; // 1 for left-to-right, -1 for right-to-left
}) {
  const birdGroupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Mesh>(null);
  const rightWingRef = useRef<THREE.Mesh>(null);

  // Aerodynamic distant soaring wing: arched leading edge, tapered primary feathers
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    // Shoulder to mid-wing forward sweep
    shape.quadraticCurveTo(0.012, 0.005, 0.025, 0.007);
    // Sweeping back to a fine aerodynamic primary tip
    shape.quadraticCurveTo(0.036, 0.003, 0.045, -0.003);
    // Trailing edge contour back to inner wing root
    shape.quadraticCurveTo(0.022, -0.006, 0, -0.004);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  // Slender distant aerodynamic bird body
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.008); // Beak
    shape.quadraticCurveTo(0.003, 0.0, 0.002, -0.010); // Right flank
    shape.lineTo(0.004, -0.014); // Tail flare right
    shape.lineTo(0, -0.011); // Center notch
    shape.lineTo(-0.004, -0.014); // Tail flare left
    shape.quadraticCurveTo(-0.003, 0.0, 0, 0.008); // Back to beak
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

    // Authentic soaring cadence:
    // 70% of the time, the bird glides peacefully with a gentle dihedral V-shape.
    // Every ~6 seconds, it does a short burst of 3 gentle wing strokes to catch thermals.
    const cycleDuration = 6.2;
    const cycleTime = (t + spec.flapOffset) % cycleDuration;
    const isFlapping = cycleTime < 1.4;

    let wingAngle = 0.06; // Calm soaring dihedral angle
    if (isFlapping) {
      const flapProgress = cycleTime / 1.4;
      // 3 gentle sinusoidal flaps with smooth ease-in and ease-out envelope
      const envelope = Math.sin(flapProgress * Math.PI);
      wingAngle += Math.sin(flapProgress * Math.PI * 6.0) * 0.32 * envelope;
    }

    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = -wingAngle;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = wingAngle;
    }

    if (birdGroupRef.current) {
      // Gentle bank / roll as the bird rides the air current
      const bankRoll = Math.sin(t * 0.45 + spec.flapOffset) * 0.06 + spec.bankBias;
      birdGroupRef.current.rotation.z = bankRoll;

      // Subtle pitch response: slight lift during flapping, level during soar
      const pitch = isFlapping ? Math.sin(cycleTime * 12.0) * 0.03 : 0.0;
      birdGroupRef.current.rotation.x = pitch;

      // Small vertical lift variation
      birdGroupRef.current.position.y =
        spec.offsetY + Math.sin(t * 0.3 + spec.flapOffset) * 0.006;
    }
  });

  return (
    <group
      ref={birdGroupRef}
      position={[spec.offsetX * flightDirection, spec.offsetY, spec.offsetZ]}
      scale={[spec.scale * flightDirection, spec.scale, spec.scale]}
    >
      {/* Slender bird body */}
      <mesh geometry={bodyGeometry} material={material} renderOrder={0.65} />

      {/* Left wing */}
      <group position={[-0.002, 0, 0]}>
        <mesh
          ref={leftWingRef}
          geometry={wingGeometry}
          material={material}
          renderOrder={0.65}
          scale={[-1, 1, 1]}
        />
      </group>

      {/* Right wing */}
      <group position={[0.002, 0, 0]}>
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

  // Common material with subtle silhouette tint that harmonizes with distance and sky
  const birdMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#303846"),
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

  // Passage management:
  // Each crossing takes ~30 seconds, followed by ~55 seconds of peaceful intermission (total ~85s cycle).
  // Birds appear only occasionally, making the sky feel naturally alive rather than an endless loop.
  const passageRef = useRef({
    flightDirection: 1, // 1: left-to-right, -1: right-to-left
    altitudeFactor: 0.32, // Relative altitude in upper sky
  });

  useFrame((state, delta) => {
    const store = useTimeStore.getState();
    const now = new Date();
    const wallClock = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, performance.now());
    const sky = getSkyState(hour);

    // Active hours: Pagi (05:00 - 10:59), Siang (11:00 - 14:59), and Sore (15:00 - 18:59)
    // Fades out and stays hidden at Malam (19:00 - 04:59)
    const isDaytime = hour >= 5.0 && hour < 19.0;

    const t = state.clock.elapsedTime;

    // Total passage cycle: 84 seconds
    // Crossing window: 0 to 30 seconds
    // Quiet sky intermission: 30 to 84 seconds (54 seconds of calm with no birds)
    const cyclePeriod = 84.0;
    const crossingDuration = 30.0;
    const cycleTime = t % cyclePeriod;
    const passageNumber = Math.floor(t / cyclePeriod);

    // Determine flight properties for this passage
    const isEvenPassage = passageNumber % 2 === 0;
    passageRef.current.flightDirection = isEvenPassage ? 1 : -1;
    // Slight altitude variation between passages (between 0.28 and 0.36 of viewport height)
    passageRef.current.altitudeFactor = 0.28 + ((passageNumber * 37) % 10) * 0.008;

    const isCrossingActive = isDaytime && cycleTime < crossingDuration;

    // Compute edge fade-in / fade-out during crossing
    let crossingAlpha = 0.0;
    if (isCrossingActive) {
      const progress = cycleTime / crossingDuration;
      // Soft fade in on entering horizon and fade out on leaving
      const fadeIn = THREE.MathUtils.smoothstep(progress, 0.0, 0.12);
      const fadeOut = 1.0 - THREE.MathUtils.smoothstep(progress, 0.88, 1.0);
      crossingAlpha = fadeIn * fadeOut * 0.82;
    }

    currentOpacity.current = THREE.MathUtils.damp(
      currentOpacity.current,
      crossingAlpha,
      2.0,
      delta,
    );

    const isVisible = currentOpacity.current > 0.005;
    if (flockRef.current) flockRef.current.visible = isVisible;

    if (isVisible) {
      birdMaterial.opacity = currentOpacity.current;

      // Color tint harmonized with time of day (soft atmospheric dusk tint during sunset)
      if (sky.sun < 0.28 || (hour >= 16.5 && hour < 19.0)) {
        birdMaterial.color.setRGB(0.28, 0.20, 0.26); // Warm dusky silhouette
      } else {
        birdMaterial.color.setRGB(0.20, 0.24, 0.28); // Distant hazy slate
      }

      // Smooth horizontal flight across the horizon
      const progress = cycleTime / crossingDuration;
      const spanWidth = viewport.width * 1.5;
      const startX = passageRef.current.flightDirection === 1 ? -spanWidth * 0.5 : spanWidth * 0.5;
      const endX = passageRef.current.flightDirection === 1 ? spanWidth * 0.5 : -spanWidth * 0.5;
      const currentX = THREE.MathUtils.lerp(startX, endX, progress);

      // Gentle undulating soaring curve across the sky
      const baseAltitude = viewport.height * passageRef.current.altitudeFactor;
      const waveY = Math.sin(progress * Math.PI * 2.2) * (viewport.height * 0.025);
      const currentY = baseAltitude + waveY;

      // Position far in the distant sky (Z = -8.9)
      if (flockRef.current) {
        flockRef.current.position.set(currentX, currentY, -8.9);
      }
    }
  });

  return (
    <group ref={flockRef} visible={false}>
      {DISTANT_FLOCK.map((spec, index) => (
        <DistantBird
          key={index}
          spec={spec}
          material={birdMaterial}
          flightDirection={passageRef.current.flightDirection}
        />
      ))}
    </group>
  );
}
