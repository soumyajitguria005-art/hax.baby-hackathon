class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private defaultMasterVolume: number = 0.85;

  constructor() {
    // Setup listener to resume audio context seamlessly on user gesture
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
      window.addEventListener('keydown', unlockAudio, { passive: true, once: true });
    }
  }

  private initAudioGraph(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (!this.ctx) return null;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // Initialize master bus: Compressor -> Master Gain -> Destination
    if (!this.compressor) {
      this.compressor = this.ctx.createDynamicsCompressor();
      // Gentle transparent mastering compression: boosts quieter harmonics while preventing clipping
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);
    }

    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.defaultMasterVolume,
        this.ctx.currentTime
      );
      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    return this.ctx;
  }

  private getAudioDestination(): AudioNode | null {
    if (this.isMuted) return null;
    const ctx = this.initAudioGraph();
    if (!ctx || !this.compressor) return null;
    return this.compressor;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
      // Smooth 25ms ramp prevents clicks when muting/unmuting during playback
      this.masterGain.gain.linearRampToValueAtTime(
        muted ? 0 : this.defaultMasterVolume,
        t + 0.025
      );
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Star Sparkle: Celestial multi-note sparkle arpeggio (A5, E6, A6, C7).
   * Warm, bright stardust tones with audible presence.
   */
  public playStarSparkle() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const notes = [880, 1318.5, 1760, 2093]; // A5, E6, A6, C7
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Balanced envelope: quick 15ms attack, pleasant chime decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  /**
   * Lullaby Note: Deeply relaxing celesta chime with dual-oscillator warmth.
   * Fundamental sine + octave triangle harmonic.
   */
  public playLullabyNote(freq: number = 523.25, duration: number = 0.8) {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    // Fundamental celesta chime envelope
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.025);
    gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    // Gentle overtone harmonic envelope (softer for warm, non-piercing timbre)
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.025);
    gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 0.75);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(dest);
    gain2.connect(dest);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  }

  /**
   * Lantern Click: Tactile rotary/lightbulb switch click with warm upward pitch sweep.
   */
  public playLanternClick() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.24);
  }

  /**
   * Dream Whoosh: Whimsical filtered air glide for launch animations and transitions.
   */
  public playDreamWhoosh() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.38);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2600, ctx.currentTime + 0.28);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.30, ctx.currentTime + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.58);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.62);
  }

  /**
   * Gentle Pop: Bubbly, playful interaction pop.
   */
  public playGentlePop() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.095);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Constellation Chime: Pentatonic chime note with ethereal octave harmonic.
   */
  public playConstellationChime(noteIndex: number = 0) {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    // Bedtime celestial pentatonic chime scale: C5, D5, E5, G5, A5, C6, D6, E6
    const pentatonicScale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
    const freq = pentatonicScale[noteIndex % pentatonicScale.length];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode1 = ctx.createGain();
    const gainNode2 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);

    // Ethereal octave harmonic
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gainNode1.gain.setValueAtTime(0, ctx.currentTime);
    gainNode1.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.02);
    gainNode1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.88);

    gainNode2.gain.setValueAtTime(0, ctx.currentTime);
    gainNode2.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gainNode2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);

    osc1.connect(gainNode1);
    osc2.connect(gainNode2);
    gainNode1.connect(dest);
    gainNode2.connect(dest);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.92);
    osc2.stop(ctx.currentTime + 0.92);
  }

  /**
   * Story Chime: Harmonic bedtime chord intervals for the 3 story chapters.
   */
  public playStoryChime(chapterIndex: number = 0) {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const chords = [
      [523.25, 783.99],   // C5 + G5 (A Sleepy Beginning)
      [659.25, 987.77],   // E5 + B5 (The Dream Engineer)
      [783.99, 1318.51],  // G5 + E6 (Dreams for Everyone)
    ];
    const frequencies = chords[chapterIndex % chords.length];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.055;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.68);

      osc.connect(gainNode);
      gainNode.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.72);
    });
  }

  /**
   * Button Tick: Clean, subtle wooden UI tick. Clearly audible and pleasant.
   */
  public playButtonTick() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(820, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.30, ctx.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.048);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.052);
  }

  /**
   * Success Chime: Ascending chime (G5 -> C6) for note submission and wins.
   */
  public playSuccessChime() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const notes = [783.99, 1046.5]; // G5 -> C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.32, startTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.36);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + 0.39);
    });
  }

  /**
   * Error Beep: Polite, low triangle alert tone.
   */
  public playErrorBeep() {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.16);
  }

  /**
   * State Selection: Musical, expressive character feedback for all 12 states.
   */
  public playStateSelection(state: string) {
    const dest = this.getAudioDestination();
    if (!dest || !this.ctx) return;
    const ctx = this.ctx;

    try {
      const STATE_TONES: Record<string, { f1: number; f2?: number; sweep?: number; duration: number }> = {
        idle: { f1: 523.25, duration: 0.20 }, // C5
        happy: { f1: 659.25, f2: 783.99, duration: 0.24 }, // E5 -> G5 upward joy
        curious: { f1: 587.33, sweep: 698.46, duration: 0.22 }, // D5 -> F5 rise
        excited: { f1: 659.25, f2: 880.0, duration: 0.24 }, // E5 -> A5 bright leap
        sleepy: { f1: 440.0, sweep: 392.0, duration: 0.28 }, // A4 -> G4 soft drift
        surprised: { f1: 698.46, sweep: 880.0, duration: 0.18 }, // F5 -> A5 light chirp
        shy: { f1: 493.88, duration: 0.20 }, // B4 soft warm chime
        reading: { f1: 523.25, f2: 783.99, duration: 0.22 }, // C5 + G5 harmonic pair
        working: { f1: 622.25, duration: 0.16 }, // Eb5 quick tap
        flying: { f1: 783.99, sweep: 1046.5, duration: 0.26 }, // G5 -> C6 airy glide
        'holding-lantern': { f1: 659.25, f2: 987.77, duration: 0.24 }, // E5 + B5 celestial glow
        sleeping: { f1: 392.0, sweep: 329.63, duration: 0.30 }, // G4 -> E4 gentle lullaby
      };

      const tone = STATE_TONES[state] || { f1: 587.33, duration: 0.2 };
      const startTime = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(tone.f1, startTime);
      if (tone.sweep) {
        osc.frequency.exponentialRampToValueAtTime(tone.sweep, startTime + tone.duration * 0.7);
      }

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.30, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + tone.duration);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(startTime);
      osc.stop(startTime + tone.duration + 0.02);

      // Complementary harmonic layer for rich resonant states
      if (tone.f2) {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const start2 = startTime + 0.03;

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(tone.f2, start2);

        gain2.gain.setValueAtTime(0, start2);
        gain2.gain.linearRampToValueAtTime(0.16, start2 + 0.015);
        gain2.gain.exponentialRampToValueAtTime(0.0001, start2 + tone.duration * 0.85);

        osc2.connect(gain2);
        gain2.connect(dest);

        osc2.start(start2);
        osc2.stop(start2 + tone.duration);
      }
    } catch {
      // Audio fallback
    }
  }
}

export const soundEngine = new SoundEngine();
