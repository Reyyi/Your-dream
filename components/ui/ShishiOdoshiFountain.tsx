"use client";

import { useEffect, useRef, useState } from "react";
import { soundscape } from "@/lib/soundscape";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface MapleLeaf {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  vx: number;
  vy: number;
}

export function ShishiOdoshiFountain({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Bamboo water fill state: 0 to 1
  const [waterFill, setWaterFill] = useState(0);
  const [isTipping, setIsTipping] = useState(false);
  const [totalClacks, setTotalClacks] = useState(0);

  const fillRef = useRef(0);
  const tiltAngleRef = useRef(0); // 0 = resting tilted back, 0.45 = dumped forward
  const stateRef = useRef<"filling" | "dumping" | "returning">("filling");
  const ripplesRef = useRef<Ripple[]>([]);
  const leavesRef = useRef<MapleLeaf[]>([
    { id: 1, x: 0.35, y: 0.65, rotation: 0.4, scale: 0.85, vx: 0, vy: 0 },
    { id: 2, x: 0.62, y: 0.72, rotation: -0.6, scale: 1.05, vx: 0, vy: 0 },
    { id: 3, x: 0.48, y: 0.82, rotation: 1.2, scale: 0.75, vx: 0, vy: 0 },
  ]);

  // Main animation and physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let dropAccumulator = 0;

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

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

      // ──────────────────────────────────────────────────────────
      // 1. Water Fill & Tilt Logic
      // ──────────────────────────────────────────────────────────
      if (stateRef.current === "filling") {
        fillRef.current += delta * 0.18; // Fills in ~5.5s
        setWaterFill(Math.min(1, fillRef.current));

        // Random delicate water droplet ping into bamboo cavity
        dropAccumulator += delta;
        if (dropAccumulator > 1.2) {
          dropAccumulator = 0;
          soundscape.playWaterDropSound();
        }

        if (fillRef.current >= 1.0) {
          stateRef.current = "dumping";
          setIsTipping(true);
        }
      } else if (stateRef.current === "dumping") {
        // Tip forward
        tiltAngleRef.current += delta * 2.8;
        if (tiltAngleRef.current >= 0.48) {
          tiltAngleRef.current = 0.48;
          fillRef.current = 0;
          setWaterFill(0);

          // Add splash ripples to basin
          const basinCenterX = width * 0.42;
          const basinCenterY = height * 0.74;
          ripplesRef.current.push(
            { x: basinCenterX, y: basinCenterY, radius: 4, alpha: 0.9 },
            { x: basinCenterX - 6, y: basinCenterY + 4, radius: 2, alpha: 0.7 },
          );

          // Push floating leaves
          leavesRef.current.forEach((leaf) => {
            leaf.vx += (Math.random() - 0.5) * 0.04;
            leaf.vy += (Math.random() - 0.5) * 0.04;
          });

          stateRef.current = "returning";
        }
      } else if (stateRef.current === "returning") {
        // Swing backward fast
        tiltAngleRef.current -= delta * 3.4;
        if (tiltAngleRef.current <= 0) {
          tiltAngleRef.current = 0;
          stateRef.current = "filling";
          setIsTipping(false);
          setTotalClacks((prev) => prev + 1);

          // Authentic Shishi-odoshi bamboo clack on stone!
          soundscape.playShishiOdoshiClack();
        }
      }

      // ──────────────────────────────────────────────────────────
      // 2. Render Stone Tsukubai Water Basin (Background)
      // ──────────────────────────────────────────────────────────
      const basinX = width * 0.5;
      const basinY = height * 0.75;
      const basinRadiusX = width * 0.38;
      const basinRadiusY = height * 0.18;

      // Outer mossy granite rim
      const stoneGrad = ctx.createRadialGradient(
        basinX - 20,
        basinY - 15,
        basinRadiusX * 0.2,
        basinX,
        basinY,
        basinRadiusX * 1.15,
      );
      stoneGrad.addColorStop(0, "#475569");
      stoneGrad.addColorStop(0.55, "#334155");
      stoneGrad.addColorStop(0.85, "#1e293b");
      stoneGrad.addColorStop(1, "#0f172a");

      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.ellipse(basinX, basinY, basinRadiusX * 1.12, basinRadiusY * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Moss accent on basin rim
      ctx.fillStyle = "rgba(74, 114, 76, 0.4)";
      ctx.beginPath();
      ctx.ellipse(basinX - basinRadiusX * 0.4, basinY - basinRadiusY * 0.3, 18, 9, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Basin Water Cavity
      const waterGrad = ctx.createRadialGradient(
        basinX - 10,
        basinY - 8,
        5,
        basinX,
        basinY,
        basinRadiusX * 0.95,
      );
      waterGrad.addColorStop(0, "rgba(56, 189, 248, 0.32)");
      waterGrad.addColorStop(0.65, "rgba(14, 116, 144, 0.55)");
      waterGrad.addColorStop(1, "rgba(8, 47, 73, 0.85)");

      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      ctx.ellipse(basinX, basinY, basinRadiusX * 0.92, basinRadiusY * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Water Ripple Physics
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += delta * 45;
        r.alpha -= delta * 0.65;

        if (r.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.strokeStyle = `rgba(224, 242, 254, ${r.alpha * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Floating Momiji Leaves
      leavesRef.current.forEach((leaf) => {
        leaf.x += leaf.vx;
        leaf.y += leaf.vy;
        leaf.vx *= 0.96;
        leaf.vy *= 0.96;
        leaf.rotation += 0.003;

        const lx = width * leaf.x;
        const ly = height * leaf.y;

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(leaf.rotation);
        ctx.scale(leaf.scale, leaf.scale);

        // 5-lobed Japanese maple leaf drawing
        ctx.fillStyle = "#15803d"; // lush summer bamboo green
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 4;

        ctx.beginPath();
        for (let p = 0; p < 5; p++) {
          const angle = (p - 2) * 0.55;
          const leafLen = p === 2 ? 14 : 10;
          ctx.lineTo(Math.sin(angle) * leafLen, -Math.cos(angle) * leafLen);
          ctx.lineTo(Math.sin(angle + 0.28) * (leafLen * 0.5), -Math.cos(angle + 0.28) * (leafLen * 0.5));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // ──────────────────────────────────────────────────────────
      // 3. Static Feed Pipe (Kakehi Bamboo Pipe at top right)
      // ──────────────────────────────────────────────────────────
      const pipeStartX = width * 0.95;
      const pipeStartY = height * 0.18;
      const pipeEndX = width * 0.62;
      const pipeEndY = height * 0.29;

      ctx.save();
      // Pipe shadow
      ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(pipeStartX, pipeStartY + 8);
      ctx.lineTo(pipeEndX, pipeEndY + 8);
      ctx.stroke();

      // Bamboo Pipe Body
      const pipeGrad = ctx.createLinearGradient(0, pipeStartY, 0, pipeEndY + 12);
      pipeGrad.addColorStop(0, "#a3e635");
      pipeGrad.addColorStop(0.45, "#65a30d");
      pipeGrad.addColorStop(1, "#365314");

      ctx.strokeStyle = pipeGrad;
      ctx.lineWidth = 11;
      ctx.beginPath();
      ctx.moveTo(pipeStartX, pipeStartY);
      ctx.lineTo(pipeEndX, pipeEndY);
      ctx.stroke();

      // Pipe bamboo node segment ring
      ctx.strokeStyle = "#4d7c0f";
      ctx.lineWidth = 3;
      const midPipeX = (pipeStartX + pipeEndX) / 2;
      const midPipeY = (pipeStartY + pipeEndY) / 2;
      ctx.beginPath();
      ctx.moveTo(midPipeX - 2, midPipeY - 6);
      ctx.lineTo(midPipeX + 2, midPipeY + 6);
      ctx.stroke();

      // Water stream dripping from Kakehi into the rocker
      ctx.strokeStyle = "rgba(186, 230, 253, 0.85)";
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(pipeEndX - 2, pipeEndY + 4);
      const dripEndY = height * 0.42;
      ctx.lineTo(pipeEndX - 6, dripEndY);
      ctx.stroke();
      ctx.restore();

      // ──────────────────────────────────────────────────────────
      // 4. Pivoting Bamboo Rocker Tube (Shishi-odoshi)
      // ──────────────────────────────────────────────────────────
      const pivotX = width * 0.52;
      const pivotY = height * 0.44;

      ctx.save();
      ctx.translate(pivotX, pivotY);
      // Resting angle is -0.16 rad, tilting down to +0.32 rad
      const currentAngle = -0.16 + tiltAngleRef.current;
      ctx.rotate(currentAngle);

      // Tube dimensions
      const tubeLenLeft = width * 0.38; // hollow snout dipping into basin
      const tubeLenRight = width * 0.22; // rear cavity catching water

      // Bamboo Rocker Body
      const rockerGrad = ctx.createLinearGradient(0, -9, 0, 9);
      rockerGrad.addColorStop(0, "#bef264"); // top fresh bamboo highlight
      rockerGrad.addColorStop(0.35, "#84cc16");
      rockerGrad.addColorStop(0.85, "#4d7c0f");
      rockerGrad.addColorStop(1, "#1a2e05");

      ctx.fillStyle = rockerGrad;
      ctx.beginPath();
      // Draw hollow sliced snout on left end
      ctx.moveTo(-tubeLenLeft, 4);
      ctx.lineTo(-tubeLenLeft + 16, -7);
      ctx.lineTo(tubeLenRight, -7);
      ctx.lineTo(tubeLenRight, 7);
      ctx.lineTo(-tubeLenLeft, 7);
      ctx.closePath();
      ctx.fill();

      // Bamboo joint ring
      ctx.strokeStyle = "#365314";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-tubeLenLeft * 0.4, -7);
      ctx.lineTo(-tubeLenLeft * 0.4, 7);
      ctx.stroke();

      // Water pouring out from snout when dumping
      if (stateRef.current === "dumping" || (stateRef.current === "returning" && tiltAngleRef.current > 0.2)) {
        ctx.fillStyle = "rgba(186, 230, 253, 0.75)";
        ctx.beginPath();
        ctx.moveTo(-tubeLenLeft, 4);
        ctx.quadraticCurveTo(-tubeLenLeft - 18, 12, -tubeLenLeft - 24, 45);
        ctx.lineTo(-tubeLenLeft - 14, 45);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      // ──────────────────────────────────────────────────────────
      // 5. Wooden Support Pivot Post & Base Clack Stone
      // ──────────────────────────────────────────────────────────
      // Support post
      ctx.fillStyle = "#78350f";
      ctx.fillRect(pivotX - 5, pivotY - 4, 10, height * 0.28);
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 1;
      ctx.strokeRect(pivotX - 5, pivotY - 4, 10, height * 0.28);

      // Pivot pin
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Clack Stone under the rear of the tube
      const stoneStopX = pivotX + width * 0.18;
      const stoneStopY = pivotY + height * 0.14;
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.ellipse(stoneStopX, stoneStopY, 24, 14, -0.15, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleManualTip = () => {
    if (stateRef.current === "filling") {
      fillRef.current = 1.0;
      soundscape.playWaterDropSound();
    }
  };

  const handleBasinClick = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left);
    const clickY = (e.clientY - rect.top);

    soundscape.playWaterDropSound();
    ripplesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 4,
      alpha: 0.95,
    });
  };

  return (
    <div
      className={`glass-panel relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-slate-950/45 p-6 backdrop-blur-xl ${className}`}
    >
      {/* Header Info */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-sm text-emerald-300">
            🎋
          </span>
          <div>
            <h3 className="font-display text-base font-semibold text-[#f5eee4]">
              Pancuran Bambu Shishi-odoshi
            </h3>
            <p className="text-[0.6rem] text-emerald-200/60 uppercase tracking-widest">
              Ritme Keheningan Air &amp; Kayu
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
          <span className="text-white/50 text-[0.62rem]">Ketukan Zen:</span>
          <span className="font-mono text-emerald-300 font-bold">{totalClacks}</span>
        </div>
      </div>

      {/* Main Canvas Simulation */}
      <div className="relative mt-4 w-full h-[300px] sm:h-[340px] cursor-pointer" onClick={handleBasinClick}>
        <canvas
          ref={canvasRef}
          className="h-full w-full block rounded-2xl"
          title="Klik kolam untuk membuat riak air atau ketuk bambu untuk menuang"
        />

        {/* Floating guidance hint */}
        <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex justify-between text-[0.62rem] text-white/50">
          <span>Sentuh kolam air untuk riak daun maple</span>
          <span className="text-emerald-300/80">
            {isTipping ? "Menuang air..." : `Mengisi rongga bambu: ${Math.round(waterFill * 100)}%`}
          </span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300 transition-all duration-150"
              style={{ width: `${waterFill * 100}%` }}
            />
          </div>
          <span className="font-mono text-[0.62rem] text-white/50">Air Terkumpul</span>
        </div>

        <button
          className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-1.5 text-xs font-medium text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/25 transition-all active:scale-95 shadow-md"
          onClick={handleManualTip}
          type="button"
        >
          Tuang Bambu Sekarang ↺
        </button>
      </div>
    </div>
  );
}
