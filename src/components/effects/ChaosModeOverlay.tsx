import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/soundEffects';

interface ChaosModeOverlayProps {
  active: boolean;
  onDisable: () => void;
  theme: 'day' | 'night';
}

interface FloatingMote {
  id: number;
  emoji: string;
  left: number; // percentage
  top: number;  // percentage
  speed: number;
  size: number;
}

const RETRO_EMOJIS = ['⭐', '✨', '🌙', '👾', '🎮', '🪄', '☁️', '💤'];

export const ChaosModeOverlay: React.FC<ChaosModeOverlayProps> = ({ active, onDisable, theme }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motes, setMotes] = useState<FloatingMote[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);

    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Initialize restrained floating sprites when active
  useEffect(() => {
    if (!active) {
      setMotes([]);
      document.body.classList.remove('chaos-mode-active');
      return;
    }

    // Apply active chaos state to body for CSS transition enhancements
    document.body.classList.add('chaos-mode-active');

    // Play whimsical activation chime
    soundEngine.playConstellationChime(3);

    // Trigger gentle initial confetti burst
    if (!reducedMotion) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.1 },
          colors: ['#f472b6', '#38bdf8', '#f1c66d', '#a855f7'],
        });
      } catch {
        // fallback
      }
    }

    // Restrained floating sprites in margins (6 items max)
    const initialMotes: FloatingMote[] = [
      { id: 1, emoji: '👾', left: 4, top: 20, speed: 22, size: 20 },
      { id: 2, emoji: '⭐', left: 93, top: 28, speed: 18, size: 18 },
      { id: 3, emoji: '✨', left: 6, top: 62, speed: 25, size: 22 },
      { id: 4, emoji: '🎮', left: 92, top: 70, speed: 20, size: 20 },
      { id: 5, emoji: '🌙', left: 3, top: 85, speed: 24, size: 18 },
      { id: 6, emoji: '💤', left: 94, top: 45, speed: 19, size: 16 },
    ];
    setMotes(initialMotes);

    // Global click listener in Chaos Mode to produce tiny playful sparkle pop
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't pop on dismiss button
      const target = e.target as HTMLElement;
      if (target?.closest('[data-chaos-dismiss]')) return;

      if (!reducedMotion) {
        soundEngine.playGentlePop();
      }
    };

    window.addEventListener('click', handleGlobalClick, { passive: true });

    return () => {
      document.body.classList.remove('chaos-mode-active');
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [active, reducedMotion]);

  if (!active) return null;

  return (
    <>
      {/* 1. TOP RETRO DREAM MARQUEE BANNER */}
      <div
        role="status"
        aria-live="polite"
        className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg transition-all animate-fade-in"
      >
        <div className="liquid-glass rounded-full px-4 py-2 flex items-center justify-between gap-3 shadow-2xl border-2 border-pink-400/60 bg-slate-950/85 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-pink-300 font-bold whitespace-nowrap flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>CHAOS MODE ON</span>
            </span>
            <span className="hidden sm:inline text-slate-400">·</span>
            <span className="hidden sm:inline text-amber-300/90 truncate text-[11px]">
              Retro dream sprites & click sparkles active!
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonTick();
              onDisable();
            }}
            data-chaos-dismiss="true"
            className="shrink-0 px-2.5 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/40 border border-pink-400/40 text-[11px] font-mono text-pink-200 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            aria-label="Turn off Chaos Mode"
          >
            <span>Exit</span>
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. RESTRAINED RETRO FLOATING MARGIN SPRITES (POINTER-EVENTS-NONE) */}
      <div
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
        aria-hidden="true"
      >
        {motes.map((mote) => (
          <div
            key={mote.id}
            className={`absolute transition-transform ${
              reducedMotion ? '' : 'animate-bounce'
            }`}
            style={{
              left: `${mote.left}%`,
              top: `${mote.top}%`,
              fontSize: `${mote.size}px`,
              animationDuration: `${mote.speed / 4}s`,
              opacity: 0.85,
              filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.6))',
            }}
          >
            {mote.emoji}
          </div>
        ))}
      </div>
    </>
  );
};
