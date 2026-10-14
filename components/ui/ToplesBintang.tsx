"use client";

import { useState } from "react";
import { useStarsJarStore } from "@/lib/starsJarStore";
import { soundscape } from "@/lib/soundscape";

export function ToplesBintang() {
  const { stars, selectedStar, isShaking, openStar, removeStar, shakeJar } =
    useStarsJarStore();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleShake = () => {
    shakeJar();
    soundscape.playJarGlassSound();
  };

  const handleOpenRandom = () => {
    if (stars.length === 0) return;
    const random = stars[Math.floor(Math.random() * stars.length)];
    soundscape.playStarFoldSound();
    openStar(random);
  };

  return (
    <div className="relative mt-8">
      {/* Toples Harapan Container */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Left Column: Visual Glass Jar */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="relative">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-t from-amber-300/20 via-sky-400/10 to-transparent blur-3xl" />

            {/* Glass Jar Body */}
            <div
              className={`relative flex h-80 w-60 flex-col items-center justify-between rounded-b-[3.5rem] rounded-t-[1.8rem] border border-white/30 bg-white/[0.04] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_0_30px_rgba(255,255,255,0.08)] backdrop-blur-md transition-transform duration-300 ${
                isShaking ? "animate-bounce" : "hover:scale-[1.02]"
              }`}
            >
              {/* Wooden Cork Lid */}
              <div className="relative -mt-6 flex h-7 w-28 items-center justify-center rounded-t-lg border border-amber-900/40 bg-gradient-to-r from-[#8a5d3b] via-[#a8744f] to-[#7c5030] shadow-md">
                <span className="text-[0.55rem] uppercase tracking-widest text-[#fdecd2]/70">
                  gabus lilin
                </span>
              </div>

              {/* Jar Neck Ring */}
              <div className="h-3 w-44 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm" />

              {/* Inside the Glass Jar: Floating Origami Stars */}
              <div className="relative flex flex-1 w-full flex-wrap items-center justify-center content-center gap-2.5 overflow-hidden px-2 py-4">
                {stars.length === 0 ? (
                  <p className="text-center text-xs italic text-white/40">
                    Toples masih kosong...
                    <br />
                    Lipat mimpi pertamamu!
                  </p>
                ) : (
                  stars.slice(0, 16).map((star, idx) => {
                    const delay = (idx % 5) * 0.4;
                    return (
                      <button
                        key={star.id}
                        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-base shadow-sm transition-all duration-300 hover:scale-125 hover:border-white"
                        style={{
                          backgroundColor: `${star.color}25`,
                          borderColor: `${star.color}60`,
                          boxShadow: `0 0 12px ${star.color}40`,
                          animation: `pulse 3s ease-in-out ${delay}s infinite`,
                        }}
                        onClick={() => {
                          soundscape.playStarFoldSound();
                          openStar(star);
                        }}
                        title={`Buka lipatan: ${star.text.slice(0, 30)}...`}
                        type="button"
                      >
                        <span style={{ color: star.color }}>{star.symbol}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Base Label */}
              <div className="mb-2 flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/40 px-3 py-1 text-[0.62rem] text-white/70 backdrop-blur-sm">
                <span>⭐</span>
                <span>{stars.length} Bintang Terlipat</span>
              </div>
            </div>
          </div>

          {/* Interactive Jar Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              className="dream-button flex items-center gap-2"
              onClick={handleShake}
              type="button"
            >
              <span>Kocok Toples</span>
              <span>🔔</span>
            </button>
            <button
              className="dream-button dream-button-quiet flex items-center gap-2"
              disabled={stars.length === 0}
              onClick={handleOpenRandom}
              type="button"
            >
              <span>Buka Bintang Acak</span>
              <span>🎲</span>
            </button>
          </div>
        </div>

        {/* Right Column: Information & Star Archive List */}
        <div className="lg:col-span-7">
          <div className="rounded-[1.6rem] border border-white/15 bg-slate-950/40 p-6 backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow">Penyimpan Rahasia & Harapan</p>
                <h3 className="mt-1 font-display text-2xl text-white sm:text-3xl">
                  Toples Bintang Kaca
                </h3>
              </div>
              <span className="rounded-full border border-amber-300/30 bg-amber-200/10 px-3 py-1 text-xs text-amber-200">
                Pribadi & Tersimpan di Browser
              </span>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-white/70 sm:text-sm">
              Di masa lampau, orang-orang melipat seribu bintang kertas untuk
              menjaga doa tetap hidup. Setiap kali hatimu gundah atau memiliki
              harapan rahasia, tuliskan dan lipat menjadi bintang. Di dalam
              toples ini, mimpimu terjaga aman tanpa dihakimi oleh siapa pun.
            </p>

            {/* List of Stars in Jar */}
            <div className="mt-6 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              <p className="text-[0.62rem] uppercase tracking-wider text-white/45">
                Koleksi Bintang di Dalam Toples
              </p>
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  <button
                    className="flex flex-1 items-center gap-3 text-left"
                    onClick={() => {
                      soundscape.playStarFoldSound();
                      openStar(star);
                    }}
                    type="button"
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-sm"
                      style={{
                        backgroundColor: `${star.color}25`,
                        color: star.color,
                      }}
                    >
                      {star.symbol}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white/90">
                        {star.text}
                      </p>
                      <p className="text-[0.58rem] text-white/40">
                        Dilipat pada{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(star.foldedAt))}
                      </p>
                    </div>
                  </button>

                  <button
                    className="shrink-0 p-1.5 text-xs text-white/35 transition hover:text-white/80"
                    onClick={() => {
                      soundscape.playStarFoldSound();
                      openStar(star);
                    }}
                    title="Buka lipatan kertas"
                    type="button"
                  >
                    Buka ↗
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Origami Paper Unfold Modal */}
      {selectedStar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-300"
          onClick={() => openStar(null)}
          role="presentation"
        >
          <div
            aria-labelledby="unfold-title"
            aria-modal="true"
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-amber-200/30 bg-[#f7f2e7] p-7 text-[#2c241e] shadow-2xl transition-all sm:p-9"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{
              backgroundImage:
                "radial-gradient(#d3c6ab 0.75px, transparent 0.75px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Header fold badge */}
            <div className="flex items-center justify-between border-b border-[#dfd4be] pb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-base shadow-sm"
                  style={{
                    backgroundColor: selectedStar.color,
                    color: "#fff",
                  }}
                >
                  {selectedStar.symbol}
                </span>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-wider text-[#82725e]">
                    Lembar Kertas Terbuka
                  </p>
                  <p className="font-display text-lg text-[#3a3026]">
                    Bintang Harapan
                  </p>
                </div>
              </div>
              <button
                aria-label="Tutup lipatan"
                className="rounded-full p-2 text-[#7c6f5e] transition hover:bg-[#eae1cd]"
                onClick={() => openStar(null)}
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Prompt context if available */}
            {selectedStar.prompt && (
              <div className="mt-4 rounded-xl border border-[#e4d8c2] bg-[#eee6d4]/60 p-3">
                <p className="text-[0.6rem] uppercase tracking-wider text-[#8a7a66]">
                  Pertanyaan Saat Menulis:
                </p>
                <p className="font-display text-sm italic text-[#4a3f33]">
                  &ldquo;{selectedStar.prompt}&rdquo;
                </p>
              </div>
            )}

            {/* Core Message Body */}
            <div className="my-6">
              <p className="font-display text-xl leading-relaxed text-[#2c241e] sm:text-2xl">
                {selectedStar.text}
              </p>
            </div>

            {/* Footer metadata & delete */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dfd4be] pt-4 text-xs text-[#7e6f5c]">
              <p>
                Dilipat pada{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(selectedStar.foldedAt))}
              </p>

              <div className="flex items-center gap-2">
                {confirmDeleteId === selectedStar.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      className="rounded-full bg-rose-600 px-3 py-1 text-xs text-white transition hover:bg-rose-700"
                      onClick={() => {
                        removeStar(selectedStar.id);
                        setConfirmDeleteId(null);
                      }}
                      type="button"
                    >
                      Yakin Hapus
                    </button>
                    <button
                      className="rounded-full border border-[#b8ab96] px-2.5 py-1 text-xs text-[#5e5345]"
                      onClick={() => setConfirmDeleteId(null)}
                      type="button"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-rose-700 underline decoration-rose-300 underline-offset-4 hover:text-rose-900"
                    onClick={() => setConfirmDeleteId(selectedStar.id)}
                    type="button"
                  >
                    Lepaskan Bintang
                  </button>
                )}
                <button
                  className="rounded-full bg-[#42362b] px-4 py-1.5 text-xs text-[#fff6e6] transition hover:bg-[#2b221a]"
                  onClick={() => openStar(null)}
                  type="button"
                >
                  Lipat Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
