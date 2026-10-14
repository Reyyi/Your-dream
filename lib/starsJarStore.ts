"use client";

import { create } from "zustand";

export type StarItem = {
  id: string;
  text: string;
  prompt?: string;
  mood: string;
  symbol: string;
  color: string;
  foldedAt: string;
};

const STORAGE_KEY = "yourdream_stars_jar_v1";

const defaultStars: StarItem[] = [
  {
    id: "star-default-1",
    text: "Aku ingin belajar mencintai proses, bukan hanya terburu-buru mengejar hasil. Menjadi lebih ramah pada diri sendiri.",
    prompt: "Bintang atau harapan rahasia apa yang masih kamu pandang diam-diam?",
    mood: "berharap",
    symbol: "✧",
    color: "#ffd97d", // golden starlight
    foldedAt: "2026-10-14T00:00:00.000Z",
  },
  {
    id: "star-default-2",
    text: "Malam ini aku melepaskan semua cemas tentang masa depan. Cukup bernapas dan percaya bahwa esok akan baik-baik saja.",
    prompt: "Jika malam ini kamu bisa beristirahat tanpa cemas, apa yang ingin kamu katakan pada dirimu?",
    mood: "tenang",
    symbol: "☾",
    color: "#aed4f8", // celestial blue
    foldedAt: "2026-10-13T20:30:00.000Z",
  },
  {
    id: "star-default-3",
    text: "Bersyukur atas secangkir teh hangat, keheningan kamar, dan satu hari lagi yang berhasil kulewati dengan selamat.",
    prompt: "Hal sederhana apa yang ingin kamu ingat dari hari ini?",
    mood: "bersyukur",
    symbol: "✿",
    color: "#fec7d7", // soft rose stardust
    foldedAt: "2026-10-12T21:45:00.000Z",
  },
];

function loadStoredStars(): StarItem[] {
  if (typeof window === "undefined") return defaultStars;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStars;
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
  activeTab: "compose" | "jar" | "letters";
  setActiveTab: (tab: "compose" | "jar" | "letters") => void;
  openStar: (star: StarItem | null) => void;
  foldStar: (text: string, prompt?: string, mood?: string) => void;
  removeStar: (id: string) => void;
  shakeJar: () => void;
};

export const useStarsJarStore = create<StarsJarState>((set, get) => ({
  stars: loadStoredStars(),
  selectedStar: null,
  isShaking: false,
  activeTab: "compose",

  setActiveTab: (tab) => set({ activeTab: tab }),

  openStar: (star) => set({ selectedStar: star }),

  foldStar: (text, prompt, mood = "berharap") => {
    let color = "#ffd97d";
    let symbol = "✧";

    switch (mood) {
      case "tenang":
        color = "#aed4f8";
        symbol = "☾";
        break;
      case "berharap":
        color = "#ffd97d";
        symbol = "✧";
        break;
      case "lelah":
        color = "#c8b6ff";
        symbol = "☁";
        break;
      case "bersyukur":
        color = "#fec7d7";
        symbol = "✿";
        break;
      case "campur":
        color = "#a7f3d0";
        symbol = "◌";
        break;
    }

    const newStar: StarItem = {
      id: "star-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      text: text.trim(),
      prompt,
      mood,
      symbol,
      color,
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
