"use client";

import { useEffect, useState } from "react";
import { soundscape } from "@/lib/soundscape";
import { useIntroStore } from "@/lib/introStore";

const STORAGE_KEY = "yourdream_intro_seen_v1";

export function CinematicIntro({ onFinished }: { onFinished?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setMounted(true);
    const seen = window.sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShouldShow(true);
      useIntroStore.getState().setIntroActive(true);
    } else {
      useIntroStore.getState().setIntroActive(false);
      onFinished?.();
    }
  }, [onFinished]);

  useEffect(() => {
    if (!shouldShow || exiting) return;

    // Progressive modern reveal stages
    const timer1 = window.setTimeout(() => setStage(1), 400);
    const timer2 = window.setTimeout(() => setStage(2), 1100);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [shouldShow, exiting]);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    useIntroStore.getState().setDreamTransitioning(true);

    try {
      soundscape.playStarFoldSound();
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore audio or storage exceptions
    }

    // Smooth dream world transition duration
    window.setTimeout(() => {
      setShouldShow(false);
      useIntroStore.getState().setIntroActive(false);
      useIntroStore.getState().setDreamTransitioning(false);
      onFinished?.();
    }, 1050);
  };

  if (!mounted || !shouldShow) return null;

  return (
    <div
      aria-label="Animasi pembuka Your Dream"
      className={`fixed inset-0 z-50 flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden bg-[#070b14] px-5 py-6 sm:px-12 sm:py-10 text-center select-none transition-all duration-1000 ease-out ${
        exiting
          ? "pointer-events-none scale-110 opacity-0 blur-md"
          : "scale-100 opacity-100"
      }`}
      role="dialog"
    >
      {/* Dynamic Dream World Portal Veil Overlay (Activates during transition) */}
      {exiting && (
        <div
          aria-hidden="true"
          className="dream-world-veil fixed inset-0 z-[60] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,248,225,0.75)_0%,rgba(168,85,247,0.35)_40%,rgba(11,16,29,0.95)_80%)]"
        />
      )}

      {/* Atmospheric Star Grain & Vignette */}
      <div
        aria-hidden="true"
        className="sky-grain pointer-events-none absolute inset-0 opacity-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(45,55,90,0.55)_0%,rgba(9,14,24,0.94)_65%,#050811_100%)]"
      />

      {/* Glowing Celestial Light Auras */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-amber-200/15 to-purple-500/15 blur-[120px] sm:h-[36rem] sm:w-[36rem]"
      />

      {/* Top Bar with Modern Discreet Skip Button */}
      <div className="relative z-10 flex w-full max-w-5xl items-center justify-end">
        <button
          aria-label="Lewati animasi pembuka"
          className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 text-[0.68rem] tracking-wider text-white/60 backdrop-blur-md transition-all hover:border-white/35 hover:bg-white/10 hover:text-white active:scale-95"
          onClick={handleEnter}
          type="button"
        >
          Lewati ↗
        </button>
      </div>

      {/* Center Cinematic Card & Orbital Starlight Nexus */}
      <div className="relative z-10 my-auto flex w-full max-w-lg flex-col items-center">
        {/* Modern Orbital Starlight Nexus */}
        <div
          className={`relative mb-6 flex h-24 w-24 items-center justify-center transition-all duration-1000 ease-out sm:h-28 sm:w-28 ${
            stage >= 0 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          {/* Outer Dashed Orbiting Ring */}
          <div
            aria-hidden="true"
            className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-amber-300/35"
          />

          {/* Counter-rotating Thin Ring with Micro Satellite */}
          <div
            aria-hidden="true"
            className="animate-spin-reverse-slow absolute -inset-2.5 rounded-full border border-white/10"
          >
            <span className="absolute top-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(255,229,178,0.9)]" />
          </div>

          {/* Pulse Ripple Wave */}
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-200/25 duration-1000" />

          {/* Core Glowing Sphere */}
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-amber-100/30 via-slate-900/80 to-purple-900/40 backdrop-blur-xl shadow-[0_0_40px_rgba(255,228,170,0.35)] sm:h-18 sm:w-18">
            <span className="font-serif text-2xl text-[#ffe3b0] drop-shadow-[0_0_14px_rgba(255,227,176,0.85)]">
              ✧
            </span>
          </div>
        </div>

        {/* Eyebrow Tag */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-400/[0.08] px-3.5 py-1 text-[0.62rem] font-medium tracking-[0.25em] text-amber-200 uppercase transition-all duration-1000 ease-out ${
            stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span>santai sejenak</span>
          <span className="text-amber-300">•</span>
          <span>selamat datang</span>
        </div>

        {/* Main Display Title */}
        <h1
          className={`mt-4 font-display text-[clamp(3.2rem,11vw,5.5rem)] font-normal leading-none tracking-[-0.04em] text-[#fff6e6] transition-all duration-1000 ease-out ${
            stage >= 1 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Your Dream
        </h1>

        {/* Grounded & Warm Message */}
        <p
          className={`mt-5 max-w-sm text-xs leading-relaxed text-white/75 sm:text-sm transition-all duration-1000 ease-out px-2 ${
            stage >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          &quot;Selamat datang. Luangkan waktu sejenak untuk santai, membaca cerita, atau sekadar melepas lelah.&quot;
        </p>

        {/* Interactive Dream Entrance CTA Button */}
        <div
          className={`mt-8 transition-all duration-1000 ease-out ${
            stage >= 2
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }`}
        >
          <button
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-amber-300/40 bg-gradient-to-r from-white/15 via-white/10 to-amber-200/15 px-8 py-3.5 text-xs font-medium tracking-wider text-white shadow-[0_0_25px_rgba(255,229,178,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-amber-300/70 hover:shadow-[0_0_35px_rgba(255,235,190,0.35)] active:scale-95"
            onClick={handleEnter}
            type="button"
          >
            <span className="font-medium text-[#fff6e6]">Masuk ke Beranda</span>
            <span
              aria-hidden="true"
              className="text-amber-200 transition-transform duration-300 group-hover:translate-x-1"
            >
              ↗
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        className={`relative z-10 transition-opacity duration-1000 ${
          stage >= 2 ? "opacity-45" : "opacity-0"
        }`}
      >
        <p className="text-[0.58rem] tracking-[0.2em] text-white/60 uppercase">
          klik atau ketuk untuk melanjutkan
        </p>
      </div>
    </div>
  );
}
