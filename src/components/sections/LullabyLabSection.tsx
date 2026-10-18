import React, { useState, useEffect, useRef } from 'react';
import { PipState } from '../../types/character';
import { PipCharacter } from '../character/PipCharacter';
import { soundEngine } from '../../utils/soundEffects';
import { Play, Pause, Music, Disc3 } from 'lucide-react';
import { HeadingReveal } from '../effects/HeadingReveal';

interface LullabyLabSectionProps {
  onPlayLullaby: () => void;
  pipState: PipState;
  theme: 'day' | 'night';
  enableTilt: boolean;
}

interface Melody {
  id: string;
  name: string;
  notes: number[];
  tempo: number;
  description: string;
}

// Frequencies for music box celesta tones
const MELODIES: Melody[] = [
  {
    id: 'twinkle',
    name: 'Midnight Reverie',
    notes: [523.25, 523.25, 783.99, 783.99, 880.0, 880.0, 783.99, 698.46, 698.46, 659.25, 659.25, 587.33, 587.33, 523.25],
    tempo: 420,
    description: 'A gentle celesta arpeggio tuned to calm busy thoughts.',
  },
  {
    id: 'lavender',
    name: 'Lavender Moon Waltz',
    notes: [659.25, 783.99, 880.0, 987.77, 880.0, 783.99, 659.25, 587.33, 659.25, 523.25],
    tempo: 480,
    description: 'Slow rolling chime harmonies reminiscent of a sleepy music box.',
  },
  {
    id: 'cradle',
    name: 'Cloud Cradle Slumber',
    notes: [440.0, 523.25, 659.25, 783.99, 659.25, 523.25, 587.33, 493.88, 440.0],
    tempo: 520,
    description: 'Low soothing bass-bell chords for deep slumber induction.',
  },
];

export const LullabyLabSection: React.FC<LullabyLabSectionProps> = ({
  onPlayLullaby,
  theme,
  enableTilt,
}) => {
  const [activeMelodyIndex, setActiveMelodyIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  const activeMelody = MELODIES[activeMelodyIndex];

  // Play melody loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    let noteIdx = 0;
    onPlayLullaby();

    timerRef.current = window.setInterval(() => {
      const noteFreq = activeMelody.notes[noteIdx % activeMelody.notes.length];
      soundEngine.playLullabyNote(noteFreq, 0.7);
      setCurrentNoteIndex(noteIdx % activeMelody.notes.length);
      noteIdx++;
    }, activeMelody.tempo);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeMelodyIndex, activeMelody, onPlayLullaby]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      onPlayLullaby();
    }
  };

  return (
    <section id="lullaby-lab" className="py-20 lg:py-24 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: CHARACTER WORKING BESIDE MUSIC BOX */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800 relative">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-semibold text-pink-400">
              <Disc3 className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>{isPlaying ? 'Music Box Spinning' : 'Music Box Ready'}</span>
            </div>

            <PipCharacter
              state={isPlaying ? 'happy' : 'working'}
              size="lg"
              enableTilt={enableTilt}
              theme={theme}
              showSpeechBubble={true}
              speechText={
                isPlaying
                  ? 'Such a sweet melody! Floating notes everywhere!'
                  : 'Adjusting chime gears for peaceful sleep...'
              }
              showParticles={true}
            />

            <div className="mt-4 text-center">
              <span className="text-sm font-semibold text-white">
                {isPlaying ? 'Pip is Happy (Floating Notes)' : 'Pip in Lullaby Lab'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {isPlaying
                  ? 'Joyful sparkly eyes listening to bedtime music.'
                  : 'Calibrating harmonic celestial frequencies.'}
              </p>
            </div>
          </div>

          {/* RIGHT: INTERACTIVE MUSIC BOX CONTROLLER */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 uppercase tracking-wider">
              <Music className="w-3.5 h-3.5" />
              <span>Acoustic Dream Therapy</span>
            </div>

            <HeadingReveal
              as="h2"
              delay={80}
              className="text-3xl sm:text-4xl font-bold text-white font-display"
            >
              The Lullaby Sound Chamber
            </HeadingReveal>

            <p className="text-slate-300 text-base leading-relaxed">
              Synthesized through Pip’s vintage celesta soundbox. Each tone is mathematically spaced to trigger gentle alpha waves and ease your mind into restorative sleep.
            </p>

            {/* Melody selection tabs */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-medium text-slate-400">Select Melody:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MELODIES.map((mel, idx) => (
                  <button
                    key={mel.id}
                    onClick={() => {
                      setActiveMelodyIndex(idx);
                      if (!isPlaying) setIsPlaying(true);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      activeMelodyIndex === idx
                        ? 'bg-purple-900/30 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold font-display">{mel.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {mel.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note Visualizer Strip */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Track: <strong className="text-pink-300">{activeMelody.name}</strong></span>
                <span className="font-mono text-[11px]">432 Hz Harmonic</span>
              </div>

              {/* Progress / Note indicators */}
              <div className="flex items-center gap-1.5 h-8">
                {activeMelody.notes.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-all duration-200 ${
                      isPlaying && currentNoteIndex === i
                        ? 'bg-pink-400 h-7 shadow-sm shadow-pink-400/50'
                        : isPlaying && Math.abs(currentNoteIndex - i) <= 1
                        ? 'bg-purple-500/50 h-5'
                        : 'bg-slate-800 h-3'
                    }`}
                  />
                ))}
              </div>

              {/* Play / Pause button */}
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={togglePlayback}
                  className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-medium text-sm rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause Lullaby</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Lullaby</span>
                    </>
                  )}
                </button>

                <span className="text-xs text-slate-400">
                  {isPlaying ? 'Pip is smiling happily!' : 'Click to hear the celesta chime'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
