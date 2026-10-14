"use client";

import { useEffect, useRef, useState } from "react";
import { soundscape } from "@/lib/soundscape";

interface GoldenRecordDiscProps {
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  frequency?: number;
  size?: number;
  glyphId?: number;
  interactive?: boolean;
  className?: string;
}

export function GoldenRecordDisc({
  isPlaying = false,
  onTogglePlay,
  frequency = 432,
  size = 280,
  glyphId = 1,
  interactive = true,
  className = "",
}: GoldenRecordDiscProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI crisp rendering
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const center = size / 2;
    const radius = size * 0.46;

    let lastTime = performance.now();

    const draw = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Update rotation
      if (isPlaying) {
        rotationRef.current += delta * 0.55; // ~33 RPM aesthetic
      } else if (isHovered) {
        rotationRef.current += delta * 0.15;
      }

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(rotationRef.current);

      // 1. Outer Deep Space Glow
      const ambientGlow = ctx.createRadialGradient(0, 0, radius * 0.7, 0, 0, radius * 1.08);
      ambientGlow.addColorStop(0, "rgba(234, 179, 8, 0.28)");
      ambientGlow.addColorStop(0.85, "rgba(217, 119, 6, 0.08)");
      ambientGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.08, 0, Math.PI * 2);
      ctx.fill();

      // 2. Base Solid Gold Disc Platter
      const goldPlatter = ctx.createRadialGradient(-radius * 0.35, -radius * 0.35, radius * 0.1, 0, 0, radius);
      goldPlatter.addColorStop(0, "#fde68a"); // warm lustrous gold highlight
      goldPlatter.addColorStop(0.35, "#d97706"); // rich amber-gold body
      goldPlatter.addColorStop(0.75, "#92400e"); // deep bronze reflection
      goldPlatter.addColorStop(0.98, "#451a03"); // rim contrast
      goldPlatter.addColorStop(1, "#271003"); // sharp outer edge
      ctx.fillStyle = goldPlatter;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Etched Concentric Phonograph Grooves
      ctx.strokeStyle = "rgba(255, 245, 210, 0.14)";
      ctx.lineWidth = 0.85;
      for (let r = radius * 0.38; r < radius * 0.94; r += 2.8) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // High-contrast groove banks (sound track divisions)
      ctx.strokeStyle = "rgba(69, 26, 3, 0.4)";
      ctx.lineWidth = 1.4;
      [0.52, 0.68, 0.82].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(0, 0, radius * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 4. Iconic Voyager Pulsar Map & Coordinate Diagram
      ctx.strokeStyle = "rgba(255, 248, 220, 0.72)";
      ctx.lineWidth = 1.0;

      // 14 Pulsar lines radiating from the galactic sun center
      const pulsarAngles = [
        0, 0.35, 0.72, 1.15, 1.62, 2.05, 2.54, 3.14, 3.65, 4.12, 4.68, 5.18, 5.72, 6.1,
      ];
      pulsarAngles.forEach((angle, idx) => {
        const len = radius * (0.22 + ((idx * 7) % 11) * 0.015);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
        ctx.stroke();

        // Pulsar binary period ticks
        const tickDist = len * 0.85;
        const tickX = Math.cos(angle) * tickDist;
        const tickY = Math.sin(angle) * tickDist;
        ctx.beginPath();
        ctx.arc(tickX, tickY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();
      });

      // 5. Fundamental Hydrogen Atom Hyperfine Transition (Top Right quadrant)
      const hX = radius * 0.42;
      const hY = -radius * 0.42;
      ctx.strokeStyle = "rgba(255, 250, 230, 0.65)";
      ctx.lineWidth = 1.0;
      // Proton & Electron circle 1
      ctx.beginPath();
      ctx.arc(hX - 12, hY, 6, 0, Math.PI * 2);
      ctx.stroke();
      // Arrow 1
      ctx.beginPath();
      ctx.moveTo(hX - 12, hY - 6);
      ctx.lineTo(hX - 12, hY - 11);
      ctx.stroke();

      // Connecting line
      ctx.beginPath();
      ctx.moveTo(hX - 6, hY);
      ctx.lineTo(hX + 6, hY);
      ctx.stroke();

      // Proton & Electron circle 2
      ctx.beginPath();
      ctx.arc(hX + 12, hY, 6, 0, Math.PI * 2);
      ctx.stroke();
      // Arrow 2 (opposing spin)
      ctx.beginPath();
      ctx.moveTo(hX + 12, hY + 6);
      ctx.lineTo(hX + 12, hY + 11);
      ctx.stroke();

      // 6. Central Spindle and Mirror Platter Hub
      const hubGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius * 0.28);
      hubGrad.addColorStop(0, "#fef3c7");
      hubGrad.addColorStop(0.5, "#d97706");
      hubGrad.addColorStop(1, "#78350f");
      ctx.fillStyle = hubGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.26, 0, Math.PI * 2);
      ctx.fill();

      // Center Spindle Hole
      ctx.fillStyle = "#0c111d";
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.065, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.065, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // 7. Non-rotating Stylus Laser Needle & Indicator
      const stylusX = center + radius * 0.62;
      const stylusY = center - radius * 0.68;
      const targetGrooveX = center + radius * 0.58;
      const targetGrooveY = center - radius * 0.12;

      // Stylus arm shadow
      ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(stylusX + 3, stylusY + 3);
      ctx.lineTo(targetGrooveX + 3, targetGrooveY + 3);
      ctx.stroke();

      // Stylus metal arm
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(stylusX, stylusY);
      ctx.lineTo(targetGrooveX, targetGrooveY);
      ctx.stroke();

      // Stylus head cartridge
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(targetGrooveX - 4, targetGrooveY - 4, 8, 12);

      // Optical laser contact sensor point
      const laserColor = isPlaying ? "rgba(251, 191, 36, 1)" : "rgba(226, 232, 240, 0.8)";
      ctx.fillStyle = laserColor;
      ctx.shadowColor = isPlaying ? "#f59e0b" : "transparent";
      ctx.shadowBlur = isPlaying ? 10 : 0;
      ctx.beginPath();
      ctx.arc(targetGrooveX, targetGrooveY + 8, isPlaying ? 3 : 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sound resonance waves when playing
      if (isPlaying) {
        const pulse = (Math.sin(now * 0.006) * 0.5 + 0.5);
        ctx.strokeStyle = `rgba(253, 224, 71, ${0.45 - pulse * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(targetGrooveX, targetGrooveY + 8, 6 + pulse * 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isHovered, size, frequency, glyphId]);

  const handleClick = () => {
    if (!interactive) return;
    soundscape.playGoldenDiscScanSound(frequency);
    onTogglePlay?.();
  };

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className={`rounded-full transition-transform duration-500 ${
          interactive ? "cursor-pointer active:scale-95 hover:scale-[1.02]" : ""
        }`}
        onClick={handleClick}
        style={{ width: size, height: size }}
        title={interactive ? "Klik untuk memutar / menjeda pembacaan piringan emas" : undefined}
      />
    </div>
  );
}
