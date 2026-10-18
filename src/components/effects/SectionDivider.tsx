import React from 'react';
import { Star, Sparkles, Moon, Cloud } from 'lucide-react';

export interface SectionDividerProps {
  variant?: 'wave' | 'constellation' | 'arch' | 'horizon';
  theme?: 'day' | 'night';
  badgeIcon?: 'star' | 'sparkle' | 'moon' | 'cloud';
  badgeLabel?: string;
  className?: string;
  flip?: boolean;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'wave',
  theme = 'night',
  badgeIcon = 'star',
  badgeLabel,
  className = '',
  flip = false,
}) => {
  const isNight = theme === 'night';

  const renderBadgeIcon = () => {
    switch (badgeIcon) {
      case 'sparkle':
        return <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />;
      case 'moon':
        return <Moon className="w-3.5 h-3.5 text-amber-300" />;
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-sky-400" />;
      case 'star':
      default:
        return <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" />;
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden select-none my-6 sm:my-10 ${
        flip ? 'rotate-180' : ''
      } ${className}`}
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-20 lg:h-24 transition-opacity duration-500"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Liquid Glass Starlight Gradient */}
            <linearGradient id={`dividerGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#c084fc" stopOpacity={isNight ? '0.7' : '0.5'} />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity={isNight ? '0.9' : '0.7'} />
              <stop offset="75%" stopColor="#f1c66d" stopOpacity={isNight ? '0.7' : '0.5'} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </linearGradient>

            {/* Liquid Glass Body Fill Gradient */}
            <linearGradient id={`dividerFill-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={isNight ? '#38bdf8' : '#ffffff'}
                stopOpacity={isNight ? '0.08' : '0.15'}
              />
              <stop
                offset="100%"
                stopColor={isNight ? '#f472b6' : '#e0e7ff'}
                stopOpacity="0"
              />
            </linearGradient>

            {/* Glow Filter */}
            <filter id={`dividerGlow-${variant}`} x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* VARIANT 1: UNDULATING LIQUID WAVE WITH STARRY NODES */}
          {variant === 'wave' && (
            <g>
              {/* Glass fill area */}
              <path
                d="M 0,55 C 320,15 540,95 720,55 C 900,15 1120,95 1440,55 L 1440,100 L 0,100 Z"
                fill={`url(#dividerFill-${variant})`}
              />
              {/* Diffuse glow aura */}
              <path
                d="M 0,55 C 320,15 540,95 720,55 C 900,15 1120,95 1440,55"
                stroke={`url(#dividerGrad-${variant})`}
                strokeWidth="4"
                filter={`url(#dividerGlow-${variant})`}
                opacity="0.5"
              />
              {/* Crisp liquid glass wave line */}
              <path
                d="M 0,55 C 320,15 540,95 720,55 C 900,15 1120,95 1440,55"
                stroke={`url(#dividerGrad-${variant})`}
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              {/* Faint secondary dotted constellation orbit */}
              <path
                d="M 0,65 C 320,25 540,105 720,65 C 900,25 1120,105 1440,65"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="4 10"
                opacity="0.3"
              />
            </g>
          )}

          {/* VARIANT 2: CONSTELLATION LINKED ARCH WITH TWINKLE STARS */}
          {variant === 'constellation' && (
            <g>
              <path
                d="M 0,70 C 380,20 620,80 720,40 C 820,80 1060,20 1440,70"
                stroke={`url(#dividerGrad-${variant})`}
                strokeWidth="2"
                strokeDasharray="6 8"
                strokeLinecap="round"
                filter={`url(#dividerGlow-${variant})`}
                opacity="0.75"
              />
              <path
                d="M 0,70 C 380,20 620,80 720,40 C 820,80 1060,20 1440,70"
                stroke="#ffffff"
                strokeWidth="1"
                strokeDasharray="2 12"
                strokeLinecap="round"
              />
              {/* Connecting constellation vectors */}
              <line x1="240" y1="42" x2="380" y2="28" stroke="#f472b6" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 4" />
              <line x1="1060" y1="28" x2="1200" y2="42" stroke="#38bdf8" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 4" />
            </g>
          )}

          {/* VARIANT 3: CELESTIAL ARCH WITH CURVED GLASS CREST */}
          {variant === 'arch' && (
            <g>
              <path
                d="M 0,85 Q 720,-10 1440,85 L 1440,100 L 0,100 Z"
                fill={`url(#dividerFill-${variant})`}
              />
              <path
                d="M 0,85 Q 720,-10 1440,85"
                stroke={`url(#dividerGrad-${variant})`}
                strokeWidth="3.5"
                filter={`url(#dividerGlow-${variant})`}
                opacity="0.6"
              />
              <path
                d="M 0,85 Q 720,-10 1440,85"
                stroke={`url(#dividerGrad-${variant})`}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 60,92 Q 720,5 1380,92"
                stroke="#f1c66d"
                strokeWidth="1"
                strokeDasharray="3 14"
                opacity="0.35"
              />
            </g>
          )}

          {/* VARIANT 4: DREAM HORIZON WITH DUAL FLOWING RIBBONS */}
          {variant === 'horizon' && (
            <g>
              <path
                d="M 0,40 C 450,85 990,15 1440,60"
                stroke={`url(#dividerGrad-${variant})`}
                strokeWidth="2.5"
                filter={`url(#dividerGlow-${variant})`}
                opacity="0.7"
              />
              <path
                d="M 0,60 C 450,15 990,85 1440,40"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                opacity="0.45"
              />
            </g>
          )}

          {/* EMBEDDED CONSTELLATION STARS & STARDUST NODES */}
          {/* Left Cluster */}
          <g transform="translate(180, 48)">
            <circle r="2.5" fill="#f1c66d" className="animate-ping opacity-60" />
            <circle r="1.75" fill="#ffffff" />
            <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#f1c66d" opacity="0.6" />
          </g>
          <g transform="translate(340, 26)">
            <circle r="1.5" fill="#f472b6" />
            <circle r="3" fill="#f472b6" opacity="0.35" filter={`url(#dividerGlow-${variant})`} />
          </g>
          <g transform="translate(480, 68)">
            <circle r="2" fill="#38bdf8" />
            <path d="M0,-5 L1,-1 L5,0 L1,1 L0,5 L-1,1 L-5,0 L-1,-1 Z" fill="#ffffff" opacity="0.75" />
          </g>

          {/* Right Cluster */}
          <g transform="translate(960, 68)">
            <circle r="2" fill="#38bdf8" />
            <path d="M0,-5 L1,-1 L5,0 L1,1 L0,5 L-1,1 L-5,0 L-1,-1 Z" fill="#ffffff" opacity="0.75" />
          </g>
          <g transform="translate(1100, 26)">
            <circle r="1.5" fill="#c084fc" />
            <circle r="3" fill="#c084fc" opacity="0.35" filter={`url(#dividerGlow-${variant})`} />
          </g>
          <g transform="translate(1260, 48)">
            <circle r="2.5" fill="#f1c66d" className="animate-ping opacity-60" />
            <circle r="1.75" fill="#ffffff" />
            <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#f1c66d" opacity="0.6" />
          </g>
        </svg>

        {/* CENTRAL LIQUID-GLASS ORB & NARRATIVE BADGE */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="liquid-glass-pill px-3.5 py-1.5 flex items-center gap-2 border border-pink-400/30 hover:border-pink-400/60 shadow-[0_0_16px_rgba(244,114,182,0.25)] transition-all">
            {renderBadgeIcon()}
            {badgeLabel && (
              <span
                className="text-[11px] font-semibold tracking-wider uppercase font-rounded"
                style={{ color: 'var(--color-text-main)' }}
              >
                {badgeLabel}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
