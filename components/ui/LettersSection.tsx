"use client";

import { useState } from "react";
import { reminders } from "@/lib/rayvelioneLetters";
import type { ReminderItem } from "@/lib/rayvelioneLetters";
import { soundscape } from "@/lib/soundscape";

export function LettersSection() {
  const [selectedReminder, setSelectedReminder] = useState<ReminderItem | null>(
    null,
  );
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleOpenReminder = (item: ReminderItem) => {
    setSelectedReminder(item);
    setCopiedQuote(false);
    soundscape.playStarFoldSound();
  };

  const handleOpenRandom = () => {
    const random = reminders[Math.floor(Math.random() * reminders.length)];
    handleOpenReminder(random);
  };

  const handleCopyQuote = (quote: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`"${quote}"`);
      setCopiedQuote(true);
      window.setTimeout(() => setCopiedQuote(false), 2000);
    }
  };

  const handleNextReminder = () => {
    if (!selectedReminder) return;
    const currentIndex = reminders.findIndex(
      (l) => l.id === selectedReminder.id,
    );
    const nextIndex = (currentIndex + 1) % reminders.length;
    handleOpenReminder(reminders[nextIndex]);
  };

  return (
    <div className="relative mt-8">
      {/* Top Banner with Daily Random Trigger */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-[1.6rem] border border-amber-300/20 bg-gradient-to-r from-amber-500/10 via-amber-200/[0.04] to-transparent p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="eyebrow text-amber-200/80">Sains, Fantasi, dan Ketenangan</p>
          <h2 className="mt-1 font-display text-2xl text-white sm:text-3xl">
            Lembar Pengingat
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-white/70 sm:text-sm">
            Kumpulan catatan hening tentang keajaiban alam semesta, logika kehidupan,
            dan ruang aman untuk imajinasimu. Ditulis langsung untuk menemanimu
            beristirahat malam ini.
          </p>
        </div>
        <button
          className="dream-button flex shrink-0 items-center gap-2 border-amber-300/40 bg-amber-200/15 text-amber-100 hover:border-amber-300/60"
          onClick={handleOpenRandom}
          type="button"
        >
          <span>Buka Pengingat untuk Malam Ini</span>
          <span>✦</span>
        </button>
      </div>

      {/* Reminders Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reminders.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col justify-between rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-lg transition-all duration-300 hover:border-amber-200/30 hover:bg-white/[0.06] hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.62rem] text-white/60">
                  {item.category}
                </span>
                <span className="text-[0.6rem] text-white/40">
                  {item.readTime} baca
                </span>
              </div>

              <h3 className="mt-3 font-display text-xl leading-snug text-[#fff4e3] transition group-hover:text-amber-100">
                {item.title}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-white/60">
                {item.subtitle}
              </p>

              {/* Gold Quote Highlight */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <p className="font-display text-xs italic leading-relaxed text-amber-200/80">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[0.65rem] text-white/40">Pengingat Malam</span>
              <button
                className="text-xs text-amber-200 underline decoration-amber-300/40 underline-offset-4 transition hover:text-white"
                onClick={() => handleOpenReminder(item)}
                type="button"
              >
                Buka Catatan ↗
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Parchment Reminder Reader Modal */}
      {selectedReminder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/75 animate-in fade-in duration-300"
          onClick={() => setSelectedReminder(null)}
          role="presentation"
        >
          <div
            aria-labelledby="reminder-modal-title"
            aria-modal="true"
            className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2.2rem] border border-amber-200/30 bg-[#f9f5ed] p-6 text-[#29221a] shadow-2xl transition-all sm:p-10"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{
              backgroundImage:
                "radial-gradient(#d6c9af 0.8px, transparent 0.8px)",
              backgroundSize: "22px 22px",
            }}
          >
            {/* Header: Astrolabe Emblem & Category */}
            <div className="flex items-center justify-between border-b border-[#ded3be] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2f3d54] via-[#1f293d] to-[#121927] text-xs font-serif text-[#ffd7a8] shadow-md border border-white/20">
                  ✧
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-[#847461]">
                    Lembar Pengingat · {selectedReminder.category}
                  </p>
                  <p className="text-xs text-[#6e5f4d]">
                    {selectedReminder.readTime} bacaan hening
                  </p>
                </div>
              </div>
              <button
                aria-label="Tutup catatan"
                className="rounded-full p-2 text-[#776856] transition hover:bg-[#eae0cc]"
                onClick={() => setSelectedReminder(null)}
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Reminder Title */}
            <div className="mt-7">
              <h2
                className="font-display text-3xl font-medium leading-tight text-[#2c231b] sm:text-4xl"
                id="reminder-modal-title"
              >
                {selectedReminder.title}
              </h2>
              <p className="mt-2 text-xs italic text-[#726351] sm:text-sm">
                {selectedReminder.subtitle}
              </p>
            </div>

            {/* Golden Quote Box */}
            <div className="my-6 rounded-2xl border border-[#decfae] bg-[#f2e9d2]/70 p-4 text-center sm:p-5">
              <p className="font-display text-base italic leading-relaxed text-[#514332] sm:text-lg">
                &ldquo;{selectedReminder.quote}&rdquo;
              </p>
              <button
                className="mt-3 text-[0.65rem] text-[#84735c] underline decoration-[#b09e86] underline-offset-4 transition hover:text-[#2c231b]"
                onClick={() => handleCopyQuote(selectedReminder.quote)}
                type="button"
              >
                {copiedQuote ? "✓ Kutipan Berhasil Disalin!" : "Salin Kutipan Ini"}
              </button>
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm leading-relaxed text-[#3a3026] sm:text-base sm:leading-8 font-serif">
              {selectedReminder.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-[#ded3be] pt-5 flex items-end justify-between">
              <div>
                <p className="font-display text-lg text-[#29221a]">
                  Catatan Ruang Tenang
                </p>
                <p className="text-[0.62rem] uppercase tracking-wider text-[#8b7a66]">
                  Ditulis untuk menemanimu malam ini
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-[#beb09a] px-3.5 py-1.5 text-xs text-[#4f4336] transition hover:bg-[#eee2ce]"
                  onClick={handleNextReminder}
                  type="button"
                >
                  Catatan Berikutnya ➔
                </button>
                <button
                  className="rounded-full bg-[#3a3026] px-4 py-1.5 text-xs text-[#faf3e6] transition hover:bg-[#251e18]"
                  onClick={() => setSelectedReminder(null)}
                  type="button"
                >
                  Selesai Membaca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
