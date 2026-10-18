import React, { useState, useEffect } from 'react';
import { PipCharacter } from '../character/PipCharacter';
import { ArrowUp, Heart, Moon } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';
import { DeveloperBottomBar } from './DeveloperBottomBar';

interface FooterProps {
  theme: 'day' | 'night';
  enableTilt: boolean;
}

export const Footer: React.FC<FooterProps> = ({ theme, enableTilt }) => {
  const [visitorCount, setVisitorCount] = useState<number>(42);
  const [isShared] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('pip_local_dream_counter');
      const currentCount = stored ? parseInt(stored, 10) : 42;

      // Increment once per browser session to prevent double-counting on refresh
      const sessionCounted = sessionStorage.getItem('pip_counted_this_session');
      if (!sessionCounted) {
        const nextCount = currentCount + 1;
        localStorage.setItem('pip_local_dream_counter', nextCount.toString());
        sessionStorage.setItem('pip_counted_this_session', 'true');
        setVisitorCount(nextCount);
      } else {
        setVisitorCount(currentCount);
      }
    } catch {
      setVisitorCount(42);
    }
  }, []);

  const scrollToTop = () => {
    soundEngine.playLanternClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formattedCount = visitorCount.toString().padStart(6, '0');

  return (
    <footer
      data-cursor-exclude="true"
      className="pt-6 pb-6 sm:pt-7 sm:pb-7 border-t border-pink-400/15 relative overflow-visible transition-colors"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Main Clean Row: Sleepy Pip & Controls (Compact, tightened height) */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 pb-4 sm:pb-5">
          {/* Sleepy Pip & Farewell Message (18% larger avatar with snug Z/ZZ indicators) */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-[76px] h-[76px] sm:w-[92px] sm:h-[92px] shrink-0 relative flex items-center justify-center">
              <PipCharacter
                state="sleeping"
                size="md"
                enableTilt={enableTilt}
                theme={theme}
                showSpeechBubble={false}
                interactive={true}
                showParticles={true}
                className="w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] font-semibold text-pink-400 uppercase tracking-wider mb-0.5">
                <Moon className="w-3 h-3 text-pink-400" />
                <span>Midnight Nursery Shift Over</span>
              </div>
              <h3
                className="text-lg sm:text-xl font-bold font-serif"
                style={{ color: 'var(--color-text-heading)' }}
              >
                Pip is sound asleep
              </h3>
              <p
                className="text-xs max-w-sm mt-0.5 leading-relaxed"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Curled up with his plush bunny on a bed of vapor. Ready for tomorrow’s dream deliveries.
              </p>
            </div>
          </div>

          {/* Action Area: Back to Top & Minimalist Visitor Counter */}
          <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollToTop}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-pink-400/25 bg-white/5 hover:bg-pink-500/15 hover:border-pink-400/50 text-slate-200 hover:text-white shadow-xs active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-pink-400" />
            </button>

            {/* Refined Minimalist Visitor Counter */}
            <div className="flex flex-col items-center md:items-end gap-0.5">
              <div className="px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-mono border border-slate-700/40 bg-slate-950/60 shadow-xs">
                <span className="text-[10px] text-pink-400 font-semibold tracking-wider">
                  VISITOR:
                </span>
                <div className="flex items-center gap-0.5" aria-label={`Visitor count: ${visitorCount}`}>
                  {formattedCount.split('').map((digit, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center w-3.5 h-4.5 rounded bg-black/60 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold leading-none"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-500 tracking-tight">
                {isShared ? 'Shared Live Counter' : 'Local Session'}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Credits & Quote Row */}
        <div
          className="pt-3.5 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <p>© 2026 Pip's Dream OS. Built with liquid glass and stardust.</p>
          <div className="flex items-center gap-3">
            <span className="italic">"Good things start small."</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-pink-400 font-semibold">
              Sweet dreams <Heart className="w-3 h-3 fill-pink-400" />
            </span>
          </div>
        </div>

        {/* Final Row: Integrated Developer Attribution Bar */}
        <div className="pt-2 mt-2 border-t border-pink-400/10">
          <DeveloperBottomBar theme={theme} />
        </div>
      </div>
    </footer>
  );
};
