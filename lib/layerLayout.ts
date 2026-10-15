import type { LayerConfig } from "@/lib/layers.config";

export type LayerLayout = {
  width: number;
  height: number;
  position: readonly [number, number, number];
};

const landscapeGroundLayers = new Set([
  "mountains_far",
  "hills_mid",
  "hills_near",
  "grass_front",
]);

export function getLayerLayout(
  config: LayerConfig,
  viewportWidth: number,
  viewportHeight: number,
): LayerLayout {
  const aspect = viewportWidth / Math.max(0.1, viewportHeight);
  const isPortrait = aspect < 1.15;
  const [, , z] = config.position;

  // 1. Specialized responsive layout for ground and mountain layers
  if (landscapeGroundLayers.has(config.id)) {
    // Width: on mobile portrait, span viewportWidth * 1.35 so visitors see the full sweeping
    // silhouette curves instead of an extreme 5x zoomed-in crop. On desktop, cover wide screen.
    const width = isPortrait
      ? Math.max(viewportWidth * 1.35, 1.3)
      : Math.max(viewportWidth * 1.16, viewportHeight * config.scale * 1.9);

    // Tiered height proportions: leaves ~64% open sky above for stars, moon, and birds
    let heightMultiplier = 0.88;
    if (config.id === "mountains_far") {
      heightMultiplier = isPortrait ? 0.92 : 0.90;
    } else if (config.id === "hills_mid") {
      heightMultiplier = isPortrait ? 0.82 : 0.80;
    } else if (config.id === "hills_near") {
      heightMultiplier = isPortrait ? 0.72 : 0.70;
    } else if (config.id === "grass_front") {
      heightMultiplier = 0.52;
    }

    const height = viewportHeight * heightMultiplier;

    // Anchor bottom edge firmly to bottom of viewport with safe 4% bleed overlap
    const bottomBleed = viewportHeight * 0.04;
    const y = -viewportHeight * 0.5 - bottomBleed + height * 0.5;
    const x = config.offset[0];

    return {
      width,
      height,
      position: [x, y + config.offset[1], z],
    };
  }

  // 2. Framing foliage at top corners
  if (config.id === "frame_leaves") {
    const width = Math.max(viewportWidth * 1.08, 1.8);
    const height = viewportHeight * 0.75;
    const y = viewportHeight * 0.5 - height * 0.5;
    return {
      width,
      height,
      position: [config.offset[0], y + config.offset[1], z],
    };
  }

  // 3. Fallback for standalone props (e.g. street_lamp)
  const sourceHeight = viewportHeight * config.scale;
  const sourceWidth = sourceHeight * 0.5;
  const [configuredX, configuredY] = config.position;

  return {
    width: sourceWidth,
    height: sourceHeight,
    position: [configuredX + config.offset[0], configuredY + config.offset[1], z],
  };
}
