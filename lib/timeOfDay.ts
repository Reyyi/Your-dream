export type RGB = readonly [number, number, number];
export type Point2D = readonly [number, number];

export type SkyState = {
  topColor: RGB;
  horizonColor: RGB;
  lightColor: RGB;
  stars: number;
  sun: number;
  sunPosition: Point2D;
  moon: number;
  moonPosition: Point2D;
  nebula: number;
  clouds: number;
  fog: number;
};

type SkyKeyframe = SkyState & { hour: number };

const keyframes: SkyKeyframe[] = [
  {
    hour: 0,
    topColor: [0.008, 0.015, 0.055],
    horizonColor: [0.07, 0.075, 0.18],
    lightColor: [0.22, 0.28, 0.48],
    stars: 1,
    sun: 0,
    sunPosition: [0.5, 0.72],
    moon: 1,
    moonPosition: [0.5, 0.78],
    nebula: 1,
    clouds: 0.32,
    fog: 0.2,
  },
  {
    hour: 5,
    topColor: [0.13, 0.17, 0.31],
    horizonColor: [0.77, 0.39, 0.35],
    lightColor: [0.95, 0.55, 0.35],
    stars: 0,
    sun: 0,
    sunPosition: [0.1, 0.2],
    moon: 0,
    moonPosition: [0.08, 0.44],
    nebula: 0,
    clouds: 0.66,
    fog: 0.56,
  },
  {
    hour: 7,
    topColor: [0.25, 0.48, 0.68],
    horizonColor: [0.97, 0.69, 0.49],
    lightColor: [1, 0.74, 0.47],
    stars: 0,
    sun: 0,
    sunPosition: [0.2, 0.34],
    moon: 0,
    moonPosition: [0.14, 0.3],
    nebula: 0,
    clouds: 0.62,
    fog: 0.35,
  },
  {
    hour: 12,
    topColor: [0.19, 0.48, 0.77],
    horizonColor: [0.72, 0.82, 0.83],
    lightColor: [1, 0.91, 0.7],
    stars: 0,
    sun: 1,
    sunPosition: [0.5, 0.76],
    moon: 0,
    moonPosition: [0.5, 0.65],
    nebula: 0,
    clouds: 0.54,
    fog: 0.17,
  },
  {
    hour: 17,
    topColor: [0.35, 0.37, 0.62],
    horizonColor: [0.96, 0.54, 0.35],
    lightColor: [1, 0.58, 0.36],
    stars: 0,
    sun: 0,
    sunPosition: [0.8, 0.34],
    moon: 0,
    moonPosition: [0.86, 0.34],
    nebula: 0,
    clouds: 0.68,
    fog: 0.4,
  },
  {
    hour: 19,
    topColor: [0.04, 0.052, 0.15],
    horizonColor: [0.23, 0.15, 0.28],
    lightColor: [0.55, 0.32, 0.42],
    stars: 0.28,
    sun: 0,
    sunPosition: [0.94, 0.16],
    moon: 0.18,
    moonPosition: [0.78, 0.74],
    nebula: 0,
    clouds: 0.38,
    fog: 0.3,
  },
  {
    hour: 24,
    topColor: [0.008, 0.015, 0.055],
    horizonColor: [0.07, 0.075, 0.18],
    lightColor: [0.22, 0.28, 0.48],
    stars: 1,
    sun: 0,
    sunPosition: [0.5, 0.72],
    moon: 1,
    moonPosition: [0.5, 0.78],
    nebula: 1,
    clouds: 0.32,
    fog: 0.2,
  },
];

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function mixColor(a: RGB, b: RGB, amount: number): RGB {
  return [
    mix(a[0], b[0], amount),
    mix(a[1], b[1], amount),
    mix(a[2], b[2], amount),
  ];
}

export function normalizeTime(hour: number) {
  const wrapped = ((hour % 24) + 24) % 24;
  return wrapped === 0 && hour === 24 ? 24 : wrapped;
}

export function getSkyState(timeOfDay: number): SkyState {
  const hour = ((timeOfDay % 24) + 24) % 24;
  let nextIndex = keyframes.findIndex((frame) => frame.hour > hour);
  if (nextIndex === -1) nextIndex = keyframes.length - 1;

  const next = keyframes[nextIndex];
  const previous = keyframes[nextIndex - 1];
  const amount = (hour - previous.hour) / (next.hour - previous.hour);

  return {
    topColor: mixColor(previous.topColor, next.topColor, amount),
    horizonColor: mixColor(previous.horizonColor, next.horizonColor, amount),
    lightColor: mixColor(previous.lightColor, next.lightColor, amount),
    stars: mix(previous.stars, next.stars, amount),
    sun: mix(previous.sun, next.sun, amount),
    sunPosition: [
      mix(previous.sunPosition[0], next.sunPosition[0], amount),
      mix(previous.sunPosition[1], next.sunPosition[1], amount),
    ],
    moon: mix(previous.moon, next.moon, amount),
    moonPosition: [
      mix(previous.moonPosition[0], next.moonPosition[0], amount),
      mix(previous.moonPosition[1], next.moonPosition[1], amount),
    ],
    nebula: mix(previous.nebula, next.nebula, amount),
    clouds: mix(previous.clouds, next.clouds, amount),
    fog: mix(previous.fog, next.fog, amount),
  };
}

export function getLocalTimeOfDay(date = new Date()) {
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
}

export function formatTime(hour: number) {
  if (hour >= 24) return "24:00";
  const wrapped = ((hour % 24) + 24) % 24;
  const hours = Math.floor(wrapped);
  const minutes = Math.floor((wrapped - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
