"use client";

import { useEffect, useRef } from "react";

interface CosmicOscilloscopeProps {
  isPlaying: boolean;
  frequency?: number;
  height?: number;
  className?: string;
}

export function CosmicOscilloscope({
  isPlaying,
  frequency = 432,
  height = 84,
  className = "",
}: CosmicOscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isMounted = true;

    const render = () => {
      if (!isMounted) return;

      const width = canvas.clientWidth;
      const h = height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (canvas.width !== width * dpr || canvas.height !== h * dpr) {
        canvas.width = width * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, h);

      const midY = h / 2;

      // Subtle background grid lines (oscilloscope reticle)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;

      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Vertical tick marks
      const step = 28;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, midY - 3);
        ctx.lineTo(x, midY + 3);
        ctx.stroke();
      }

      // Waveform animation
      const speed = isPlaying ? 0.08 : 0.02;
      phaseRef.current += speed;
      const phase = phaseRef.current;

      const amp = isPlaying ? 22 : 6;
      const freqScale = (frequency / 432) * 0.028;

      // Primary Golden Carrier Wave
      ctx.beginPath();
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = isPlaying ? "rgba(251, 191, 36, 0.95)" : "rgba(255, 245, 215, 0.4)";
      ctx.shadowColor = isPlaying ? "rgba(245, 158, 11, 0.85)" : "transparent";
      ctx.shadowBlur = isPlaying ? 8 : 0;

      for (let x = 0; x < width; x++) {
        // Multi-frequency harmonic superposition
        const y1 = Math.sin(x * freqScale + phase);
        const y2 = Math.sin(x * freqScale * 2.1 - phase * 1.4) * 0.35;
        const y3 = isPlaying ? Math.cos(x * 0.08 + phase * 2.6) * 0.15 : 0;

        // Taper edges to prevent abrupt clipping
        const edgeTaper = Math.sin((x / width) * Math.PI);
        const y = midY + (y1 + y2 + y3) * amp * edgeTaper;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary Ethereal Ghost Wave (Harmonic reflection)
      if (isPlaying) {
        ctx.beginPath();
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = "rgba(192, 132, 252, 0.5)";
        ctx.shadowBlur = 0;

        for (let x = 0; x < width; x++) {
          const yHarmonic = Math.sin(x * freqScale * 1.5 + phase * 0.8) * amp * 0.45;
          const edgeTaper = Math.sin((x / width) * Math.PI);
          const y = midY - yHarmonic * edgeTaper;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();
      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frequency, height]);

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 ${className}`}>
      <canvas
        ref={canvasRef}
        className="block w-full"
        style={{ height }}
      />
      <div className="pointer-events-none absolute left-3 top-2 flex items-center gap-1.5 text-[0.55rem] font-mono uppercase tracking-widest text-amber-300/80">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-amber-400 animate-pulse" : "bg-white/30"}`} />
        <span>{isPlaying ? "MODULASI TRANSMISI AKTIF" : "GELOMBANG PEMBAWA STANDBY"}</span>
      </div>
    </div>
  );
}
