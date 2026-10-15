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
  const aspect = viewportWidth / Math.max(0.1, viewportHeight);
  const isPortrait = aspect < 1.15;

  const sourceHeight = viewportHeight * config.scale;
  const sourceWidth = sourceHeight * 2;

  let width: number;
  let height: number;

  if (coverLayerIds.has(config.id)) {
    if (isPortrait && config.id !== "frame_leaves") {
      // On mobile portrait, span width comfortably so the full sweeping curves
      // fit across the screen instead of an extreme 5x zoomed-in crop
      width = Math.max(viewportWidth * 1.35, 1.4);
      height = sourceHeight;
    } else {
      const coverScale = Math.max(1, viewportWidth / sourceWidth);
      width = sourceWidth * coverScale;
      height = sourceHeight * coverScale;
    }
  } else {
    const scale = Math.min(1, (viewportWidth * 0.88) / sourceWidth);
    width = sourceWidth * scale;
    height = sourceHeight * scale;
  }

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
