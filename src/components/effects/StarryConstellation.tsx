import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../utils/soundEffects';
import { Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface StarNode {
  id: string;
  name: string;
  x: number; // percentage of viewport width (0 - 100)
  y: number; // percentage of viewport height (0 - 100)
  color?: string;
  size?: number;
}

// 12 carefully positioned celestial constellation stars across the viewport edges
const CELESTIAL_STARS: StarNode[] = [
  // Left Wing Cluster
  { id: 'star-1', name: 'Polaris Pip', x: 8, y: 14, color: '#f1c66d', size: 10 },
  { id: 'star-2', name: 'Sleepy Ursa', x: 18, y: 26, color: '#f472b6', size: 8 },
  { id: 'star-3', name: 'Cloud Bunny', x: 6, y: 44, color: '#38bdf8', size: 9 },
  { id: 'star-4', name: 'Lullaby Lyra', x: 16, y: 62, color: '#c084fc', size: 8 },
  { id: 'star-5', name: 'Dream Lantern', x: 8, y: 82, color: '#f1c66d', size: 9 },

  // Center Arc
  { id: 'star-6', name: 'Cloud Fluff', x: 28, y: 8, color: '#bae6fd', size: 7 },
  { id: 'star-7', name: 'Moonlit Whiskers', x: 72, y: 7, color: '#fde047', size: 8 },

  // Right Wing Cluster
  { id: 'star-8', name: 'Sirius Spark', x: 92, y: 15, color: '#38bdf8', size: 10 },
  { id: 'star-9', name: 'Nightcap Crest', x: 82, y: 30, color: '#f472b6', size: 9 },
  { id: 'star-10', name: 'Stardust Wing', x: 94, y: 50, color: '#c084fc', size: 8 },
  { id: 'star-11', name: 'Celesta Chord', x: 84, y: 70, color: '#38bdf8', size: 8 },
  { id: 'star-12', name: 'Midnight Bell', x: 92, y: 86, color: '#f1c66d', size: 9 },
];

export interface StarryConstellationProps {
  theme: 'day' | 'night';
}

export const StarryConstellation: React.FC<StarryConstellationProps> = ({ theme }) => {
  // Only active in Night mode
  const [connectedStars, setConnectedStars] = useState<string[]>([]);
  const [lastClickedStar, setLastClickedStar] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState<StarNode | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Clear constellation when switching to Day mode
  useEffect(() => {
    if (theme === 'day') {
      setConnectedStars([]);
      setLastClickedStar(null);
      setHasCelebrated(false);
    }
  }, [theme]);

  if (theme !== 'night') {
    return null;
  }

  const handleStarClick = (star: StarNode) => {
    // If the star is already the last clicked star, do nothing
    if (lastClickedStar === star.id) return;

    // Play faint celestial chime note
    const noteIndex = connectedStars.length;
    soundEngine.playConstellationChime(noteIndex);

    const nextConnected = [...connectedStars, star.id];
    setConnectedStars(nextConnected);
    setLastClickedStar(star.id);

    // Easter egg celebration when 5 or more stars form a constellation
    if (nextConnected.length === 5 && !hasCelebrated) {
      setHasCelebrated(true);
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.2 },
          colors: ['#f1c66d', '#38bdf8', '#f472b6'],
        });
      } catch {
        // Fallback
      }
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playGentlePop();
    setConnectedStars([]);
    setLastClickedStar(null);
    setHasCelebrated(false);
  };

  // Convert star ID to StarNode
  const getStarById = (id: string) => CELESTIAL_STARS.find((s) => s.id === id);

  return (
    <div
      aria-hidden="false"
      className="fixed inset-0 w-full h-full pointer-events-none z-30 overflow-hidden select-none"
    >
      {/* SVG GLOWING CONSTELLATION LINES */}
      <svg
        className="w-full h-full absolute inset-0 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Intense Constellation Starlight Glow */}
          <filter id="constellationGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Starlight Line Gradient */}
          <linearGradient id="constellationLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f1c66d" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Drawn Constellation Lines */}
        {connectedStars.map((starId, index) => {
          if (index === 0) return null;
          const prevStar = getStarById(connectedStars[index - 1]);
          const currStar = getStarById(starId);

          if (!prevStar || !currStar) return null;

          return (
            <g key={`line-${prevStar.id}-${currStar.id}-${index}`}>
              {/* Outer soft glow line */}
              <line
                x1={`${prevStar.x}%`}
                y1={`${prevStar.y}%`}
                x2={`${currStar.x}%`}
                y2={`${currStar.y}%`}
                stroke="url(#constellationLineGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#constellationGlow)"
                className="opacity-70 animate-fade-in"
              />
              {/* Crisp primary starlight line */}
              <line
                x1={`${prevStar.x}%`}
                y1={`${prevStar.y}%`}
                x2={`${currStar.x}%`}
                y2={`${currStar.y}%`}
                stroke="#ffffff"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeDasharray="4 6"
                className="opacity-90 animate-fade-in"
              />
            </g>
          );
        })}
      </svg>

      {/* CLICKABLE CONSTELLATION STARS */}
      {CELESTIAL_STARS.map((star) => {
        const isConnected = connectedStars.includes(star.id);
        const isLastClicked = lastClickedStar === star.id;
        const color = star.color || '#f1c66d';

        return (
          <button
            key={star.id}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none group cursor-pointer"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            aria-label={`Constellation star ${star.name}. Click to connect.`}
            title={`${star.name} (Click to link constellation)`}
          >
            {/* Outer pulsating beacon on hover or connection */}
            <span
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                isConnected
                  ? 'border-2 border-sky-400 animate-ping opacity-60'
                  : 'group-hover:border group-hover:border-pink-400 group-hover:animate-pulse opacity-40'
              }`}
              style={{
                borderColor: isConnected ? '#38bdf8' : color,
              }}
            />

            {/* Glowing Aura Ring */}
            <span
              className="absolute inset-0 rounded-full blur-[4px] transition-opacity duration-300"
              style={{
                backgroundColor: color,
                opacity: isConnected ? 0.75 : 0.25,
              }}
            />

            {/* Central Diamond Star Node */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`transform transition-transform duration-300 ${
                isConnected
                  ? 'scale-125 rotate-45'
                  : 'group-hover:scale-135 group-hover:rotate-12'
              }`}
            >
              {/* 4-point Diamond Star */}
              <path
                d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
                fill={isConnected ? '#ffffff' : color}
                stroke={color}
                strokeWidth="1"
                className="drop-shadow-[0_0_6px_rgba(241,198,109,0.8)]"
              />
              <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
            </svg>

            {/* Subtle Star Sparkle Twinkle */}
            {!isConnected && (
              <span
                className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white animate-ping opacity-60 pointer-events-none"
                style={{ animationDuration: '2.5s' }}
              />
            )}
          </button>
        );
      })}

      {/* MINIMAL LIQUID-GLASS CONSTELLATION HUD BADGE */}
      <div className="fixed bottom-6 left-6 pointer-events-auto z-40">
        <div className="liquid-glass-pill px-4 py-2 flex items-center gap-2.5 shadow-xl border border-sky-400/30 text-xs transition-all hover:scale-105">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
          <span className="font-semibold text-slate-200 font-serif">
            {connectedStars.length === 0 ? (
              <span className="text-slate-300">
                Night Constellation: <span className="text-sky-300 font-normal">Click stars to draw</span>
              </span>
            ) : (
              <span className="text-sky-300">
                Constellation: <strong className="text-white font-mono">{connectedStars.length}</strong> {connectedStars.length === 1 ? 'star' : 'stars'} linked
              </span>
            )}
          </span>

          {connectedStars.length > 0 && (
            <button
              onClick={handleReset}
              className="ml-1 p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Constellation"
              aria-label="Reset Constellation"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tooltip on hovered star */}
      {hoveredStar && (
        <div
          className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-8 animate-fade-in"
          style={{
            left: `${hoveredStar.x}%`,
            top: `${hoveredStar.y}%`,
          }}
        >
          <div className="liquid-glass-pill px-2.5 py-1 text-[10px] font-mono text-sky-200 border border-sky-400/40 shadow-lg whitespace-nowrap">
            ★ {hoveredStar.name}
          </div>
        </div>
      )}
    </div>
  );
};
