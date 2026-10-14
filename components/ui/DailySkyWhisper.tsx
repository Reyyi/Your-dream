"use client";

import { useEffect, useState } from "react";
import { soundscape } from "@/lib/soundscape";

const skyWhispers = [
  "Di bawah langit malam yang sama, beristirahatlah. Mimpimu tidak akan pergi ke mana-mana.",
  "Malam bukanlah pengingat tentang apa yang belum tercapai, melainkan ruang teduh untuk bernapas sejenak.",
  "Kecil atau besar, harapan yang kamu rawat hari ini adalah lentera yang menuntun esokmu.",
  "Bintang tidak bersinar untuk menyaingi bintang lain. Mereka hanya bersinar sebagaimana adanya.",
  "Jika hari ini terasa melelahkan, ketahuilah bahwa kelelahanmu berharga. Kamu sudah bertahan dengan sangat baik.",
  "Ada ketenangan yang menunggumu di balik helaan napas yang panjang.",
  "Ketika kamu merasa tersesat, ingatlah bahwa langit malam selalu tahu jalan pulang.",
  "Jangan takut pada gelap malam; di sanalah keajaiban bintang-bintang mulai terlihat.",
];

export function DailySkyWhisper() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    setIndex(dayOfYear % skyWhispers.length);
  }, []);

  const handleNext = () => {
    if (fading) return;
    setFading(true);
    soundscape.playStarFoldSound();
    window.setTimeout(() => {
      setIndex((prev) => (prev + 1) % skyWhispers.length);
      setFading(false);
    }, 200);
  };

  return (
    <div
      aria-label="Bisikan langit hari ini"
      className="max-w-[24rem] rounded-[1.3rem] border border-white/15 bg-slate-950/40 p-4 shadow-lg backdrop-blur-xl transition hover:border-white/25 sm:p-5"
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200/20 text-xs text-amber-200">
            ✧
          </span>
          <p className="text-[0.58rem] uppercase tracking-widest text-white/55">
            Bisikan Langit Hari Ini
          </p>
        </div>
        <button
          aria-label="Ganti bisikan langit"
          className="rounded-full px-2 py-0.5 text-[0.62rem] text-white/45 transition hover:bg-white/10 hover:text-white"
          onClick={handleNext}
          title="Ganti bisikan berikutnya"
          type="button"
        >
          berikutnya ↻
        </button>
      </div>

      <p
        className={`mt-3 font-display text-sm italic leading-relaxed text-[#fdf6e9] transition-opacity duration-300 sm:text-[0.98rem] ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        &ldquo;{skyWhispers[index]}&rdquo;
      </p>

      <p className="mt-2 text-right text-[0.58rem] tracking-wider text-white/40">
        Rayvelione
      </p>
    </div>
  );
}
