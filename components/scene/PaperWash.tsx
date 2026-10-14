"use client";

import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const paperFragmentShader = /* glsl */ `
  uniform sampler2D uPaper;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    float paper = texture2D(uPaper, vUv * vec2(7.0, 5.0)).r;
    paper = mix(1.0, paper, uOpacity);
    gl_FragColor = vec4(vec3(paper), 1.0);
    #include <colorspace_fragment>
  }
`;

function createPaperTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) throw new Error("Tidak dapat membuat tekstur kertas.");

  const image = context.createImageData(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (y * canvas.width + x) * 4;
      const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const grain = noise - Math.floor(noise);
      const fiber = Math.sin(x * 0.11 + Math.sin(y * 0.07) * 2) * 2;
      const value = Math.max(
        218,
        Math.min(255, Math.round(239 + grain * 16 + fiber)),
      );
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value;
      image.data[index + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export function PaperWash() {
  const viewport = useThree((state) => state.viewport);
  const paper = useMemo(createPaperTexture, []);
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
        fragmentShader: paperFragmentShader,
        uniforms: {
          uPaper: { value: paper },
          uOpacity: { value: 0.13 },
        },
        transparent: true,
        blending: THREE.MultiplyBlending,
        premultipliedAlpha: true,
        depthWrite: false,
        depthTest: false,
        toneMapped: false,
      }),
    [paper],
  );

  useEffect(
    () => () => {
      material.dispose();
      paper.dispose();
    },
    [material, paper],
  );

  return (
    <mesh
      position={[0, 0, -0.12]}
      renderOrder={20}
      scale={[viewport.width, viewport.height, 1]}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
