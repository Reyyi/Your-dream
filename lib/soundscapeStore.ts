"use client";

import { create } from "zustand";
import { soundscape } from "@/lib/soundscape";

export type PresetName = "off" | "rainy-night" | "mountain-breeze" | "camp-fire" | "deep-sleep";

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

export const useSoundscapeStore = create<SoundscapeState>((set, get) => ({
  isPlaying: false,
  masterVolume: 0.65,
  rainVolume: 0.45,
  windVolume: 0.35,
  cricketsVolume: 0.25,
  fireVolume: 0.0,
  currentPreset: "rainy-night",
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
  },

  setChannel: (channel, val) => {
    soundscape.setChannelVolume(channel, val);
    set({ [`${channel}Volume`]: val } as unknown as Partial<SoundscapeState>);
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
        rain = 0.1;
        wind = 0.25;
        crickets = 0.3;
        fire = 0.55;
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
  },
}));
