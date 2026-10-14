"use client";

// Web Audio API Procedural Sound Engine untuk Barang-Barang Retro
// 100% sintetis prosedural murni tanpa file eksternal, instan, hemat memori.

class RetroRoomAudioEngine {
  private ctx: AudioContext | null = null;
  private vinylNoiseNode: AudioBufferSourceNode | null = null;
  private vinylGainNode: GainNode | null = null;
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

  // Membuka kunci audio pada interaksi pertama pengguna (khusus mobile dan Chrome)
  public async unlockAudio(): Promise<boolean> {
    const ctx = this.getContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // Fallback
      }
    }
    return ctx.state === "running";
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.vinylGainNode && this.ctx) {
      this.vinylGainNode.gain.setValueAtTime(
        muted ? 0 : 0.08,
        this.ctx.currentTime
      );
    }
  }

  // Efek Desis dan Gesekan Jarum Piringan Hitam (Vinyl Crackle & Dust)
  public startVinylSound() {
    if (this.vinylNoiseNode) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Warm brown noise baseline
        data[i] = (lastOut + 0.025 * white) / 1.025;
        lastOut = data[i];

        // Random vinyl crackle pops
        if (Math.random() < 0.0025) {
          data[i] += (Math.random() - 0.5) * 2.2;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();

      this.vinylNoiseNode = noiseSource;
      this.vinylGainNode = gain;
    } catch {
      // Audio fallback silent
    }
  }

  public stopVinylSound() {
    try {
      if (this.vinylNoiseNode) {
        this.vinylNoiseNode.stop();
        this.vinylNoiseNode.disconnect();
        this.vinylNoiseNode = null;
      }
      this.vinylGainNode = null;
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Sentuhan Jarum Piringan Hitam (Needle Drop Scratch)
  public playNeedleDrop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.09);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Jepretan Kamera Polaroid dan Penggulung Foto Mekanis
  public playPolaroidCapture() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // 1. Shutter Click
      const oscClick = ctx.createOscillator();
      const gainClick = ctx.createGain();
      oscClick.type = "triangle";
      oscClick.frequency.setValueAtTime(1400, now);
      oscClick.frequency.exponentialRampToValueAtTime(350, now + 0.04);
      gainClick.gain.setValueAtTime(0.18, now);
      gainClick.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      oscClick.connect(gainClick);
      gainClick.connect(ctx.destination);
      oscClick.start(now);
      oscClick.stop(now + 0.06);

      // 2. Ejection Motor Whirr
      const oscMotor = ctx.createOscillator();
      const gainMotor = ctx.createGain();
      oscMotor.type = "sawtooth";
      oscMotor.frequency.setValueAtTime(320, now + 0.08);
      oscMotor.frequency.linearRampToValueAtTime(460, now + 0.35);
      oscMotor.frequency.exponentialRampToValueAtTime(260, now + 0.55);

      gainMotor.gain.setValueAtTime(0.0001, now + 0.08);
      gainMotor.gain.linearRampToValueAtTime(0.08, now + 0.12);
      gainMotor.gain.setValueAtTime(0.08, now + 0.45);
      gainMotor.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = "bandpass";
      motorFilter.frequency.setValueAtTime(800, now);

      oscMotor.connect(motorFilter);
      motorFilter.connect(gainMotor);
      gainMotor.connect(ctx.destination);

      oscMotor.start(now + 0.08);
      oscMotor.stop(now + 0.6);
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Putaran Piringan Telepon Rotary Dial (Ratchet Wheel)
  public playRotaryDialRatchet() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.032;

        osc.type = "sine";
        osc.frequency.setValueAtTime(1600 + i * 80, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.018);

        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.025);
      }
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Lonceng Telepon Klasik (Vintage Telephone Bell Chime)
  public playPhoneChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const freqs = [853, 960]; // Classic dual-frequency ring tone

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Kenop Putar Saluran TV Tabung (Heavy TV Channel Clunk)
  public playTvKnobClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Balik Lembaran Angka Jam Flip (Mechanical Card Flip Tick)
  public playFlipClockTick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Alunan Musik Melodi Retro Realistis (Electric Piano Rhodes Chords & Warm Sub-Bass)
  public playWarmLofiChord(chordFreqs: number[], rootBassFreq?: number, melodyNoteFreq?: number) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // 1. Lapisan Akor Piano Elektrik Vintage (Dual Osc Triangle + Sine dengan Detune Chorus)
      chordFreqs.forEach((freq, idx) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.05;

        // Osc 1: Triangle hangat
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(freq, noteStart);
        // Soft vintage pitch wobble
        osc1.frequency.linearRampToValueAtTime(freq * 1.003, noteStart + 0.8);
        osc1.frequency.linearRampToValueAtTime(freq * 0.998, noteStart + 1.8);

        // Osc 2: Sine dengan detune chorus hangat (+2.5 Hz)
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq + 2.5, noteStart);

        // Lowpass filter hangat khas speaker kabinet kayu 1970-an
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1100, noteStart);
        filter.frequency.exponentialRampToValueAtTime(450, noteStart + 2.2);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.08, noteStart + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.4);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteStart + 2.5);
        osc2.stop(noteStart + 2.5);
      });

      // 2. Lapisan Bass Analog Hangat (Deep Sub Bass)
      if (rootBassFreq) {
        const bassOsc = ctx.createOscillator();
        const bassFilter = ctx.createBiquadFilter();
        const bassGain = ctx.createGain();

        bassOsc.type = "sine";
        bassOsc.frequency.setValueAtTime(rootBassFreq, now);

        bassFilter.type = "lowpass";
        bassFilter.frequency.setValueAtTime(220, now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 2.3);
      }

      // 3. Lapisan Melodi Lonceng Kalimba / Glockenspiel Retro
      if (melodyNoteFreq) {
        const melOsc = ctx.createOscillator();
        const melGain = ctx.createGain();
        const melStart = now + 0.35;

        melOsc.type = "sine";
        melOsc.frequency.setValueAtTime(melodyNoteFreq, melStart);

        melGain.gain.setValueAtTime(0.001, melStart);
        melGain.gain.linearRampToValueAtTime(0.07, melStart + 0.04);
        melGain.gain.exponentialRampToValueAtTime(0.0001, melStart + 1.2);

        melOsc.connect(melGain);
        melGain.connect(ctx.destination);

        melOsc.start(melStart);
        melOsc.stop(melStart + 1.3);
      }
    } catch {
      // Audio fallback silent
    }
  }
}

export const retroRoomAudio = new RetroRoomAudioEngine();
