import { create } from "zustand";

type IntroStore = {
  isIntroActive: boolean;
  isDreamTransitioning: boolean;
  setIntroActive: (active: boolean) => void;
  setDreamTransitioning: (transitioning: boolean) => void;
};

export const useIntroStore = create<IntroStore>((set) => ({
  isIntroActive: true,
  isDreamTransitioning: false,
  setIntroActive: (active) => set({ isIntroActive: active }),
  setDreamTransitioning: (transitioning) => set({ isDreamTransitioning: transitioning }),
}));
