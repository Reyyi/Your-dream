"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type ParallaxState = {
  current: THREE.Vector2;
  target: THREE.Vector2;
  reducedMotion: boolean;
  sensorActive: boolean;
  lastInputAt: number;
};

export function useParallaxControls() {
  const orientationHandler = useRef<(event: DeviceOrientationEvent) => void>(
    () => undefined,
  );
  const state = useRef<ParallaxState>({
    current: new THREE.Vector2(),
    target: new THREE.Vector2(),
    reducedMotion: false,
    sensorActive: false,
    lastInputAt: 0,
  });
  const [showPermissionButton, setShowPermissionButton] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateMotionPreference = () => {
      state.current.reducedMotion = motionPreference.matches;
      if (motionPreference.matches) {
        state.current.target.set(0, 0);
        state.current.sensorActive = false;
      }
    };

    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);

    const eventConstructor = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<"granted" | "denied">;
        })
      | undefined;
    const requiresPermission =
      typeof eventConstructor?.requestPermission === "function";
    setShowPermissionButton(requiresPermission);

    const handlePointerMove = (event: PointerEvent) => {
      if (state.current.reducedMotion || event.pointerType === "touch") return;
      state.current.target.set(
        THREE.MathUtils.clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1),
        THREE.MathUtils.clamp((0.5 - event.clientY / window.innerHeight) * 2, -1, 1),
      );
      state.current.lastInputAt = performance.now();
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (state.current.reducedMotion) return;
      if (event.gamma === null || event.beta === null) return;
      state.current.target.set(
        THREE.MathUtils.clamp(event.gamma / 32, -1, 1),
        THREE.MathUtils.clamp((event.beta - 35) / 35, -1, 1),
      );
      state.current.lastInputAt = performance.now();
      state.current.sensorActive = true;
    };
    orientationHandler.current = handleOrientation;
    if (!requiresPermission) {
      window.addEventListener("deviceorientation", handleOrientation, {
        passive: true,
      });
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener(
        "deviceorientation",
        orientationHandler.current,
      );
    };
  }, []);

  const requestOrientationPermission = useCallback(async () => {
    const eventConstructor = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<"granted" | "denied">;
        })
      | undefined;
    setShowPermissionButton(false);
    if (!eventConstructor?.requestPermission) return;

    try {
      const permission = await eventConstructor.requestPermission();
      if (permission === "granted" && !state.current.reducedMotion) {
        window.addEventListener(
          "deviceorientation",
          orientationHandler.current,
          { passive: true },
        );
      }
    } catch {
      state.current.sensorActive = false;
    }
  }, []);

  return { state, showPermissionButton, requestOrientationPermission };
}

export function ParallaxSmoothing({
  state,
}: {
  state: MutableRefObject<ParallaxState>;
}) {
  useFrame((_, delta) => {
    const parallax = state.current;
    if (parallax.reducedMotion) {
      parallax.current.set(0, 0);
      return;
    }

    const elapsed = performance.now() - parallax.lastInputAt;
    const useAmbient = !parallax.sensorActive && elapsed > 1800;
    const ambientTime = performance.now() * 0.00016;
    const ambientX = useAmbient ? Math.sin(ambientTime) * 0.035 : 0;
    const ambientY = useAmbient ? Math.sin(ambientTime * 0.73 + 1.2) * 0.022 : 0;
    const targetX = parallax.target.x + ambientX;
    const targetY = parallax.target.y + ambientY;
    const damping = 1 - Math.exp(-delta * 2.8);
    parallax.current.x = THREE.MathUtils.lerp(
      parallax.current.x,
      targetX,
      damping,
    );
    parallax.current.y = THREE.MathUtils.lerp(
      parallax.current.y,
      targetY,
      damping,
    );
  });

  return null;
}

export function ParallaxLayer({
  depth,
  state,
  children,
  lockY = false,
}: {
  depth: number;
  state: MutableRefObject<ParallaxState>;
  children: ReactNode;
  lockY?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const viewportWidth = useThree((three) => three.viewport.width);
  const viewportHeight = useThree((three) => three.viewport.height);

  useFrame(() => {
    if (!group.current) return;
    group.current.position.x =
      state.current.current.x * depth * viewportWidth * 0.035;
    group.current.position.y = lockY
      ? 0
      : state.current.current.y * depth * viewportHeight * 0.035;
  });

  return <group ref={group}>{children}</group>;
}

export function ResponsiveSceneCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const setSize = useThree((state) => state.setSize);

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const aspect = size.width / Math.max(1, size.height);
    const targetHeight = aspect >= 1.2 ? 2.2 : 2.0;
    camera.zoom = Math.max(1, size.height / targetHeight);
    camera.updateProjectionMatrix();
    setSize(size.width, size.height);
  }, [camera, setSize, size.height, size.width]);

  return null;
}
