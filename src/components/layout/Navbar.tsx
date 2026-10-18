import React, { useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/soundEffects';

interface NavbarProps {
  theme: 'day' | 'night';
  onToggleTheme: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onSecretStarUnlock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  soundMuted,
  onToggleSound,
  onSecretStarUnlock,
}) => {
  const [starClickCount, setStarClickCount] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);

  const handleStarClick = () => {
    soundEngine.playStarSparkle();
    const newCount = starClickCount + 1;
    setStarClickCount(newCount);

    if (newCount >= 5) {
      setStarClickCount(0);
      setShowSecretModal(true);
      onSecretStarUnlock();

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#f1c66d', '#f472b6', '#a34063', '#ffffff'],
        });
      } catch {
        // Fallback if canvas-confetti is unavailable
      }
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
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
            <a
              href="#hero"
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              Home
            </a>
            <a
              href="#about"
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              About
            </a>
            <a
              href="#projects"
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              Projects
            </a>
            <a
              href="#story"
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap"
              style={{ color: 'var(--color-text-main)' }}
            >
              Our Story
            </a>
            <a
              href="#dream-delivery-routes"
              className="px-3.5 py-1.5 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors whitespace-nowrap text-sky-400"
            >
              Routes
            </a>
          </nav>

          {/* Zone 3: Interactive Controls (Sound, Theme, Secret Star) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Secret Clickable Star Button (5 clicks trigger Easter Egg) */}
            <button
              onClick={handleStarClick}
              className="liquid-glass-pill p-2 text-yellow-400 hover:text-yellow-300 hover:scale-110 active:scale-95 transition-all relative group"
              title={`Secret Star (${starClickCount}/5 clicks)`}
              aria-label="Secret star easter egg"
            >
              <Star className="w-4 h-4 fill-yellow-300 drop-shadow-[0_0_6px_rgba(241,198,109,0.7)] animate-pulse" />
              {starClickCount > 0 && starClickCount < 5 && (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-mono bg-pink-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {starClickCount}
                </span>
              )}
            </button>

            {/* Global Sound Toggle */}
            <button
              onClick={onToggleSound}
              aria-pressed={!soundMuted}
              className={`liquid-glass-pill px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all ${
                !soundMuted ? 'text-amber-400' : 'text-slate-400'
              }`}
              title={!soundMuted ? 'Mute Sounds' : 'Unmute Bedtime Sounds'}
              aria-label={!soundMuted ? 'Mute Sounds' : 'Unmute Bedtime Sounds'}
            >
              {!soundMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{!soundMuted ? 'Sound On' : 'Muted'}</span>
            </button>

            {/* Day / Night Theme Switch */}
            <button
              onClick={onToggleTheme}
              className="liquid-glass-pill px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              style={{ color: 'var(--color-text-heading)' }}
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

      {/* Secret Star Floating Glass Note Modal */}
      {showSecretModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border-2 border-pink-400/50 animate-pip-bounce">
            <div className="flex items-center justify-between pb-3 border-b border-pink-500/20 mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-yellow-300">
                <Sparkles className="w-4 h-4" />
                <span>Pip's Secret Star Note</span>
              </div>
              <button
                onClick={() => setShowSecretModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
                aria-label="Close message"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-4 space-y-3">
              <div className="text-4xl">🌟</div>
              <blockquote className="text-lg font-serif italic text-white leading-relaxed">
                "You found my secret star! Thanks for being here."
              </blockquote>
              <cite className="block text-sm font-semibold text-pink-300 not-italic">
                — Pip, Junior Dream Engineer
              </cite>
              <p className="text-xs text-slate-300 pt-2">
                You've unlocked the Midnight Confetti Blessing. Sleep tight tonight!
              </p>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setShowSecretModal(false)}
                className="liquid-glass-button px-6 py-2 rounded-full text-xs font-bold text-white bg-pink-600/60 hover:bg-pink-600 border border-pink-400"
              >
                Keep Dreaming ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
