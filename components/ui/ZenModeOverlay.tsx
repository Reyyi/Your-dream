"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useZenStore } from "@/lib/zenStore";

export function ZenModeOverlay() {
  const isZenMode = useZenStore((state) => state.isZenMode);
  const setZenMode = useZenStore((state) => state.setZenMode);

  const [timeText, setTimeText] = useState("");
  const [secondsText, setSecondsText] = useState("");
  const [dateText, setDateText] = useState("");
  const [showExitHint, setShowExitHint] = useState(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update real-time digital clock and Indonesian date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTimeText(`${hours}:${minutes}`);
      setSecondsText(seconds);

      const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
      ];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      setDateText(`${dayName}, ${now.getDate()} ${monthName} ${now.getFullYear()}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Enter Zen Mode with fullscreen
  const enterZen = useCallback(() => {
    setZenMode(true);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, [setZenMode]);

  // Exit Zen Mode
  const exitZen = useCallback(() => {
    setZenMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [setZenMode]);

  // Handle pointer activity to reveal and auto-hide exit control after 3s
  const handlePointerActivity = () => {
    if (!isZenMode) return;
    setShowExitHint(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowExitHint(false);
    }, 3000);
  };

  // Keyboard shortcut listener (Z to toggle, Esc to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (isZenMode) {
          exitZen();
        } else {
          enterZen();
        }
      } else if (e.key === "Escape" && isZenMode) {
        exitZen();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isZenMode) {
        setZenMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isZenMode, enterZen, exitZen, setZenMode]);

  return (
    <>
      {/* 1. Floating Trigger Button when UI is visible */}
      <div
        className={`fixed bottom-5 left-5 z-40 sm:bottom-7 sm:left-7 transition-all duration-1000 ease-in-out ${
          isZenMode
            ? "pointer-events-none translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={enterZen}
          aria-label="Nikmati Pemandangan"
          className="group flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/45 px-3.5 py-2 text-xs font-medium text-white/75 shadow-[0_0_20px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:border-amber-300/40 hover:bg-slate-900/75 hover:text-amber-200 hover:scale-105 active:scale-95"
          title="Nikmati Pemandangan (Tekan Z)"
        >
          <span className="text-sm text-amber-300/90 transition-transform duration-300 group-hover:rotate-12">
            🌙
          </span>
          <span className="tracking-wide">Nikmati Pemandangan</span>
          <span className="hidden rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[0.58rem] text-white/60 sm:inline-block">
            Z
          </span>
        </button>
      </div>

      {/* 2. Zen Mode Fullscreen Viewport Overlay */}
      <div
        onClick={exitZen}
        onMouseMove={handlePointerActivity}
        onTouchStart={handlePointerActivity}
        onTouchMove={handlePointerActivity}
        aria-hidden={!isZenMode}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 sm:p-12 transition-opacity duration-1000 ease-in-out cursor-default select-none ${
          isZenMode
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Top Floating Exit Button: Appears on cursor move / tap, auto-hides after 3s */}
        <div
          className={`flex w-full justify-center transition-all duration-500 ease-out ${
            showExitHint ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              exitZen();
            }}
            aria-label="Kembali ke Beranda"
            className="flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/60 px-4 py-1.5 text-[0.68rem] tracking-wider text-white/80 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-white/50 hover:bg-slate-900/90 hover:text-white hover:scale-105 active:scale-95"
          >
            <span>✕</span>
            <span>Kembali ke Beranda</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[0.55rem] text-white/50">ESC</span>
          </button>
        </div>

        {/* Minimalist Aesthetic Digital Clock in Center */}
        <div className="flex flex-col items-center justify-center text-center my-auto transition-transform duration-1000">
          <div className="flex items-baseline gap-2 font-display text-7xl font-extralight tracking-tight text-white/70 drop-shadow-[0_0_35px_rgba(255,245,230,0.18)] sm:text-9xl">
            <span>{timeText || "00:00"}</span>
            <span className="text-xl font-light text-white/35 sm:text-3xl font-sans tracking-normal">
              {secondsText}
            </span>
          </div>

          <p className="mt-3 text-xs uppercase tracking-[0.35em] text-white/45 sm:text-sm font-sans">
            {dateText}
          </p>

          <p className="mt-4 text-[0.65rem] tracking-[0.25em] text-white/30 italic">
            ruang hening untuk beristirahat
          </p>
        </div>

        {/* Bottom Subtle Hint */}
        <div
          className={`text-[0.6rem] uppercase tracking-[0.3em] text-white/25 transition-opacity duration-700 ${
            showExitHint ? "opacity-100" : "opacity-0"
          }`}
        >
          klik di mana saja untuk kembali
        </div>
      </div>
    </>
  );
}
