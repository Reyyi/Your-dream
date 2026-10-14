"use client";

// Web Audio API procedural soundscape generator for nature sounds
// Zero external files, instant loading, deeply calming.

type SoundscapeChannel = "rain" | "wind" | "crickets" | "fire";

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private channelGains: Record<SoundscapeChannel, GainNode | null> = {
    rain: null,
    wind: null,
    crickets: null,
    fire: null,
  };
  private activeSources: { stop: () => void }[] = [];
  private isRunning = false;

  private initContext() {
    if (this.ctx) return this.ctx;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Initialize channel gains
    (Object.keys(this.channelGains) as SoundscapeChannel[]).forEach((channel) => {
      if (!this.ctx || !this.masterGain) return;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.connect(this.masterGain);
      this.channelGains[channel] = gain;
    });

    return this.ctx;
  }

  // Create pink/brown noise buffer for natural atmospheric sounds
  private createNoiseBuffer(durationSeconds = 6): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration for softer, warmer tone
      data[i] = (lastOut + 0.025 * white) / 1.025;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  // Soft Continuous Rain Generator
  private startRain() {
    if (!this.ctx || !this.channelGains.rain) return;
    const buffer = this.createNoiseBuffer(5);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(320, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(this.channelGains.rain);
    source.start();

    this.activeSources.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
        } catch {
          // Ignore
        }
      },
    });
  }

  // Breathing Mountain / Night Breeze Generator
  private startWind() {
    if (!this.ctx || !this.channelGains.wind) return;
    const buffer = this.createNoiseBuffer(8);
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // LFO to slowly sweep wind frequency like breathing gusts
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    source.connect(filter);
    filter.connect(this.channelGains.wind);
    source.start();

    this.activeSources.push({
      stop: () => {
        try {
          source.stop();
          lfo.stop();
          source.disconnect();
          lfo.disconnect();
        } catch {
          // Ignore
        }
      },
    });
  }

  // Crickets / Night Insects Generator
  private startCrickets() {
    if (!this.ctx || !this.channelGains.crickets) return;
    const ctx = this.ctx;
    const dest = this.channelGains.crickets;

    let intervalId: number | null = null;

    const chirp = () => {
      if (!this.isRunning || !this.ctx) return;
      const now = ctx.currentTime;
      // High frequency insect pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(4450 + (Math.random() - 0.5) * 200, now);

      gain.gain.setValueAtTime(0, now);
      // Double chirp pulse
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.25);
    };

    intervalId = window.setInterval(() => {
      if (Math.random() > 0.25) {
        chirp();
      }
    }, 750);

    this.activeSources.push({
      stop: () => {
        if (intervalId) clearInterval(intervalId);
      },
    });
  }

  // Hearth / Campfire Crackle Generator
  private startFire() {
    if (!this.ctx || !this.channelGains.fire) return;
    const ctx = this.ctx;
    const dest = this.channelGains.fire;

    // Soft warm low roar
    const buffer = this.createNoiseBuffer(4);
    if (!buffer) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(220, ctx.currentTime);

    const roarGain = ctx.createGain();
    roarGain.gain.setValueAtTime(0.4, ctx.currentTime);

    source.connect(filter);
    filter.connect(roarGain);
    roarGain.connect(dest);
    source.start();

    // Occasional subtle pops/crackles
    const intervalId = window.setInterval(() => {
      if (!this.isRunning || !this.ctx) return;
      const now = ctx.currentTime;
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = "triangle";
      popOsc.frequency.setValueAtTime(350 + Math.random() * 400, now);
      popGain.gain.setValueAtTime(0.18, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      popOsc.connect(popGain);
      popGain.connect(dest);
      popOsc.start(now);
      popOsc.stop(now + 0.04);
    }, 450);

    this.activeSources.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
          clearInterval(intervalId);
        } catch {
          // Ignore
        }
      },
    });
  }

  public start() {
    const ctx = this.initContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => undefined);
    }
    if (this.isRunning) return;
    this.isRunning = true;

    this.startRain();
    this.startWind();
    this.startCrickets();
    this.startFire();
  }

  public stop() {
    this.isRunning = false;
    this.activeSources.forEach((source) => source.stop());
    this.activeSources = [];
  }

  public setMasterVolume(volume: number) {
    if (!this.masterGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public setChannelVolume(channel: SoundscapeChannel, volume: number) {
    const gainNode = this.channelGains[channel];
    if (!gainNode || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, volume));
    gainNode.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.08);
  }

  public resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => undefined);
    }
  }
}

export const soundscape = new SoundscapeEngine();
