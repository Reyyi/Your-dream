"use client";

import { useEffect, useState } from "react";
import type { TimeCapsule } from "@/lib/timeCapsuleStore";
import {
  formatAU,
  formatKm,
  formatLightDelay,
  getTelemetry,
} from "@/lib/timeCapsuleStore";

interface CosmicTelemetryVisualizerProps {
  capsule: TimeCapsule;
  className?: string;
}

export function CosmicTelemetryVisualizer({
  capsule,
  className = "",
}: CosmicTelemetryVisualizerProps) {
  const [telemetry, setTelemetry] = useState(() => getTelemetry(capsule));

  useEffect(() => {
    // 50ms interval for butter-smooth real-time odometer ticking
    const interval = window.setInterval(() => {
      setTelemetry(getTelemetry(capsule));
    }, 60);

    return () => window.clearInterval(interval);
  }, [capsule]);

  return (
    <div
      className={`glass-panel rounded-[1.6rem] border border-amber-400/20 bg-slate-950/50 p-5 backdrop-blur-xl sm:p-6 ${className}`}
    >
      {/* Top Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-65" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
          </span>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-amber-200/70">
              Telemetri Antarbintang
            </p>
            <p className="font-mono text-xs font-semibold tracking-wider text-white">
              {capsule.authorCode} // {capsule.coordinates.ra}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
          <span className="text-[0.62rem] text-white/50">Frekuensi Pembawa:</span>
          <span className="font-mono text-[0.68rem] font-medium text-amber-300">
            {capsule.carrierFrequency} Hz
          </span>
        </div>
      </div>

      {/* Main Odometer Dashboard Grid */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Distance in KM */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-[0.58rem] uppercase tracking-widest text-white/55">
            Jarak dari Bumi
          </p>
          <p className="mt-1 font-mono text-base font-bold tabular-nums text-[#fff7e6] sm:text-lg">
            {formatKm(telemetry.distanceKm)}
          </p>
          <p className="mt-0.5 text-[0.62rem] text-amber-200/60">
            Kecepatan jelajah: 17,0 km/detik
          </p>
        </div>

        {/* Distance in AU */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-[0.58rem] uppercase tracking-widest text-white/55">
            Satuan Astronomi (AU)
          </p>
          <p className="mt-1 font-mono text-base font-bold tabular-nums text-amber-300 sm:text-lg">
            {formatAU(telemetry.distanceAU)}
          </p>
          <p className="mt-0.5 text-[0.62rem] text-white/45">
            1 AU = jarak rata-rata Bumi ke Matahari
          </p>
        </div>

        {/* Light Travel Delay */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3.5 sm:p-4">
          <p className="text-[0.58rem] uppercase tracking-widest text-white/55">
            Jarak Tempuh Cahaya
          </p>
          <p className="mt-1 font-mono text-base font-bold tabular-nums text-purple-200 sm:text-lg">
            {formatLightDelay(telemetry.lightDelaySeconds)}
          </p>
          <p className="mt-0.5 text-[0.62rem] text-white/45">
            Kecepatan sinyal radio: c (299.792 km/detik)
          </p>
        </div>
      </div>

      {/* Trajectory Zone Progress Bar */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.62rem] uppercase tracking-widest text-white/60">
            Zona Antariksa Terkini
          </p>
          <span className="font-mono text-[0.68rem] font-medium text-amber-300">
            {telemetry.zone}
          </span>
        </div>

        {/* Physical Gradient Track */}
        <div className="mt-3 relative h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-purple-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] transition-all duration-300"
            style={{ width: `${Math.max(6, telemetry.zoneProgress * 100)}%` }}
          />
        </div>

        <p className="mt-2.5 text-[0.68rem] leading-relaxed text-white/60">
          {telemetry.zoneInfo}
        </p>

        {/* Milestone Waypoints */}
        <div className="mt-3.5 flex justify-between text-[0.55rem] font-mono text-white/40">
          <span>Bumi (0 AU)</span>
          <span>Jupiter (5,2 AU)</span>
          <span>Pluto (39,5 AU)</span>
          <span>Heliopause (120 AU)</span>
          <span>Antarbintang (&gt;120 AU)</span>
        </div>
      </div>
    </div>
  );
}
