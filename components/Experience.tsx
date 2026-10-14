"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { TimeControls } from "@/components/ui/TimeControls";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import { DailySkyWhisper } from "@/components/ui/DailySkyWhisper";

const SkyScene = dynamic(() => import("@/components/scene/SkyScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#18233d]" />,
});

export function Experience({
  availableLayerIds,
}: {
  availableLayerIds: string[];
}) {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-clip bg-[#18233d]">
      <CinematicIntro onFinished={() => setIntroFinished(true)} />

      <div className="absolute inset-0">
        <SkyScene availableLayerIds={availableLayerIds} />
      </div>
      <div
        aria-hidden="true"
        className="sky-grain pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(13,19,34,0.22)_0%,transparent_28%,transparent_62%,rgba(18,24,39,0.25)_100%)]" />

      <SiteHeader active="home" />

      <section
        className={`home-hero relative z-20 mx-6 w-[calc(100%-3rem)] max-w-[27rem] pb-8 transition-all duration-1000 ease-out sm:mx-10 sm:w-auto lg:ml-16 ${
          introFinished ? "translate-y-0 opacity-100" : "translate-y-3 opacity-90"
        }`}
      >
        <p className="mb-3 text-[0.62rem] uppercase tracking-[0.3em] text-white/70">
          tempat mimpi menemukan jalannya
        </p>
        <h1 className="font-display text-6xl font-normal leading-[0.9] tracking-[-0.04em] text-[#fff5e6] sm:text-7xl lg:text-[6rem]">
          Your
          <br />
          Dream.
        </h1>
        <p className="home-hero-copy mt-5 max-w-[22rem] text-sm leading-6 text-white/80 sm:text-base">
          Sebuah ruang tenang yang dirangkai untuk menjelajah kisah, merawat mimpi,
          dan menemukan keajaiban kecil di setiap langkah.
        </p>
        <div className="home-hero-actions mt-6 flex max-w-[28rem] flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            className="dream-home-primary"
            href="/perpustakaan"
          >
            <span>Buka sebuah buku</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <Link
            className="dream-home-secondary"
            href="/mini-games"
          >
            Jelajahi sebentar
          </Link>
          <Link className="dream-home-journal" href="/jurnal">
            Tulis mimpimu <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {/* Portal Khusus: Dunia Retro (Sisi Lain Alam Beranda) */}
        <div className="mt-5 max-w-[28rem]">
          <Link
            href="/dunia-retro"
            className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-950/50 via-slate-900/70 to-slate-950/60 p-3 sm:p-3.5 backdrop-blur-xl shadow-[0_4px_20px_rgba(245,158,11,0.2)] transition-all duration-300 hover:border-amber-400/80 hover:shadow-[0_4px_30px_rgba(245,158,11,0.35)] hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-400/50 bg-amber-950/80 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                <span className="font-mono text-xs font-bold">84</span>
              </span>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm sm:text-base font-semibold tracking-wide text-[#fff3db]">
                    Dunia Retro: Sisi Lain Alam Mimpi
                  </span>
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.2 text-[0.55rem] font-bold tracking-wider text-amber-300 border border-amber-400/40">
                    BARU
                  </span>
                </div>
                <span className="text-[0.68rem] text-white/70 line-clamp-1">
                  Laboratorium sains analog, kaset pita, gelombang radio, dan sandi logika
                </span>
              </div>
            </div>
            <span className="ml-2 text-amber-300 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="home-hero-whisper mt-6">
          <DailySkyWhisper />
        </div>
      </section>

      <TimeControls />
    </main>
  );
}
