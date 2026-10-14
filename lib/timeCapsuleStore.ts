"use client";

export type TimeCapsuleCategory =
  | "refleksi"
  | "harapan"
  | "keheningan"
  | "sains";

export type TimeCapsule = {
  id: string;
  title: string;
  authorCode: string;
  content: string;
  category: TimeCapsuleCategory;
  carrierFrequency: number;
  launchedAt: number;
  unlockAt: number | null;
  goldenDiscGlyph: number;
  coordinates: {
    ra: string;
    dec: string;
  };
  isTribute?: boolean;
};

export const STORAGE_KEY_CAPSULES = "yourdream_time_capsules_v1";

export const CATEGORY_METADATA: Record<
  TimeCapsuleCategory,
  { label: string; icon: string; accent: string; description: string }
> = {
  refleksi: {
    label: "Refleksi Hidup",
    icon: "☾",
    accent: "from-blue-400 to-indigo-500",
    description: "Perjalanan batin dan pembelajaran tentang ketabahan hidup",
  },
  harapan: {
    label: "Harapan Masa Depan",
    icon: "✧",
    accent: "from-amber-300 to-yellow-500",
    description: "Cita-cita dan impian yang dilepaskan ke pelukan masa depan",
  },
  keheningan: {
    label: "Keheningan Jiwa",
    icon: "◌",
    accent: "from-emerald-400 to-teal-500",
    description: "Helaan napas damai dan ketenangan yang ingin diabadikan",
  },
  sains: {
    label: "Kebenaran Semesta",
    icon: "◈",
    accent: "from-purple-400 to-fuchsia-500",
    description: "Catatan sains, logika alam, dan kekaguman pada struktur kosmik",
  },
};

export const CARRIER_FREQUENCIES = [
  {
    freq: 432,
    label: "432 Hz",
    name: "Harmoni Alam",
    description: "Frekuensi getaran alami air dan resonansi bumi",
  },
  {
    freq: 528,
    label: "528 Hz",
    name: "Transformasi Cahaya",
    description: "Frekuensi nada solfeggio pemulihan dan kejernihan pikiran",
  },
  {
    freq: 852,
    label: "852 Hz",
    name: "Kesadaran Kosmik",
    description: "Resonansi spiritual ruang tinggi dan keheningan mendalam",
  },
  {
    freq: 1420,
    label: "1420 MHz",
    name: "Garis Hidrogen Antariksa",
    description: "Garis emisi radio hidrogen netral yang digunakan wahana Voyager",
  },
];

// Seed initial tribute capsule if storage is empty
const INITIAL_TRIBUTE_CAPSULE: TimeCapsule = {
  id: "capsule-voyager-tribute-1977",
  title: "Gema Peradaban di Tepian Tata Surya",
  authorCode: "PENGEMBARA-VOYAGER",
  content:
    "Ini adalah hadiah dari sebuah dunia kecil yang jauh, penanda suara kami, sains kami, musik kami, dan harapan kami. Kami berusaha bertahan di zaman kami sehingga kami mungkin hidup dan melintasi waktu untuk menyapa masa depanmu.",
  category: "sains",
  carrierFrequency: 1420,
  // Simulated launch anchor representing deep interstellar distance
  launchedAt: new Date(2023, 0, 1).getTime(),
  unlockAt: null,
  goldenDiscGlyph: 1,
  coordinates: {
    ra: "17j 14m 12d",
    dec: "+12° 02′ 28″",
  },
  isTribute: true,
};

function generateCosmicCoordinates(): { ra: string; dec: string } {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);
  const deg = (Math.random() > 0.5 ? "+" : "-") + Math.floor(Math.random() * 85);
  const arcMin = Math.floor(Math.random() * 60);
  return {
    ra: `${hours.toString().padStart(2, "0")}j ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}d`,
    dec: `${deg}° ${arcMin.toString().padStart(2, "0")}′`,
  };
}

export function loadTimeCapsules(): TimeCapsule[] {
  if (typeof window === "undefined") return [INITIAL_TRIBUTE_CAPSULE];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_CAPSULES);
    if (!raw) {
      window.localStorage.setItem(
        STORAGE_KEY_CAPSULES,
        JSON.stringify([INITIAL_TRIBUTE_CAPSULE]),
      );
      return [INITIAL_TRIBUTE_CAPSULE];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [INITIAL_TRIBUTE_CAPSULE];
  } catch {
    return [INITIAL_TRIBUTE_CAPSULE];
  }
}

export function saveTimeCapsules(capsules: TimeCapsule[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_CAPSULES, JSON.stringify(capsules));
  } catch {
    // Ignore storage quota errors
  }
}

export function addTimeCapsule(
  data: Omit<TimeCapsule, "id" | "launchedAt" | "coordinates">,
): TimeCapsule {
  const newCapsule: TimeCapsule = {
    ...data,
    id: `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    launchedAt: Date.now(),
    coordinates: generateCosmicCoordinates(),
  };

  const current = loadTimeCapsules();
  const updated = [newCapsule, ...current];
  saveTimeCapsules(updated);
  return newCapsule;
}

export function deleteTimeCapsule(id: string): TimeCapsule[] {
  const current = loadTimeCapsules();
  const updated = current.filter((c) => c.id !== id);
  saveTimeCapsules(updated);
  return updated;
}

// ──────────────────────────────────────────────────────────
// Physics Telemetry Calculations (17 km/s Voyager Cruise Speed)
// ──────────────────────────────────────────────────────────

const KM_PER_SECOND = 17.0; // km/s
const KM_PER_AU = 149597870.7; // 1 Astronomical Unit
const SPEED_OF_LIGHT_KMS = 299792.458; // km/s

export type TelemetryData = {
  elapsedSeconds: number;
  distanceKm: number;
  distanceAU: number;
  lightDelaySeconds: number;
  zone: string;
  zoneProgress: number; // 0 to 1 inside current cosmic zone
  zoneInfo: string;
};

export function getTelemetry(capsule: TimeCapsule, now = Date.now()): TelemetryData {
  const elapsedMs = Math.max(0, now - capsule.launchedAt);
  const elapsedSeconds = elapsedMs / 1000;

  // For tribute capsule, add simulated voyage base distance
  const baseKm = capsule.isTribute ? 24500000000 : 0;
  const distanceKm = baseKm + elapsedSeconds * KM_PER_SECOND;
  const distanceAU = distanceKm / KM_PER_AU;
  const lightDelaySeconds = distanceKm / SPEED_OF_LIGHT_KMS;

  // Determine current cosmic region
  let zone = "Ruang Bumi & Bulan";
  let zoneInfo = "Melewati orbit gravitasi bumi menuju lintasan antarplanet";
  let zoneProgress = 0.1;

  if (distanceAU < 2.5) {
    zone = "Kawasan Planet Dalam (Mars & Sabuk Asteroid)";
    zoneInfo = "Melintasi orbit Mars dan jutaan batuan sabuk asteroid utama";
    zoneProgress = distanceAU / 2.5;
  } else if (distanceAU < 9.5) {
    zone = "Kawasan Planet Raksasa Gas (Jupiter & Saturnus)";
    zoneInfo = "Memanfaatkan dorongan gravitasi medan magnet planet raksasa";
    zoneProgress = (distanceAU - 2.5) / 7.0;
  } else if (distanceAU < 30.0) {
    zone = "Kawasan Raksasa Es (Uranus & Neptunus)";
    zoneInfo = "Cahaya matahari mulai memudar menjadi titik bintang kecil";
    zoneProgress = (distanceAU - 9.5) / 20.5;
  } else if (distanceAU < 120.0) {
    zone = "Sabuk Kuiper & Batas Tata Surya";
    zoneInfo = "Mengarungi ribuan objek es beku purba di tepian sistem surya";
    zoneProgress = (distanceAU - 30.0) / 90.0;
  } else if (distanceAU < 1000.0) {
    zone = "Heliopause & Medium Antarbintang Murni";
    zoneInfo = "Meninggalkan angin matahari, berlayar di samudra ruang antarbintang";
    zoneProgress = (distanceAU - 120.0) / 880.0;
  } else {
    zone = "Awan Oort & Ruang Hampa Galaksi Abadi";
    zoneInfo = "Batas terluar gravitasi tata surya tempat lahirnya komet es abadi";
    zoneProgress = 1.0;
  }

  return {
    elapsedSeconds,
    distanceKm,
    distanceAU,
    lightDelaySeconds,
    zone,
    zoneProgress: Math.max(0, Math.min(1, zoneProgress)),
    zoneInfo,
  };
}

export function formatAU(au: number): string {
  if (au < 1) return au.toFixed(4) + " AU";
  if (au < 100) return au.toFixed(2) + " AU";
  return au.toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " AU";
}

export function formatKm(km: number): string {
  return Math.floor(km).toLocaleString("id-ID") + " km";
}

export function formatLightDelay(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(2)} detik cahaya`;
  }
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins} menit ${secs} detik cahaya`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours} jam ${mins} menit cahaya`;
}
