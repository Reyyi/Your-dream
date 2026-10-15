"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneQuality } from "@/components/scene/GrassField";

interface LeafParticle {
  x: number;
  y: number;
  z: number;
  speedY: number;
  flutterSpeed: number;
  flutterAmp: number;
  rotSpeed: number;
  phase: number;
  size: number;
  clusterX: number; // Anchor around left or right tree boughs
}

function createLeafGeometry() {
  const shape = new THREE.Shape();
  // Natural tapered foliage leaf silhouette
  shape.moveTo(0, 0.024); // Leaf tip
  shape.quadraticCurveTo(0.012, 0.008, 0.008, -0.016);
  shape.lineTo(0, -0.022); // Stem base
  shape.lineTo(-0.008, -0.016);
  shape.quadraticCurveTo(-0.012, 0.008, 0, 0.024);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

export function FallingLeaves({ quality }: { quality: SceneQuality }) {
  const viewport = useThree((state) => state.viewport);
  const count = quality === "low" ? 14 : quality === "medium" ? 24 : 36;
  const geometry = useMemo(() => createLeafGeometry(), []);

  // Material with translucent foliage tone
  const materials = useMemo(
    () => [
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#4a5e46"),
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#5d6b4f"),
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#51453a"),
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    ],
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [geometry, materials]);

  const groupRef = useRef<THREE.Group>(null);
  const leafMeshesRef = useRef<THREE.Mesh[]>([]);

  const leavesData = useMemo(() => {
    const data: LeafParticle[] = [];
    for (let i = 0; i < count; i++) {
      // Clustered near tree branches: left trees (-0.38) or right trees (+0.42)
      const isLeft = i % 2 === 0;
      const clusterX = isLeft
        ? -viewport.width * (0.34 + Math.random() * 0.16)
        : viewport.width * (0.36 + Math.random() * 0.16);

      const startY = -viewport.height * 0.42 + Math.random() * (viewport.height * 0.8);

      data.push({
        x: clusterX + (Math.random() - 0.5) * (viewport.width * 0.18),
        y: startY,
        z: -1.2 + (Math.random() - 0.5) * 0.8,
        speedY: 0.0035 + Math.random() * 0.0045,
        flutterSpeed: 1.8 + Math.random() * 2.2,
        flutterAmp: 0.015 + Math.random() * 0.022,
        rotSpeed: 1.2 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        size: 0.75 + Math.random() * 0.5,
        clusterX,
      });
    }
    return data;
  }, [count, viewport.height, viewport.width]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const groundLimit = -viewport.height * 0.48;
    const respawnTop = viewport.height * 0.38;

    leafMeshesRef.current.forEach((mesh, index) => {
      if (!mesh) return;
      const data = leavesData[index];
      if (!data) return;

      // Vertical descent
      data.y -= data.speedY;

      // Natural zigzag drifting flutter
      const flutterX = Math.sin(t * data.flutterSpeed + data.phase) * data.flutterAmp;
      mesh.position.x = data.x + flutterX;
      mesh.position.y = data.y;
      mesh.position.z = data.z;

      // Tumble & roll rotation
      mesh.rotation.z = Math.sin(t * data.rotSpeed + data.phase) * 0.65;
      mesh.rotation.y = Math.cos(t * data.rotSpeed * 0.8 + data.phase) * 0.45;

      // Respawn at canopy above when touching ground
      if (data.y < groundLimit) {
        data.y = respawnTop + Math.random() * (viewport.height * 0.15);
        data.x = data.clusterX + (Math.random() - 0.5) * (viewport.width * 0.18);
        data.phase = Math.random() * Math.PI * 2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {leavesData.map((leaf, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) leafMeshesRef.current[index] = el;
          }}
          geometry={geometry}
          material={materials[index % materials.length]}
          position={[leaf.x, leaf.y, leaf.z]}
          scale={[leaf.size, leaf.size, leaf.size]}
          renderOrder={3.5}
        />
      ))}
    </group>
  );
}
