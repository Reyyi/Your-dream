import type { RGB } from "@/lib/timeOfDay";
import type { SkyState } from "@/lib/timeOfDay";

function smoothstep(edge0: number, edge1: number, value: number) {
  const amount = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
}

function mixColor(a: RGB, b: RGB, amount: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ];
}

export function getLayerTint(hour: number, sky: SkyState): RGB {
  const wrappedHour = ((hour % 24) + 24) % 24;
  const dawn = 1 - smoothstep(0, 1.7, Math.abs(wrappedHour - 6));
  const dusk = 1 - smoothstep(0, 1.7, Math.abs(wrappedHour - 18));
  const warm = Math.min(1, Math.max(dawn, dusk));
  const daylight = Math.max(0, Math.min(1, sky.sun));
  const night = Math.max(0, 1 - Math.max(daylight, warm));
  const twilightTint: RGB = [1, 0.73, 0.51];
  const nightTint: RGB = [0.49, 0.55, 0.79];
  const dayTint: RGB = [1, 0.98, 0.91];

  return mixColor(
    mixColor(dayTint, twilightTint, warm),
    nightTint,
    night * 0.9,
  );
}
