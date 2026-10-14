"use client";

import { useEffect, useRef, useState } from "react";
import { soundscape } from "@/lib/soundscape";

interface StoneSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  mass: number;
  color: string;
  borderColor: string;
  shape: "flat" | "oval" | "wedge" | "pebble";
}

interface PuzzleLevel {
  level: number;
  title: string;
  description: string;
  availableStones: StoneSpec[];
  targetCount: number;
}

const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    level: 1,
    title: "Tingkat 1: Pondasi Sungai Alami",
    description: "Susun 3 batu kali mendatar hingga seimbang stabil selama 3 detik.",
    targetCount: 3,
    availableStones: [
      { id: "s1", name: "Batu Kali Pipih", width: 140, height: 42, mass: 4, color: "#57534e", borderColor: "#78716c", shape: "flat" },
      { id: "s2", name: "Batu Basal Sedang", width: 105, height: 36, mass: 3, color: "#334155", borderColor: "#475569", shape: "oval" },
      { id: "s3", name: "Batu Kuarsa Mahkota", width: 68, height: 32, mass: 2, color: "#e2e8f0", borderColor: "#f8fafc", shape: "oval" },
    ],
  },
  {
    level: 2,
    title: "Tingkat 2: Kemiringan Sudut Tiga Titik",
    description: "Susun 4 batu termasuk batu baji miring dengan menjaga titik tumpu pusat massa.",
    targetCount: 4,
    availableStones: [
      { id: "s1", name: "Batu Alas Granit", width: 150, height: 44, mass: 5, color: "#475569", borderColor: "#64748b", shape: "flat" },
      { id: "s2", name: "Batu Baji Miring", width: 110, height: 38, mass: 3, color: "#525252", borderColor: "#737373", shape: "wedge" },
      { id: "s3", name: "Batu Kali Lonjong", width: 95, height: 34, mass: 2.5, color: "#64748b", borderColor: "#94a3b8", shape: "oval" },
      { id: "s4", name: "Kerikil Puncak Kuarsa", width: 55, height: 28, mass: 1.5, color: "#f1f5f9", borderColor: "#ffffff", shape: "pebble" },
    ],
  },
  {
    level: 3,
    title: "Tingkat 3: Menara Hening Bertingkat",
    description: "Bangun menara 5 batu vertikal. Perhatikan urutan batu agar tidak roboh ke samping.",
    targetCount: 5,
    availableStones: [
      { id: "s1", name: "Batu Andesit Pondasi", width: 160, height: 46, mass: 6, color: "#3f3f46", borderColor: "#52525b", shape: "flat" },
      { id: "s2", name: "Batu Granit Tengah", width: 125, height: 38, mass: 4, color: "#475569", borderColor: "#64748b", shape: "flat" },
      { id: "s3", name: "Batu Basal Bulat", width: 98, height: 35, mass: 3, color: "#1e293b", borderColor: "#334155", shape: "oval" },
      { id: "s4", name: "Batu Sungai Halus", width: 75, height: 30, mass: 2, color: "#64748b", borderColor: "#94a3b8", shape: "oval" },
      { id: "s5", name: "Permata Puncak Zen", width: 45, height: 24, mass: 1, color: "#f8fafc", borderColor: "#ffffff", shape: "pebble" },
    ],
  },
  {
    level: 4,
    title: "Tingkat 4: Titik Tumpu Sempit",
    description: "Susun 5 batu di mana batu tengah memiliki alas sempit yang menantang keseimbangan.",
    targetCount: 5,
    availableStones: [
      { id: "s1", name: "Batu Alas Tebing", width: 145, height: 42, mass: 5, color: "#57534e", borderColor: "#78716c", shape: "flat" },
      { id: "s2", name: "Batu Baji Piramida", width: 90, height: 42, mass: 3.5, color: "#44403c", borderColor: "#57534e", shape: "wedge" },
      { id: "s3", name: "Batu Lebar Penyeimbang", width: 130, height: 34, mass: 4, color: "#334155", borderColor: "#475569", shape: "flat" },
      { id: "s4", name: "Batu Bulat Halus", width: 70, height: 32, mass: 2, color: "#64748b", borderColor: "#94a3b8", shape: "oval" },
      { id: "s5", name: "Batu Puncak Terang", width: 48, height: 26, mass: 1, color: "#ffffff", borderColor: "#f1f5f9", shape: "pebble" },
    ],
  },
  {
    level: 5,
    title: "Tingkat 5: Puncak Pencerahan Zen",
    description: "Tingkat mahir: Seimbangkan 6 batu dengan pusat massa asimetris dalam harmoni sempurna.",
    targetCount: 6,
    availableStones: [
      { id: "s1", name: "Batu Andesit Hitam", width: 170, height: 46, mass: 7, color: "#27272a", borderColor: "#3f3f46", shape: "flat" },
      { id: "s2", name: "Batu Basal Berongga", width: 135, height: 38, mass: 4.5, color: "#1e293b", borderColor: "#334155", shape: "flat" },
      { id: "s3", name: "Batu Kali Asimetris", width: 110, height: 36, mass: 3.5, color: "#475569", borderColor: "#64748b", shape: "wedge" },
      { id: "s4", name: "Batu Kuarsa Tengah", width: 85, height: 32, mass: 2.8, color: "#e2e8f0", borderColor: "#f8fafc", shape: "oval" },
      { id: "s5", name: "Batu Pipih Penopang", width: 62, height: 26, mass: 1.8, color: "#64748b", borderColor: "#94a3b8", shape: "flat" },
      { id: "s6", name: "Mahkota Sempurna", width: 40, height: 22, mass: 1.0, color: "#ffffff", borderColor: "#f8fafc", shape: "pebble" },
    ],
  },
];

interface StackedStone {
  spec: StoneSpec;
  offsetX: number; // offset from base center (-50 to +50)
  tilt: number;
}

export function ZenStoneBalancePuzzle({ className = "" }: { className?: string }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const level = PUZZLE_LEVELS[currentLevelIdx];

  // Placed stack on the altar
  const [stack, setStack] = useState<StackedStone[]>([]);
  // Remaining stones in tray
  const [trayStones, setTrayStones] = useState<StoneSpec[]>(level.availableStones);
  // Selected stone to place
  const [selectedStone, setSelectedStone] = useState<StoneSpec | null>(null);
  // Drag / offset adjustment for the placing stone
  const [placingOffset, setPlacingOffset] = useState<number>(0);

  // Balance status
  const [isBalanced, setIsBalanced] = useState(true);
  const [tiltSeverity, setTiltSeverity] = useState(0); // -1 to +1
  const [stabilityTime, setStabilityTime] = useState(0); // 0 to 3
  const [isWon, setIsWon] = useState(false);

  // Initialize level
  useEffect(() => {
    setStack([]);
    setTrayStones(level.availableStones);
    setSelectedStone(null);
    setPlacingOffset(0);
    setIsBalanced(true);
    setTiltSeverity(0);
    setStabilityTime(0);
    setIsWon(false);
  }, [currentLevelIdx, level]);

  // Real-time Physics & Center-of-Mass Balance Evaluation
  useEffect(() => {
    if (stack.length === 0) {
      setIsBalanced(true);
      setTiltSeverity(0);
      setStabilityTime(0);
      return;
    }

    // 1. Calculate Center of Mass of the stacked stones
    let totalMass = 0;
    let weightedX = 0;

    for (let i = 0; i < stack.length; i++) {
      const stone = stack[i];
      totalMass += stone.spec.mass;
      weightedX += stone.spec.mass * stone.offsetX;
    }

    const centerOfMassX = totalMass > 0 ? weightedX / totalMass : 0;

    // 2. Base stone contact support limit
    const baseStone = stack[0];
    const maxAllowedDisplacement = baseStone.spec.width * 0.22;

    const normalizedTilt = centerOfMassX / maxAllowedDisplacement;
    setTiltSeverity(Math.max(-1.5, Math.min(1.5, normalizedTilt)));

    // Check if within equilibrium bounds
    const stable = Math.abs(centerOfMassX) <= maxAllowedDisplacement;
    setIsBalanced(stable);

    if (!stable) {
      // Tumble after delay
      soundscape.playStonePlacementSound();
      setStabilityTime(0);
      const timer = setTimeout(() => {
        // Tumble top stones
        soundscape.playStonePlacementSound();
        setStack((prev) => prev.slice(0, 1)); // keep only base
        // Return lost stones back to tray
        const baseSpec = stack[0].spec;
        setTrayStones(level.availableStones.filter((s) => s.id !== baseSpec.id));
      }, 700);
      return () => clearTimeout(timer);
    } else if (stack.length === level.targetCount) {
      // Countdown 3 seconds to victory
      const interval = setInterval(() => {
        setStabilityTime((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            return 3;
          }
          const next = prev + 0.5;
          soundscape.playWaterDropSound();
          if (next >= 3) {
            setIsWon(true);
            soundscape.playZenSingingBowlSound(280);
            soundscape.playKotoPluck(528);
          }
          return next;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [stack, level]);

  const handlePlaceStone = () => {
    if (!selectedStone) return;
    soundscape.playStonePlacementSound();

    const newStacked: StackedStone = {
      spec: selectedStone,
      offsetX: placingOffset,
      tilt: (placingOffset / 30) * 0.12,
    };

    setStack((prev) => [...prev, newStacked]);
    setTrayStones((prev) => prev.filter((s) => s.id !== selectedStone.id));
    setSelectedStone(null);
    setPlacingOffset(0);
  };

  const handleReset = () => {
    soundscape.playWaterDropSound();
    setStack([]);
    setTrayStones(level.availableStones);
    setSelectedStone(null);
    setPlacingOffset(0);
    setIsBalanced(true);
    setTiltSeverity(0);
    setStabilityTime(0);
    setIsWon(false);
  };

  const handleNextLevel = () => {
    soundscape.playPrismRotateSound();
    if (currentLevelIdx < PUZZLE_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`glass-panel flex flex-col rounded-[2rem] border border-stone-700/40 bg-slate-950/50 p-6 backdrop-blur-xl ${className}`}
    >
      {/* Level Header & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[0.6rem] font-mono uppercase tracking-[0.25em] text-emerald-300">
            TEKA-TEKI KESEIMBANGAN BATU GRAVITASI
          </span>
          <h3 className="font-display text-lg text-[#fff5e6] sm:text-xl">
            {level.title}
          </h3>
          <p className="mt-1 text-xs text-white/65">{level.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {PUZZLE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.level}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold transition-all ${
                idx === currentLevelIdx
                  ? "border border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                  : idx < currentLevelIdx
                  ? "bg-white/15 text-white/80"
                  : "bg-white/5 text-white/30"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setCurrentLevelIdx(idx);
              }}
              type="button"
            >
              {lvl.level}
            </button>
          ))}
        </div>
      </div>

      {/* Main Altar Canvas Area */}
      <div className="relative mt-5 flex min-h-[380px] w-full flex-col items-center justify-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0c1424] via-[#101b2f] to-[#152238] p-6 shadow-inner">
        {/* Equilibrium Aura Glow */}
        {stack.length > 0 && isBalanced && (
          <div
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
              stabilityTime > 0 ? "opacity-35" : "opacity-15"
            } bg-[radial-gradient(circle_at_50%_70%,rgba(52,211,153,0.3)_0%,transparent_65%)]`}
          />
        )}

        {/* Instability Warning Indicator */}
        {!isBalanced && (
          <div className="absolute top-4 flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/20 px-4 py-1 text-xs font-medium text-rose-200 animate-bounce shadow-lg">
            <span>⚠ Pusat massa tidak seimbang! Batu runtuh...</span>
          </div>
        )}

        {/* Stability Hold Progress Indicator */}
        {isBalanced && stack.length === level.targetCount && !isWon && (
          <div className="absolute top-4 flex flex-col items-center gap-1 rounded-2xl border border-emerald-400/30 bg-emerald-950/40 px-5 py-2 backdrop-blur-md shadow-xl">
            <span className="text-[0.62rem] font-mono uppercase tracking-widest text-emerald-300">
              Menjaga Keseimbangan Hening...
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-2 w-6 rounded-full transition-all duration-300 ${
                    stabilityTime >= step
                      ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Victory Celebration Card */}
        {isWon && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-6 text-center animate-in fade-in duration-500">
            <span className="text-4xl">🪨✨</span>
            <h4 className="mt-3 font-display text-2xl text-emerald-200">
              Keseimbangan Purna Terwujud
            </h4>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/80">
              Semua batu tersusun harmonis menentang gravitasi dengan keheningan pikiran dan presisi titik tumpu.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-xs font-medium text-white hover:bg-white/20 transition-all"
                onClick={handleReset}
                type="button"
              >
                Susun Ulang ↺
              </button>
              {currentLevelIdx < PUZZLE_LEVELS.length - 1 && (
                <button
                  className="rounded-full border border-emerald-400 bg-emerald-400/25 px-6 py-2 text-xs font-bold text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:bg-emerald-400/35 transition-all"
                  onClick={handleNextLevel}
                  type="button"
                >
                  Tingkat Berikutnya →
                </button>
              )}
            </div>
          </div>
        )}

        {/* The Natural Stack of Balanced Stones */}
        <div
          className="relative flex flex-col-reverse items-center transition-transform duration-300"
          style={{ transform: `rotate(${tiltSeverity * 3.5}deg)` }}
        >
          {stack.map((item, idx) => (
            <div
              key={item.spec.id}
              className="relative transition-all duration-300 shadow-xl"
              style={{
                width: item.spec.width,
                height: item.spec.height,
                backgroundColor: item.spec.color,
                borderColor: item.spec.borderColor,
                borderWidth: 2,
                borderRadius: item.spec.shape === "flat" ? "14px" : item.spec.shape === "wedge" ? "20px 8px 18px 22px" : "999px",
                transform: `translateX(${item.offsetX}px) rotate(${item.tilt}rad)`,
                marginTop: idx > 0 ? -4 : 0,
              }}
            >
              {/* Natural Stone Surface Highlights */}
              <div className="absolute inset-x-2 top-1.5 h-1 rounded-full bg-white/20 blur-[1px]" />
            </div>
          ))}
        </div>

        {/* Altar Wooden Table Foundation */}
        <div className="mt-2 h-7 w-64 sm:w-80 rounded-t-xl border-t-2 border-x-2 border-stone-600 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 shadow-2xl flex items-center justify-center">
          <span className="text-[0.55rem] font-mono tracking-widest text-stone-400 uppercase">
            Altar Batu Zen
          </span>
        </div>
      </div>

      {/* Stone Placement Adjuster Bar (If a stone is selected) */}
      {selectedStone && (
        <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-400/10 p-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-amber-100">
              Menempatkan: {selectedStone.name} (Bobot: {selectedStone.mass} kg)
            </span>
            <span className="font-mono text-xs text-amber-300">
              Geser Posisi: {placingOffset > 0 ? `+${placingOffset}` : placingOffset}px
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <span className="text-xs text-white/50">Kiri</span>
            <input
              aria-label="Geser posisi tumpu batu"
              className="time-slider block w-full cursor-pointer"
              max="45"
              min="-45"
              onChange={(e) => setPlacingOffset(Number(e.target.value))}
              step="1"
              type="range"
              value={placingOffset}
            />
            <span className="text-xs text-white/50">Kanan</span>
          </div>

          <div className="mt-3.5 flex justify-end gap-2">
            <button
              className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white"
              onClick={() => setSelectedStone(null)}
              type="button"
            >
              Batal
            </button>
            <button
              className="rounded-full border border-emerald-400 bg-emerald-500/30 px-5 py-1 text-xs font-bold text-emerald-100 hover:bg-emerald-500/40 shadow-md"
              onClick={handlePlaceStone}
              type="button"
            >
              Letakkan di Atas Menara 🪨
            </button>
          </div>
        </div>
      )}

      {/* Tray of Available Stones */}
      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between pb-3">
          <p className="text-[0.62rem] uppercase tracking-widest text-white/50">
            Nampan Batu Tersedia ({trayStones.length} Batu Tersisa)
          </p>
          <button
            className="text-[0.62rem] text-white/50 hover:text-white transition-colors"
            onClick={handleReset}
            type="button"
          >
            Mulai Ulang Tingkat ↺
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {trayStones.map((st) => (
            <button
              key={st.id}
              className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                selectedStone?.id === st.id
                  ? "border-amber-300 bg-amber-400/20 shadow-lg scale-105"
                  : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
              }`}
              onClick={() => {
                soundscape.playStonePlacementSound();
                setSelectedStone(st);
              }}
              type="button"
            >
              <div
                className="h-8 rounded-lg border shadow-sm"
                style={{
                  width: Math.min(65, st.width * 0.45),
                  backgroundColor: st.color,
                  borderColor: st.borderColor,
                }}
              />
              <div>
                <p className="text-xs font-semibold text-[#f5eee4] group-hover:text-amber-200 transition-colors">
                  {st.name}
                </p>
                <p className="text-[0.62rem] text-white/45">
                  Lebar {st.width}px • Bobot {st.mass}
                </p>
              </div>
            </button>
          ))}

          {trayStones.length === 0 && stack.length > 0 && (
            <p className="text-xs italic text-white/45 py-2">
              Semua batu telah ditempatkan di atas altar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
