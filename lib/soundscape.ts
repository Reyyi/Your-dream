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

  // Pure optical crystal refractive ping when rotating prism
  public playPrismRotateSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const freqs = [1567.98, 2349.32]; // G6, D7 crystalline harmonic
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.045 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      });
    } catch {
      // Ignore
    }
  }

  // Delicate star birth note corresponding to placement position
  public playStarTone(pitchRatio = 1) {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const baseFreq = 528 * Math.max(0.6, Math.min(2.5, pitchRatio));
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.02, now + 0.3);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // Ignore
    }
  }

  // Constellation link chime when connecting two stars
  public playConstellationLinkSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const freqs = [792, 1056];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.035, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.36);
      });
    } catch {
      // Ignore
    }
  }

  // Interstellar ion thruster ignition & deep-space beacon launch sound
  public playCapsuleLaunchSequence() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // 1. Sub-bass propulsion sweep
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(65, now);
      subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.8);
      subGain.gain.setValueAtTime(0.08, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.25);

      // 2. Ion carrier frequency rise
      const ionOsc = ctx.createOscillator();
      const ionGain = ctx.createGain();
      ionOsc.type = "triangle";
      ionOsc.frequency.setValueAtTime(260, now + 0.1);
      ionOsc.frequency.exponentialRampToValueAtTime(880, now + 0.7);
      ionGain.gain.setValueAtTime(0.04, now + 0.1);
      ionGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      ionOsc.connect(ionGain);
      ionGain.connect(ctx.destination);
      ionOsc.start(now + 0.1);
      ionOsc.stop(now + 0.95);

      // 3. Starlight beacon chime triad
      [528, 660, 792, 1056].forEach((f, idx) => {
        const chime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chime.type = "sine";
        chime.frequency.setValueAtTime(f, now + 0.4 + idx * 0.08);
        chimeGain.gain.setValueAtTime(0.04, now + 0.4 + idx * 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4 + idx * 0.08);
        chime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chime.start(now + 0.4 + idx * 0.08);
        chime.stop(now + 1.45 + idx * 0.08);
      });
    } catch {
      // Ignore
    }
  }

  // Authentic analog Golden Record needle scan & carrier transmission tone
  public playGoldenDiscScanSound(freq = 432) {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // Stylus touch click
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(140, now);
      clickGain.gain.setValueAtTime(0.06, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.05);

      // Carrier frequency with subtle analog wow & flutter
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + 0.03);
      // Gentle cosmic micro-modulations
      osc.frequency.linearRampToValueAtTime(freq * 1.008, now + 0.25);
      osc.frequency.linearRampToValueAtTime(freq * 0.994, now + 0.5);
      osc.frequency.linearRampToValueAtTime(freq, now + 0.75);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, now);

      gain.gain.setValueAtTime(0.05, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.03);
      osc.stop(now + 0.88);
    } catch {
      // Ignore
    }
  }

  // Deep space hydrogen 1420 MHz line telemetry pulse
  public playPulsarBeep(frequency = 1420) {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignore
    }
  }

  // Resonant temporal lock seal chime
  public playTemporalSealSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const freqs = [330, 440, 660];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.045, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.62);
      });
    } catch {
      // Ignore
    }
  }

  // Authentic Japanese Shishi-odoshi bamboo clack impact against stone
  public playShishiOdoshiClack() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // 1. Sharp high-frequency wooden strike click
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(1420, now);
      click.frequency.exponentialRampToValueAtTime(320, now + 0.025);
      clickGain.gain.setValueAtTime(0.09, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.04);

      // 2. Hollow cylindrical bamboo body resonance (420 Hz body)
      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      body.type = "sine";
      body.frequency.setValueAtTime(420, now);
      body.frequency.exponentialRampToValueAtTime(340, now + 0.18);
      bodyGain.gain.setValueAtTime(0.12, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      body.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      body.start(now);
      body.stop(now + 0.24);

      // 3. Low resonant stone foundation thud (160 Hz stone cavity)
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(165, now);
      subGain.gain.setValueAtTime(0.08, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  // Pure natural water droplet pitch
  public playWaterDropSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      // Rising bubble pitch
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(1480, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Deep sustaining Zen Tibetan singing bowl multi-harmonic resonance
  public playZenSingingBowlSound(freq = 280) {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      // Authentic non-integer metallic bell overtones: fundamental, 2.76x, 5.4x
      const harmonics = [
        { mult: 1.0, vol: 0.1, decay: 3.2 },
        { mult: 2.76, vol: 0.05, decay: 2.4 },
        { mult: 5.4, vol: 0.02, decay: 1.6 },
      ];

      harmonics.forEach(({ mult, vol, decay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq * mult, now);

        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay + 0.05);
      });
    } catch {
      // Ignore
    }
  }

  // Acoustic koto silk string pluck
  public playKotoPluck(freq = 440) {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.4);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.72);
    } catch {
      // Ignore
    }
  }

  // Deep solid natural stone placement thud
  public playStonePlacementSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  // Soft gravel & sand raking friction
  public playRakeSandSound() {
    try {
      if (!this.ctx) this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * 0.08);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(540, now);
      filter.Q.setValueAtTime(1.2, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
    } catch {
      // Ignore
    }
  }
}

export const soundscape = new SoundscapeEngine();
