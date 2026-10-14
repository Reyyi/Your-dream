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
  | "balance";

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
    id: "balance",
    number: "06",
    title: "Keseimbangan Batu",
    description: "Tumpuk batu sungai dengan sabar dan temukan titik hening gravitasi.",
    symbol: "🪨",
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
            {activeGame === "balance" && <StoneBalanceGame />}
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
// Game 06: Keseimbangan Batu (Zen Stone Balance)
// ──────────────────────────────────────────────────────────

interface StoneDef {
  name: string;
  width: number;
  height: number;
  borderRadius: string;
  bg: string;
  border: string;
  shadow: string;
  maxTolerance: number;
}

const STONES_DATA: StoneDef[] = [
  {
    name: "Batu Basal Pijakan",
    width: 210,
    height: 48,
    borderRadius: "50% 50% 45% 55% / 60% 60% 40% 40%",
    bg: "linear-gradient(180deg, #374151 0%, #1f2937 100%)",
    border: "rgba(255, 255, 255, 0.18)",
    shadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    maxTolerance: 50,
  },
  {
    name: "Batu Granit Sungai",
    width: 170,
    height: 42,
    borderRadius: "55% 45% 52% 48% / 50% 55% 45% 50%",
    bg: "linear-gradient(180deg, #4b5563 0%, #374151 100%)",
    border: "rgba(255, 255, 255, 0.2)",
    shadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
    maxTolerance: 34,
  },
  {
    name: "Batu Sabak Pipih",
    width: 130,
    height: 34,
    borderRadius: "48% 52% 46% 54% / 55% 45% 55% 45%",
    bg: "linear-gradient(180deg, #64748b 0%, #475569 100%)",
    border: "rgba(255, 255, 255, 0.22)",
    shadow: "0 6px 16px rgba(0, 0, 0, 0.35)",
    maxTolerance: 26,
  },
  {
    name: "Batu Kali Halus",
    width: 95,
    height: 28,
    borderRadius: "52% 48% 50% 50% / 48% 52% 48% 52%",
    bg: "linear-gradient(180deg, #94a3b8 0%, #64748b 100%)",
    border: "rgba(255, 255, 255, 0.25)",
    shadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    maxTolerance: 18,
  },
  {
    name: "Kristal Kuarsa Puncak",
    width: 62,
    height: 26,
    borderRadius: "45% 55% 55% 45% / 60% 50% 50% 40%",
    bg: "linear-gradient(180deg, #e9d5ff 0%, #c084fc 100%)",
    border: "rgba(255, 255, 255, 0.6)",
    shadow: "0 0 20px rgba(192, 132, 252, 0.6), 0 4px 10px rgba(0, 0, 0, 0.4)",
    maxTolerance: 14,
  },
];

interface PlacedStone {
  index: number;
  offset: number;
  rotation: number;
}

function StoneBalanceGame() {
  const [placedStones, setPlacedStones] = useState<PlacedStone[]>([
    { index: 0, offset: 0, rotation: 0 },
  ]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isDropping, setIsDropping] = useState(false);
  const [isToppled, setIsToppled] = useState(false);
  const [isBalanced, setIsBalanced] = useState(false);

  const resetGame = () => {
    setPlacedStones([{ index: 0, offset: 0, rotation: 0 }]);
    setCurrentIndex(1);
    setCurrentOffset(0);
    setIsDropping(false);
    setIsToppled(false);
    setIsBalanced(false);
  };

  const handlePlaceStone = () => {
    if (isDropping || isToppled || isBalanced) return;
    if (currentIndex >= STONES_DATA.length) return;

    setIsDropping(true);

    const prevStone = placedStones[placedStones.length - 1];
    const diff = currentOffset - prevStone.offset;
    const tolerance = STONES_DATA[currentIndex].maxTolerance;

    setTimeout(() => {
      if (Math.abs(diff) <= tolerance) {
        // Successful drop
        const rotation = Math.max(-5, Math.min(5, diff * 0.12));
        const nextPlaced = [
          ...placedStones,
          { index: currentIndex, offset: currentOffset, rotation },
        ];
        setPlacedStones(nextPlaced);

        if (currentIndex === STONES_DATA.length - 1) {
          setIsBalanced(true);
          soundscape.playZenChime();
        } else {
          soundscape.playStoneSound();
          setCurrentIndex((idx) => idx + 1);
          // Set next stone starting offset slightly near previous stone
          setCurrentOffset(Math.round(currentOffset * 0.5));
        }
      } else {
        // Imbalance: stone falls off
        soundscape.playStoneSound();
        setIsToppled(true);
      }
      setIsDropping(false);
    }, 280);
  };

  const currentStone = STONES_DATA[currentIndex];

  return (
    <div className="relative mx-auto max-w-xl text-center">
      <div className="mb-4">
        <h2 className="font-display text-2xl font-light text-white">
          Keseimbangan Batu
        </h2>
        <p className="mt-1 text-xs text-white/55">
          Tumpuk batu sungai dengan sabar dan temukan titik hening gravitasi.
        </p>
      </div>

      {/* Zen cairn pond canvas */}
      <div className="relative mx-auto flex h-[380px] w-full flex-col items-center justify-end overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-black/40 via-white/[0.02] to-black/60 p-6 shadow-2xl backdrop-blur-md">
        {/* Soft background water ripples */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 h-24 w-80 rounded-full bg-emerald-500/[0.04] blur-2xl transition-all duration-1000"
          style={{
            transform: isBalanced ? "scale(1.4)" : "scale(1)",
            opacity: isBalanced ? 0.8 : 0.3,
          }}
        />

        {/* Ambient quartz starlight glow when balanced */}
        {isBalanced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-64 w-64 animate-pulse rounded-full bg-purple-500/15 blur-3xl" />
          </div>
        )}

        {/* Floating preview stone ready to drop */}
        {!isBalanced && !isToppled && currentStone && (
          <div
            className="absolute top-10 flex flex-col items-center transition-all duration-75"
            style={{
              transform: `translateX(${currentOffset}px) translateY(${
                isDropping ? "170px" : "0"
              })`,
              opacity: isDropping ? 0.3 : 1,
            }}
          >
            <div className="mb-2 text-[0.65rem] tracking-wider text-white/50">
              {currentStone.name}
            </div>
            {/* Guide alignment dashed line */}
            <div className="h-6 w-px border-l border-dashed border-white/20" />
            <div
              className="transition-transform duration-100"
              style={{
                width: `${currentStone.width}px`,
                height: `${currentStone.height}px`,
                borderRadius: currentStone.borderRadius,
                background: currentStone.bg,
                border: `1px solid ${currentStone.border}`,
                boxShadow: currentStone.shadow,
              }}
            />
          </div>
        )}

        {/* Stacked stone tower */}
        <div className="relative z-10 flex flex-col-reverse items-center pb-2">
          {placedStones.map((st, i) => {
            const data = STONES_DATA[st.index];
            const toppleStyle =
              isToppled && i === placedStones.length - 1
                ? {
                    transform: `translateX(${st.offset + 40}px) translateY(45px) rotate(24deg)`,
                    opacity: 0.6,
                    transition: "all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }
                : {
                    transform: `translateX(${st.offset}px) rotate(${st.rotation}deg)`,
                    transition: "transform 0.3s ease-out",
                  };

            return (
              <div
                key={st.index}
                className="relative -mt-2 transition-all duration-300"
                style={{
                  ...toppleStyle,
                  width: `${data.width}px`,
                  height: `${data.height}px`,
                  borderRadius: data.borderRadius,
                  background: data.bg,
                  border: `1px solid ${data.border}`,
                  boxShadow: data.shadow,
                }}
              />
            );
          })}
        </div>

        {/* Riverbed ground moss base */}
        <div className="relative z-20 mt-1 flex h-4 w-72 items-center justify-center rounded-full bg-gradient-to-r from-emerald-950/40 via-stone-800 to-emerald-950/40 border-t border-white/10 shadow-inner">
          <div className="text-[0.62rem] tracking-widest text-white/30 uppercase">
            pijakan sungai
          </div>
        </div>
      </div>

      {/* Game controls and messaging */}
      <div className="mt-5 space-y-4">
        {/* Status text */}
        {isBalanced ? (
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4 text-purple-200">
            <p className="text-sm font-medium">✧ Keseimbangan Sempurna Terwujud</p>
            <p className="mt-1 text-xs text-purple-200/75">
              Semua batu telah berdiri seimbang dalam keheningan. Gravitasi dan
              ketenangan berpadu tanpa perlu terburu-buru.
            </p>
          </div>
        ) : isToppled ? (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-200">
            <p className="text-sm font-medium">Batu Tergelincir Lembut</p>
            <p className="mt-1 text-xs text-amber-200/75">
              Titik tumpu bergeser dari pusat gravitasi. Tarik napas sejenak dan
              mari susun kembali batu sungai ini dengan tenang.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-xs text-white/60">
              Geser ke kiri atau kanan untuk menyelaraskan batu ({currentIndex} /{" "}
              {STONES_DATA.length - 1})
            </p>

            {/* Slider control */}
            <div className="mt-3 flex w-full max-w-xs items-center gap-3">
              <button
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10"
                onClick={() => setCurrentOffset((prev) => Math.max(-80, prev - 8))}
                type="button"
              >
                ←
              </button>
              <input
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-purple-400"
                max={80}
                min={-80}
                onChange={(e) => setCurrentOffset(Number(e.target.value))}
                step={1}
                type="range"
                value={currentOffset}
              />
              <button
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-white/70 transition hover:bg-white/10"
                onClick={() => setCurrentOffset((prev) => Math.min(80, prev + 8))}
                type="button"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {!isBalanced && !isToppled && (
            <button
              className="dream-home-primary px-6 py-2.5 text-xs font-medium"
              disabled={isDropping}
              onClick={handlePlaceStone}
              type="button"
            >
              Letakkan Batu 🪨
            </button>
          )}

          {(isBalanced || isToppled || placedStones.length > 1) && (
            <button
              className="rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              onClick={resetGame}
              type="button"
            >
              {isBalanced ? "Susun Ulang ↺" : "Mulai Ulang ↺"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

