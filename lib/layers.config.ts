import type { RGB } from "@/lib/timeOfDay";

export type LayerId =
  | "mountains_far"
  | "hills_mid"
  | "hills_near"
  | "street_lamp"
  | "grass_front"
  | "frame_leaves";

export type LayerConfig = {
  id: LayerId;
  path: `/assets/layers/${string}.webp`;
  depth: number;
  scale: number;
  position: readonly [number, number, number];
  offset: readonly [number, number];
  tint: RGB;
  fog: number;
  renderOrder: number;
};

export type SpriteConfig = LayerConfig & {
  source: "image" | "procedural" | "sprite";
};

const tint: RGB = [1, 1, 1];

export const sceneLayers: LayerConfig[] = [
  {
    id: "mountains_far",
    path: "/assets/layers/mountains_far.webp",
    depth: 0.08,
    scale: 1.22,
    position: [0, -0.02, -6],
    offset: [0, 0],
    tint,
    fog: 0.76,
    renderOrder: 1,
  },
  {
    id: "hills_mid",
    path: "/assets/layers/hills_mid.webp",
    depth: 0.22,
    scale: 1.17,
    position: [0, -0.12, -4],
    offset: [0, 0],
    tint,
    fog: 0.54,
    renderOrder: 2,
  },
  {
    id: "hills_near",
    path: "/assets/layers/hills_near.webp",
    depth: 0.42,
    scale: 1.13,
    position: [0, -0.28, -2],
    offset: [0, 0],
    tint,
    fog: 0.3,
    renderOrder: 3,
  },
];

export const sceneSprites: SpriteConfig[] = [
  {
    id: "street_lamp",
    path: "/assets/layers/street_lamp.webp",
    source: "procedural",
    depth: 0,
    scale: 0.3,
    position: [1.35, -0.43, 0.3],
    offset: [0, 0],
    tint,
    fog: 0.04,
    renderOrder: 12,
  },
  {
    id: "grass_front",
    path: "/assets/layers/grass_front.webp",
    source: "procedural",
    depth: 0.92,
    scale: 1.25,
    position: [0, -0.58, -0.45],
    offset: [0, 0],
    tint,
    fog: 0.02,
    renderOrder: 9,
  },
  {
    id: "frame_leaves",
    path: "/assets/layers/frame_leaves.webp",
    source: "image",
    depth: 0.8,
    scale: 1.18,
    position: [0, 0, -0.72],
    offset: [0, 0],
    tint,
    fog: 0.04,
    renderOrder: 10,
  },
];

export const allSceneLayers: LayerConfig[] = [
  ...sceneLayers,
  ...sceneSprites,
];
