"use client";

import { useEffect, useMemo, useState } from "react";
import { GoldenRecordDisc } from "@/components/ui/GoldenRecordDisc";
import { CosmicTelemetryVisualizer } from "@/components/ui/CosmicTelemetryVisualizer";
import { CosmicOscilloscope } from "@/components/ui/CosmicOscilloscope";
import {
  CARRIER_FREQUENCIES,
  CATEGORY_METADATA,
  addTimeCapsule,
  deleteTimeCapsule,
  formatKm,
  loadTimeCapsules,
} from "@/lib/timeCapsuleStore";
import type { TimeCapsule, TimeCapsuleCategory } from "@/lib/timeCapsuleStore";
import { soundscape } from "@/lib/soundscape";

type TabMode = "peluncuran" | "radar" | "sains";

const lockOptions = [
  { id: "none", label: "Pengembaraan Abadi", desc: "Dapat dibaca kapan saja sepanjang waktu", days: 0 },
  { id: "30d", label: "Segel 30 Hari", desc: "Terkunci hingga satu bulan ke depan", days: 30 },
  { id: "100d", label: "Segel 100 Hari", desc: "Terkunci hingga seratus hari pengembaraan", days: 100 },
  { id: "365d", label: "Segel 1 Tahun", desc: "Terkunci hingga genap satu putaran orbit bumi", days: 365 },
];

export function TimeCapsuleExperience() {
  const [activeTab, setActiveTab] = useState<TabMode>("radar");
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [authorCode, setAuthorCode] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<TimeCapsuleCategory>("refleksi");
  const [frequency, setFrequency] = useState(432);
  const [lockChoice, setLockChoice] = useState("none");
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState<number | null>(null);

  // Golden Disc playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const loaded = loadTimeCapsules();
    setCapsules(loaded);
    if (loaded.length > 0) {
      setSelectedCapsule(loaded[0]);
    }
  }, []);

  const totalDistanceKm = useMemo(() => {
    return capsules.reduce((acc, c) => {
      const elapsedSec = Math.max(0, Date.now() - c.launchedAt) / 1000;
      const baseKm = c.isTribute ? 24500000000 : 0;
      return acc + (baseKm + elapsedSec * 17.0);
    }, 0);
  }, [capsules]);

  const handleLaunchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Launch sequence animation
    setIsLaunching(true);
    setLaunchCountdown(3);
    soundscape.playPulsarBeep(880);

    const timer1 = setTimeout(() => {
      setLaunchCountdown(2);
      soundscape.playPulsarBeep(1100);
    }, 900);

    const timer2 = setTimeout(() => {
      setLaunchCountdown(1);
      soundscape.playPulsarBeep(1320);
    }, 1800);

    const timer3 = setTimeout(() => {
      setLaunchCountdown(0);
      soundscape.playCapsuleLaunchSequence();

      let unlockAt: number | null = null;
      const choice = lockOptions.find((o) => o.id === lockChoice);
      if (choice && choice.days > 0) {
        unlockAt = Date.now() + choice.days * 24 * 60 * 60 * 1000;
      }

      const created = addTimeCapsule({
        title: title.trim(),
        authorCode: authorCode.trim() || `PENGEMBARA-${Math.floor(10 + Math.random() * 89)}`,
        content: content.trim(),
        category,
        carrierFrequency: frequency,
        unlockAt,
        goldenDiscGlyph: Math.floor(1 + Math.random() * 4),
      });

      const updated = loadTimeCapsules();
      setCapsules(updated);
      setSelectedCapsule(created);

      setTimeout(() => {
        setIsLaunching(false);
        setLaunchCountdown(null);
        setTitle("");
        setAuthorCode("");
        setContent("");
        setActiveTab("radar");
      }, 1400);
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus catatan kapsul waktu ini dari arsip lokasimu?")) {
      soundscape.playStarFoldSound();
      const updated = deleteTimeCapsule(id);
      setCapsules(updated);
      if (selectedCapsule?.id === id) {
        setSelectedCapsule(updated[0] || null);
      }
    }
  };

  const handleExportData = () => {
    soundscape.playPrismRotateSound();
    const blob = new Blob([JSON.stringify(capsules, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kapsul-waktu-yourdream-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Determine if a capsule is currently locked
  const isCapsuleLocked = (c: TimeCapsule) => {
    if (!c.unlockAt) return false;
    return Date.now() < c.unlockAt;
  };

  const getRemainingLockTime = (unlockAt: number) => {
    const diff = Math.max(0, unlockAt - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days} hari ${hours} jam ${minutes} menit`;
  };

  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-x-clip bg-[#090e1a] text-[#f5eee4]">
      {/* Background Starfield and Deep Space Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(38,49,82,0.45)_0%,rgba(9,14,26,0.95)_75%,#050811_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(251,191,36,0.025)_0%,transparent_35%,rgba(147,51,234,0.03)_100%)]"
      />

      {/* Main Container */}
      <div className="relative z-20 mx-auto w-full max-w-6xl px-5 pt-28 pb-20 sm:px-8 sm:pt-36">
        {/* Header Introduction */}
        <section className="mb-10 text-center sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/[0.08] px-3.5 py-1 text-[0.65rem] font-medium tracking-[0.25em] text-amber-200">
            <span>VOYAGER TELEMETRY BEACON</span>
            <span className="text-amber-300">✧</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#fff8ee] sm:text-5xl lg:text-6xl">
            Kapsul Waktu Antarbintang
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            Ruang sunyi untuk mengukir pesan, harapan, dan penemuan hidupmu ke dalam piringan emas kosmik, lalu melepaskannya mengembara melintasi samudra ruang hampa selamanya.
          </p>

          {/* Key Metric Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">
              <span className="text-white/50">Wahana Mengembara:</span>
              <span className="font-mono font-bold text-amber-300">{capsules.length} Kapsul</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">
              <span className="text-white/50">Total Jarak Tempuh:</span>
              <span className="font-mono font-bold text-purple-200">{formatKm(totalDistanceKm)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md">
              <span className="text-white/50">Kecepatan Jelajah:</span>
              <span className="font-mono text-white/90">17,0 km/detik</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation Controls */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border border-white/15 bg-slate-950/40 p-1.5 shadow-xl backdrop-blur-xl">
            <button
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "radar"
                  ? "bg-amber-400/20 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.25)] border border-amber-300/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("radar");
              }}
              type="button"
            >
              📡 Radar &amp; Arsip Kapsul
            </button>
            <button
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "peluncuran"
                  ? "bg-amber-400/20 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.25)] border border-amber-300/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("peluncuran");
              }}
              type="button"
            >
              🚀 Luncurkan Pesan Baru
            </button>
            <button
              className={`rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 ${
                activeTab === "sains"
                  ? "bg-amber-400/20 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.25)] border border-amber-300/30"
                  : "text-white/65 hover:text-white"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setActiveTab("sains");
              }}
              type="button"
            >
              ◈ Sains Piringan Emas
            </button>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 1: RADAR & ARSIP PENGEMBARA */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "radar" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Capsule Selector List (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <p className="text-[0.62rem] uppercase tracking-[0.25em] text-white/60">
                  Daftar Transmisi Aktif ({capsules.length})
                </p>
                <button
                  className="text-[0.62rem] text-amber-300/80 hover:text-amber-200 transition-colors underline underline-offset-4"
                  onClick={handleExportData}
                  type="button"
                >
                  Ekspor Arsip JSON ↗
                </button>
              </div>

              <div className="flex flex-col gap-3 max-h-[620px] overflow-y-auto pr-1">
                {capsules.map((item) => {
                  const isSelected = selectedCapsule?.id === item.id;
                  const meta = CATEGORY_METADATA[item.category];
                  const locked = isCapsuleLocked(item);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        soundscape.playPulsarBeep(item.carrierFrequency);
                        setSelectedCapsule(item);
                        setIsPlayingAudio(false);
                      }}
                      className={`group cursor-pointer rounded-2xl border p-4.5 transition-all duration-300 ${
                        isSelected
                          ? "border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-slate-900/60 to-purple-900/10 shadow-[0_0_20px_rgba(251,191,36,0.18)]"
                          : "border-white/10 bg-slate-950/40 hover:border-white/25 hover:bg-slate-950/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">
                            {meta.icon}
                          </span>
                          <span className="text-[0.6rem] uppercase tracking-widest text-white/55">
                            {meta.label}
                          </span>
                        </div>
                        {locked ? (
                          <span className="flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 text-[0.55rem] font-medium text-amber-200">
                            🔒 Terkunci
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[0.55rem] font-medium text-emerald-300">
                            ✓ Terbuka
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-sm font-semibold text-[#fff4e0] group-hover:text-amber-200 transition-colors">
                        {item.title}
                      </h3>

                      <p className="mt-1 font-mono text-[0.62rem] text-white/45">
                        ID: {item.authorCode} {" • "} RA {item.coordinates.ra}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[0.62rem] text-white/55">
                        <span>Frekuensi: {item.carrierFrequency} Hz</span>
                        <span className="text-amber-200/80">
                          {item.isTribute ? "Misi Bersejarah" : "Diluncurkan pengguna"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Capsule Telemetry & Golden Record Viewer (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {selectedCapsule ? (
                <>
                  {/* Real-time Telemetry Dashboard */}
                  <CosmicTelemetryVisualizer capsule={selectedCapsule} />

                  {/* Golden Record Player Card */}
                  <div className="glass-panel rounded-[1.6rem] border border-white/15 bg-slate-950/45 p-6 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                      {/* Interactive Canvas Disc */}
                      <GoldenRecordDisc
                        frequency={selectedCapsule.carrierFrequency}
                        glyphId={selectedCapsule.goldenDiscGlyph}
                        isPlaying={isPlayingAudio}
                        onTogglePlay={() => setIsPlayingAudio(!isPlayingAudio)}
                        size={210}
                      />

                      {/* Disc Controls & Metadata */}
                      <div className="flex flex-1 flex-col justify-center text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="text-[0.62rem] font-mono uppercase tracking-widest text-amber-300">
                            PIRINGAN EMAS KOSMIK
                          </span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[0.55rem] font-mono text-white/70">
                            33⅓ RPM
                          </span>
                        </div>

                        <h2 className="mt-2 font-display text-xl sm:text-2xl text-[#fff8ee]">
                          {selectedCapsule.title}
                        </h2>

                        <p className="mt-1 text-xs text-white/60">
                          Dikirim oleh <span className="font-semibold text-white/90">{selectedCapsule.authorCode}</span>
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                          <button
                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all shadow-lg ${
                              isPlayingAudio
                                ? "border-amber-300 bg-amber-400/25 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                            }`}
                            onClick={() => {
                              soundscape.playGoldenDiscScanSound(selectedCapsule.carrierFrequency);
                              setIsPlayingAudio(!isPlayingAudio);
                            }}
                            type="button"
                          >
                            <span>{isPlayingAudio ? "⏸ Jeda Pembacaan" : "▶ Putar Transmisi"}</span>
                          </button>

                          {!selectedCapsule.isTribute && (
                            <button
                              className="text-[0.65rem] text-rose-300/60 hover:text-rose-300 transition-colors"
                              onClick={() => handleDelete(selectedCapsule.id)}
                              type="button"
                            >
                              Hapus Kapsul
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Oscilloscope Waveform */}
                    <div className="mt-6">
                      <CosmicOscilloscope
                        frequency={selectedCapsule.carrierFrequency}
                        height={70}
                        isPlaying={isPlayingAudio}
                      />
                    </div>

                    {/* Capsule Message Text or Lock Notice */}
                    <div className="mt-6 border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between pb-3">
                        <p className="text-[0.62rem] uppercase tracking-widest text-white/50">
                          Transkrip Isi Pesan Antarbintang
                        </p>
                        <span className="font-mono text-[0.6rem] text-amber-200/60">
                          Format: Analog Audio Matrix
                        </span>
                      </div>

                      {isCapsuleLocked(selectedCapsule) ? (
                        <div className="rounded-2xl border border-amber-300/25 bg-amber-950/20 p-5 text-center">
                          <span className="text-2xl">🔒</span>
                          <h4 className="mt-2 text-sm font-semibold text-amber-200">
                            Transmisi Terkunci dalam Segel Waktu
                          </h4>
                          <p className="mt-1 text-xs text-white/70">
                            Pesan ini dienkripsi dan baru dapat dibaca secara terbuka setelah:
                          </p>
                          <p className="mt-3 font-mono text-base font-bold text-amber-300">
                            {getRemainingLockTime(selectedCapsule.unlockAt!)}
                          </p>
                          <p className="mt-2 text-[0.65rem] text-white/50">
                            Kapsul tetap terbang di antariksa dan jarak telemetrinya dapat terus dipantau.
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                          <p className="font-display text-base italic leading-relaxed text-[#fbf4e8] sm:text-lg">
                            &ldquo;{selectedCapsule.content}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 p-8 text-center text-white/50">
                  <span className="text-3xl">🌌</span>
                  <p className="mt-3 text-sm">Pilih sebuah transmisi kapsul dari daftar di sebelah kiri.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 2: PELUNCURAN KAPSUL BARU */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "peluncuran" && (
          <div className="mx-auto max-w-3xl">
            <div className="glass-panel rounded-[2rem] border border-amber-400/25 bg-slate-950/60 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[0.62rem] font-mono uppercase tracking-[0.25em] text-amber-300">
                  MODUL PELUNCURAN WAHANA ANTARBINTANG
                </span>
                <h2 className="mt-1 font-display text-2xl text-[#fff8ee] sm:text-3xl">
                  Tuliskan Pesan Abadimu
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-white/70 sm:text-sm">
                  Apa yang ingin kamu titipkan pada kesunyian antariksa? Pesan ini akan disimpan ke dalam piringan emas dan mulai mengarungi alam semesta dengan kecepatan 17 km per detik.
                </p>
              </div>

              <form className="mt-6 flex flex-col gap-6" onSubmit={handleLaunchSubmit}>
                {/* Title & Author Code */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[0.68rem] uppercase tracking-wider text-white/60 mb-2">
                      Judul Transmisi
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber-300 focus:outline-none"
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Tentang Ketabahan Menatap Langit"
                      required
                      type="text"
                      value={title}
                    />
                  </div>

                  <div>
                    <label className="block text-[0.68rem] uppercase tracking-wider text-white/60 mb-2">
                      Nama atau Kode Sandi Penjelajah
                    </label>
                    <input
                      className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-amber-300 focus:outline-none"
                      onChange={(e) => setAuthorCode(e.target.value)}
                      placeholder="Contoh: PENGEMBARA-09 atau Namamu"
                      type="text"
                      value={authorCode}
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-[0.68rem] uppercase tracking-wider text-white/60 mb-2.5">
                    Kategori Telemetri Kapsul
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {(Object.keys(CATEGORY_METADATA) as TimeCapsuleCategory[]).map((cat) => {
                      const meta = CATEGORY_METADATA[cat];
                      const isSelected = category === cat;
                      return (
                        <button
                          key={cat}
                          className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                            isSelected
                              ? "border-amber-300/60 bg-amber-400/15 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)] scale-[1.02]"
                              : "border-white/10 bg-white/[0.025] text-white/65 hover:border-white/25 hover:text-white"
                          }`}
                          onClick={() => {
                            soundscape.playPrismRotateSound();
                            setCategory(cat);
                          }}
                          type="button"
                        >
                          <span className="text-base mb-1">{meta.icon}</span>
                          <span className="text-xs font-semibold">{meta.label}</span>
                          <span className="mt-1 text-[0.55rem] text-white/45 leading-tight">
                            {meta.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[0.68rem] uppercase tracking-wider text-white/60">
                      Pesan untuk Ruang Hampa &amp; Masa Depan
                    </label>
                    <span className="text-[0.6rem] text-amber-200/60">
                      Diukir ke dalam alur gelombang piringan emas
                    </span>
                  </div>
                  <textarea
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-sm leading-relaxed text-[#fff8ee] placeholder-white/30 focus:border-amber-300 focus:outline-none min-h-[140px]"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tuliskan mimpimu, rasa syukur atas napas hari ini, nasihat yang ingin kamu ingat sepuluh tahun lagi, atau kekagumanmu pada misteri semesta..."
                    required
                    value={content}
                  />
                </div>

                {/* Frequency & Lock Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Carrier Frequency */}
                  <div>
                    <label className="block text-[0.68rem] uppercase tracking-wider text-white/60 mb-2">
                      Frekuensi Pembawa Sinyal
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CARRIER_FREQUENCIES.map((f) => (
                        <button
                          key={f.freq}
                          className={`rounded-xl border p-2.5 text-left transition-all ${
                            frequency === f.freq
                              ? "border-amber-300 bg-amber-400/20 text-white shadow-md"
                              : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                          }`}
                          onClick={() => {
                            soundscape.playGoldenDiscScanSound(f.freq);
                            setFrequency(f.freq);
                          }}
                          type="button"
                        >
                          <p className="font-mono text-xs font-bold text-amber-200">{f.label}</p>
                          <p className="text-[0.6rem] text-white/50">{f.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temporal Lock Options */}
                  <div>
                    <label className="block text-[0.68rem] uppercase tracking-wider text-white/60 mb-2">
                      Segel Waktu Kapsul
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {lockOptions.map((opt) => (
                        <button
                          key={opt.id}
                          className={`rounded-xl border p-2.5 text-left transition-all ${
                            lockChoice === opt.id
                              ? "border-purple-300 bg-purple-500/20 text-white shadow-md"
                              : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
                          }`}
                          onClick={() => {
                            soundscape.playTemporalSealSound();
                            setLockChoice(opt.id);
                          }}
                          type="button"
                        >
                          <p className="text-xs font-bold text-purple-200">{opt.label}</p>
                          <p className="text-[0.6rem] text-white/50 leading-tight">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Launch Button */}
                <div className="mt-4 border-t border-white/10 pt-6">
                  <button
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-amber-300/50 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-8 py-3.5 text-sm font-semibold tracking-wider text-slate-950 shadow-[0_0_30px_rgba(251,191,36,0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(251,191,36,0.6)] active:scale-95 disabled:opacity-50"
                    disabled={isLaunching}
                    type="submit"
                  >
                    <span className="text-base">🚀</span>
                    <span>LEPASKAN KAPSUL KE ANTARANTARIKSA</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 3: SAINS PIRINGAN EMAS VOYAGER */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "sains" && (
          <div className="mx-auto max-w-4xl flex flex-col gap-8">
            <div className="glass-panel rounded-[2rem] border border-white/15 bg-slate-950/50 p-6 backdrop-blur-xl sm:p-10">
              <span className="text-[0.62rem] font-mono uppercase tracking-[0.25em] text-amber-300">
                HISTORIOGRAFI EKSPLORASI ANTARIKSA
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl text-[#fff8ee]">
                Piringan Emas Voyager: Surat dari Bumi untuk Masa Depan
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                Pada musim gugur tahun 1977, wahana antarbintang kembar Voyager 1 dan Voyager 2 diluncurkan oleh NASA. Di sisi luar lambung pesawat, para ilmuwan yang dipimpin oleh astronom Carl Sagan menyematkan sebuah piringan tembaga berlapis emas berdiameter 12 inci.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-amber-200 text-sm">
                    1. Mengapa Piringan Emas Bertahan Selamanya?
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Di ruang hampa antarbintang murni, tidak ada udara, air, maupun gesekan atmosfer yang dapat menyebabkan korosi. Piringan emas ini diperkirakan akan bertahan dalam kondisi utuh selama lebih dari 1 miliar tahun, melampaui usia peradaban bumi itu sendiri.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-amber-200 text-sm">
                    2. Bahasa Atom Hidrogen (1420 MHz)
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Alih-alih menggunakan bahasa manusia, waktu dan frekuensi piringan emas didefinisikan menggunakan transisi hiperfin atom hidrogen yang memancarkan radiasi pada gelombang 21 cm (1420 MHz). Atom hidrogen adalah unsur paling melimpah di alam semesta, menjadi jembatan sains universal.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-amber-200 text-sm">
                    3. Peta 14 Bintang Pulsar
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Garis-garis radiasi pada sampul piringan emas memetakan jarak matahari ke 14 bintang pulsar neutron yang berdenyut dengan ritme presisi tinggi, memungkinkan siapa pun yang menemukannya merekonstruksi koordinat asal bumi dalam skala galaksi.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <h4 className="font-semibold text-amber-200 text-sm">
                    4. Nilai Filosofis Kapsul Waktu
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Menuliskan pesan ke ruang antariksa bukan sekadar tentang apakah ada yang membacanya di seberang sana, melainkan tindakan refleksi mendalam tentang siapa diri kita saat ini, apa yang kita syukuri, dan harapan apa yang ingin kita rawat bagi masa depan.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-amber-300/30 bg-amber-500/10 p-5 text-center">
                <p className="font-display text-sm italic text-amber-100 sm:text-base">
                  &ldquo;Peluncuran kapsul ini ke ruang antarbintang adalah pernyataan penuh harapan tentang masa depan. Bahwa ada keindahan yang pernah hidup dan berani bermimpi.&rdquo;
                </p>
                <p className="mt-2 text-[0.65rem] tracking-widest text-amber-300/80 uppercase">
                  Pesan Kehormatan Voyager
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Launching Countdown Overlay Modal */}
      {isLaunching && launchCountdown !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
          role="dialog"
        >
          <div className="flex flex-col items-center justify-center text-center p-8">
            <span className="text-[0.65rem] font-mono uppercase tracking-[0.3em] text-amber-300">
              URUTAN PELUNCURAN ANTARBINTANG
            </span>

            {launchCountdown > 0 ? (
              <div className="mt-4 flex flex-col items-center">
                <span className="font-mono text-8xl font-black text-amber-400 drop-shadow-[0_0_35px_rgba(251,191,36,0.8)] animate-pulse">
                  {launchCountdown}
                </span>
                <p className="mt-4 text-xs font-mono text-white/60">
                  Menginisialisasi Piringan Emas &amp; Menyelaraskan Koordinat...
                </p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center">
                <span className="font-mono text-5xl font-black text-emerald-300 drop-shadow-[0_0_35px_rgba(52,211,153,0.8)] animate-bounce">
                  MENEMBUS ANGKASA 🚀
                </span>
                <p className="mt-4 text-xs font-mono text-white/80">
                  Wahana berakselerasi ke kecepatan 17 km/detik. Transmisi dimulai.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
