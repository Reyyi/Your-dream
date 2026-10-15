import { create } from "zustand";

interface ZenState {
  isZenMode: boolean;
  setZenMode: (active: boolean) => void;
  toggleZenMode: () => void;
}

export const useZenStore = create<ZenState>((set) => ({
  isZenMode: false,
  setZenMode: (active) => set({ isZenMode: active }),
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
}));
