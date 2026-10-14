import { create } from "zustand";

export type WeatherMode = "clear" | "rain" | "fog" | "aurora";

export interface WeatherOption {
  id: WeatherMode;
  label: string;
  icon: string;
  description: string;
}

export const WEATHER_OPTIONS: WeatherOption[] = [
  {
    id: "clear",
    label: "Cerah Bintang",
    icon: "✧",
    description: "Langit malam jernih dengan jutaan kerlip bintang dan kilasan komet.",
  },
  {
    id: "rain",
    label: "Rintik Hujan",
    icon: "🌧️",
    description: "Gerimis lembut yang jatuh berirama membasahi padang rumput.",
  },
  {
    id: "fog",
    label: "Kabut Senyap",
    icon: "🌫️",
    description: "Arak-arakan kabut lembah yang melayang perlahan di antara bukit.",
  },
  {
    id: "aurora",
    label: "Tirai Aurora",
    icon: "✨",
    description: "Gelombang cahaya kosmik zamrud dan lembayung di langit kutub.",
  },
];

const STORAGE_KEY = "your-dream-weather-v1";

interface WeatherStore {
  weather: WeatherMode;
  setWeather: (weather: WeatherMode) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: "clear",
  setWeather: (weather) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, weather);
      }
    } catch {
      // Ignore storage errors
    }
    set({ weather });
  },
}));

// Hydrate on client side safely
if (typeof window !== "undefined") {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as WeatherMode | null;
    if (saved && ["clear", "rain", "fog", "aurora"].includes(saved)) {
      useWeatherStore.setState({ weather: saved });
    }
  } catch {
    // Ignore
  }
}
