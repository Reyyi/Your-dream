"use client";

import { useState } from "react";
import { useStarsJarStore } from "@/lib/starsJarStore";
import type { StarCategory } from "@/lib/starsJarStore";
import { soundscape } from "@/lib/soundscape";

const categories: {
  id: "Semua" | StarCategory;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "Semua",
    label: "Semua Bintang",
    icon: "⭐",
    desc: "Seluruh bintang yang pernah kamu titipkan di sini",
  },
  {
    id: "Harapan & Cita-cita",
    label: "Harapan",
    icon: "✧",
    desc: "Rencana dan mimpi kecil yang lagi kamu usahakan",
  },
  {
    id: "Lepaskan Beban",
    label: "Lepaskan",
    icon: "☾",
    desc: "Unek-unek dan rasa capek yang pengen kamu ikhlaskan malam ini",
  },
  {
    id: "Ide & Fantasi",
    label: "Ide & Fantasi",
    icon: "◌",
    desc: "Khayalan seru, pemikiran acak, atau imajinasi menyenangkan",
  },
  {
    id: "Syukur Sederhana",
    label: "Hal Kecil",
    icon: "✿",
    desc: "Hal-hal sepele yang sempat bikin kamu merasa bersyukur",
  },
];

export function ToplesBintang() {
  const {
    stars,
    selectedStar,
    isShaking,
    filterCategory,
    setFilterCategory,
    openStar,
    removeStar,
    shakeJar,
    foldStar,
    setActiveTab,
  } = useStarsJarStore();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [quickComposeOpen, setQuickComposeOpen] = useState(false);
  const [quickText, setQuickText] = useState("");
  const [quickCategory, setQuickCategory] = useState<StarCategory>(
    "Harapan & Cita-cita",
  );

  const handleShake = () => {
    shakeJar();
    soundscape.playJarGlassSound();
  };

  const handleOpenRandom = () => {
    if (stars.length === 0) return;
    const pool =
      filterCategory === "Semua"
        ? stars
        : stars.filter((s) => s.category === filterCategory);
    const targetPool = pool.length > 0 ? pool : stars;
    const random = targetPool[Math.floor(Math.random() * targetPool.length)];
    soundscape.playStarFoldSound();
    openStar(random);
  };

  const handleSaveQuickStar = () => {
    const trimmed = quickText.trim();
    if (!trimmed) return;
    foldStar(trimmed, quickCategory, undefined, "berharap", 2);
    soundscape.playStarFoldSound();
    setQuickText("");
    setQuickComposeOpen(false);
  };

  const visibleStars =
    filterCategory === "Semua"
      ? stars
      : stars.filter((s) => s.category === filterCategory);

  return (
    <div className="relative mt-8">
      {/* Toples Harapan Container */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Visual Glass Jar */}
        <div className="flex flex-col items-center justify-center lg:col-span-5">
          <div className="relative">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-t from-amber-300/20 via-sky-400/10 to-transparent blur-3xl" />

            {/* Glass Jar Body */}
            <div
              className={`relative flex h-84 w-64 flex-col items-center justify-between rounded-b-[3.8rem] rounded-t-[2rem] border border-white/30 bg-white/[0.04] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_0_35px_rgba(255,255,255,0.08)] backdrop-blur-md transition-transform duration-300 ${
                isShaking ? "animate-bounce" : "hover:scale-[1.02]"
              }`}
            >
              {/* Wooden Cork Lid */}
              <div className="relative -mt-6 flex h-7 w-32 items-center justify-center rounded-t-lg border border-amber-900/40 bg-gradient-to-r from-[#8a5d3b] via-[#a8744f] to-[#7c5030] shadow-md">
                <span className="text-[0.55rem] uppercase tracking-widest text-[#fdecd2]/70">
                  gabus toples
                </span>
              </div>

              {/* Jar Neck Ring */}
              <div className="h-3 w-48 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm" />

              {/* Inside the Glass Jar: Floating Origami Stars */}
              <div className="relative flex flex-1 w-full flex-wrap items-center justify-center content-center gap-2.5 overflow-hidden px-2 py-4">
                {stars.length === 0 ? (
                  <p className="text-center text-xs text-white/50 leading-relaxed">
                    Toplesmu masih kosong.
                    <br />
                    Tulis dan lipat bintang pertamamu!
                  </p>
                ) : (
                  stars.slice(0, 18).map((star, idx) => {
                    const delay = (idx % 6) * 0.35;
                    const glowSpread =
                      star.glowLevel === 3 ? "16px" : star.glowLevel === 2 ? "10px" : "6px";
                    return (
                      <button
                        key={star.id}
                        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-base shadow-sm transition-all duration-300 hover:scale-125 hover:border-white"
                        style={{
                          backgroundColor: `${star.color}30`,
                          borderColor: `${star.color}75`,
                          boxShadow: `0 0 ${glowSpread} ${star.color}50`,
                          animation: `pulse 3s ease-in-out ${delay}s infinite`,
                        }}
                        onClick={() => {
                          soundscape.playStarFoldSound();
                          openStar(star);
                        }}
                        title={`Buka lipatan: ${star.text.slice(0, 32)}...`}
                        type="button"
                      >
                        <span style={{ color: star.color }}>{star.symbol}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Base Label */}
              <div className="mb-2 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/50 px-3.5 py-1 text-[0.62rem] text-white/75 backdrop-blur-sm">
                <span>⭐</span>
                <span>{stars.length} Bintang di Dalam Toples</span>
              </div>
            </div>
          </div>

          {/* Interactive Jar Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              className="dream-button flex items-center gap-1.5"
              onClick={handleShake}
              type="button"
            >
              <span>Kocok Toples</span>
              <span>🔔</span>
            </button>
            <button
              className="dream-button dream-button-quiet flex items-center gap-1.5"
              disabled={stars.length === 0}
              onClick={handleOpenRandom}
              type="button"
            >
              <span>Buka Acak</span>
              <span>🎲</span>
            </button>
            <button
              className="dream-button border-amber-300/40 bg-amber-200/15 text-amber-100 hover:bg-amber-200/25 flex items-center gap-1.5"
              onClick={() => setQuickComposeOpen(true)}
              type="button"
            >
              <span>+ Lipat Bintang</span>
              <span>⭐</span>
            </button>
          </div>
        </div>

        {/* Right Column: Friendly Explanation & Star Archive */}
        <div className="lg:col-span-7">
          <div className="rounded-[1.6rem] border border-white/15 bg-slate-950/40 p-6 backdrop-blur-xl sm:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow text-amber-200/80">Wadah Penitipan Pikiran</p>
                <h3 className="mt-1 font-display text-2xl text-white sm:text-3xl">
                  Toples Bintang Pribadimu
                </h3>
              </div>
              <button
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 transition hover:bg-white/10 hover:text-white"
                onClick={() => setShowHowTo(!showHowTo)}
                type="button"
              >
                {showHowTo ? "Tutup Panduan ✕" : "Fungsi & Cara Pakai ?"}
              </button>
            </div>

            {/* How-To & Purpose Explanation Box */}
            {showHowTo ? (
              <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-200/5 p-4 text-xs leading-relaxed text-amber-100/90 sm:p-5">
                <p className="font-medium text-amber-200 text-sm">
                  💡 Fungsinya buat apa sih?
                </p>
                <p className="mt-1.5 text-white/80">
                  Pernah nggak sebelum tidur kepalamu terasa penuh banget? Ada
                  unek-unek yang bikin capek, ide liar yang sayang kalau hilang,
                  atau harapan yang belum sempat kamu ceritakan ke siapa-siapa.
                  Toples ini tempat penitipannya. Begitu kamu tulis dan lipat jadi
                  bintang, kepalamu boleh merasa lega dan istirahat.
                </p>

                <p className="mt-3 font-medium text-amber-200 text-sm">
                  ✍️ Cara pakainya gampang banget:
                </p>
                <ol className="mt-1.5 list-decimal list-inside space-y-1 text-white/80">
                  <li>
                    Klik tombol <strong>+ Lipat Bintang</strong> atau tulis di tab
                    Catatan Refleksi.
                  </li>
                  <li>
                    Pilih jenis bintangnya (misal: harapan, unek-unek yang pengen
                    dilepas, ide santai, atau rasa syukur).
                  </li>
                  <li>
                    Klik <strong>Lipat Jadi Bintang</strong>. Bintangmu bakal
                    masuk ke toples ini dan tersimpan privat di browsermu.
                  </li>
                  <li>
                    Kapan pun kamu butuh penyemangat atau pengen nostalgia, klik
                    bintangnya buat membuka kembali lipatan kertasnya.
                  </li>
                </ol>
              </div>
            ) : (
              <p className="mt-4 text-xs leading-relaxed text-white/75 sm:text-sm">
                Ini tempat naruh hal-hal yang bikin kepalamu penuh sebelum tidur.
                Daripada muter-muter terus di kepala atau hilang begitu saja,
                lipat jadi sebutir bintang dan titipkan di sini. Kamu bisa buka dan
                baca lagi kapan pun kamu butuh ketenangan.
              </p>
            )}

            {/* Category Filter Pills */}
            <div className="mt-6 flex flex-wrap gap-1.5 border-b border-white/10 pb-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                    filterCategory === cat.id
                      ? "border border-amber-300/40 bg-amber-200/15 text-amber-100 font-medium shadow-sm"
                      : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                  onClick={() => setFilterCategory(cat.id)}
                  type="button"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* List of Stars in Jar */}
            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {visibleStars.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40">
                  <p>Belum ada bintang untuk kategori ini.</p>
                  <button
                    className="mt-2 text-amber-200 underline underline-offset-4 hover:text-white"
                    onClick={() => setQuickComposeOpen(true)}
                    type="button"
                  >
                    Tulis bintang pertama kategori ini ➔
                  </button>
                </div>
              ) : (
                visibleStars.map((star) => (
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
                        <div className="flex items-center gap-2">
                          <span className="rounded px-1.5 py-0.2 text-[0.58rem] border border-white/15 bg-white/5 text-white/60">
                            {star.category}
                          </span>
                          <span className="text-[0.58rem] text-white/40">
                            {new Intl.DateTimeFormat("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(star.foldedAt))}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-medium text-white/90">
                          {star.text}
                        </p>
                      </div>
                    </button>

                    <button
                      className="shrink-0 p-1.5 text-xs text-amber-200/80 transition hover:text-amber-100"
                      onClick={() => {
                        soundscape.playStarFoldSound();
                        openStar(star);
                      }}
                      title="Buka lipatan bintang"
                      type="button"
                    >
                      Buka ↗
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Star Composer Modal (Right inside Jar Tab) */}
      {quickComposeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/70 animate-in fade-in duration-300"
          onClick={() => setQuickComposeOpen(false)}
          role="presentation"
        >
          <div
            aria-labelledby="quick-title"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-[2rem] border border-amber-300/30 bg-slate-950/90 p-6 text-white shadow-2xl backdrop-blur-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow text-amber-200">Titipkan Pikiranmu</p>
                <h3 className="mt-1 font-display text-2xl" id="quick-title">
                  Lipat Bintang Baru
                </h3>
              </div>
              <button
                aria-label="Tutup"
                className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                onClick={() => setQuickComposeOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[0.62rem] uppercase tracking-wider text-white/50">
                Pilih jenis bintangnya:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "Harapan & Cita-cita",
                    label: "Harapan",
                    icon: "✧",
                  },
                  {
                    id: "Lepaskan Beban",
                    label: "Lepaskan Beban",
                    icon: "☾",
                  },
                  {
                    id: "Ide & Fantasi",
                    label: "Ide Fantasi",
                    icon: "◌",
                  },
                  {
                    id: "Syukur Sederhana",
                    label: "Hal Kecil",
                    icon: "✿",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs transition ${
                      quickCategory === item.id
                        ? "border-amber-300/50 bg-amber-200/15 text-amber-100 font-medium"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                    }`}
                    onClick={() => setQuickCategory(item.id as StarCategory)}
                    type="button"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-[0.62rem] uppercase tracking-wider text-white/50">
                Tulis bebas apa yang ada di pikiranmu:
              </span>
              <textarea
                className="journal-input"
                maxLength={2000}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Tulis 1 kalimat atau unek-unek santai saja..."
                rows={4}
                value={quickText}
              />
            </label>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <button
                className="text-xs text-white/50 hover:text-white"
                onClick={() => {
                  setQuickComposeOpen(false);
                  setActiveTab("compose");
                }}
                type="button"
              >
                Ke Lembar Refleksi Lengkap ➔
              </button>

              <button
                className="flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-200/20 px-5 py-2.5 text-xs font-medium text-amber-100 shadow-[0_0_15px_rgba(255,220,140,0.2)] transition hover:bg-amber-200/30 disabled:opacity-40"
                disabled={!quickText.trim()}
                onClick={handleSaveQuickStar}
                type="button"
              >
                <span>Lipat &amp; Masukkan ke Toples</span>
                <span>⭐</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
                    Lipatan Kertas Terbuka · {selectedStar.category}
                  </p>
                  <p className="font-display text-lg text-[#3a3026]">
                    Bintang Kertasmu
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
