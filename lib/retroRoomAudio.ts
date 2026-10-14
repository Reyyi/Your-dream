"use client";

// Web Audio API Procedural Sound Engine untuk Barang-Barang Retro
// 100% sintetis prosedural murni tanpa file eksternal, instan, hemat memori.

class RetroRoomAudioEngine {
  private ctx: AudioContext | null = null;
  private vinylNoiseNode: AudioBufferSourceNode | null = null;
  private vinylGainNode: GainNode | null = null;
  private activeMusicNotes: { osc: OscillatorNode; gain: GainNode }[] = [];
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
    if (this.vinylGainNode && this.ctx) {
      this.vinylGainNode.gain.setValueAtTime(
        muted ? 0 : 0.04,
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
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];

        // Random delicate vinyl dust pops
        if (Math.random() < 0.0018) {
          data[i] += (Math.random() - 0.5) * 1.8;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, ctx.currentTime);

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
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
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
      oscClick.frequency.setValueAtTime(1200, now);
      oscClick.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      gainClick.gain.setValueAtTime(0.12, now);
      gainClick.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      oscClick.connect(gainClick);
      gainClick.connect(ctx.destination);
      oscClick.start(now);
      oscClick.stop(now + 0.05);

      // 2. Ejection Motor Whirr
      const oscMotor = ctx.createOscillator();
      const gainMotor = ctx.createGain();
      oscMotor.type = "sawtooth";
      oscMotor.frequency.setValueAtTime(320, now + 0.08);
      oscMotor.frequency.linearRampToValueAtTime(440, now + 0.35);
      oscMotor.frequency.exponentialRampToValueAtTime(260, now + 0.55);

      gainMotor.gain.setValueAtTime(0.0001, now + 0.08);
      gainMotor.gain.linearRampToValueAtTime(0.05, now + 0.12);
      gainMotor.gain.setValueAtTime(0.05, now + 0.45);
      gainMotor.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);

      const motorFilter = ctx.createBiquadFilter();
      motorFilter.type = "bandpass";
      motorFilter.frequency.setValueAtTime(750, now);

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
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.035;

        osc.type = "sine";
        osc.frequency.setValueAtTime(1600 + i * 80, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.018);

        gain.gain.setValueAtTime(0.05, t);
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

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
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
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
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

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio fallback silent
    }
  }

  // Suara Alunan Musik Melodi Hangat Piringan Hitam & Kaset
  public playWarmLofiChord(frequencies: number[]) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.06;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);
        // Soft analog pitch wobble
        osc.frequency.linearRampToValueAtTime(freq * 1.004, noteStart + 0.6);
        osc.frequency.linearRampToValueAtTime(freq * 0.998, noteStart + 1.2);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(950, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.05, noteStart + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 1.7);
      });
    } catch {
      // Audio fallback silent
    }
  }
}

export const retroRoomAudio = new RetroRoomAudioEngine();
