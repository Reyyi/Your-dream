"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTimeStore } from "@/lib/store";
import { getSkyState } from "@/lib/timeOfDay";

export function ShootingStar() {
  const viewport = useThree((state) => state.viewport);
  const lineRef = useRef<THREE.Line>(null);

  const stateRef = useRef({
    active: false,
    progress: 0,
    startX: 0,
    startY: 0,
    length: 1.2,
    angle: -0.45, // diagonal sweep
    speed: 1.6,
    lastFired: performance.now() + 5000,
    nextInterval: 12000 + Math.random() * 15000,
  });

  const { geometry, material } = useMemo(() => {
    // 2-point line for the meteor streak
    const positions = new Float32Array([0, 0, 0, -1, 0.45, 0]);
    const colors = new Float32Array([
      1.0, 1.0, 0.9, 0.95, // Head: white-warm
      0.65, 0.75, 1.0, 0.0, // Tail: fading blue-white
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 4));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      linewidth: 2,
    });

    return { geometry: geo, material: mat };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_, delta) => {
    const now = performance.now();
    const st = stateRef.current;
    const store = useTimeStore.getState();
    const clock = new Date();
    const wallClock =
      clock.getHours() + clock.getMinutes() / 60 + clock.getSeconds() / 3600;
    const hour = store.getTimeOfDay(wallClock, now);
    const sky = getSkyState(hour);

    // Only fire during night/twilight when stars are visible
    const isNight = sky.stars > 0.3;

    if (!st.active && isNight && now - st.lastFired > st.nextInterval) {
      st.active = true;
      st.progress = 0;
      st.startX = (Math.random() - 0.2) * viewport.width * 0.8;
      st.startY = (0.2 + Math.random() * 0.25) * viewport.height;
      st.length = 0.8 + Math.random() * 0.8;
      st.angle = -0.35 - Math.random() * 0.25;
      st.speed = 2.2 + Math.random() * 0.8;
      st.lastFired = now;
      st.nextInterval = 18000 + Math.random() * 22000;
    }

    if (st.active && lineRef.current) {
      st.progress += delta * st.speed;

      if (st.progress >= 1) {
        st.active = false;
        lineRef.current.visible = false;
        return;
      }

      lineRef.current.visible = true;

      // Calculate streak head and tail positions
      const currentHeadX = st.startX + Math.cos(st.angle) * st.progress * viewport.width * 0.55;
      const currentHeadY = st.startY + Math.sin(st.angle) * st.progress * viewport.height * 0.55;

      const tailLength = st.length * (1 - Math.abs(st.progress - 0.5) * 1.5);
      const tailX = currentHeadX - Math.cos(st.angle) * Math.max(0.1, tailLength);
      const tailY = currentHeadY - Math.sin(st.angle) * Math.max(0.1, tailLength);

      const positions = geometry.attributes.position.array as Float32Array;
      positions[0] = currentHeadX;
      positions[1] = currentHeadY;
      positions[2] = -8.1;

      positions[3] = tailX;
      positions[4] = tailY;
      positions[5] = -8.1;

      geometry.attributes.position.needsUpdate = true;

      // Fade alpha
      const alpha = Math.sin(st.progress * Math.PI);
      material.opacity = alpha * 0.95;
    } else if (lineRef.current) {
      lineRef.current.visible = false;
    }
  });

  return (
    <primitive
      ref={lineRef}
      object={new THREE.Line(geometry, material)}
      renderOrder={0.75}
      visible={false}
    />
  );
}
