"use client";

// Web Audio API Procedural Retro Audio Synthesizer
// Zero external media files, zero bandwidth overhead, 100% instant procedural synthesis.

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private radioNoiseNode: AudioBufferSourceNode | null = null;
  private radioFilterNode: BiquadFilterNode | null = null;
  private radioGainNode: GainNode | null = null;
  private radioToneOsc: OscillatorNode | null = null;
  private radioToneGain: GainNode | null = null;
  private tapeHumSource: AudioBufferSourceNode | null = null;
  private tapeHumGain: GainNode | null = null;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => undefined);
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.radioGainNode && this.ctx) {
      this.radioGainNode.gain.setValueAtTime(
        muted ? 0 : 0.08,
        this.ctx.currentTime
      );
    }
    if (this.tapeHumGain && this.ctx) {
      this.tapeHumGain.gain.setValueAtTime(
        muted ? 0 : 0.04,
        this.ctx.currentTime
      );
    }
  }

  // CRT Screen Power On High Voltage Zap & Resonant Hum
  public playCrtPower(powerOn: boolean) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (powerOn) {
        // High voltage phosphor flyback charge
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(15625, now + 0.35);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.015, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      } else {
        // CRT power down collapse blip
        osc.type = "sine";
        osc.frequency.setValueAtTime(12000, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.28);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      }
    } catch {
      // Audio fallback silent
    }
  }

  // Mechanical Terminal Keyboard Click (Subtle, tactile, non-distracting)
  public playKeyClick(variant = 0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const baseFreq = 800 + (variant % 5) * 75 + Math.random() * 40;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.035);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200 + (variant % 3) * 200, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio fallback silent
    }
  }

  // Tactile Heavy Mechanical Switch / Relay Snap
  public playSwitchSnap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.04);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  // Tape Deck Mechanical Transport Button (Play, Stop, Rewind, Fast Forward)
  public playTapeButton() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // Part 1: Metallic latch thud
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.07);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Part 2: High friction spring click
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(2200, now + 0.015);
      osc2.frequency.exponentialRampToValueAtTime(700, now + 0.05);
      gain2.gain.setValueAtTime(0.05, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.015);
      osc2.stop(now + 0.07);
    } catch {
      // Audio fallback silent
    }
  }

  // Rotary Cipher Gear Tick
  public playCipherTick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.025);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio fallback silent
    }
  }

  // Morse Code Telegraph Beep
  public playMorseBeep(durationMs = 80, freq = 680) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const durSec = durationMs / 1000;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.008);
      gain.gain.setValueAtTime(0.07, now + durSec - 0.008);
      gain.gain.linearRampToValueAtTime(0.0001, now + durSec);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durSec + 0.01);
    } catch {
      // Audio fallback silent
    }
  }

  // Success Chime: Warm Vintage Analog Synthesizer Arpeggio
  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880]; // A major 7th analog chord
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.09;

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, noteStart);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, noteStart);
        filter.frequency.exponentialRampToValueAtTime(500, noteStart + 0.7);

        gain.gain.setValueAtTime(0.06, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.75);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.8);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Radio Tuner Background Noise Engine
  public startRadioNoise() {
    const ctx = this.getContext();
    if (!ctx) return;
    if (this.radioNoiseNode) return;

    try {
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.05 * white) / 1.05;
        lastOut = data[i];
        data[i] *= 2.2;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();

      this.radioNoiseNode = noiseSource;
      this.radioFilterNode = filter;
      this.radioGainNode = gain;
    } catch {
      // Audio fallback silent
    }
  }

  // Adjust radio tuning frequency filter dynamically
  public updateRadioTuning(freqHz: number, signalClarity: number) {
    if (!this.ctx || !this.radioFilterNode || !this.radioGainNode) return;
    try {
      const now = this.ctx.currentTime;
      // Map station frequency to audible bandpass filter
      const mappedFilterFreq = 400 + (freqHz % 2000) * 1.5;
      this.radioFilterNode.frequency.setTargetAtTime(mappedFilterFreq, now, 0.08);

      // Noise is loud when off-target, quiet when signal is clear
      const targetGain = this.isMuted
        ? 0
        : Math.max(0.01, 0.07 * (1 - signalClarity * 0.85));
      this.radioGainNode.gain.setTargetAtTime(targetGain, now, 0.08);
    } catch {
      // Audio fallback silent
    }
  }

  // Stop radio noise
  public stopRadioNoise() {
    try {
      if (this.radioNoiseNode) {
        this.radioNoiseNode.stop();
        this.radioNoiseNode.disconnect();
        this.radioNoiseNode = null;
      }
      this.radioFilterNode = null;
      this.radioGainNode = null;
    } catch {
      // Audio fallback silent
    }
  }

  // Continuous Analog Tape Motor & Warm Ferrite Hiss
  public startTapeHum() {
    const ctx = this.getContext();
    if (!ctx) return;
    if (this.tapeHumSource) return;

    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = data[i];
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(600, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.035, ctx.currentTime);

      source.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      source.start();

      this.tapeHumSource = source;
      this.tapeHumGain = gain;
    } catch {
      // Audio fallback silent
    }
  }

  public stopTapeHum() {
    try {
      if (this.tapeHumSource) {
        this.tapeHumSource.stop();
        this.tapeHumSource.disconnect();
        this.tapeHumSource = null;
      }
      this.tapeHumGain = null;
    } catch {
      // Audio fallback silent
    }
  }

  // Play Procedural Lo-Fi Synthesizer Melody Note for Cassette Mode
  public playLofiSynthNote(freq: number, durationSec = 1.2) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      // Soft analog pitch wobble (flutter)
      osc.frequency.linearRampToValueAtTime(freq * 1.003, now + durationSec * 0.5);
      osc.frequency.linearRampToValueAtTime(freq * 0.998, now + durationSec);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.05);
    } catch {
      // Audio fallback silent
    }
  }
}

export const retroAudio = new RetroAudioEngine();
