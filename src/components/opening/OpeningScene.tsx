import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PipCharacter } from '../character/PipCharacter';
import { soundEngine } from '../../utils/soundEffects';
import { Sparkles, Star } from 'lucide-react';
import { TextAnimation } from '../text/TextAnimation';
import { HeadingReveal } from '../effects/HeadingReveal';

interface OpeningSceneProps {
  onWakePip: () => void;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({ onWakePip }) => {
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const HOLD_DURATION = 1600; // ms to complete hold

  const handleComplete = useCallback(() => {
    setIsBursting(true);
    soundEngine.playStarSparkle();
    setTimeout(() => {
      onWakePip();
    }, 800);
  }, [onWakePip]);

  useEffect(() => {
    if (!isHolding) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      startTimeRef.current = null;
      // Smoothly decrement progress if released
      setHoldProgress((prev) => (prev > 0 ? Math.max(0, prev - 4) : 0));
      return;
    }

    const step = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const currentPct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(currentPct);

      if (currentPct >= 100) {
        handleComplete();
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
  }, [isHolding, handleComplete]);

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${
        isBursting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#251a2a',
        backgroundImage:
          'radial-gradient(circle at 50% 40%, rgba(163, 64, 99, 0.25) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(241, 198, 109, 0.15) 0%, transparent 50%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Pip's Dream Nursery"
    >
      {/* Background Starry Sky & Distant Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/6 left-1/5 w-1 h-1 bg-yellow-200 rounded-full animate-twinkle" />
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/5 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
        {/* Soft Drift Cloud Silhouettes */}
        <div className="absolute -bottom-16 left-0 right-0 h-48 bg-gradient-to-t from-[#1b1220] to-transparent pointer-events-none" />
      </div>

      {/* Skip Intro Button */}
      <button
        onClick={onWakePip}
        className="absolute top-6 right-6 z-20 liquid-glass-pill px-4 py-2 text-xs font-semibold text-pink-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
        aria-label="Skip introduction"
      >
        <span>Skip to OS</span>
        <span aria-hidden="true">→</span>
      </button>

      {/* Main Nursery Stage */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto">
        {/* Character Stage: Sleeping Pip */}
        <div className="relative mb-4">
          {/* Luminous Ambient Moon Glow */}
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
            Pip is sound asleep on the clouds. Hold the golden star to wake Pip and open the Dream OS.
          </p>
        </div>

        {/* Interactive Hold Star Button with Progress Ring */}
        <div className="relative flex flex-col items-center justify-center">
          <div
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setIsHolding(true);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setIsHolding(false);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Hold the star to wake Pip"
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
            <div className={`relative transition-transform duration-200 ${isHolding ? 'scale-125' : 'scale-100 animate-pulse'}`}>
              <Star className="w-10 h-10 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_12px_rgba(241,198,109,0.9)]" />
            </div>
          </div>

          <span className="text-xs font-semibold text-yellow-200/90 mt-3 font-rounded">
            {isHolding ? 'Waking Pip...' : 'Press & hold the star'}
          </span>
        </div>
      </div>
    </div>
  );
};
