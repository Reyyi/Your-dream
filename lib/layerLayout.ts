import type { LayerConfig } from "@/lib/layers.config";

export type LayerLayout = {
  width: number;
  height: number;
  position: readonly [number, number, number];
};

const coverLayerIds = new Set([
  "mountains_far",
  "hills_mid",
  "hills_near",
  "grass_front",
  "frame_leaves",
]);

const fixedPositionLayerIds = new Set(["street_lamp"]);

export function getLayerLayout(
  config: LayerConfig,
  viewportWidth: number,
  viewportHeight: number,
): LayerLayout {
  const sourceHeight = viewportHeight * config.scale;
  const sourceWidth = sourceHeight * 2;
  const coverScale = coverLayerIds.has(config.id)
    ? Math.max(1, viewportWidth / sourceWidth)
    : Math.min(1, (viewportWidth * 0.88) / sourceWidth);
  const width = sourceWidth * coverScale;
  const height = sourceHeight * coverScale;
  const [configuredX, configuredY, z] = config.position;
  const halfViewport = viewportWidth * 0.5;
  const halfLayer = width * 0.5;
  const x =
    coverLayerIds.has(config.id) ||
    fixedPositionLayerIds.has(config.id) ||
    halfLayer >= halfViewport
      ? configuredX
      : Math.max(
          -halfViewport + halfLayer + 0.025,
          Math.min(halfViewport - halfLayer - 0.025, configuredX),
        );

  return {
    width,
    height,
    position: [x + config.offset[0], configuredY + config.offset[1], z],
  };
}
