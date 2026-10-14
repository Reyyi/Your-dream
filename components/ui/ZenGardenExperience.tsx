"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { ZenSandCanvas } from "@/components/ui/ZenSandCanvas";
import { ShishiOdoshiFountain } from "@/components/ui/ShishiOdoshiFountain";
import { ZenStoneBalancePuzzle } from "@/components/ui/ZenStoneBalancePuzzle";
import { ZenEulerSandMandala } from "@/components/ui/ZenEulerSandMandala";
import { soundscape } from "@/lib/soundscape";

type ZenTab = "kanvas" | "keseimbangan" | "mandala" | "filosofi";

export function ZenGardenExperience() {
  const [activeTab, setActiveTab] = useState<ZenTab>("kanvas");
  const [isBellRinging, setIsBellRinging] = useState(false);

  const handleRingBell = () => {
    setIsBellRinging(true);
    soundscape.playZenSingingBowlSound(210);
    setTimeout(() => setIsBellRinging(false), 2400);
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-clip bg-[#0d131f] text-[#f5eee4]">
      {/* Background Natural Moss & Stone Mist Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(44,62,56,0.35)_0%,rgba(13,19,31,0.95)_70%,#090d16_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(163,230,53,0.02)_0%,transparent_30%,rgba(56,189,248,0.025)_100%)]"
      />

      <SiteHeader active="zen" />

      {/* Main Container */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8 sm:pt-36">
        {/* Hero Section */}
        <section className="mb-10 text-center sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-3.5 py-1 text-[0.65rem] font-medium tracking-[0.25em] text-emerald-200">
            <span>KARESANSUI NATURE SANCTUM</span>
            <span className="text-emerald-300">🎋</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#fbf6ed] sm:text-5xl lg:text-6xl">
            Taman Zen Karesansui
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Sebuah oase hening untuk menyisir pasir halus, melatih fokus pikiran lewat teka-teki gravitasi batu, dan mendengarkan ketukan bambu air yang mengembalikan ketenangan jiwamu.
          </p>

          {/* Quick Sound Bell & Ambient Indicator */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-4">
            <button
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md transition-all shadow-md ${
                isBellRinging
                  ? "border-amber-300 bg-amber-400/20 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105"
                  : "border-white/15 bg-white/[0.04] text-white/80 hover:border-amber-300/40 hover:text-amber-200"
              }`}
              onClick={handleRingBell}
              type="button"
            >
              <span>🔔</span>
              <span>Bunyikan Genta Mangkuk Tibet</span>
            </button>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Suasana: Rimba Bambu Tenang</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation Controls */}
        <div className="mb-8 flex justify-center">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto no-scrollbar rounded-full border border-white/15 bg-slate-950/45 p-1.5 shadow-xl backdrop-blur-xl">
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "kanvas"
                  ? "bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-emerald-400/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("kanvas");
              }}
              type="button"
            >
              🎋 Kanvas Pasir &amp; Bambu
            </button>
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "keseimbangan"
                  ? "bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-emerald-400/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("keseimbangan");
              }}
              type="button"
            >
              🪨 Teka-Teki Keseimbangan Batu
            </button>
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "mandala"
                  ? "bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-emerald-400/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("mandala");
              }}
              type="button"
            >
              🌸 Labirin Alur Satu Garis
            </button>
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "filosofi"
                  ? "bg-emerald-500/20 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)] border border-emerald-400/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("filosofi");
              }}
              type="button"
            >
              ◈ Filosofi Karesansui
            </button>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 1: KANVAS PASIR & PANCURAN BAMBU */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "kanvas" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main Sand Canvas (8 cols) */}
            <div className="lg:col-span-8">
              <ZenSandCanvas />
            </div>

            {/* Shishi-odoshi Bamboo Fountain (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ShishiOdoshiFountain />

              {/* Tranquil Instruction Card */}
              <div className="glass-panel rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-xs leading-relaxed text-white/70">
                <h4 className="font-semibold text-emerald-200 mb-1.5 flex items-center gap-1.5">
                  <span>🍃</span>
                  <span>Panduan Meditasi Karesansui</span>
                </h4>
                <p>
                  Gunakan garu 3 alur atau 5 alur untuk menyisir pasir mengikuti ritme napasmu yang perlahan. Letakkan batu kali di atas pasir untuk menyaksikan bagaimana riak air konsentris tercipta secara alami di sekelilingnya.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 2: TEKA-TEKI KESEIMBANGAN BATU GRAVITASI */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "keseimbangan" && (
          <div className="mx-auto max-w-4xl">
            <ZenStoneBalancePuzzle />
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 3: LABIRIN ALUR SATU GARIS MANDALA */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "mandala" && (
          <div className="mx-auto max-w-3xl">
            <ZenEulerSandMandala />
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 4: FILOSOFI KARESANSUI */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "filosofi" && (
          <div className="mx-auto max-w-4xl flex flex-col gap-8">
            <div className="glass-panel rounded-[2rem] border border-white/15 bg-slate-950/50 p-6 backdrop-blur-xl sm:p-10">
              <span className="text-[0.62rem] font-mono uppercase tracking-[0.25em] text-emerald-300">
                ESTETIKA KEHENINGAN JEPANG
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl text-[#fff8ee]">
                Karesansui: Menemukan Samudra dalam Sebutir Pasir
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                Karesansui (枯山水), yang secara harfiah bermakna &ldquo;pegunungan dan perairan kering&rdquo;, adalah bentuk seni pertamanan zen Jepang yang berkembang sejak abad pertengahan di kuil-kuil Kyoto. Tanpa setetes pun air nyata, taman ini menggunakan kerikil pasir putih halus untuk menggambarkan samudra luas dan bebatuan alami untuk menggambarkan pulau serta tebing pegunungan yang tabah.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-emerald-200 text-sm">
                    1. Samon: Alur Riak Air Pikiran
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Pola garis alur yang disisir pada pasir disebut samon (砂紋). Menyisir garis pasir menuntut kehadiran pikiran seutuhnya. Alur lengkung melambangkan ombak laut yang lembut, sementara garis lurus melambangkan aliran sungai yang tenang dan terarah.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-emerald-200 text-sm">
                    2. Shishi-odoshi: Jam Kesadaran Bambu
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Pancuran bambu air Shishi-odoshi awalnya diciptakan untuk menghalau hewan liar di kebun tanpa melukai mereka. Namun dalam tradisi zen, denting ketukan bambu pada batu berfungsi sebagai pengingat lembut (*mindfulness chime*) yang memanggil pikiran kembali ke saat ini.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-emerald-200 text-sm">
                    3. Keseimbangan Batu Gravitasi
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Menumpuk batu mengajarkan kita bahwa keseimbangan sejati tidak membutuhkan perekat atau paksaan, melainkan penemuan titik tumpu alami. Setiap batu yang diletakkan melatih kesabaran jemari dan kejernihan persepsi ruang.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-emerald-200 text-sm">
                    4. Keindahan Wabi-Sabi
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Filosofi wabi-sabi melihat keagungan dalam ketidaksempurnaan, lumut yang menempel di sela batu, dan bentuk alami yang tidak simetris. Seperti halnya hidup, ketenangan ditemukan saat kita menerima ketidakteraturan dengan hati yang lapang.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-center">
                <p className="font-display text-sm italic text-emerald-100 sm:text-base">
                  &ldquo;Di mana tidak ada air, di sanalah samudra paling tenang mengalir di dalam benakmu.&rdquo;
                </p>
                <p className="mt-2 text-[0.65rem] tracking-widest text-emerald-300/80 uppercase">
                  Pepatah Zen Karesansui
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
