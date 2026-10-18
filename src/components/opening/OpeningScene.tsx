import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PipCharacter } from '../character/PipCharacter';
import { PipArtwork } from '../character/PipArtwork';
import { soundEngine } from '../../utils/soundEffects';
import { Sparkles, Star, CloudMoon, Music, Lightbulb, BookOpen, ArrowRight } from 'lucide-react';
import { TextAnimation } from '../text/TextAnimation';
import { HeadingReveal } from '../effects/HeadingReveal';

interface OpeningSceneProps {
  onWakePip: () => void;
  initialPhase?: 'wake' | 'intro';
}

const SPECIALTIES = [
  {
    title: 'Dreamscapes',
    desc: 'little worlds made from imagination.',
    icon: CloudMoon,
    color: 'text-sky-300',
    bg: 'bg-sky-500/15',
    border: 'border-sky-400/30',
  },
  {
    title: 'Lullabies',
    desc: 'gentle melodies for sleepy nights.',
    icon: Music,
    color: 'text-pink-300',
    bg: 'bg-pink-500/15',
    border: 'border-pink-400/30',
  },
  {
    title: 'Nightlights',
    desc: 'tiny sparks of comfort in the dark.',
    icon: Lightbulb,
    color: 'text-amber-300',
    bg: 'bg-amber-500/15',
    border: 'border-amber-400/30',
  },
  {
    title: 'Bedtime Stories',
    desc: 'adventures that begin just before closing your eyes.',
    icon: BookOpen,
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-400/30',
  },
];

export const OpeningScene: React.FC<OpeningSceneProps> = ({
  onWakePip,
  initialPhase = 'wake',
}) => {
  const [phase, setPhase] = useState<'wake' | 'intro'>(initialPhase);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const HOLD_DURATION = 1400; // ms to complete hold

  const handleWakeUp = useCallback(() => {
    soundEngine.playStarSparkle();
    setPhase('intro');
  }, []);

  const handleEnterOS = useCallback(() => {
    setIsBursting(true);
    soundEngine.playStarSparkle();
    setTimeout(() => {
      onWakePip();
    }, 600);
  }, [onWakePip]);

  useEffect(() => {
    if (phase !== 'wake') return;

    if (!isHolding) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
      setHoldProgress((prev) => (prev > 0 ? Math.max(0, prev - 4) : 0));
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentPct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(currentPct);

      if (currentPct >= 100) {
        handleWakeUp();
      } else {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHolding, phase, handleWakeUp]);

  const handlePointerDown = () => {
    setIsHolding(true);
    soundEngine.playGentlePop();
  };

  const handlePointerUp = () => {
    setIsHolding(false);
  };

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden transition-all duration-700 ${
        isBursting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#251a2a',
        backgroundImage:
          'radial-gradient(circle at 50% 35%, rgba(163, 64, 99, 0.28) 0%, transparent 65%), radial-gradient(circle at 80% 85%, rgba(241, 198, 109, 0.18) 0%, transparent 55%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Pip's Dream Nursery"
    >
      {/* Background Starry Sky & Distant Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/6 left-1/5 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" />
        <div
          className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-twinkle"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-twinkle"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute -bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-[#1b1220] to-transparent pointer-events-none" />
      </div>

      {/* Skip Intro Button — Always Accessible */}
      <button
        onClick={onWakePip}
        className="absolute top-6 right-6 z-20 liquid-glass-pill px-4 py-2 text-xs font-semibold text-pink-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
        aria-label="Skip introduction directly to OS"
      >
        <span>Skip to OS</span>
        <span aria-hidden="true">→</span>
      </button>

      {/* PHASE 1: WAKE PIP INTERACTION */}
      {phase === 'wake' && (
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg mx-auto animate-fade-in">
          {/* Character Stage: Sleeping Pip */}
          <div className="relative mb-4">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-b from-amber-200/10 via-pink-400/10 to-transparent blur-3xl pointer-events-none" />
            <PipCharacter
              state={isHolding ? 'surprised' : 'sleeping'}
              size="xl"
              enableTilt={false}
              theme="night"
              showSpeechBubble={false}
              interactive={false}
              showParticles={!isHolding}
            />
          </div>

          {/* Narrative Invitation Message */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-medium text-pink-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Midnight Nursery</span>
            </div>

            <HeadingReveal
              as="h2"
              delay={100}
              className="text-3xl sm:text-4xl font-serif text-[#fff8f1] tracking-wide leading-tight"
            >
              <TextAnimation divideBy="word" delay={0.2}>
                A little dream is waiting for you.
              </TextAnimation>
            </HeadingReveal>

            <p className="text-sm text-pink-200/80 max-w-sm mx-auto">
              Pip is sound asleep on the clouds. Hold the golden star to wake Pip and meet the Junior Dream Engineer.
            </p>
          </div>

          {/* Interactive Hold Star Button with Progress Ring */}
          <div className="relative flex flex-col items-center justify-center">
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onClick={handleWakeUp}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleWakeUp();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Hold or click the star to wake Pip"
              className="relative w-24 h-24 rounded-full flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-xl"
              style={{
                background: 'radial-gradient(circle, rgba(241,198,109,0.3) 0%, rgba(51,36,58,0.8) 70%)',
                boxShadow: isHolding
                  ? '0 0 35px rgba(241, 198, 109, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.5)'
                  : '0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Circular Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="4"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  fill="none"
                  stroke="#f1c66d"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-75"
                />
              </svg>

              {/* Glowing Golden Star Icon */}
              <div
                className={`relative transition-transform duration-200 ${
                  isHolding ? 'scale-125' : 'scale-100 animate-pulse'
                }`}
              >
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_12px_rgba(241,198,109,0.9)]" />
              </div>
            </div>

            <span className="text-xs font-semibold text-yellow-200/90 mt-3 font-rounded">
              {isHolding ? 'Waking Pip...' : 'Press & hold (or click) to wake'}
            </span>
          </div>
        </div>
      )}

      {/* PHASE 2: COMPLETE OFFICIAL CHARACTER INTRODUCTION */}
      {phase === 'intro' && (
        <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl p-6 sm:p-8 md:p-10 border border-pink-400/30 shadow-2xl space-y-6 animate-fade-in my-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* LEFT COLUMN: OFFICIAL ARTWORK DISPLAY */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <div
                className="relative w-full max-w-xs rounded-2xl overflow-hidden border border-pink-300/40 shadow-xl p-2.5 transition-transform hover:scale-[1.02]"
                style={{
                  backgroundColor: '#fbf7ee', // Soft cream tone matching original background
                }}
              >
                {/* Luminous glow accent */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-pink-100/10 pointer-events-none" />

                {/* Standalone Pip Artwork */}
                {!imageError ? (
                  <img
                    src="/assets/pip-avatar-cloud.png"
                    alt="Pip - Junior Dream Engineer at Midnight Nursery sitting on a soft cloud"
                    className={`w-full h-auto max-h-60 sm:max-h-72 object-contain mx-auto rounded-xl transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-90'
                    }`}
                    onLoad={() => {
                      setImageLoaded(true);
                      setImageError(false);
                    }}
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-60 sm:h-72 flex items-center justify-center p-2">
                    <PipArtwork
                      posture="sitting"
                      emotion="default"
                      theme="day"
                      lanternGlow={true}
                    />
                  </div>
                )}
              </div>

              {/* Subtitle badge underneath illustration */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-[11px] font-semibold text-pink-200">
                <Sparkles className="w-3 h-3 text-yellow-300 shrink-0" />
                <span>Midnight Nursery Official Portrait</span>
              </div>
            </div>

            {/* RIGHT COLUMN: OFFICIAL CHARACTER IDENTITY & COPY */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4 text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-semibold text-pink-300 mb-2">
                  <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                  <span>Junior Dream Engineer at the Midnight Nursery</span>
                </div>

                <HeadingReveal
                  as="h1"
                  delay={50}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#fff8f1] tracking-tight leading-tight"
                >
                  Meet Pip
                </HeadingReveal>

                <p className="text-xs sm:text-sm text-pink-200/70 font-rounded font-medium mt-0.5">
                  Junior Dream Engineer at the Midnight Nursery
                </p>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-pink-100/90">
                  "Every night, when the world grows quiet and the stars begin to sparkle, Pip gets to work. A little sleepy, endlessly imaginative, and always ready to dream, Pip turns tiny ideas into magical bedtime adventures."
                </p>
              </div>

              {/* PIP'S SPECIALTIES GRID */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-pink-300/80">
                  Pip's Specialties:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SPECIALTIES.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div
                        key={spec.title}
                        className={`p-2.5 rounded-2xl liquid-glass border ${spec.border} flex items-start gap-2.5`}
                      >
                        <div className={`p-1.5 rounded-xl ${spec.bg} ${spec.color} shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold font-serif text-white block">
                            {spec.title}
                          </span>
                          <span className="text-[11px] text-pink-200/80 leading-snug block">
                            — {spec.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CLOSING LINE & ACTION CTA */}
              <div className="pt-2 space-y-3">
                <p className="text-xs sm:text-sm font-medium italic text-yellow-200/90 leading-snug">
                  "Every great dream begins with a little spark of imagination. Ready to see what Pip dreams up next?"
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleEnterOS}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2 group cursor-pointer hover:scale-105 active:scale-95"
                    style={{ backgroundColor: 'var(--color-berry)' }}
                  >
                    <span>Enter Dream OS</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onWakePip}
                    className="liquid-glass-pill px-4 py-2 text-xs font-semibold text-pink-200 hover:text-white transition-colors cursor-pointer"
                  >
                    Skip directly to inventions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
