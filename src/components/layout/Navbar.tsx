import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Volume2, VolumeX, Star, Sparkles, Zap, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/soundEffects';

interface NavbarProps {
  theme: 'day' | 'night';
  onToggleTheme: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onSecretStarUnlock: () => void;
  chaosMode?: boolean;
  onToggleChaosMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  soundMuted,
  onToggleSound,
  onSecretStarUnlock,
  chaosMode = false,
  onToggleChaosMode,
}) => {
  const [starClickCount, setStarClickCount] = useState(0);
  const [showSecretToast, setShowSecretToast] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleStarClick = () => {
    soundEngine.playStarSparkle();
    const newCount = starClickCount + 1;
    setStarClickCount(newCount);

    if (newCount >= 4) {
      setStarClickCount(0);
      setShowSecretToast(true);
      onSecretStarUnlock();

      // Trigger gentle, non-disruptive confetti celebration
      try {
        confetti({
          particleCount: 45,
          spread: 50,
          origin: { y: 0.12 },
          colors: ['#f1c66d', '#f472b6', '#a34063', '#ffffff'],
        });
      } catch {
        // Fallback if canvas-confetti is unavailable
      }

      // Auto-dismiss toast after 6.5 seconds so visitor is never trapped
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = window.setTimeout(() => {
        setShowSecretToast(false);
      }, 6500);
    }
  };

  return (
    <>
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="liquid-glass rounded-full px-5 py-3 flex items-center justify-between gap-4 shadow-lg transition-all duration-300">
          {/* Zone 1: Wordmark & Brand Star */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight font-serif whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-full"
            style={{ color: 'var(--color-text-heading)' }}
          >
            <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-amber-300 flex items-center justify-center text-xs shadow-sm shadow-pink-500/40 group-hover:rotate-12 transition-transform">
              ⭐
            </span>
            <span>Pip's Dream OS</span>
          </a>

          {/* Zone 2: Navigation Links (Clean glass pills) */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold" aria-label="Main Navigation">
            <a
              href="#hero"
              onClick={() => soundEngine.playButtonTick()}
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => soundEngine.playButtonTick()}
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              About
            </a>
            <a
              href="#projects"
              onClick={() => soundEngine.playButtonTick()}
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              Projects
            </a>
            <a
              href="#story"
              onClick={() => soundEngine.playButtonTick()}
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              Our Story
            </a>
            <a
              href="#dream-delivery-routes"
              onClick={() => soundEngine.playButtonTick()}
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap text-sky-400"
            >
              Routes
            </a>
            <a
              href="#guestbook"
              onClick={() => soundEngine.playButtonTick()}
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap text-pink-300 font-bold"
            >
              Guestbook
            </a>
          </nav>

          {/* Zone 3: Interactive Controls (Sound, Theme, Secret Star, Chaos Mode) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Subtle Secret Star Button (Easter Egg Discovery) */}
            <button
              onClick={handleStarClick}
              className="liquid-glass-pill p-2 text-yellow-400 hover:text-yellow-300 hover:scale-110 active:scale-95 transition-all relative group cursor-pointer"
              title="Wish upon a star ✨"
              aria-label="Wish upon a star"
            >
              <Star className="w-4 h-4 fill-yellow-300 drop-shadow-[0_0_6px_rgba(241,198,109,0.7)] animate-pulse" />
            </button>

            {/* Optional Responsive Chaos Mode Toggle */}
            {onToggleChaosMode && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playButtonTick();
                  onToggleChaosMode();
                }}
                aria-pressed={chaosMode}
                className={`liquid-glass-pill px-2.5 sm:px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  chaosMode
                    ? 'text-pink-100 border-pink-400 bg-pink-500/30 shadow-[0_0_12px_rgba(244,114,182,0.6)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={chaosMode ? 'Chaos Mode is ON — Click to disable' : 'Chaos Mode is OFF — Click to enable playful effects'}
                aria-label={chaosMode ? 'Chaos Mode is ON — Click to disable' : 'Chaos Mode is OFF — Click to enable playful effects'}
              >
                <Zap className={`w-3.5 h-3.5 ${chaosMode ? 'fill-amber-300 text-amber-300 animate-bounce' : 'text-slate-400'}`} />
                <span className="text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap">
                  {chaosMode ? 'Chaos: ON' : 'Chaos: OFF'}
                </span>
              </button>
            )}

            {/* Global Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-pressed={!soundMuted}
              className={`liquid-glass-pill px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                !soundMuted ? 'text-amber-400' : 'text-slate-400'
              }`}
              title={!soundMuted ? 'Mute Sounds' : 'Unmute Bedtime Sounds'}
              aria-label={!soundMuted ? 'Mute Bedtime Sounds' : 'Unmute Bedtime Sounds'}
            >
              {!soundMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{!soundMuted ? 'Sound On' : 'Muted'}</span>
            </button>

            {/* Day / Night Theme Switch */}
            <button
              onClick={onToggleTheme}
              aria-pressed={theme === 'day'}
              className="liquid-glass-pill px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{ color: 'var(--color-text-heading)' }}
              title={theme === 'night' ? 'Switch to Warm Cream Day Mode' : 'Switch to Plum Night Mode'}
              aria-label={theme === 'night' ? 'Switch to Warm Cream Day Mode' : 'Switch to Plum Night Mode'}
            >
              {theme === 'night' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-pink-400" />
                  <span className="hidden sm:inline">Night</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Day</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Secret Star Floating Glass Toast Notification (Non-Intrusive Easter Egg Discovery) */}
      {showSecretToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 liquid-glass rounded-2xl px-5 py-3.5 shadow-2xl border border-pink-400/40 animate-fade-in flex items-center gap-3 max-w-sm sm:max-w-md w-[92%] text-left"
        >
          <div className="w-8 h-8 rounded-full bg-pink-500/20 text-yellow-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin-slow" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-pink-100 flex-1 leading-snug">
            You found a little extra magic! Pip wishes you the sweetest dreams. ✨
          </p>
          <button
            onClick={() => setShowSecretToast(false)}
            className="text-pink-300 hover:text-white p-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
            aria-label="Dismiss secret note"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};
