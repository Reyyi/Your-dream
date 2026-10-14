"use client";

import { useEffect, useRef, useState } from "react";
import { soundscape } from "@/lib/soundscape";

interface MandalaNode {
  id: number;
  x: number; // percentage 0 to 1
  y: number; // percentage 0 to 1
  label?: string;
}

interface MandalaEdge {
  from: number;
  to: number;
}

interface MandalaLevel {
  level: number;
  title: string;
  japaneseTitle: string;
  meaning: string;
  nodes: MandalaNode[];
  edges: MandalaEdge[];
}

const MANDALA_LEVELS: MandalaLevel[] = [
  {
    level: 1,
    title: "Segitiga Gunung Fuji",
    japaneseTitle: "富士山の調和",
    meaning: "Puncak keteguhan alam yang menembus kabut pagi.",
    nodes: [
      { id: 0, x: 0.5, y: 0.18 },
      { id: 1, x: 0.22, y: 0.78 },
      { id: 2, x: 0.78, y: 0.78 },
      { id: 3, x: 0.5, y: 0.52 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ],
  },
  {
    level: 2,
    title: "Gerbang Suci Torii",
    japaneseTitle: "鳥居の門",
    meaning: "Batas peralihan dari kebisingan dunia menuju keheningan batin.",
    nodes: [
      { id: 0, x: 0.24, y: 0.24 },
      { id: 1, x: 0.76, y: 0.24 },
      { id: 2, x: 0.32, y: 0.44 },
      { id: 3, x: 0.68, y: 0.44 },
      { id: 4, x: 0.32, y: 0.82 },
      { id: 5, x: 0.68, y: 0.82 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
      { from: 2, to: 5 },
    ],
  },
  {
    level: 3,
    title: "Bintang Pola Asanoha",
    japaneseTitle: "麻の葉",
    meaning: "Pola geometris daun rami tradisional simbol pertumbuhan sehat dan ketabahan.",
    nodes: [
      { id: 0, x: 0.5, y: 0.16 },
      { id: 1, x: 0.82, y: 0.38 },
      { id: 2, x: 0.82, y: 0.76 },
      { id: 3, x: 0.5, y: 0.88 },
      { id: 4, x: 0.18, y: 0.76 },
      { id: 5, x: 0.18, y: 0.38 },
      { id: 6, x: 0.5, y: 0.52 }, // Center
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 0, to: 6 },
      { from: 2, to: 6 },
      { from: 4, to: 6 },
    ],
  },
  {
    level: 4,
    title: "Tujuh Permata Shippo",
    japaneseTitle: "七宝文様",
    meaning: "Simbol lingkaran saling bertaut lambang harmoni tanpa batas.",
    nodes: [
      { id: 0, x: 0.5, y: 0.16 },
      { id: 1, x: 0.78, y: 0.32 },
      { id: 2, x: 0.84, y: 0.68 },
      { id: 3, x: 0.62, y: 0.86 },
      { id: 4, x: 0.38, y: 0.86 },
      { id: 5, x: 0.16, y: 0.68 },
      { id: 6, x: 0.22, y: 0.32 },
      { id: 7, x: 0.5, y: 0.42 },
      { id: 8, x: 0.5, y: 0.68 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 0 },
      { from: 0, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 3 },
      { from: 8, to: 4 },
      { from: 7, to: 1 },
    ],
  },
  {
    level: 5,
    title: "Lingkaran Pencerahan Enso",
    japaneseTitle: "円相の境地",
    meaning: "Satu sapuan kuas utuh melambangkan kebebasan pikiran dan kesederhanaan hakiki.",
    nodes: [
      { id: 0, x: 0.5, y: 0.14 },
      { id: 1, x: 0.76, y: 0.22 },
      { id: 2, x: 0.88, y: 0.5 },
      { id: 3, x: 0.76, y: 0.78 },
      { id: 4, x: 0.5, y: 0.88 },
      { id: 5, x: 0.24, y: 0.78 },
      { id: 6, x: 0.12, y: 0.5 },
      { id: 7, x: 0.24, y: 0.22 },
      { id: 8, x: 0.4, y: 0.46 },
      { id: 9, x: 0.6, y: 0.54 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 0 },
      { from: 0, to: 8 },
      { from: 8, to: 9 },
      { from: 9, to: 4 },
      { from: 8, to: 6 },
      { from: 9, to: 2 },
    ],
  },
];

// Pentatonic solfeggio koto scale notes
const KOTO_FREQUENCIES = [330, 392, 440, 528, 587, 660, 784, 880];

export function ZenEulerSandMandala({ className = "" }: { className?: string }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const level = MANDALA_LEVELS[levelIndex];

  // Path history: sequence of visited nodes
  const [path, setPath] = useState<number[]>([]);
  const [currentNode, setCurrentNode] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStuck, setIsStuck] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset when level changes
  useEffect(() => {
    setPath([]);
    setCurrentNode(null);
    setIsCompleted(false);
    setIsStuck(false);
  }, [levelIndex]);

  // Check if an edge is already traversed
  const isEdgeTraversed = (a: number, b: number) => {
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      if ((u === a && v === b) || (u === b && v === a)) {
        return true;
      }
    }
    return false;
  };

  // Check if an edge exists in the puzzle definition
  const edgeExists = (a: number, b: number) => {
    return level.edges.some(
      (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
    );
  };

  // Count traversed edges
  const traversedEdgeCount = Math.max(0, path.length - 1);
  const totalEdgeCount = level.edges.length;

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // 1. Draw all Puzzle Edges (Unvisited = subtle sand indentation)
    level.edges.forEach((edge) => {
      const n1 = level.nodes[edge.from];
      const n2 = level.nodes[edge.to];
      const x1 = n1.x * width;
      const y1 = n1.y * height;
      const x2 = n2.x * width;
      const y2 = n2.y * height;

      const traversed = isEdgeTraversed(edge.from, edge.to);

      if (traversed) {
        // Glowing Golden Furrow Raked Line
        ctx.strokeStyle = "rgba(251, 191, 36, 0.95)";
        ctx.lineWidth = 4.5;
        ctx.shadowColor = "rgba(245, 158, 11, 0.75)";
        ctx.shadowBlur = 12;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner bright core
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else {
        // Unraked guideline
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2.0;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    // 2. Draw all Nodes (Sacred Sand Garden Focus Stones)
    level.nodes.forEach((node) => {
      const nx = node.x * width;
      const ny = node.y * height;

      const isCurrent = currentNode === node.id;
      const isStartCandidate = currentNode === null;

      // Check if this node has available unvisited edges
      const hasAvailable = level.edges.some(
        (e) =>
          ((e.from === node.id && !isEdgeTraversed(e.from, e.to)) ||
            (e.to === node.id && !isEdgeTraversed(e.from, e.to))) &&
          (currentNode === null || edgeExists(currentNode, node.id)),
      );

      // Node Shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = isCurrent ? "#f59e0b" : hasAvailable ? "#475569" : "#1e293b";
      ctx.beginPath();
      ctx.arc(nx, ny, isCurrent ? 14 : 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node Border
      ctx.strokeStyle = isCurrent
        ? "#fef08a"
        : hasAvailable
        ? "rgba(255, 255, 255, 0.45)"
        : "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = isCurrent ? 3 : 1.5;
      ctx.beginPath();
      ctx.arc(nx, ny, isCurrent ? 14 : 11, 0, Math.PI * 2);
      ctx.stroke();

      // Center gold pearl
      ctx.fillStyle = isCurrent ? "#ffffff" : isStartCandidate ? "#fbbf24" : "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }, [level, path, currentNode]);

  const handleNodeClick = (nodeId: number) => {
    if (isCompleted) return;

    if (currentNode === null) {
      // First node chosen: start the single-stroke path!
      soundscape.playKotoPluck(KOTO_FREQUENCIES[0]);
      setCurrentNode(nodeId);
      setPath([nodeId]);
      return;
    }

    if (nodeId === currentNode) return;

    // Check if valid edge exists
    if (!edgeExists(currentNode, nodeId)) return;

    // Check if edge is already traversed
    if (isEdgeTraversed(currentNode, nodeId)) return;

    // Play next note on koto scale
    const noteFreq = KOTO_FREQUENCIES[path.length % KOTO_FREQUENCIES.length];
    soundscape.playKotoPluck(noteFreq);

    const newPath = [...path, nodeId];
    setPath(newPath);
    setCurrentNode(nodeId);

    // Check completion condition
    if (newPath.length - 1 === totalEdgeCount) {
      setIsCompleted(true);
      setIsStuck(false);
      soundscape.playZenSingingBowlSound(240);
      return;
    }

    // Check if stuck (no more untraversed edges from new current node)
    const hasNext = level.edges.some((e) => {
      const match = (e.from === nodeId && !isEdgeTraversed(e.from, e.to)) ||
                    (e.to === nodeId && !isEdgeTraversed(e.from, e.to));
      // edge from nodeId to other node must not be the one just taken
      if (!match) return false;
      const other = e.from === nodeId ? e.to : e.from;
      return !(nodeId === currentNode && other === nodeId);
    });

    if (!hasNext && newPath.length - 1 < totalEdgeCount) {
      setIsStuck(true);
      soundscape.playWaterDropSound();
    } else {
      setIsStuck(false);
    }
  };

  const handleUndo = () => {
    if (path.length <= 1) {
      handleReset();
      return;
    }
    soundscape.playWaterDropSound();
    const newPath = path.slice(0, path.length - 1);
    setPath(newPath);
    setCurrentNode(newPath[newPath.length - 1]);
    setIsCompleted(false);
    setIsStuck(false);
  };

  const handleReset = () => {
    soundscape.playWaterDropSound();
    setPath([]);
    setCurrentNode(null);
    setIsCompleted(false);
    setIsStuck(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Find closest node within touch radius (32px)
    for (let i = 0; i < level.nodes.length; i++) {
      const node = level.nodes[i];
      const nx = node.x * width;
      const ny = node.y * height;
      const dist = Math.hypot(x - nx, y - ny);
      if (dist < 32) {
        handleNodeClick(node.id);
        break;
      }
    }
  };

  return (
    <div
      className={`glass-panel flex flex-col rounded-[2rem] border border-amber-400/25 bg-slate-950/50 p-6 backdrop-blur-xl ${className}`}
    >
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[0.6rem] font-mono uppercase tracking-[0.25em] text-amber-300">
            TEKA-TEKI LABIRIN ALUR SATU GARIS
          </span>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg text-[#fff5e6] sm:text-xl">
              {level.title}
            </h3>
            <span className="font-serif text-xs text-amber-200/60">
              ({level.japaneseTitle})
            </span>
          </div>
          <p className="mt-1 text-xs text-white/65">{level.meaning}</p>
        </div>

        {/* Level Selector Dots */}
        <div className="flex items-center gap-2">
          {MANDALA_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.level}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold transition-all ${
                idx === levelIndex
                  ? "border border-amber-400 bg-amber-400/25 text-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                  : idx < levelIndex
                  ? "bg-white/15 text-white/80"
                  : "bg-white/5 text-white/30"
              }`}
              onClick={() => {
                soundscape.playPrismRotateSound();
                setLevelIndex(idx);
              }}
              type="button"
            >
              {lvl.level}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mandala Canvas Area */}
      <div className="relative mt-5 flex h-[380px] sm:h-[440px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-stone-800 bg-gradient-to-b from-[#181a24] to-[#11131a] p-4 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full block cursor-pointer select-none"
          onClick={handleCanvasClick}
          title="Klik titik batu untuk menarik alur pasir tanpa mengulang garis"
        />

        {/* Guidance Prompt */}
        {currentNode === null && (
          <div className="pointer-events-none absolute top-4 rounded-full border border-amber-300/30 bg-amber-950/60 px-4 py-1.5 text-xs text-amber-200 backdrop-blur-md shadow-lg animate-pulse">
            Pilih titik awal batu mana saja di kanvas untuk mulai menyisir
          </div>
        )}

        {/* Stuck Warning */}
        {isStuck && !isCompleted && (
          <div className="absolute top-4 flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-950/80 px-4 py-1.5 text-xs text-rose-200 backdrop-blur-md shadow-lg animate-bounce">
            <span>Jalur terhenti! Tidak ada garis tersisa dari titik ini. Tekan Mundur ↺</span>
          </div>
        )}

        {/* Completion Modal Celebration */}
        {isCompleted && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/65 backdrop-blur-md p-6 text-center animate-in fade-in duration-500">
            <span className="text-4xl">🌸✨</span>
            <h4 className="mt-3 font-display text-2xl text-amber-200">
              Mandala Alur Sempurna
            </h4>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/80">
              Satu garis utuh mengalir tanpa henti dan tanpa tumpang tindih, menyatukan seluruh harmoni geometri pasir.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white hover:bg-white/20 transition-all"
                onClick={handleReset}
                type="button"
              >
                Sisir Ulang ↺
              </button>
              {levelIndex < MANDALA_LEVELS.length - 1 && (
                <button
                  className="rounded-full border border-amber-400 bg-amber-400/30 px-6 py-2 text-xs font-bold text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:bg-amber-400/40 transition-all"
                  onClick={() => setLevelIndex((prev) => prev + 1)}
                  type="button"
                >
                  Tingkat Geometri Berikutnya →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress & Controls Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[0.62rem] text-white/50 uppercase tracking-widest">Alur Tersisir:</span>
            <span className="font-mono text-sm font-bold text-amber-300">
              {traversedEdgeCount} / {totalEdgeCount}
            </span>
          </div>

          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-200"
              style={{ width: `${(traversedEdgeCount / totalEdgeCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs text-white/70 hover:text-white transition-all disabled:opacity-30"
            disabled={path.length <= 1}
            onClick={handleUndo}
            type="button"
          >
            Langkah Mundur ↶
          </button>
          <button
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs text-white/70 hover:text-white transition-all disabled:opacity-30"
            disabled={path.length === 0}
            onClick={handleReset}
            type="button"
          >
            Mulai Ulang ↺
          </button>
        </div>
      </div>
    </div>
  );
}
