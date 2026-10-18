class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playStarSparkle() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [880, 1318.5, 1760, 2093]; // A5, E6, A6, C7
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  public playLullabyNote(freq: number = 523.25, duration: number = 0.8) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Soft chime with rich celesta harmonics
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  }

  public playLanternClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.26);
  }

  public playDreamWhoosh() {
    const ctx = this.getContext();
    if (!ctx) return;

    // Gentle filtered whimsical whoosh
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2400, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.65);
  }

  public playGentlePop() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }

  public playConstellationChime(noteIndex: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Bedtime celestial pentatonic chime scale: C5, D5, E5, G5, A5, C6, D6, E6
    const pentatonicScale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
    const freq = pentatonicScale[noteIndex % pentatonicScale.length];

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, ctx.currentTime);

    // Ethereal octave harmonic
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    // Soft celestial chime envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.95);
    osc2.stop(ctx.currentTime + 0.95);
  }

  public playStoryChime(chapterIndex: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Harmonic bedtime chime intervals for the 3 story chapters:
    // Chapter 1: C5 + G5 (A Sleepy Beginning)
    // Chapter 2: E5 + B5 (The Dream Engineer)
    // Chapter 3: G5 + E6 (Dreams for Everyone)
    const chords = [
      [523.25, 783.99],
      [659.25, 987.77],
      [783.99, 1318.51],
    ];
    const frequencies = chords[chapterIndex % chords.length];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Delicate, non-intrusive celestial chime envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.75);
    });
  }

  public playButtonTick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(820, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  public playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [783.99, 1046.5]; // G5 -> C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.07, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  public playErrorBeep() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  public playStateSelection(state: string) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Subtle, pleasant musical tones for all 12 character states
      const STATE_TONES: Record<string, { f1: number; f2?: number; sweep?: number; duration: number }> = {
        idle: { f1: 523.25, duration: 0.18 }, // C5
        happy: { f1: 659.25, f2: 783.99, duration: 0.22 }, // E5 -> G5 upward joy
        curious: { f1: 587.33, sweep: 698.46, duration: 0.2 }, // D5 -> F5 rise
        excited: { f1: 659.25, f2: 880.0, duration: 0.22 }, // E5 -> A5 bright leap
        sleepy: { f1: 440.0, sweep: 392.0, duration: 0.26 }, // A4 -> G4 soft drift
        surprised: { f1: 698.46, sweep: 880.0, duration: 0.16 }, // F5 -> A5 light chirp
        shy: { f1: 493.88, duration: 0.18 }, // B4 soft warm chime
        reading: { f1: 523.25, f2: 783.99, duration: 0.2 }, // C5 + G5 harmonic pair
        working: { f1: 622.25, duration: 0.15 }, // Eb5 quick tap
        flying: { f1: 783.99, sweep: 1046.5, duration: 0.24 }, // G5 -> C6 airy glide
        'holding-lantern': { f1: 659.25, f2: 987.77, duration: 0.22 }, // E5 + B5 celestial glow
        sleeping: { f1: 392.0, sweep: 329.63, duration: 0.28 }, // G4 -> E4 gentle lullaby
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

      // Very gentle, non-intrusive dreamworld chime volume
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.038, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + tone.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + tone.duration + 0.02);

      // Complementary harmonic layer for resonant states
      if (tone.f2) {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const start2 = startTime + 0.03;

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(tone.f2, start2);

        gain2.gain.setValueAtTime(0, start2);
        gain2.gain.linearRampToValueAtTime(0.024, start2 + 0.015);
        gain2.gain.exponentialRampToValueAtTime(0.0001, start2 + tone.duration * 0.85);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(start2);
        osc2.stop(start2 + tone.duration);
      }
    } catch {
      // Audio failure fallback
    }
  }
}

export const soundEngine = new SoundEngine();
