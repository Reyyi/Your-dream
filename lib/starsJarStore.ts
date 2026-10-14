"use client";

import { create } from "zustand";

export type StarCategory =
  | "Harapan & Cita-cita"
  | "Lepaskan Beban"
  | "Ide & Fantasi"
  | "Syukur Sederhana";

export type StarItem = {
  id: string;
  text: string;
  prompt?: string;
  category: StarCategory;
  mood: string;
  symbol: string;
  color: string;
  foldedAt: string;
  glowLevel: 1 | 2 | 3;
};

const STORAGE_KEY = "yourdream_stars_jar_v2";

const defaultStars: StarItem[] = [
  {
    id: "star-default-1",
    text: "Mengingatkan diri sendiri bahwa materi di tubuhku berasal dari debu bintang yang bertahan miliaran tahun. Hari ini terasa berat, tetapi aku dibangun untuk bertahan.",
    prompt: "Bintang atau harapan rahasia apa yang masih kamu rawat diam-diam?",
    category: "Harapan & Cita-cita",
    mood: "berharap",
    symbol: "✧",
    color: "#ffd97d",
    foldedAt: "2026-10-14T00:00:00.000Z",
    glowLevel: 3,
  },
  {
    id: "star-default-2",
    text: "Malam ini aku melepaskan cemas tentang rencana esok hari. Otakku butuh istirahat lelap malam ini agar logikaku kembali jernih besok pagi.",
    prompt: "Apa yang ingin kamu lepaskan malam ini agar punya ruang untuk hal baru?",
    category: "Lepaskan Beban",
    mood: "tenang",
    symbol: "☾",
    color: "#aed4f8",
    foldedAt: "2026-10-13T20:30:00.000Z",
    glowLevel: 2,
  },
  {
    id: "star-default-3",
    text: "Membayangkan sebuah rumah pohon kaca di tengah hutan pinus dengan rak buku tanpa batas dan teropong bintang besar di atapnya.",
    prompt: "Tempat seperti apa yang ingin kamu kunjungi dalam imajinasi malam ini?",
    category: "Ide & Fantasi",
    mood: "campur",
    symbol: "◌",
    color: "#c8b6ff",
    foldedAt: "2026-10-12T21:45:00.000Z",
    glowLevel: 2,
  },
  {
    id: "star-default-4",
    text: "Bersyukur atas secangkir teh hangat, keheningan kamar, dan satu hari lagi yang berhasil kulewati dengan tekad yang tetap utuh.",
    prompt: "Hal sederhana apa yang ingin kamu ingat dari hari ini?",
    category: "Syukur Sederhana",
    mood: "bersyukur",
    symbol: "✿",
    color: "#a7f3d0",
    foldedAt: "2026-10-11T19:15:00.000Z",
    glowLevel: 1,
  },
];

function loadStoredStars(): StarItem[] {
  if (typeof window === "undefined") return defaultStars;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check migration from v1 if exists
      const v1Raw = window.localStorage.getItem("yourdream_stars_jar_v1");
      if (v1Raw) {
        const parsedV1 = JSON.parse(v1Raw);
        if (Array.isArray(parsedV1) && parsedV1.length > 0) {
          return parsedV1.map((item: Record<string, unknown>) => ({
            ...(item as unknown as StarItem),
            category: (item.category as StarCategory) || "Harapan & Cita-cita",
            glowLevel: (item.glowLevel as 1 | 2 | 3) || 2,
          }));
        }
      }
      return defaultStars;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return defaultStars;
}

function persistStars(stars: StarItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stars));
  } catch {
    // ignore
  }
}

type StarsJarState = {
  stars: StarItem[];
  selectedStar: StarItem | null;
  isShaking: boolean;
  filterCategory: "Semua" | StarCategory;
  activeTab: "compose" | "jar" | "reminders";
  setActiveTab: (tab: "compose" | "jar" | "reminders") => void;
  setFilterCategory: (cat: "Semua" | StarCategory) => void;
  openStar: (star: StarItem | null) => void;
  foldStar: (
    text: string,
    category?: StarCategory,
    prompt?: string,
    mood?: string,
    glowLevel?: 1 | 2 | 3,
  ) => void;
  removeStar: (id: string) => void;
  shakeJar: () => void;
};

export const useStarsJarStore = create<StarsJarState>((set, get) => ({
  stars: loadStoredStars(),
  selectedStar: null,
  isShaking: false,
  filterCategory: "Semua",
  activeTab: "compose",

  setActiveTab: (tab) => set({ activeTab: tab }),

  setFilterCategory: (cat) => set({ filterCategory: cat }),

  openStar: (star) => set({ selectedStar: star }),

  foldStar: (
    text,
    category = "Harapan & Cita-cita",
    prompt,
    mood = "berharap",
    glowLevel = 2,
  ) => {
    let color = "#ffd97d";
    let symbol = "✧";

    switch (category) {
      case "Harapan & Cita-cita":
        color = "#ffd97d"; // Gold
        symbol = "✧";
        break;
      case "Lepaskan Beban":
        color = "#aed4f8"; // Cool sky blue
        symbol = "☾";
        break;
      case "Ide & Fantasi":
        color = "#c8b6ff"; // Lavender starlight
        symbol = "◌";
        break;
      case "Syukur Sederhana":
        color = "#a7f3d0"; // Mint emerald
        symbol = "✿";
        break;
    }

    const newStar: StarItem = {
      id: "star-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      text: text.trim(),
      prompt,
      category,
      mood,
      symbol,
      color,
      glowLevel,
      foldedAt: new Date().toISOString(),
    };

    const updated = [newStar, ...get().stars];
    persistStars(updated);
    set({ stars: updated });
  },

  removeStar: (id) => {
    const updated = get().stars.filter((s) => s.id !== id);
    persistStars(updated);
    set({
      stars: updated,
      selectedStar: get().selectedStar?.id === id ? null : get().selectedStar,
    });
  },

  shakeJar: () => {
    if (get().isShaking) return;
    set({ isShaking: true });
    window.setTimeout(() => {
      set({ isShaking: false });
    }, 900);
  },
}));
