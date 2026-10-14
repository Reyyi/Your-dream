"use client";

import { useEffect, useState } from "react";

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
    } else {
      onFinished?.();
    }
  }, [onFinished]);

  useEffect(() => {
    if (!shouldShow || exiting) return;

    // Sequence timing for stages:
    // Stage 0: Ethereal orb breathing
    // Stage 1: Whispered eyebrow and title emerge
    // Stage 2: Poetic quote and entrance button ready
    const timer1 = window.setTimeout(() => setStage(1), 500);
    const timer2 = window.setTimeout(() => setStage(2), 1400);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [shouldShow, exiting]);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors
    }

    window.setTimeout(() => {
      setShouldShow(false);
      onFinished?.();
    }, 950);
  };

  if (!mounted || !shouldShow) return null;

  return (
    <div
      aria-label="Animasi pembuka Your Dream"
      className={`fixed inset-0 z-50 flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden bg-[#0c1322] px-6 py-8 text-center transition-all duration-1000 ease-out sm:px-12 sm:py-12 ${
        exiting
          ? "pointer-events-none scale-105 opacity-0 blur-sm"
          : "opacity-100 scale-100"
      }`}
      role="dialog"
    >
      {/* Background cinematic vignette & star grains */}
      <div
        aria-hidden="true"
        className="sky-grain pointer-events-none absolute inset-0 opacity-25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(38,49,82,0.45)_0%,rgba(12,19,34,0.92)_70%,#090e1a_100%)]"
      />

      {/* Floating ambient glow orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-amber-200/10 to-purple-500/10 blur-[110px]"
      />

      {/* Top bar: discreet skip button */}
      <div className="relative z-10 flex w-full max-w-5xl items-center justify-end">
        <button
          aria-label="Lewati animasi pembuka"
          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-[0.68rem] tracking-wider text-white/60 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
          onClick={handleEnter}
          type="button"
        >
          Lewati ↗
        </button>
      </div>

      {/* Center cinematic emblem & title card */}
      <div className="relative z-10 flex my-auto w-full max-w-xl flex-col items-center">
        {/* Breathing celestial crest */}
        <div
          className={`relative mb-6 flex h-20 w-20 items-center justify-center transition-all duration-1000 ease-out sm:h-24 sm:w-24 ${
            stage >= 0 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          {/* Animated pulsing ripple rings */}
          <span className="absolute inset-0 animate-ping rounded-full border border-amber-200/25 duration-1000" />
          <span className="absolute -inset-2 rounded-full border border-white/10" />
          <span className="absolute -inset-5 rounded-full border border-white/5" />
          
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-amber-100/25 via-slate-900/60 to-purple-900/30 backdrop-blur-lg shadow-[0_0_35px_rgba(255,228,170,0.35)] sm:h-16 sm:w-16">
            <span className="text-xl text-[#ffe3b0] sm:text-2xl drop-shadow-[0_0_12px_rgba(255,227,176,0.8)]">
              ☾
            </span>
          </div>
        </div>

        {/* Whispered eyebrow */}
        <p
          className={`text-[0.65rem] uppercase tracking-[0.35em] text-amber-100/70 transition-all duration-1000 ease-out ${
            stage >= 1
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          pejamkan matamu sejenak · tarik napas perlahan
        </p>

        {/* Main Title */}
        <h1
          className={`mt-4 font-display text-[clamp(3.2rem,9vw,5.5rem)] font-normal leading-none tracking-[-0.04em] text-[#fff6e6] transition-all duration-1000 ease-out ${
            stage >= 1
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          Your Dream
        </h1>

        {/* Subtitle tag: by rayvelione */}
        <p
          className={`mt-2 text-[0.68rem] uppercase tracking-[0.3em] text-white/50 transition-all duration-1000 ease-out ${
            stage >= 1
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          by rayvelione
        </p>

        {/* Poetic quote */}
        <p
          className={`mt-6 max-w-md text-xs leading-relaxed text-white/65 sm:text-sm transition-all duration-1000 ease-out ${
            stage >= 2
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          “Di sini, waktu berjalan pelan agar mimpimu punya ruang untuk bernapas.”
        </p>

        {/* Enter CTA button */}
        <div
          className={`mt-8 transition-all duration-1000 ease-out ${
            stage >= 2
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-4 opacity-0 scale-95"
          }`}
        >
          <button
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/35 bg-white/10 px-7 py-3 text-xs tracking-wider text-white shadow-[0_0_25px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 hover:border-white/60 hover:bg-white/20 hover:shadow-[0_0_35px_rgba(255,235,190,0.3)] active:scale-95"
            onClick={handleEnter}
            type="button"
          >
            <span className="font-medium">Masuk ke Ruang Tenang</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              ↗
            </span>
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <div
        className={`relative z-10 transition-opacity duration-1000 ${
          stage >= 2 ? "opacity-40" : "opacity-0"
        }`}
      >
        <p className="text-[0.6rem] tracking-widest text-white/60">
          KETUK UNTUK MEMULAI PERJALANAN
        </p>
      </div>
    </div>
  );
}
