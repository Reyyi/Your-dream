"use client";

import { useSoundscapeStore } from "@/lib/soundscapeStore";
import { useZenStore } from "@/lib/zenStore";
import type { PresetName } from "@/lib/soundscapeStore";

export function SoundscapePanel() {
  const isZenMode = useZenStore((state) => state.isZenMode);
  const {
    isPlaying,
    masterVolume,
    rainVolume,
    windVolume,
    cricketsVolume,
    fireVolume,
    currentPreset,
    panelOpen,
    togglePanel,
    togglePlay,
    setMasterVolume,
    setChannel,
    applyPreset,
  } = useSoundscapeStore();

  const presets: { id: PresetName; label: string; icon: string }[] = [
    { id: "rainy-night", label: "Malam Hujan", icon: "🌧️" },
    { id: "mountain-breeze", label: "Angin Gunung", icon: "🍃" },
    { id: "camp-fire", label: "Api Unggun", icon: "🪵" },
    { id: "deep-sleep", label: "Tidur Lelap", icon: "☾" },
  ];

  return (
    <>
      {/* Floating soundscape toggle pill button */}
      <div
        className={`fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7 transition-all duration-1000 ease-in-out ${
          isZenMode ? "pointer-events-none translate-y-6 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <button
          aria-expanded={panelOpen}
          aria-label="Buka kontrol suara lanskap alam"
          className={`group flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs backdrop-blur-xl transition-all duration-300 shadow-lg ${
            isPlaying
              ? "border-amber-300/40 bg-amber-200/15 text-[#fff2d8] shadow-[0_0_20px_rgba(255,225,160,0.2)]"
              : "border-white/20 bg-slate-950/40 text-white/75 hover:border-white/40 hover:text-white"
          }`}
          onClick={togglePanel}
          type="button"
        >
          {isPlaying ? (
            <span className="flex items-end gap-0.5 h-3">
              <span className="h-full w-0.5 animate-pulse rounded-full bg-amber-200" />
              <span className="h-2/3 w-0.5 animate-pulse delay-75 rounded-full bg-amber-200" />
              <span className="h-4/5 w-0.5 animate-pulse delay-150 rounded-full bg-amber-200" />
            </span>
          ) : (
            <span className="text-sm">♫</span>
          )}
          <span className="tracking-wide">
            {isPlaying ? "Suara Alam" : "Suara Alam"}
          </span>
        </button>
      </div>

      {/* Floating soundscape mixer panel */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6"
          onClick={togglePanel}
          role="presentation"
        >
          <div
            aria-labelledby="soundscape-title"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-[1.8rem] border border-white/20 bg-slate-950/85 p-6 shadow-2xl backdrop-blur-2xl transition-all sm:p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow">Harmoni Suara Alami</p>
                <h3 className="mt-1 font-display text-2xl text-white" id="soundscape-title">
                  Lanskap Suara
                </h3>
              </div>
              <button
                aria-label="Tutup panel suara"
                className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                onClick={togglePanel}
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Master toggle & volume */}
            <div className="mt-5 flex items-center justify-between gap-4">
              <button
                className={`flex-1 rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                  isPlaying
                    ? "border-amber-300/50 bg-amber-200/20 text-amber-100 shadow-[0_0_15px_rgba(255,220,140,0.25)]"
                    : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                }`}
                onClick={togglePlay}
                type="button"
              >
                {isPlaying ? "Hentikan Suara ⏸" : "Nyalakan Suara ▶"}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Volume</span>
                <input
                  aria-label="Volume utama"
                  className="time-slider w-20 cursor-pointer"
                  max="1"
                  min="0"
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  step="0.05"
                  type="range"
                  value={masterVolume}
                />
              </div>
            </div>

            {/* Presets */}
            <div className="mt-6">
              <p className="mb-2 text-[0.6rem] uppercase tracking-wider text-white/40">
                Pilihan Suasana
              </p>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs transition ${
                      isPlaying && currentPreset === preset.id
                        ? "border-amber-300/50 bg-amber-200/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                    onClick={() => applyPreset(preset.id)}
                    type="button"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Channel Sliders */}
            <div className="mt-6 space-y-3.5">
              <p className="text-[0.6rem] uppercase tracking-wider text-white/40">
                Paduan Suara Sendiri
              </p>

              {/* Rain */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="w-28 text-white/70">🌧️ Hujan Rintik</span>
                <input
                  aria-label="Volume Hujan"
                  className="time-slider flex-1 cursor-pointer"
                  max="1"
                  min="0"
                  onChange={(e) => setChannel("rain", Number(e.target.value))}
                  step="0.05"
                  type="range"
                  value={rainVolume}
                />
              </div>

              {/* Wind */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="w-28 text-white/70">🍃 Angin Gunung</span>
                <input
                  aria-label="Volume Angin"
                  className="time-slider flex-1 cursor-pointer"
                  max="1"
                  min="0"
                  onChange={(e) => setChannel("wind", Number(e.target.value))}
                  step="0.05"
                  type="range"
                  value={windVolume}
                />
              </div>

              {/* Crickets */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="w-28 text-white/70">🦗 Jangkrik Malam</span>
                <input
                  aria-label="Volume Jangkrik"
                  className="time-slider flex-1 cursor-pointer"
                  max="1"
                  min="0"
                  onChange={(e) => setChannel("crickets", Number(e.target.value))}
                  step="0.05"
                  type="range"
                  value={cricketsVolume}
                />
              </div>

              {/* Fire */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="w-28 text-white/70">🪵 Api Unggun</span>
                <input
                  aria-label="Volume Api"
                  className="time-slider flex-1 cursor-pointer"
                  max="1"
                  min="0"
                  onChange={(e) => setChannel("fire", Number(e.target.value))}
                  step="0.05"
                  type="range"
                  value={fireVolume}
                />
              </div>
            </div>

            <p className="mt-5 text-center text-[0.62rem] text-white/35">
              Ditenun dengan Web Audio API murni · Tenang & tanpa kuota
            </p>
          </div>
        </div>
      )}
    </>
  );
}
