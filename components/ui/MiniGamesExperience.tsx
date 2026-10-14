"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { soundscape } from "@/lib/soundscape";

type GameId =
  | "breathing"
  | "memory"
  | "constellation"
  | "chimes"
  | "lanterns"
  | "prism";

const games: {
  id: GameId;
  number: string;
  title: string;
  description: string;
  symbol: string;
}[] = [
  {
    id: "breathing",
    number: "01",
    title: "Napas Awan",
    description: "Ikuti irama pelan untuk memberi jeda pada pikiran.",
    symbol: "◉",
  },
  {
    id: "memory",
    number: "02",
    title: "Pasang Ingatan",
    description: "Temukan pasangan simbol dengan langkah sesedikit mungkin.",
    symbol: "✳",
  },
  {
    id: "constellation",
    number: "03",
    title: "Rasi Senyap",
    description: "Sambungkan bintang bernomor dan temukan bentuknya.",
    symbol: "✧",
  },
  {
    id: "chimes",
    number: "04",
    title: "Lonceng Angin",
    description: "Sentuh genta kristal untuk melantunkan nada lembut penenang pikiran.",
    symbol: "🎐",
  },
  {
    id: "lanterns",
    number: "05",
    title: "Lentera Malam",
    description: "Tuliskan harapan kecil, nyalakan lentera, dan biarkan terbang ke angkasa.",
    symbol: "🏮",
  },
  {
    id: "prism",
    number: "06",
    title: "Prisma Cahaya Bintang",
    description: "Atur sudut pantulan prisma untuk memandu berkas foton menyalakan mercusuar kosmik.",
    symbol: "⟡",
  },
];

export function MiniGamesExperience() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  return (
    <main className="dream-page min-h-screen overflow-hidden px-5 pb-20 pt-32 sm:px-10 lg:px-16">
      <div aria-hidden="true" className="dream-orb dream-orb-one" />
      <div aria-hidden="true" className="dream-orb dream-orb-two" />
      <SiteHeader active="games" />
      <section className="relative z-10 mx-auto max-w-6xl">
        <p className="eyebrow">bermain tanpa perlu terburu-buru</p>
        <div className="mt-4 max-w-3xl">
          <h1 className="font-display text-5xl leading-none tracking-[-0.035em] text-[#f7f0e7] sm:text-7xl">
            Ruang
            <span className="text-[#cbb9dd]"> bermain.</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Pengalaman kecil untuk menenangkan napas, melatih ingatan,
            melantunkan harmoni, atau menerbangkan harapan ke langit malam.
          </p>
        </div>

        {!activeGame ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <button
                key={game.id}
                className="game-card text-left"
                onClick={() => setActiveGame(game.id)}
                type="button"
              >
                <span className="flex items-start justify-between">
                  <span className="game-icon">{game.symbol}</span>
                  <span className="text-xs tracking-[0.22em] text-white/35">
                    {game.number}
                  </span>
                </span>
                <span className="mt-9 block font-display text-3xl text-white">
                  {game.title}
                </span>
                <span className="mt-3 block min-h-12 text-sm leading-6 text-white/55">
                  {game.description}
                </span>
                <span className="mt-7 inline-flex items-center gap-2 text-xs text-[#e7d6bd]">
                  Mulai bermain <span aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <section className="game-stage mt-9">
            <button
              className="mb-6 text-xs text-white/55 transition hover:text-white"
              onClick={() => setActiveGame(null)}
              type="button"
            >
              ← Kembali ke semua permainan
            </button>
            {activeGame === "breathing" && <BreathingGame />}
            {activeGame === "memory" && <MemoryGame />}
            {activeGame === "constellation" && <ConstellationGame />}
            {activeGame === "chimes" && <WindChimesGame />}
            {activeGame === "lanterns" && <LanternsGame />}
            {activeGame === "prism" && <PrismLightGame />}
          </section>
        )}
      </section>
    </main>
  );
}

function BreathingGame() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const updateElapsed = () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    };
    updateElapsed();
    const interval = window.setInterval(updateElapsed, 250);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  const step = elapsed % 12;
  const instruction =
    step < 4 ? "Tarik napas" : step < 6 ? "Tahan perlahan" : "Hembuskan";

  const toggle = () => {
    if (startedAt === null) {
      setStartedAt(Date.now() - elapsed * 1000);
    } else {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
      setStartedAt(null);
    }
  };

  const reset = () => {
    setStartedAt(null);
    setElapsed(0);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <p className="eyebrow">ikuti irama yang terasa nyaman</p>
      <div
        aria-label={startedAt === null ? "Jeda" : instruction}
        className={`breath-orb mt-8 ${startedAt !== null ? "breath-orb-active" : ""}`}
      >
        <span className="font-display text-xl text-white/90">
          {startedAt === null ? "pelan-pelan" : instruction}
        </span>
      </div>
      <p className="mt-7 max-w-md text-sm leading-6 text-white/55">
        Tidak ada target. Berhenti kapan saja, dan biarkan napas kembali ke
        ritmenya sendiri.
      </p>
      <div className="mt-6 flex gap-3">
        <button className="dream-button" onClick={toggle} type="button">
          {startedAt === null ? "Mulai" : "Jeda"}
        </button>
        <button className="dream-button dream-button-quiet" onClick={reset} type="button">
          Ulangi
        </button>
      </div>
    </div>
  );
}

type MemoryCard = {
  id: number;
  symbol: string;
  revealed: boolean;
  matched: boolean;
};

const memorySymbols = ["☾", "✿", "☁", "✦", "♧", "◌"];

function shuffledCards(): MemoryCard[] {
  const cards = [...memorySymbols, ...memorySymbols]
    .map((symbol, id) => ({ id, symbol, revealed: false, matched: false }));
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }
  return cards;
}

function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>(() =>
    memorySymbols.flatMap((symbol, index) => [
      { id: index * 2, symbol, revealed: false, matched: false },
      { id: index * 2 + 1, symbol, revealed: false, matched: false },
    ]),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const lock = useRef(false);
  const complete = cards.every((card) => card.matched);

  useEffect(() => {
    if (!started || complete) return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [complete, started]);

  useEffect(() => {
    if (selected.length !== 2) return;
    const [firstId, secondId] = selected;
    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);
    if (!first || !second) return;
    lock.current = true;
    const timeout = window.setTimeout(() => {
      if (first.symbol === second.symbol) {
        setCards((current) =>
          current.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, matched: true }
              : card,
          ),
        );
      } else {
        setCards((current) =>
          current.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, revealed: false }
              : card,
          ),
        );
      }
      setSelected([]);
      lock.current = false;
    }, first.symbol === second.symbol ? 350 : 850);
    return () => window.clearTimeout(timeout);
  }, [cards, selected]);

  const restart = () => {
    setCards(shuffledCards());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    lock.current = false;
  };

  const reveal = (card: MemoryCard) => {
    if (lock.current || card.revealed || card.matched) return;
    if (!started) setStarted(true);
    setCards((current) =>
      current.map((item) =>
        item.id === card.id ? { ...item, revealed: true } : item,
      ),
    );
    setSelected((current) => [...current, card.id]);
    if (selected.length === 1) setMoves((value) => value + 1);
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">temukan enam pasang simbol</p>
      <div className="mt-3 flex justify-center gap-6 text-xs text-white/55">
        <span>Langkah {moves}</span>
        <span>
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}
          :{(seconds % 60).toString().padStart(2, "0")}
        </span>
      </div>
      <div className="memory-grid mx-auto mt-6">
        {cards.map((card) => (
          <button
            key={card.id}
            aria-label={
              card.matched
                ? `Pasangan ${card.symbol}`
                : card.revealed
                  ? card.symbol
                  : "Kartu tertutup"
            }
            className={`memory-card ${
              card.revealed || card.matched ? "memory-card-open" : ""
            }`}
            disabled={card.matched}
            onClick={() => reveal(card)}
            type="button"
          >
            {card.revealed || card.matched ? card.symbol : "·"}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-5 min-h-6 text-sm text-[#e4d3bb]">
        {complete ? "Semua pasangan ditemukan. Bagus sekali." : "Pelan-pelan saja."}
      </p>
      <button className="dream-button dream-button-quiet mt-3" onClick={restart} type="button">
        Kocok ulang
      </button>
    </div>
  );
}

const constellationBoards = [
  { targets: [1, 4, 7, 9], hint: "Bentuk lengkung kecil di ufuk." },
  { targets: [0, 3, 6, 8], hint: "Garis miring yang mengarah pulang." },
  { targets: [2, 5, 7, 10], hint: "Sebuah jembatan di antara bintang." },
  { targets: [0, 1, 6, 9], hint: "Sayap layang-layang di langit utara." },
  { targets: [3, 4, 8, 10], hint: "Puncak mahkota sunyi penanda malam." },
  { targets: [2, 3, 7, 9], hint: "Sauh perahu di samudra rasi." },
];

const starPositions = [
  [12, 18],
  [28, 30],
  [48, 15],
  [70, 24],
  [86, 14],
  [20, 67],
  [40, 50],
  [60, 73],
  [78, 53],
  [34, 84],
  [88, 83],
];

function ConstellationGame() {
  const [round, setRound] = useState(0);
  const [connected, setConnected] = useState<number[]>([]);
  const [message, setMessage] = useState("Mulai dari bintang bernomor 1.");
  const target = constellationBoards[round % constellationBoards.length].targets;
  const complete = connected.length === target.length;

  const connect = (index: number) => {
    if (complete) return;
    if (index !== target[connected.length]) {
      setConnected([]);
      setMessage("Belum tepat. Coba lagi dari bintang pertama.");
      return;
    }
    const next = [...connected, index];
    setConnected(next);
    if (next.length === target.length) {
      setMessage("Rasi kecilmu sudah tersambung.");
    } else {
      setMessage(`Bagus. Cari bintang nomor ${next.length + 1}.`);
    }
  };

  const nextPattern = () => {
    setRound((value) => value + 1);
    setConnected([]);
    setMessage("Mulai dari bintang bernomor 1.");
  };

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">pola {round + 1} · {constellationBoards[round % constellationBoards.length].hint}</p>
      <p className="mt-3 text-sm text-white/55">
        Hubungkan empat bintang sesuai urutan angkanya.
      </p>
      <div className="constellation-board mx-auto mt-6">
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {connected.slice(1).map((starIndex, index) => {
            const from = starPositions[connected[index]];
            const to = starPositions[starIndex];
            return (
              <line
                key={`${connected[index]}-${starIndex}`}
                stroke="rgba(238, 218, 183, .72)"
                strokeWidth="0.55"
                x1={from[0]}
                x2={to[0]}
                y1={from[1]}
                y2={to[1]}
              />
            );
          })}
        </svg>
        {starPositions.map((position, index) => {
          const number = target.indexOf(index);
          const isConnected = connected.includes(index);
          return (
            <button
              key={index}
              aria-label={
                number >= 0
                  ? `Bintang ${number + 1}${isConnected ? ", tersambung" : ""}`
                  : "Bintang"
              }
              className={`constellation-star ${
                number >= 0 ? "constellation-star-target" : ""
              } ${isConnected ? "constellation-star-connected" : ""}`}
              onClick={() => connect(index)}
              style={{ left: `${position[0]}%`, top: `${position[1]}%` }}
              type="button"
            >
              {number >= 0 ? number + 1 : ""}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-5 min-h-6 text-sm text-[#e4d3bb]">
        {message}
      </p>
      {complete && (
        <button className="dream-button mt-3" onClick={nextPattern} type="button">
          Lihat pola berikutnya
        </button>
      )}
    </div>
  );
}

const chimeTones = [
  { id: "c4", label: "Fajar (C)", note: "Do", freq: 261.63, height: 180, hue: "from-amber-200/40 via-amber-300/20 to-slate-900/40", key: "1" },
  { id: "d4", label: "Embun (D)", note: "Re", freq: 293.66, height: 165, hue: "from-orange-200/40 via-amber-200/20 to-slate-900/40", key: "2" },
  { id: "e4", label: "Surya (E)", note: "Mi", freq: 329.63, height: 150, hue: "from-rose-200/40 via-pink-200/20 to-slate-900/40", key: "3" },
  { id: "g4", label: "Senja (G)", note: "Sol", freq: 392.00, height: 135, hue: "from-purple-200/40 via-indigo-200/20 to-slate-900/40", key: "4" },
  { id: "a4", label: "Bintang (A)", note: "La", freq: 440.00, height: 120, hue: "from-indigo-200/40 via-blue-200/20 to-slate-900/40", key: "5" },
  { id: "c5", label: "Malam (C5)", note: "Do Tinggi", freq: 523.25, height: 105, hue: "from-cyan-200/40 via-sky-200/20 to-slate-900/40", key: "6" },
];

function WindChimesGame() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [breezeMode, setBreezeMode] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => undefined);
      }
    };
  }, []);

  const strikeChime = useCallback((chime: typeof chimeTones[number]) => {
    setActiveNote(chime.id);
    window.setTimeout(() => {
      setActiveNote((curr) => (curr === chime.id ? null : curr));
    }, 600);

    if (muted) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => undefined);
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();
      const overtoneGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2600, now);

      osc.type = "sine";
      osc.frequency.setValueAtTime(chime.freq, now);

      overtone.type = "sine";
      overtone.frequency.setValueAtTime(chime.freq * 2.76, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      overtoneGain.gain.setValueAtTime(0, now);
      overtoneGain.gain.linearRampToValueAtTime(0.07, now + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(filter);
      overtoneGain.connect(filter);
      filter.connect(ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 2.6);
      overtone.stop(now + 2.6);
    } catch {
      // Audio fallback jika autoplay dibatasi browser
    }
  }, [muted]);

  useEffect(() => {
    if (!breezeMode) return;
    const interval = window.setInterval(() => {
      const randomChime = chimeTones[Math.floor(Math.random() * chimeTones.length)];
      strikeChime(randomChime);
    }, 2400);
    return () => window.clearInterval(interval);
  }, [breezeMode, strikeChime]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const matched = chimeTones.find((item) => item.key === e.key);
      if (matched) strikeChime(matched);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [strikeChime]);

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">harmoni nada kristal & ketenangan</p>
      <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">Lonceng Angin</h2>
      <p className="mt-2 text-sm text-white/55">
        Sentuh atau klik genta untuk melantunkan nada lembut, atau gunakan tombol angka keyboard (1–6).
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          className={`rounded-full border px-4 py-1.5 text-xs transition ${
            breezeMode
              ? "border-amber-300/60 bg-amber-200/15 text-amber-100"
              : "border-white/20 text-white/70 hover:border-white/40 hover:bg-white/10"
          }`}
          onClick={() => setBreezeMode(!breezeMode)}
          type="button"
        >
          {breezeMode ? "🎐 Semilir Angin: Aktif" : "🎐 Nyalakan Semilir Angin"}
        </button>
        <button
          className="rounded-full border border-white/20 px-4 py-1.5 text-xs text-white/70 transition hover:border-white/40 hover:bg-white/10"
          onClick={() => setMuted(!muted)}
          type="button"
        >
          {muted ? "Suara: Senyap (Mute)" : "Suara: Aktif ♫"}
        </button>
      </div>

      <div className="relative mx-auto mt-9 flex min-h-[340px] max-w-xl flex-col items-center justify-start rounded-3xl border border-white/10 bg-slate-950/35 p-6 backdrop-blur-md">
        {/* Wooden bar */}
        <div className="h-3 w-4/5 rounded-full bg-gradient-to-r from-amber-900/60 via-amber-700/80 to-amber-900/60 shadow-lg" />

        {/* Chime bars */}
        <div className="mt-2 flex w-full justify-around px-2 sm:px-6">
          {chimeTones.map((chime) => {
            const isActive = activeNote === chime.id;
            return (
              <button
                key={chime.id}
                aria-label={`Bunyikan genta ${chime.label}`}
                className="group flex flex-col items-center transition-transform focus:outline-none"
                onClick={() => strikeChime(chime)}
                type="button"
              >
                <div className="h-10 w-[1.5px] bg-white/35 transition-colors group-hover:bg-white/80" />
                <div
                  className={`relative flex flex-col justify-end items-center rounded-full border border-white/30 bg-gradient-to-b ${chime.hue} p-1 shadow-md transition-all duration-300 ${
                    isActive
                      ? "-rotate-3 scale-105 border-white shadow-[0_0_24px_rgba(255,235,180,0.7)]"
                      : "group-hover:border-white/60"
                  }`}
                  style={{ height: `${chime.height}px`, width: "30px" }}
                >
                  {isActive && (
                    <span className="absolute -inset-2 animate-ping rounded-full border border-white/40" />
                  )}
                  <span className="mb-2 text-[0.62rem] font-bold tracking-wider text-white/90">
                    {chime.key}
                  </span>
                </div>
                <div className="mt-3 h-2 w-2 rounded-full bg-white/40 group-hover:bg-white" />
                <span className="mt-2 text-[0.65rem] text-white/50 group-hover:text-white/90">
                  {chime.note}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type Lantern = {
  id: string;
  text: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  wobble: number;
};

const presetWishes = [
  "Kedamaian hati",
  "Mimpi yang bertumbuh",
  "Kesehatan & kehangatan",
  "Langkah baru yang tenang",
  "Rasa syukur hari ini",
  "Hari esok yang lembut",
];

function LanternsGame() {
  const [wish, setWish] = useState("");
  const [lanterns, setLanterns] = useState<Lantern[]>([
    { id: "init-1", text: "Ketenangan", x: 25, y: 35, speed: 0.12, size: 0.85, wobble: 0 },
    { id: "init-2", text: "Harapan", x: 68, y: 55, speed: 0.15, size: 0.95, wobble: 2 },
    { id: "init-3", text: "Terima kasih", x: 45, y: 15, speed: 0.1, size: 0.75, wobble: 4 },
  ]);
  const [sparks, setSparks] = useState<{ id: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLanterns((curr) =>
        curr
          .map((item) => ({
            ...item,
            y: item.y - item.speed,
            wobble: item.wobble + 0.04,
          }))
          .filter((item) => item.y > -25),
      );
    }, 50);
    return () => window.clearInterval(timer);
  }, []);

  const releaseLantern = (wishText?: string) => {
    const textToRelease = (wishText || wish).trim() || "Harapan Kecil";
    const newLantern: Lantern = {
      id: window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now() + Math.random()),
      text: textToRelease,
      x: 18 + Math.random() * 64,
      y: 92,
      speed: 0.11 + Math.random() * 0.08,
      size: 0.9 + Math.random() * 0.22,
      wobble: Math.random() * 6,
    };
    setLanterns((curr) => [...curr, newLantern]);
    if (!wishText) setWish("");
  };

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const sparkId = String(Date.now() + Math.random());
    setSparks((curr) => [...curr, { id: sparkId, x, y }]);
    window.setTimeout(() => {
      setSparks((curr) => curr.filter((s) => s.id !== sparkId));
    }, 900);
  };

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">pelepasan doa & pendar cahaya</p>
      <h2 className="mt-2 font-display text-3xl text-white sm:text-4xl">Lentera Malam</h2>
      <p className="mt-2 text-sm text-white/55">
        Tuliskan satu harapan atau mimpi kecilmu, nyalakan lentera, dan biarkan membubung tinggi ke langit senyap.
      </p>

      {/* Night Sky Box */}
      <div
        className="relative mx-auto mt-6 h-[380px] w-full cursor-crosshair overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1222] via-[#141b30] to-[#1c243c] shadow-2xl"
        onClick={handleSkyClick}
      >
        <div className="sky-grain pointer-events-none absolute inset-0 opacity-20" />

        {/* Lanterns */}
        {lanterns.map((lantern) => {
          const swayX = lantern.x + Math.sin(lantern.wobble) * 2;
          return (
            <div
              key={lantern.id}
              className="pointer-events-none absolute flex flex-col items-center transition-transform"
              style={{
                left: `${swayX}%`,
                top: `${lantern.y}%`,
                transform: `scale(${lantern.size}) translate(-50%, -50%)`,
                opacity: lantern.y < 5 ? Math.max(0, lantern.y / 5) : 1,
              }}
            >
              <div className="relative flex flex-col items-center">
                <div className="absolute -inset-4 rounded-full bg-amber-400/20 blur-md" />
                <div className="relative flex h-14 w-10 flex-col items-center justify-between rounded-b-md rounded-t-xl border border-amber-200/50 bg-gradient-to-t from-amber-500/80 via-amber-300/90 to-amber-100/90 shadow-[0_0_20px_rgba(255,200,100,0.8)]">
                  <span className="mt-1 block h-1 w-6 rounded-full bg-amber-800/40" />
                  <span className="h-3 w-3 rounded-full bg-white shadow-[0_0_10px_#fff]" />
                  <span className="mb-1 block h-1 w-6 rounded-full bg-amber-800/40" />
                </div>
              </div>
              <span className="mt-2 max-w-[120px] truncate text-[0.65rem] font-medium tracking-wide text-amber-100/90 drop-shadow">
                {lantern.text}
              </span>
            </div>
          );
        })}

        {/* Click sparks */}
        {sparks.map((spark) => (
          <span
            key={spark.id}
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-amber-200"
            style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
          />
        ))}

        <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-[0.62rem] text-white/35">
          Sentuh langit malam untuk menaburkan pendar bintang
        </p>
      </div>

      {/* Preset wish chips */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {presetWishes.map((item) => (
          <button
            key={item}
            className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[0.68rem] text-white/70 transition hover:border-white/35 hover:bg-white/10 hover:text-white"
            onClick={() => releaseLantern(item)}
            type="button"
          >
            + {item}
          </button>
        ))}
      </div>

      {/* Input box */}
      <form
        className="mx-auto mt-4 flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          releaseLantern();
        }}
      >
        <input
          className="w-full rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs text-white outline-none placeholder:text-white/40 focus:border-white/40"
          maxLength={30}
          onChange={(e) => setWish(e.target.value)}
          placeholder="Tuliskan harapanmu sendiri..."
          type="text"
          value={wish}
        />
        <button className="dream-home-primary shrink-0" type="submit">
          Terbangkan ↗
        </button>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Game 06: Prisma Cahaya Bintang (Starlight Prism Router)
// Teka-teki logika optik untuk mengasah otak dan pemikiran spasial
// ──────────────────────────────────────────────────────────

type Direction = "UP" | "RIGHT" | "DOWN" | "LEFT";
type MirrorType = "slash" | "backslash";

interface GridPos {
  col: number;
  row: number;
}

interface MirrorCell extends GridPos {
  id: string;
  initialType: MirrorType;
}

interface ObstacleCell extends GridPos {
  id: string;
}

interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  hint: string;
  gridCols: number;
  gridRows: number;
  source: {
    col: number;
    row: number;
    dir: Direction;
  };
  target: GridPos;
  checkpoints?: GridPos[];
  obstacles: ObstacleCell[];
  mirrors: MirrorCell[];
}

const PRISM_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: "Tingkat 1: Foton Pertama",
    subtitle: "Sentuh prisma untuk memutar sudut pantulan dan arahkan berkas cahaya ke mercusuar.",
    hint: "Prisma kaca membelokkan cahaya sembilan puluh derajat sesuai kemiringan sudutnya.",
    gridCols: 4,
    gridRows: 4,
    source: { col: 0, row: 1, dir: "RIGHT" },
    target: { col: 2, row: 3 },
    obstacles: [{ id: "ob1", col: 3, row: 1 }],
    mirrors: [{ id: "m1", col: 2, row: 1, initialType: "slash" }],
  },
  {
    id: 2,
    title: "Tingkat 2: Mengitari Nebula Gelap",
    subtitle: "Gunakan dua prisma untuk memandu cahaya melewati rintangan kehampaan kosmik.",
    hint: "Hindari nebula hitam di depan sumber cahaya dengan membelokkannya ke bawah terlebih dahulu.",
    gridCols: 4,
    gridRows: 4,
    source: { col: 0, row: 0, dir: "RIGHT" },
    target: { col: 3, row: 2 },
    obstacles: [{ id: "ob1", col: 2, row: 0 }],
    mirrors: [
      { id: "m1", col: 1, row: 0, initialType: "slash" },
      { id: "m2", col: 1, row: 2, initialType: "slash" },
    ],
  },
  {
    id: 3,
    title: "Tingkat 3: Alur Zig-Zag Kosmik",
    subtitle: "Rangkai empat prisma untuk mengalirkan cahaya melintasi labirin ruang.",
    hint: "Cahaya harus berbelok empat kali untuk menghindari pilar kehampaan di tengah.",
    gridCols: 5,
    gridRows: 5,
    source: { col: 0, row: 1, dir: "RIGHT" },
    target: { col: 4, row: 4 },
    obstacles: [
      { id: "ob1", col: 4, row: 1 },
      { id: "ob2", col: 2, row: 2 },
    ],
    mirrors: [
      { id: "m1", col: 3, row: 1, initialType: "slash" },
      { id: "m2", col: 3, row: 3, initialType: "backslash" },
      { id: "m3", col: 1, row: 3, initialType: "backslash" },
      { id: "m4", col: 1, row: 4, initialType: "slash" },
    ],
  },
  {
    id: 4,
    title: "Tingkat 4: Titik Singgah Kristal",
    subtitle: "Cahaya harus mengaktifkan kristal resonansi sebelum dapat menyalakan mercusuar akhir.",
    hint: "Rencanakan rute yang melewati kristal melayang di sisi kanan terlebih dahulu.",
    gridCols: 5,
    gridRows: 5,
    source: { col: 2, row: 0, dir: "DOWN" },
    target: { col: 0, row: 4 },
    checkpoints: [{ col: 4, row: 2 }],
    obstacles: [
      { id: "ob1", col: 2, row: 2 },
      { id: "ob2", col: 1, row: 4 },
    ],
    mirrors: [
      { id: "m1", col: 2, row: 1, initialType: "slash" },
      { id: "m2", col: 4, row: 1, initialType: "slash" },
      { id: "m3", col: 4, row: 3, initialType: "backslash" },
      { id: "m4", col: 0, row: 3, initialType: "backslash" },
    ],
  },
  {
    id: 5,
    title: "Tingkat 5: Pusaran Orbit Bintang",
    subtitle: "Aktifkan dua kristal penjaga di sudut jauh lalu masuki inti kosmik di tengah.",
    hint: "Cahaya akan mengelilingi perimeter luar sebelum menembus ke pusat galaksi.",
    gridCols: 5,
    gridRows: 5,
    source: { col: 0, row: 0, dir: "RIGHT" },
    target: { col: 2, row: 2 },
    checkpoints: [
      { col: 4, row: 0 },
      { col: 4, row: 4 },
    ],
    obstacles: [
      { id: "ob1", col: 1, row: 1 },
      { id: "ob2", col: 3, row: 1 },
      { id: "ob3", col: 1, row: 3 },
      { id: "ob4", col: 3, row: 3 },
    ],
    mirrors: [
      { id: "m1", col: 4, row: 0, initialType: "slash" },
      { id: "m2", col: 4, row: 4, initialType: "backslash" },
      { id: "m3", col: 0, row: 4, initialType: "slash" },
      { id: "m4", col: 0, row: 2, initialType: "backslash" },
    ],
  },
];

function traceRay(level: LevelConfig, mirrorsState: Record<string, MirrorType>) {
  const path: GridPos[] = [];
  const visitedCheckpoints = new Set<string>();
  let reachedTarget = false;

  let currentCol = level.source.col;
  let currentRow = level.source.row;
  let dx = 0;
  let dy = 0;

  switch (level.source.dir) {
    case "RIGHT":
      dx = 1;
      dy = 0;
      break;
    case "DOWN":
      dx = 0;
      dy = 1;
      break;
    case "LEFT":
      dx = -1;
      dy = 0;
      break;
    case "UP":
      dx = 0;
      dy = -1;
      break;
  }

  path.push({ col: currentCol, row: currentRow });

  const maxSteps = 30;
  let steps = 0;

  while (steps < maxSteps) {
    steps++;
    const nextCol = currentCol + dx;
    const nextRow = currentRow + dy;

    // Check bounds
    if (
      nextCol < 0 ||
      nextCol >= level.gridCols ||
      nextRow < 0 ||
      nextRow >= level.gridRows
    ) {
      break;
    }

    currentCol = nextCol;
    currentRow = nextRow;
    path.push({ col: currentCol, row: currentRow });

    // Check checkpoint
    if (
      level.checkpoints?.some(
        (cp) => cp.col === currentCol && cp.row === currentRow,
      )
    ) {
      visitedCheckpoints.add(`${currentCol},${currentRow}`);
    }

    // Check obstacle
    if (
      level.obstacles.some(
        (ob) => ob.col === currentCol && ob.row === currentRow,
      )
    ) {
      break;
    }

    // Check target
    if (currentCol === level.target.col && currentRow === level.target.row) {
      const allCheckpointsVisited =
        !level.checkpoints ||
        level.checkpoints.every((cp) =>
          visitedCheckpoints.has(`${cp.col},${cp.row}`),
        );
      if (allCheckpointsVisited) {
        reachedTarget = true;
      }
      break;
    }

    // Check mirror deflection
    const mirror = level.mirrors.find(
      (m) => m.col === currentCol && m.row === currentRow,
    );
    if (mirror) {
      const type = mirrorsState[mirror.id] ?? mirror.initialType;
      if (type === "slash") {
        // slash: ╱
        const oldDx = dx;
        const oldDy = dy;
        dx = -oldDy;
        dy = -oldDx;
      } else {
        // backslash: ╲
        const oldDx = dx;
        const oldDy = dy;
        dx = oldDy;
        dy = oldDx;
      }
    }
  }

  return { path, reachedTarget, visitedCheckpoints };
}

function PrismLightGame() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [mirrorsState, setMirrorsState] = useState<Record<string, MirrorType>>({});
  const [clearedLevel, setClearedLevel] = useState(false);
  const [allFinished, setAllFinished] = useState(false);

  const level = PRISM_LEVELS[currentLevelIndex];

  // Initialize or reset mirror states for the level
  const initLevel = useCallback(
    (lvlIndex: number) => {
      const targetLvl = PRISM_LEVELS[lvlIndex];
      const initial: Record<string, MirrorType> = {};
      targetLvl.mirrors.forEach((m) => {
        initial[m.id] = m.initialType;
      });
      setMirrorsState(initial);
      setClearedLevel(false);
    },
    [],
  );

  useEffect(() => {
    initLevel(currentLevelIndex);
  }, [currentLevelIndex, initLevel]);

  // Compute ray trace
  const { path, reachedTarget, visitedCheckpoints } = traceRay(level, mirrorsState);

  // Check victory
  useEffect(() => {
    if (reachedTarget && !clearedLevel) {
      setClearedLevel(true);
      soundscape.playZenChime();

      // Unlock next level
      const nextLvlNum = level.id + 1;
      if (nextLvlNum <= PRISM_LEVELS.length) {
        setUnlockedLevels((prev) =>
          prev.includes(nextLvlNum) ? prev : [...prev, nextLvlNum],
        );
      } else {
        setAllFinished(true);
      }
    }
  }, [reachedTarget, clearedLevel, level.id]);

  const toggleMirror = (id: string) => {
    if (clearedLevel && !allFinished) return;
    soundscape.playPrismRotateSound();
    setMirrorsState((prev) => ({
      ...prev,
      [id]: prev[id] === "slash" ? "backslash" : "slash",
    }));
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < PRISM_LEVELS.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    initLevel(currentLevelIndex);
  };

  const handleRestartFromBeginning = () => {
    setCurrentLevelIndex(0);
    setAllFinished(false);
    initLevel(0);
  };

  const dirSymbols: Record<Direction, string> = {
    RIGHT: "→",
    DOWN: "↓",
    LEFT: "←",
    UP: "↑",
  };

  return (
    <div className="relative mx-auto max-w-xl text-center">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-light text-white">
          Prisma Cahaya Bintang
        </h2>
        <p className="mt-1 text-xs text-white/55">
          Teka-teki alur optik: atur sudut pantulan prisma untuk memandu cahaya semesta.
        </p>
      </div>

      {/* Level Selection Tabs */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
        {PRISM_LEVELS.map((lvl, idx) => {
          const isUnlocked = unlockedLevels.includes(lvl.id);
          const isCurrent = idx === currentLevelIndex;
          return (
            <button
              key={lvl.id}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                isCurrent
                  ? "border border-purple-400/50 bg-purple-500/20 text-purple-200 shadow-[0_0_12px_rgba(192,132,252,0.3)]"
                  : isUnlocked
                    ? "border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10 hover:text-white"
                    : "cursor-not-allowed border border-white/5 bg-transparent text-white/25"
              }`}
              disabled={!isUnlocked}
              onClick={() => setCurrentLevelIndex(idx)}
              type="button"
            >
              Tingkat {lvl.id} {isUnlocked ? "" : "🔒"}
            </button>
          );
        })}
      </div>

      {/* Level Info Banner */}
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-left backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
            {level.title}
          </h3>
          <span className="text-[0.65rem] text-white/40">
            Kisi {level.gridCols}×{level.gridRows}
          </span>
        </div>
        <p className="mt-1 text-xs text-white/75">{level.subtitle}</p>
        <p className="mt-1 text-[0.68rem] italic text-white/45">
          Petunjuk: {level.hint}
        </p>
      </div>

      {/* Chamber Board Container */}
      <div className="relative mx-auto flex w-full max-w-md items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-stone-950/70 via-black/80 to-purple-950/20 p-4 shadow-2xl backdrop-blur-md sm:p-6">
        {/* Ambient Starlight Bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-64 w-64 rounded-full bg-purple-600/10 blur-3xl transition-all duration-700"
            style={{
              opacity: reachedTarget ? 0.9 : 0.25,
              transform: reachedTarget ? "scale(1.25)" : "scale(0.95)",
            }}
          />
        </div>

        {/* Dynamic Grid Board */}
        <div
          className="relative grid w-full gap-2"
          style={{
            gridTemplateColumns: `repeat(${level.gridCols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: level.gridRows }).map((_, r) =>
            Array.from({ length: level.gridCols }).map((__, c) => {
              const isSource =
                level.source.col === c && level.source.row === r;
              const isTarget =
                level.target.col === c && level.target.row === r;
              const checkpoint = level.checkpoints?.find(
                (cp) => cp.col === c && cp.row === r,
              );
              const isCheckpointVisited = checkpoint
                ? visitedCheckpoints.has(`${c},${r}`)
                : false;
              const obstacle = level.obstacles.find(
                (ob) => ob.col === c && ob.row === r,
              );
              const mirror = level.mirrors.find(
                (m) => m.col === c && m.row === r,
              );
              const mirrorType = mirror
                ? mirrorsState[mirror.id] ?? mirror.initialType
                : null;

              return (
                <div
                  key={`${c}-${r}`}
                  className="relative flex aspect-square items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] transition-colors"
                >
                  {/* Subtle grid intersection dot */}
                  <div className="pointer-events-none absolute h-1 w-1 rounded-full bg-white/10" />

                  {/* 1. Source Emitter */}
                  {isSource && (
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/20 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                        <span className="text-xs font-bold">
                          {dirSymbols[level.source.dir]}
                        </span>
                      </div>
                      <span className="mt-0.5 text-[0.55rem] font-medium tracking-tight text-cyan-300/70">
                        Sumber
                      </span>
                    </div>
                  )}

                  {/* 2. Target Beacon Sanctuary */}
                  {isTarget && (
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 ${
                          reachedTarget
                            ? "border border-amber-300 bg-amber-300/30 text-amber-100 shadow-[0_0_20px_rgba(252,211,77,0.7)] animate-pulse"
                            : "border border-white/20 bg-white/[0.04] text-white/40"
                        }`}
                      >
                        <span className="text-sm font-bold">
                          {reachedTarget ? "✧" : "⟡"}
                        </span>
                      </div>
                      <span
                        className={`mt-0.5 text-[0.55rem] font-medium tracking-tight transition ${
                          reachedTarget ? "text-amber-300" : "text-white/40"
                        }`}
                      >
                        Mercusuar
                      </span>
                    </div>
                  )}

                  {/* 3. Checkpoint Resonator */}
                  {checkpoint && (
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                          isCheckpointVisited
                            ? "border border-purple-300 bg-purple-500/30 text-purple-200 shadow-[0_0_15px_rgba(216,180,254,0.6)]"
                            : "border border-dashed border-purple-400/30 bg-purple-950/20 text-purple-400/40"
                        }`}
                      >
                        <span className="text-xs">✦</span>
                      </div>
                      <span
                        className={`mt-0.5 text-[0.52rem] transition ${
                          isCheckpointVisited
                            ? "text-purple-300"
                            : "text-purple-400/40"
                        }`}
                      >
                        Singgah
                      </span>
                    </div>
                  )}

                  {/* 4. Dark Nebula Obstacle */}
                  {obstacle && (
                    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/20">
                      <span className="text-xs text-purple-400/40">✕</span>
                      <span className="mt-0.5 text-[0.52rem] text-purple-400/40">
                        Nebula
                      </span>
                    </div>
                  )}

                  {/* 5. Rotatable Prism Mirror */}
                  {mirror && mirrorType && (
                    <button
                      aria-label="Putar sudut prisma"
                      className="group relative z-20 flex h-full w-full items-center justify-center rounded-xl border border-purple-400/30 bg-purple-500/10 p-1 transition hover:border-purple-300 hover:bg-purple-500/25 active:scale-95"
                      onClick={() => toggleMirror(mirror.id)}
                      title="Sentuh untuk memutar sudut prisma"
                      type="button"
                    >
                      {/* Mirror Bar Indicator */}
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        <div
                          className="h-10 w-1.5 rounded-full bg-gradient-to-b from-purple-200 via-white to-purple-200 shadow-[0_0_10px_rgba(216,180,254,0.8)] transition-transform duration-300"
                          style={{
                            transform:
                              mirrorType === "slash"
                                ? "rotate(45deg)"
                                : "rotate(-45deg)",
                          }}
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 text-[0.55rem] text-purple-300/60 group-hover:text-purple-200">
                        ↻
                      </span>
                    </button>
                  )}
                </div>
              );
            }),
          )}

          {/* SVG Real-time Starlight Laser Overlay */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox={`0 0 ${level.gridCols * 100} ${level.gridRows * 100}`}
          >
            <defs>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Laser Path */}
            {path.length > 1 && (
              <>
                {/* Outer Glow Halo */}
                <polyline
                  fill="none"
                  points={path
                    .map((p) => `${p.col * 100 + 50},${p.row * 100 + 50}`)
                    .join(" ")}
                  stroke={reachedTarget ? "#fcd34d" : "#c084fc"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={0.4}
                  strokeWidth="8"
                />
                {/* Core Focused Beam */}
                <polyline
                  filter="url(#laserGlow)"
                  fill="none"
                  points={path
                    .map((p) => `${p.col * 100 + 50},${p.row * 100 + 50}`)
                    .join(" ")}
                  stroke={reachedTarget ? "#fffbeb" : "#f5f3ff"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                />
                {/* Leading Photon Head */}
                {path[path.length - 1] && (
                  <circle
                    cx={path[path.length - 1].col * 100 + 50}
                    cy={path[path.length - 1].row * 100 + 50}
                    fill={reachedTarget ? "#fcd34d" : "#38bdf8"}
                    r="5"
                    className="animate-ping"
                  />
                )}
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Control Actions & Notifications */}
      <div className="mt-5 space-y-4">
        {clearedLevel ? (
          <div className="rounded-2xl border border-purple-400/30 bg-purple-500/10 p-4 text-purple-200">
            <p className="text-sm font-medium">✧ Berkas Cahaya Menyatu Harmonis</p>
            <p className="mt-1 text-xs text-purple-200/80">
              Semua prisma telah memantulkan foton pada sudut geometri yang tepat.
              Mercusuar kosmik kini bersinar terang menembus kegelapan ruang.
            </p>
          </div>
        ) : (
          <p className="text-xs text-white/55">
            Sentuh prisma kristal pada kotak untuk memutar sudut pantulan sembilan puluh derajat.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {clearedLevel && currentLevelIndex < PRISM_LEVELS.length - 1 && (
            <button
              className="dream-home-primary px-6 py-2.5 text-xs font-medium"
              onClick={handleNextLevel}
              type="button"
            >
              Tingkat Berikutnya ➔
            </button>
          )}

          {allFinished && (
            <div className="w-full">
              <p className="mb-2 text-xs font-medium text-amber-200">
                ✦ Selamat, kamu telah menuntaskan seluruh teka-teki prisma kosmik dengan ketajaman logika.
              </p>
              <button
                className="dream-home-primary px-6 py-2.5 text-xs font-medium"
                onClick={handleRestartFromBeginning}
                type="button"
              >
                Mainkan Dari Awal ↺
              </button>
            </div>
          )}

          <button
            className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            onClick={handleRestart}
            type="button"
          >
            Atur Ulang Sudut ↺
          </button>
        </div>
      </div>
    </div>
  );
}


