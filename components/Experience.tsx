"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { TimeControls } from "@/components/ui/TimeControls";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import { DailySkyWhisper } from "@/components/ui/DailySkyWhisper";
import { BirdsBackground } from "@/components/scene/BirdsBackground";
import { useZenStore } from "@/lib/zenStore";
import { ZenModeOverlay } from "@/components/ui/ZenModeOverlay";

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
  const isZenMode = useZenStore((state) => state.isZenMode);

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-clip bg-[#18233d]">
      <CinematicIntro onFinished={() => setIntroFinished(true)} />

      <div className="absolute inset-0">
        <SkyScene availableLayerIds={availableLayerIds} />
      </div>
      <BirdsBackground />
      <div
        aria-hidden="true"
        className="sky-grain pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(13,19,34,0.22)_0%,transparent_28%,transparent_62%,rgba(18,24,39,0.25)_100%)]" />

      <section
        className={`home-hero relative z-20 mx-6 w-[calc(100%-3rem)] max-w-[27rem] pb-8 transition-all duration-1000 ease-out sm:mx-10 sm:w-auto lg:ml-16 ${
          isZenMode
            ? "-translate-y-4 opacity-0 blur-sm pointer-events-none"
            : introFinished
            ? "translate-y-0 opacity-100 filter-none"
            : "translate-y-4 opacity-0 blur-sm pointer-events-none"
        }`}
      >
        <p className="mb-3 text-[0.62rem] uppercase tracking-[0.3em] text-white/70">
          tempat singgah untuk rehat sejenak
        </p>
        <h1 className="font-display text-6xl font-normal leading-[0.9] tracking-[-0.04em] text-[#fff5e6] sm:text-7xl lg:text-[6rem]">
          Your
          <br />
          Dream.
        </h1>
        <p className="home-hero-copy mt-5 max-w-[22rem] text-sm leading-6 text-white/80 sm:text-base">
          Tempat singgah untuk membaca cerita pendek, menyimpan catatan mimpi, atau sekadar menatap langit malam saat kamu butuh istirahat.
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

        <div className="home-hero-whisper mt-6">
          <DailySkyWhisper />
        </div>
      </section>

      <TimeControls />
      <ZenModeOverlay />
    </main>
  );
}
