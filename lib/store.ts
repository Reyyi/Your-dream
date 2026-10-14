import { create } from "zustand";

export type TimeMode = "real-time" | "manual";

type TimeStore = {
  timeOfDay: number;
  targetTimeOfDay: number;
  mode: TimeMode;
  transitionFrom: number;
  transitionTo: number;
  transitionStartedAt: number | null;
  transitionDurationMs: number;
  initializeRealTime: (hour: number) => void;
  syncRealTime: (hour: number) => void;
  setManualTime: (hour: number) => void;
  returnToRealTime: (hour: number) => void;
  getTimeOfDay: (wallClockHour: number, now?: number) => number;
};

function wrapHour(hour: number) {
  return ((hour % 24) + 24) % 24;
}

function interpolateHour(from: number, to: number, amount: number) {
  let difference = ((to - from + 36) % 24) - 12;
  if (difference === -12 && to - from > 0) difference = 12;
  return wrapHour(from + difference * amount);
}

const TRANSITION_DURATION_MS = 1400;

export const useTimeStore = create<TimeStore>((set, get) => ({
  timeOfDay: 12,
  targetTimeOfDay: 12,
  mode: "real-time",
  transitionFrom: 12,
  transitionTo: 12,
  transitionStartedAt: null,
  transitionDurationMs: TRANSITION_DURATION_MS,

  initializeRealTime: (hour) =>
    set({
      timeOfDay: hour,
      targetTimeOfDay: hour,
      mode: "real-time",
      transitionFrom: hour,
      transitionTo: hour,
      transitionStartedAt: null,
    }),

  syncRealTime: (hour) => {
    if (get().mode !== "real-time") return;
    set({
      timeOfDay: hour,
      targetTimeOfDay: hour,
      transitionFrom: hour,
      transitionTo: hour,
      transitionStartedAt: null,
    });
  },

  setManualTime: (hour) => {
    const now = performance.now();
    const current = get().getTimeOfDay(getLocalHour(), now);
    const target = wrapHour(hour);
    set({
      timeOfDay: target,
      targetTimeOfDay: hour,
      mode: "manual",
      transitionFrom: current,
      transitionTo: target,
      transitionStartedAt: now,
    });
  },

  returnToRealTime: (hour) => {
    const now = performance.now();
    const current = get().getTimeOfDay(getLocalHour(), now);
    set({
      timeOfDay: hour,
      targetTimeOfDay: hour,
      mode: "real-time",
      transitionFrom: current,
      transitionTo: hour,
      transitionStartedAt: now,
    });
  },

  getTimeOfDay: (wallClockHour, now = performance.now()) => {
    const state = get();
    const startedAt = state.transitionStartedAt;
    if (startedAt === null) {
      return state.mode === "real-time" ? wallClockHour : state.targetTimeOfDay;
    }

    const elapsed = Math.max(0, now - startedAt);
    if (elapsed >= state.transitionDurationMs) {
      return state.mode === "real-time" ? wallClockHour : state.transitionTo;
    }

    const linearProgress = elapsed / state.transitionDurationMs;
    const easedProgress =
      linearProgress * linearProgress * (3 - 2 * linearProgress);
    return interpolateHour(state.transitionFrom, state.transitionTo, easedProgress);
  },
}));

function getLocalHour() {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}
