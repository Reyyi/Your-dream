"use client";

import { useEffect, useState } from "react";
import {
  formatTime,
  getLocalTimeOfDay,
} from "@/lib/timeOfDay";
import { useTimeStore } from "@/lib/store";

const presets = [
  { label: "Fajar", time: 6 },
  { label: "Siang", time: 12 },
  { label: "Senja", time: 18 },
  { label: "Malam", time: 22 },
];

export function TimeControls() {
  const mode = useTimeStore((state) => state.mode);
  const targetTime = useTimeStore((state) => state.targetTimeOfDay);
  const setManualTime = useTimeStore((state) => state.setManualTime);
  const returnToRealTime = useTimeStore((state) => state.returnToRealTime);
  const [displayTime, setDisplayTime] = useState(12);

  useEffect(() => {
    let lastSyncedMinute = -1;
    const syncTime = () => {
      const now = new Date();
      const localTime = getLocalTimeOfDay(now);
      const store = useTimeStore.getState();
      if (store.mode === "real-time" && now.getMinutes() !== lastSyncedMinute) {
        store.syncRealTime(localTime);
        lastSyncedMinute = now.getMinutes();
      }
      setDisplayTime(
        store.getTimeOfDay(localTime, performance.now()),
      );
    };

    useTimeStore.getState().initializeRealTime(getLocalTimeOfDay());
    syncTime();

    const interval = window.setInterval(syncTime, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const sliderTime = mode === "manual" ? targetTime : displayTime;

  return (
    <section
      aria-label="Kontrol waktu langit"
      className="home-time-controls glass-panel relative z-30 mx-4 mb-4 mt-auto rounded-[1.4rem] px-5 py-5 sm:mx-auto sm:mb-8 sm:w-[min(38rem,calc(100vw-3rem))] sm:px-7 sm:py-6"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[0.58rem] uppercase tracking-[0.25em] text-white/60">
            waktu di langit
          </p>
          <p className="font-display text-[2rem] leading-none tabular-nums text-[#fff2dd]">
            {formatTime(displayTime)}
          </p>
        </div>
        <div className="mb-1 flex items-center gap-2 text-[0.65rem] text-white/70">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              mode === "real-time"
                ? "bg-[#b9d9bb] shadow-[0_0_9px_rgba(185,217,187,0.8)]"
                : "bg-[#f4c78e]"
            }`}
          />
          <span>{mode === "real-time" ? "waktu nyata" : "waktu pilihan"}</span>
        </div>
      </div>

      <div className="mt-5">
        <input
          aria-label="Atur waktu langit, 0 sampai 24 jam"
          className="time-slider block w-full cursor-pointer"
          max="24"
          min="0"
          onChange={(event) => setManualTime(Number(event.currentTarget.value))}
          step="0.05"
          type="range"
          value={sliderTime}
        />
        <div className="mt-2 flex justify-between text-[0.58rem] tabular-nums text-white/55">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              className={`rounded-full border px-3 py-1.5 text-[0.65rem] transition-colors ${
                mode === "manual" && Math.abs(targetTime - preset.time) < 0.1
                  ? "border-white/60 bg-white/15 text-white"
                  : "border-white/20 text-white/75 hover:border-white/45 hover:bg-white/10"
              }`}
              onClick={() => setManualTime(preset.time)}
              type="button"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="text-[0.62rem] text-white/45 transition-colors hover:text-amber-200"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("yourdream:shoot_star"));
            }}
            title="Saksikan sekelebat bintang jatuh melintasi langit"
            type="button"
          >
            bintang jatuh ☄
          </button>
          <button
            className="text-[0.62rem] text-white/45 transition-colors hover:text-white/80"
            onClick={() => {
              window.sessionStorage.removeItem("yourdream_intro_seen_v1");
              window.location.reload();
            }}
            title="Putar kembali animasi pembuka sinematik"
            type="button"
          >
            putar pembuka ↺
          </button>
          <button
            className="text-[0.65rem] text-white/65 underline decoration-white/35 underline-offset-4 transition-colors hover:text-white disabled:cursor-default disabled:opacity-40"
            disabled={mode === "real-time"}
            onClick={() => returnToRealTime(getLocalTimeOfDay())}
            type="button"
          >
            kembali ke waktu nyata
          </button>
        </div>
      </div>
    </section>
  );
}
