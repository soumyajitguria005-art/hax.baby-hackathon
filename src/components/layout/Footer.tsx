import React, { useState, useEffect } from 'react';
import { PipCharacter } from '../character/PipCharacter';
import { ArrowUp, Heart, Moon } from 'lucide-react';
import { ScrollReveal } from '../effects/ScrollReveal';
import { HeadingReveal } from '../effects/HeadingReveal';
import { TextAnimation } from '../text';

interface FooterProps {
  theme: 'day' | 'night';
  enableTilt: boolean;
}

export const Footer: React.FC<FooterProps> = ({ theme, enableTilt }) => {
  const [visitorCount, setVisitorCount] = useState<number>(42);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('pip_local_dream_counter');
      const count = stored ? parseInt(stored, 10) + 1 : 42;
      localStorage.setItem('pip_local_dream_counter', count.toString());
      setVisitorCount(count);
    } catch {
      setVisitorCount(42);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formattedCount = visitorCount.toString().padStart(6, '0');

  return (
    <footer className="py-16 border-t border-slate-800/60 relative overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-pink-400/20">
          {/* Sleeping Pip on Cloud */}
          <ScrollReveal distance={24} duration={700}>
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                <PipCharacter
                  state="sleeping"
                  size="md"
                  enableTilt={enableTilt}
                  theme={theme}
                  showSpeechBubble={false}
                  interactive={true}
                  showParticles={true}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-pink-400 mb-1">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Midnight Nursery Shift Over</span>
                </div>
                <HeadingReveal
                  as="h3"
                  delay={80}
                  className="text-xl sm:text-2xl font-bold font-serif"
                  style={{ color: 'var(--color-text-heading)' }}
                >
                  <TextAnimation divideBy="word">
                    Pip is sound asleep
                  </TextAnimation>
                </HeadingReveal>
                <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Curled up with his white plush bunny friend on a bed of vapor. Ready for tomorrow’s dream deliveries.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Back to top glass button & Local visitor counter */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <button
              onClick={scrollToTop}
              className="liquid-glass-button px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              style={{ color: 'var(--color-text-main)' }}
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-pink-400" />
            </button>

            {/* Local Nursery Counter */}
            <div className="liquid-glass-pill px-3 py-1.5 flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="text-[10px] text-pink-400 uppercase font-semibold">Local Dream Count:</span>
              <span className="text-amber-400 font-bold tracking-widest">#{formattedCount}</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Quote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <p>© 2026 Pip's Dream OS. Built with liquid glass and stardust.</p>
          <div className="flex items-center gap-4">
            <span className="italic">"Good things start small."</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-pink-400 font-semibold">
              Sweet dreams <Heart className="w-3 h-3 fill-pink-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
