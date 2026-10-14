"use client";

import { useEffect, useState, useRef } from "react";
import { soundscape } from "@/lib/soundscape";
import { useTimeStore } from "@/lib/store";
import { getLocalTimeOfDay } from "@/lib/timeOfDay";

type TimeBracketId = "pagi" | "siang" | "senja" | "malam";

type TimeBracketData = {
  id: TimeBracketId;
  label: string;
  quotes: string[];
};

const TIME_WHISPERS: Record<TimeBracketId, TimeBracketData> = {
  pagi: {
    id: "pagi",
    label: "Bisikan Pagi",
    quotes: [
      "Matahari mulai naik. Bawa satu harapan kecilmu hari ini, pelan-pelan saja.",
      "Awali pagimu dengan tenang, tidak perlu terburu-buru mengejar dunia.",
      "Pagi hari selalu membawa lembaran baru yang bersih untuk melangkah kembali.",
    ],
  },
  siang: {
    id: "siang",
    label: "Bisikan Siang",
    quotes: [
      "Di tengah teriknya hari, jangan lupa ambil jeda untuk bernapas sejenak.",
      "Jika harimu terasa padat, beristirahat sejenak bukanlah tanda menyerah.",
      "Cukupkan sejenak kesibukanmu untuk meneguk air dan menenangkan pikiran.",
    ],
  },
  senja: {
    id: "senja",
    label: "Bisikan Senja",
    quotes: [
      "Langit mulai berganti warna. Terima kasih sudah bertahan sejauh ini hari ini.",
      "Senja mengingatkan bahwa setiap hari yang lelah pun bisa berakhir dengan indah.",
      "Lepaskan beban yang tidak perlu kamu bawa pulang ke waktu istirahatmu.",
    ],
  },
  malam: {
    id: "malam",
    label: "Bisikan Malam",
    quotes: [
      "Di bawah langit malam yang sama, beristirahatlah. Mimpimu tidak akan pergi ke mana-mana.",
      "Malam bukanlah pengingat tentang apa yang belum tercapai, melainkan ruang teduh untuk bernapas sejenak.",
      "Jika hari ini terasa melelahkan, ketahuilah bahwa kelelahanmu berharga. Kamu sudah bertahan dengan sangat baik.",
      "Istirahatkan pikiranmu malam ini, biarkan semesta yang menjaga rotasi bumi hingga fajar tiba.",
    ],
  },
};

function getTimeBracket(hour: number): TimeBracketData {
  const normalized = ((hour % 24) + 24) % 24;
  if (normalized >= 5 && normalized < 11) {
    return TIME_WHISPERS.pagi;
  }
  if (normalized >= 11 && normalized < 15) {
    return TIME_WHISPERS.siang;
  }
  if (normalized >= 15 && normalized < 19) {
    return TIME_WHISPERS.senja;
  }
  return TIME_WHISPERS.malam;
}

export function DailySkyWhisper() {
  const mode = useTimeStore((state) => state.mode);
  const targetTime = useTimeStore((state) => state.targetTimeOfDay);
  const [realTimeHour, setRealTimeHour] = useState<number>(() => getLocalTimeOfDay());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const updateRealTime = () => {
      setRealTimeHour(getLocalTimeOfDay());
    };
    updateRealTime();
    const interval = window.setInterval(updateRealTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const currentHour = mode === "manual" ? targetTime : realTimeHour;
  const bracket = getTimeBracket(currentHour);

  // Reset to primary quote when time bracket changes
  const prevBracketIdRef = useRef(bracket.id);
  useEffect(() => {
    if (prevBracketIdRef.current !== bracket.id) {
      prevBracketIdRef.current = bracket.id;
      setFading(true);
      const timer = window.setTimeout(() => {
        setQuoteIndex(0);
        setFading(false);
      }, 150);
      return () => window.clearTimeout(timer);
    }
  }, [bracket.id]);

  const handleNext = () => {
    if (fading) return;
    setFading(true);
    soundscape.playStarFoldSound();
    window.setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % bracket.quotes.length);
      setFading(false);
    }, 180);
  };

  const activeQuote = bracket.quotes[quoteIndex % bracket.quotes.length];

  return (
    <div
      aria-label="Bisikan langit hari ini"
      className="max-w-[24rem] rounded-[1.3rem] border border-white/20 bg-slate-950/40 p-4 shadow-xl backdrop-blur-xl transition hover:border-white/35 sm:p-5"
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
        &ldquo;{activeQuote}&rdquo;
      </p>

      <p className="mt-2 text-right text-[0.58rem] tracking-wider text-white/50 transition-all duration-300 font-medium">
        {bracket.label}
      </p>
    </div>
  );
}
