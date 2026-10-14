"use client";

// Web Audio API procedural soundscape generator for nature sounds
// Zero external files, instant loading, deeply calming & physically accurate acoustics.

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
      data[i] *= 3.5;
    }
    return buffer;
  }

  // Soft Continuous Rain with Natural Droplet Splashes
  private startRain() {
    if (!this.ctx || !this.channelGains.rain) return;
    const ctx = this.ctx;
    const dest = this.channelGains.rain;

    const buffer = this.createNoiseBuffer(5);
    if (!buffer) return;

    // 1. Steady rainfall wash
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(820, ctx.currentTime);
    filter.Q.setValueAtTime(0.75, ctx.currentTime);

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(280, ctx.currentTime);

    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(dest);
    source.start();

    // 2. Random delicate droplet impacts on foliage
    const dropBufferSize = Math.floor(ctx.sampleRate * 0.04);
    const dropBuffer = ctx.createBuffer(1, dropBufferSize, ctx.sampleRate);
    const dropData = dropBuffer.getChannelData(0);
    for (let i = 0; i < dropBufferSize; i++) {
      dropData[i] = Math.random() * 2 - 1;
    }

    let timeoutId: number | null = null;
    const triggerDrop = () => {
      if (!this.isRunning || !this.ctx) return;
      const now = ctx.currentTime;
      const dropSource = ctx.createBufferSource();
      dropSource.buffer = dropBuffer;

      const dropFilter = ctx.createBiquadFilter();
      dropFilter.type = "bandpass";
      dropFilter.frequency.setValueAtTime(1400 + Math.random() * 1800, now);
      dropFilter.Q.setValueAtTime(3.2, now);

      const dropGain = ctx.createGain();
      const dropVol = 0.06 + Math.random() * 0.08;
      dropGain.gain.setValueAtTime(dropVol, now);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      dropSource.connect(dropFilter);
      dropFilter.connect(dropGain);
      dropGain.connect(dest);
      dropSource.start(now);
      dropSource.stop(now + 0.04);

      timeoutId = window.setTimeout(triggerDrop, 90 + Math.random() * 280);
    };

    timeoutId = window.setTimeout(triggerDrop, 200);

    this.activeSources.push({
      stop: () => {
        try {
          source.stop();
          source.disconnect();
          if (timeoutId) clearTimeout(timeoutId);
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
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    // LFO to slowly sweep wind frequency like breathing gusts
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
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

  // Crickets / Night Insects with Natural Grouped Cadence
  private startCrickets() {
    if (!this.ctx || !this.channelGains.crickets) return;
    const ctx = this.ctx;
    const dest = this.channelGains.crickets;

    let timeoutId: number | null = null;

    const playChirp = () => {
      if (!this.isRunning || !this.ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(4500 + (Math.random() - 0.5) * 150, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      gain.gain.linearRampToValueAtTime(0.13, now + 0.11);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.22);

      // Crickets chirp in rhythms, with realistic breathing pauses
      const delay = Math.random() < 0.65 ? 240 + Math.random() * 80 : 900 + Math.random() * 1200;
      timeoutId = window.setTimeout(playChirp, delay);
    };

    timeoutId = window.setTimeout(playChirp, 500);

    this.activeSources.push({
      stop: () => {
        if (timeoutId) clearTimeout(timeoutId);
      },
    });
  }

  // Realistic Campfire Generator (Bara Hangat, Desisan Abu, & Letupan Kayu Kering Nyata)
  private startFire() {
    if (!this.ctx || !this.channelGains.fire) return;
    const ctx = this.ctx;
    const dest = this.channelGains.fire;

    // 1. Flame body (deru hangat bara api membakar)
    const flameBuffer = this.createNoiseBuffer(5);
    if (!flameBuffer) return;
    const flameSource = ctx.createBufferSource();
    flameSource.buffer = flameBuffer;
    flameSource.loop = true;

    const flameFilter = ctx.createBiquadFilter();
    flameFilter.type = "lowpass";
    flameFilter.frequency.setValueAtTime(260, ctx.currentTime);
    flameFilter.Q.setValueAtTime(1.2, ctx.currentTime);

    const flameGain = ctx.createGain();
    flameGain.gain.setValueAtTime(0.38, ctx.currentTime);

    flameSource.connect(flameFilter);
    flameFilter.connect(flameGain);
    flameGain.connect(dest);
    flameSource.start();

    // 2. Ember sizzle (desisan bara dan abu halus terus menerus)
    const sizzleSource = ctx.createBufferSource();
    sizzleSource.buffer = flameBuffer;
    sizzleSource.loop = true;

    const sizzleFilter = ctx.createBiquadFilter();
    sizzleFilter.type = "bandpass";
    sizzleFilter.frequency.setValueAtTime(2200, ctx.currentTime);
    sizzleFilter.Q.setValueAtTime(1.8, ctx.currentTime);

    const sizzleGain = ctx.createGain();
    sizzleGain.gain.setValueAtTime(0.1, ctx.currentTime);

    sizzleSource.connect(sizzleFilter);
    sizzleFilter.connect(sizzleGain);
    sizzleGain.connect(dest);
    sizzleSource.start();

    // 3. Authentic sharp wood snap & crackle generator (Bukan nada oscillator!)
    // White noise impulse bursts for crisp, realistic dry wood cracking
    const snapBufferSize = Math.floor(ctx.sampleRate * 0.06);
    const snapBuffer = ctx.createBuffer(1, snapBufferSize, ctx.sampleRate);
    const snapData = snapBuffer.getChannelData(0);
    for (let i = 0; i < snapBufferSize; i++) {
      snapData[i] = Math.random() * 2 - 1;
    }

    let timeoutId: number | null = null;

    const playCrackle = () => {
      if (!this.isRunning || !this.ctx) return;
      const now = ctx.currentTime;

      const isLoudSnap = Math.random() < 0.28;
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      // Filtered noise for genuine dry wood snap
      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = isLoudSnap ? "bandpass" : "highpass";
      snapFilter.frequency.setValueAtTime(
        isLoudSnap ? 2200 + Math.random() * 1200 : 3500 + Math.random() * 2000,
        now,
      );
      snapFilter.Q.setValueAtTime(isLoudSnap ? 3.0 : 1.2, now);

      const snapGain = ctx.createGain();
      const peakVolume = isLoudSnap ? 0.36 + Math.random() * 0.24 : 0.08 + Math.random() * 0.12;
      const decayTime = isLoudSnap ? 0.025 + Math.random() * 0.02 : 0.008 + Math.random() * 0.015;

      snapGain.gain.setValueAtTime(peakVolume, now);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(dest);
      snapSource.start(now);
      snapSource.stop(now + decayTime + 0.01);

      // If it's a solid wood crack, accompany with a subtle low wood body thump
      if (isLoudSnap) {
        const thumpOsc = ctx.createOscillator();
        const thumpGain = ctx.createGain();
        thumpOsc.type = "sine";
        thumpOsc.frequency.setValueAtTime(115 + Math.random() * 55, now);
        thumpGain.gain.setValueAtTime(0.2, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        thumpOsc.connect(thumpGain);
        thumpGain.connect(dest);
        thumpOsc.start(now);
        thumpOsc.stop(now + 0.045);

        // Immediate tiny aftershock crackles (mini sparks popping right after a big snap)
        const aftershockCount = 1 + Math.floor(Math.random() * 3);
        for (let j = 0; j < aftershockCount; j++) {
          const delay = 0.025 + j * (0.02 + Math.random() * 0.03);
          const miniSource = ctx.createBufferSource();
          miniSource.buffer = snapBuffer;
          const miniFilter = ctx.createBiquadFilter();
          miniFilter.type = "highpass";
          miniFilter.frequency.setValueAtTime(4200 + Math.random() * 2200, now + delay);
          const miniGain = ctx.createGain();
          miniGain.gain.setValueAtTime(0.06 + Math.random() * 0.08, now + delay);
          miniGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.012);
          miniSource.connect(miniFilter);
          miniFilter.connect(miniGain);
          miniGain.connect(dest);
          miniSource.start(now + delay);
          miniSource.stop(now + delay + 0.02);
        }
      }

      // Natural clustered rhythm of fire crackling
      const nextDelay =
        Math.random() < 0.45 ? 60 + Math.random() * 140 : 220 + Math.random() * 650;
      timeoutId = window.setTimeout(playCrackle, nextDelay);
    };

    timeoutId = window.setTimeout(playCrackle, 100);

    this.activeSources.push({
      stop: () => {
        try {
          flameSource.stop();
          sizzleSource.stop();
          flameSource.disconnect();
          sizzleSource.disconnect();
          if (timeoutId) clearTimeout(timeoutId);
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

  // Soft crystalline celestial chime when a shooting star streaks across
  public playMeteorChime() {
    try {
      if (!this.ctx) {
        this.initContext();
      }
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => undefined);
      }
      const now = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.09, now + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      masterGain.connect(ctx.destination);

      const freqs = [1567.98, 2093.0, 3135.96]; // G6, C7, G7 crystalline harmonics
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 1.4);

        const delay = idx * 0.035;
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.6);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now + delay);
        osc.stop(now + delay + 1.7);
      });
    } catch {
      // Audio autoplay policy or device without audio
    }
  }

  // Sweet paper fold & star birth chime
  public playStarFoldSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // 1. Soft paper fold rustle
      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const rustleSrc = ctx.createBufferSource();
      rustleSrc.buffer = buffer;
      const rustleFilter = ctx.createBiquadFilter();
      rustleFilter.type = "bandpass";
      rustleFilter.frequency.setValueAtTime(2200, now);
      rustleFilter.Q.setValueAtTime(1.5, now);
      const rustleGain = ctx.createGain();
      rustleGain.gain.setValueAtTime(0.04, now);
      rustleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      rustleSrc.connect(rustleFilter);
      rustleFilter.connect(rustleGain);
      rustleGain.connect(ctx.destination);
      rustleSrc.start(now);

      // 2. Rising starlight arpeggio
      const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  // Delicate glass chime when shaking/tapping the jar
  public playJarGlassSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // Resonant glass ping
      const pings = [2850, 4200, 1850];
      pings.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);
        gain.gain.setValueAtTime(0, now + idx * 0.025);
        gain.gain.linearRampToValueAtTime(0.04 / (idx + 1), now + idx * 0.025 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.025 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.025);
        osc.stop(now + idx * 0.025 + 0.95);
      });
    } catch {
      // Ignore
    }
  }

  // Natural river stone tap sound
  public playStoneSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // Filtered impact thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignore
    }
  }

  // Meditative singing bowl chord when balance is achieved
  public playZenChime() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const freqs = [432, 648, 864, 1296]; // Harmonic tuning based on 432Hz
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        const delay = idx * 0.03;
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), now + delay + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 2.6);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundscape = new SoundscapeEngine();
