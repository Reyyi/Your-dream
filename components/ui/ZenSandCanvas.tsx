"use client";

import { useEffect, useRef, useState } from "react";
import { soundscape } from "@/lib/soundscape";

type RakeTool = "rake3" | "rake5" | "smooth" | "stone";
type StoneType = "andesit" | "granit" | "kuarsa" | "basal";

interface PlacedStone {
  id: string;
  x: number; // 0 to 1
  y: number; // 0 to 1
  radius: number;
  type: StoneType;
  rotation: number;
}

export function ZenSandCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sandDataCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [tool, setTool] = useState<RakeTool>("rake3");
  const [selectedStoneType, setSelectedStoneType] = useState<StoneType>("andesit");
  const [stones, setStones] = useState<PlacedStone[]>([
    { id: "s1", x: 0.32, y: 0.42, radius: 26, type: "granit", rotation: 0.2 },
    { id: "s2", x: 0.72, y: 0.58, radius: 34, type: "andesit", rotation: -0.4 },
    { id: "s3", x: 0.52, y: 0.75, radius: 20, type: "kuarsa", rotation: 0.8 },
  ]);

  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const soundThrottleRef = useRef(0);

  // Initialize sand height/groove buffer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!sandDataCanvasRef.current) {
      sandDataCanvasRef.current = document.createElement("canvas");
      sandDataCanvasRef.current.width = 1200;
      sandDataCanvasRef.current.height = 750;
      const sCtx = sandDataCanvasRef.current.getContext("2d");
      if (sCtx) {
        // Base textured gravel tone
        sCtx.fillStyle = "#e2d9cc";
        sCtx.fillRect(0, 0, 1200, 750);

        // Initial concentric ripples around default stones
        drawStoneRipples(sCtx, 0.32 * 1200, 0.42 * 750, 26 * 1.5);
        drawStoneRipples(sCtx, 0.72 * 1200, 0.58 * 750, 34 * 1.5);
        drawStoneRipples(sCtx, 0.52 * 1200, 0.75 * 750, 20 * 1.5);
      }
    }

    renderSand();
  }, []);

  const drawStoneRipples = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
    ctx.save();
    for (let i = 1; i <= 4; i++) {
      const ringRadius = r + i * 16;
      // Ridge highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius - 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Furrow shadow
      ctx.strokeStyle = "rgba(120, 110, 95, 0.5)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  const renderSand = () => {
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

    // 1. Draw Raked Sand Grooves from buffer
    if (sandDataCanvasRef.current) {
      ctx.drawImage(sandDataCanvasRef.current, 0, 0, width, height);
    }

    // 2. Render Placed Natural Stones
    stones.forEach((stone) => {
      const sx = stone.x * width;
      const sy = stone.y * height;
      const r = stone.radius;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(stone.rotation);

      // Deep Stone Contact Shadow
      ctx.shadowColor = "rgba(40, 32, 24, 0.55)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 6;

      // Stone Body by geological type
      const stoneGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.4, 2, 0, 0, r);

      if (stone.type === "granit") {
        stoneGrad.addColorStop(0, "#94a3b8");
        stoneGrad.addColorStop(0.45, "#475569");
        stoneGrad.addColorStop(0.85, "#334155");
        stoneGrad.addColorStop(1, "#1e293b");
      } else if (stone.type === "kuarsa") {
        stoneGrad.addColorStop(0, "#ffffff");
        stoneGrad.addColorStop(0.4, "#f1f5f9");
        stoneGrad.addColorStop(0.8, "#cbd5e1");
        stoneGrad.addColorStop(1, "#94a3b8");
      } else if (stone.type === "basal") {
        stoneGrad.addColorStop(0, "#334155");
        stoneGrad.addColorStop(0.5, "#1e293b");
        stoneGrad.addColorStop(0.85, "#0f172a");
        stoneGrad.addColorStop(1, "#020617");
      } else {
        // Andesit (river brown-grey)
        stoneGrad.addColorStop(0, "#78716c");
        stoneGrad.addColorStop(0.5, "#57534e");
        stoneGrad.addColorStop(0.85, "#44403c");
        stoneGrad.addColorStop(1, "#292524");
      }

      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();

      // Delicate moss patch on top edge
      if (stone.type === "andesit" || stone.type === "granit") {
        ctx.fillStyle = "rgba(74, 114, 76, 0.55)";
        ctx.beginPath();
        ctx.ellipse(-r * 0.25, -r * 0.3, r * 0.35, r * 0.2, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "stone") {
      // Place a new stone
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const newStone: PlacedStone = {
        id: `stone-${Date.now()}`,
        x: x / width,
        y: y / height,
        radius: selectedStoneType === "andesit" ? 32 : selectedStoneType === "granit" ? 28 : selectedStoneType === "kuarsa" ? 22 : 36,
        type: selectedStoneType,
        rotation: (Math.random() - 0.5) * 1.5,
      };

      soundscape.playStonePlacementSound();

      // Add ripples to buffer
      if (sandDataCanvasRef.current) {
        const sCtx = sandDataCanvasRef.current.getContext("2d");
        if (sCtx) {
          const sX = (x / width) * sandDataCanvasRef.current.width;
          const sY = (y / height) * sandDataCanvasRef.current.height;
          drawStoneRipples(sCtx, sX, sY, newStone.radius * 1.5);
        }
      }

      setStones((prev) => [...prev, newStone]);
      renderSand();
      return;
    }

    isDrawingRef.current = true;
    lastPosRef.current = { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas || !sandDataCanvasRef.current) return;
    const sCtx = sandDataCanvasRef.current.getContext("2d");
    if (!sCtx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const sWidth = sandDataCanvasRef.current.width;
    const sHeight = sandDataCanvasRef.current.height;

    const x0 = (lastPosRef.current.x / width) * sWidth;
    const y0 = (lastPosRef.current.y / height) * sHeight;
    const x1 = (x / width) * sWidth;
    const y1 = (y / height) * sHeight;

    // Rake acoustics throttle
    const now = performance.now();
    if (now - soundThrottleRef.current > 70) {
      soundThrottleRef.current = now;
      soundscape.playRakeSandSound();
    }

    sCtx.save();

    if (tool === "smooth") {
      // Pebble smoothing stone
      sCtx.strokeStyle = "#e2d9cc";
      sCtx.lineWidth = 44;
      sCtx.lineCap = "round";
      sCtx.lineJoin = "round";
      sCtx.beginPath();
      sCtx.moveTo(x0, y0);
      sCtx.lineTo(x1, y1);
      sCtx.stroke();
    } else {
      // Multi-tooth wooden Kumade rake (rake3 = 3 furrows, rake5 = 5 furrows)
      const prongs = tool === "rake3" ? [-12, 0, 12] : [-22, -11, 0, 11, 22];
      const angle = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2;

      prongs.forEach((offset) => {
        const ox = Math.cos(angle) * offset;
        const oy = Math.sin(angle) * offset;

        // Sand furrow ridge highlight (sunlit side)
        sCtx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        sCtx.lineWidth = 2.0;
        sCtx.lineCap = "round";
        sCtx.beginPath();
        sCtx.moveTo(x0 + ox - 1.5, y0 + oy - 1.5);
        sCtx.lineTo(x1 + ox - 1.5, y1 + oy - 1.5);
        sCtx.stroke();

        // Sand furrow depression shadow
        sCtx.strokeStyle = "rgba(125, 115, 100, 0.52)";
        sCtx.lineWidth = 4.0;
        sCtx.lineCap = "round";
        sCtx.beginPath();
        sCtx.moveTo(x0 + ox, y0 + oy);
        sCtx.lineTo(x1 + ox, y1 + oy);
        sCtx.stroke();
      });
    }

    sCtx.restore();

    lastPosRef.current = { x, y };
    renderSand();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleClearSand = () => {
    soundscape.playZenSingingBowlSound(240);
    const sCanvas = sandDataCanvasRef.current;
    if (!sCanvas) return;
    const sCtx = sCanvas.getContext("2d");
    if (!sCtx) return;

    sCtx.fillStyle = "#e2d9cc";
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);

    // Redraw ripples around existing stones
    const width = sCanvas.width;
    const height = sCanvas.height;
    stones.forEach((st) => {
      drawStoneRipples(sCtx, st.x * width, st.y * height, st.radius * 1.5);
    });

    renderSand();
  };

  const handleRemoveLastStone = () => {
    if (stones.length === 0) return;
    soundscape.playWaterDropSound();
    setStones((prev) => prev.slice(0, prev.length - 1));
    setTimeout(handleClearSand, 50);
  };

  return (
    <div
      className={`glass-panel flex flex-col rounded-[2rem] border border-amber-300/20 bg-slate-950/45 p-6 backdrop-blur-xl ${className}`}
    >
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display text-lg text-[#fff5e4] sm:text-xl">
            Kanvas Pasir Zen Karesansui
          </h3>
          <p className="text-[0.62rem] text-amber-200/60 uppercase tracking-widest">
            Taman Kering Batu &amp; Alur Pasir Meditatif
          </p>
        </div>

        {/* Toolbar Modes */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
              tool === "rake3"
                ? "border-amber-300 bg-amber-400/20 text-amber-200 shadow-md"
                : "border-white/15 bg-white/[0.03] text-white/70 hover:text-white"
            }`}
            onClick={() => {
              soundscape.playRakeSandSound();
              setTool("rake3");
            }}
            type="button"
          >
            <span>彡</span>
            <span>Garu 3 Alur</span>
          </button>

          <button
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
              tool === "rake5"
                ? "border-amber-300 bg-amber-400/20 text-amber-200 shadow-md"
                : "border-white/15 bg-white/[0.03] text-white/70 hover:text-white"
            }`}
            onClick={() => {
              soundscape.playRakeSandSound();
              setTool("rake5");
            }}
            type="button"
          >
            <span>川</span>
            <span>Garu 5 Alur</span>
          </button>

          <button
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
              tool === "smooth"
                ? "border-amber-300 bg-amber-400/20 text-amber-200 shadow-md"
                : "border-white/15 bg-white/[0.03] text-white/70 hover:text-white"
            }`}
            onClick={() => {
              soundscape.playRakeSandSound();
              setTool("smooth");
            }}
            type="button"
          >
            <span>◯</span>
            <span>Batu Perata</span>
          </button>

          <button
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-all ${
              tool === "stone"
                ? "border-emerald-300 bg-emerald-500/20 text-emerald-200 shadow-md"
                : "border-white/15 bg-white/[0.03] text-white/70 hover:text-white"
            }`}
            onClick={() => {
              soundscape.playStonePlacementSound();
              setTool("stone");
            }}
            type="button"
          >
            <span>🪨</span>
            <span>Letakkan Batu</span>
          </button>
        </div>
      </div>

      {/* Secondary Sub-toolbar if Stone mode is active */}
      {tool === "stone" && (
        <div className="flex flex-wrap items-center gap-3 border-b border-white/5 py-2.5 text-xs">
          <span className="text-[0.62rem] text-white/50 uppercase tracking-wider">
            Jenis Batu Alami:
          </span>
          {(["andesit", "granit", "kuarsa", "basal"] as StoneType[]).map((st) => (
            <button
              key={st}
              className={`rounded-lg border px-2.5 py-1 text-[0.68rem] capitalize transition-all ${
                selectedStoneType === st
                  ? "border-emerald-300 bg-emerald-400/20 text-emerald-100"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
              }`}
              onClick={() => setSelectedStoneType(st)}
              type="button"
            >
              {st}
            </button>
          ))}
          <span className="ml-auto text-[0.6rem] text-amber-200/70">
            Klik kanvas pasir di bawah untuk meletakkan batu
          </span>
        </div>
      )}

      {/* Main Interactive Sand Canvas */}
      <div className="relative mt-4 h-[380px] sm:h-[460px] w-full overflow-hidden rounded-2xl border border-stone-800 shadow-2xl">
        <canvas
          ref={canvasRef}
          className="h-full w-full block cursor-crosshair touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        {/* Tactile Sand Status Hint */}
        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex justify-between text-[0.62rem] text-stone-700 font-medium">
          <span>Tarik kursor atau jarimu di pasir untuk menyisir alur air</span>
          <span>Batu Sungai Aktif: {stones.length}</span>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-[0.65rem] text-white/55">
          Filosofi Karesansui: Garis pasir merepresentasikan aliran air, sedangkan batu melambangkan keteguhan pulau hidup.
        </div>

        <div className="flex items-center gap-2">
          {stones.length > 0 && (
            <button
              className="rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/70 hover:text-white transition-all"
              onClick={handleRemoveLastStone}
              type="button"
            >
              Angkat Batu Terakhir
            </button>
          )}

          <button
            className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-200 hover:border-amber-300 hover:bg-amber-400/20 transition-all active:scale-95 shadow-md"
            onClick={handleClearSand}
            type="button"
          >
            Ratakan Kembali Pasir ↺
          </button>
        </div>
      </div>
    </div>
  );
}
