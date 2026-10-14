"use client";

import { create } from "zustand";
import { soundscape } from "@/lib/soundscape";

export type PresetName = "off" | "rainy-night" | "mountain-breeze" | "camp-fire" | "deep-sleep";

const STORAGE_KEY = "yourdream_soundscape_v1";

interface SavedSettings {
  masterVolume: number;
  rainVolume: number;
  windVolume: number;
  cricketsVolume: number;
  fireVolume: number;
  currentPreset: PresetName;
}

const defaultSettings: SavedSettings = {
  masterVolume: 0.65,
  rainVolume: 0.45,
  windVolume: 0.35,
  cricketsVolume: 0.25,
  fireVolume: 0.0,
  currentPreset: "rainy-night",
};

function loadStoredSettings(): SavedSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      masterVolume: typeof parsed.masterVolume === "number" ? parsed.masterVolume : defaultSettings.masterVolume,
      rainVolume: typeof parsed.rainVolume === "number" ? parsed.rainVolume : defaultSettings.rainVolume,
      windVolume: typeof parsed.windVolume === "number" ? parsed.windVolume : defaultSettings.windVolume,
      cricketsVolume: typeof parsed.cricketsVolume === "number" ? parsed.cricketsVolume : defaultSettings.cricketsVolume,
      fireVolume: typeof parsed.fireVolume === "number" ? parsed.fireVolume : defaultSettings.fireVolume,
      currentPreset: parsed.currentPreset || defaultSettings.currentPreset,
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: SavedSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore error
  }
}

type SoundscapeState = {
  isPlaying: boolean;
  masterVolume: number;
  rainVolume: number;
  windVolume: number;
  cricketsVolume: number;
  fireVolume: number;
  currentPreset: PresetName;
  panelOpen: boolean;
  togglePanel: () => void;
  togglePlay: () => void;
  setMasterVolume: (val: number) => void;
  setChannel: (channel: "rain" | "wind" | "crickets" | "fire", val: number) => void;
  applyPreset: (preset: PresetName) => void;
};

const initial = loadStoredSettings();

export const useSoundscapeStore = create<SoundscapeState>((set, get) => ({
  isPlaying: false,
  masterVolume: initial.masterVolume,
  rainVolume: initial.rainVolume,
  windVolume: initial.windVolume,
  cricketsVolume: initial.cricketsVolume,
  fireVolume: initial.fireVolume,
  currentPreset: initial.currentPreset,
  panelOpen: false,

  togglePanel: () => set((state) => ({ panelOpen: !state.panelOpen })),

  togglePlay: () => {
    const nextState = !get().isPlaying;
    if (nextState) {
      soundscape.start();
      soundscape.setMasterVolume(get().masterVolume);
      soundscape.setChannelVolume("rain", get().rainVolume);
      soundscape.setChannelVolume("wind", get().windVolume);
      soundscape.setChannelVolume("crickets", get().cricketsVolume);
      soundscape.setChannelVolume("fire", get().fireVolume);
    } else {
      soundscape.stop();
    }
    set({ isPlaying: nextState });
  },

  setMasterVolume: (val: number) => {
    soundscape.setMasterVolume(val);
    set({ masterVolume: val });
    saveSettings({
      masterVolume: val,
      rainVolume: get().rainVolume,
      windVolume: get().windVolume,
      cricketsVolume: get().cricketsVolume,
      fireVolume: get().fireVolume,
      currentPreset: get().currentPreset,
    });
  },

  setChannel: (channel, val) => {
    soundscape.setChannelVolume(channel, val);
    const updated = { [`${channel}Volume`]: val } as unknown as Partial<SoundscapeState>;
    set(updated);
    saveSettings({
      masterVolume: get().masterVolume,
      rainVolume: channel === "rain" ? val : get().rainVolume,
      windVolume: channel === "wind" ? val : get().windVolume,
      cricketsVolume: channel === "crickets" ? val : get().cricketsVolume,
      fireVolume: channel === "fire" ? val : get().fireVolume,
      currentPreset: get().currentPreset,
    });
  },

  applyPreset: (preset: PresetName) => {
    let rain = 0;
    let wind = 0;
    let crickets = 0;
    let fire = 0;

    switch (preset) {
      case "rainy-night":
        rain = 0.6;
        wind = 0.3;
        crickets = 0.15;
        fire = 0.0;
        break;
      case "mountain-breeze":
        rain = 0.0;
        wind = 0.65;
        crickets = 0.35;
        fire = 0.0;
        break;
      case "camp-fire":
        rain = 0.08;
        wind = 0.2;
        crickets = 0.25;
        fire = 0.65;
        break;
      case "deep-sleep":
        rain = 0.4;
        wind = 0.4;
        crickets = 0.0;
        fire = 0.0;
        break;
      case "off":
        get().togglePlay();
        return;
    }

    soundscape.setChannelVolume("rain", rain);
    soundscape.setChannelVolume("wind", wind);
    soundscape.setChannelVolume("crickets", crickets);
    soundscape.setChannelVolume("fire", fire);

    if (!get().isPlaying) {
      soundscape.start();
      soundscape.setMasterVolume(get().masterVolume);
    }

    set({
      isPlaying: true,
      currentPreset: preset,
      rainVolume: rain,
      windVolume: wind,
      cricketsVolume: crickets,
      fireVolume: fire,
    });

    saveSettings({
      masterVolume: get().masterVolume,
      rainVolume: rain,
      windVolume: wind,
      cricketsVolume: crickets,
      fireVolume: fire,
      currentPreset: preset,
    });
  },
}));
