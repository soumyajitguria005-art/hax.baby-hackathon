import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export interface DreamWaypoint {
  id: string;
  name: string;
  x: number; // percentage (0 to 100) or SVG x-coord
  y: number; // SVG y-coord
  label?: string;
  type?: string;
}

export interface DreamPathProps {
  className?: string;
  isRevealed?: boolean;
  progress?: number; // 0 to 100 optional manual flight progress
  interactive?: boolean;
  onSelectWaypoint?: (waypointId: string) => void;
  selectedWaypointId?: string;
  showWaypoints?: boolean;
  showTravelingComet?: boolean;
  height?: number | string;
}

const DEFAULT_WAYPOINTS: DreamWaypoint[] = [
  { id: 'launchpad', name: 'Cloud Launchpad', x: 25, y: 120, label: 'Station 0', type: 'base' },
  { id: 'rabbit', name: 'Cumulus Meadows', x: 420, y: 85, label: 'Rabbit Meadow', type: 'recipient' },
  { id: 'bear', name: 'Evergreen Hollow', x: 780, y: 145, label: 'Bear Cave', type: 'recipient' },
  { id: 'owl', name: 'High Silver Birch', x: 1160, y: 75, label: 'Owl Roost', type: 'recipient' },
];

// Beautiful gentle bezier spline traversing horizontally across the canvas
const PATH_D =
  'M 20 125 C 160 30, 280 200, 420 85 C 560 -10, 680 210, 780 145 C 880 80, 1020 10, 1165 75';

export const DreamPath: React.FC<DreamPathProps> = ({
  className = '',
  isRevealed: propIsRevealed,
  progress: propProgress,
  onSelectWaypoint,
  selectedWaypointId,
  showWaypoints = true,
  showTravelingComet = true,
  height = 180,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState<number>(1200);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Hook for viewport intersection
  const { ref: observerRef, isRevealed: localRevealed } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: false,
  });

  const isRevealed = propIsRevealed !== undefined ? propIsRevealed : localRevealed;

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      try {
        const total = pathRef.current.getTotalLength();
        if (total && total > 0) {
          setPathLength(total);
        }
      } catch {
        // Fallback default
        setPathLength(1350);
      }
    }
  }, []);

  // Track scroll position when the element is within or approaching the viewport
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;

          // Compute progress based on section position relative to screen
          // When top enters bottom of screen: 0, when it reaches top third: 1
          const start = windowHeight * 0.9;
          const end = windowHeight * 0.2;
          const current = rect.top;

          let p = (start - current) / (start - end);
          p = Math.max(0, Math.min(1, p));
          setScrollProgress(p);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Effective drawing progress (0 to 1)
  // If manual propProgress is provided (0-100), use that;
  // Otherwise blend isRevealed and scrollProgress for an organic feel
  const currentDrawRatio =
    propProgress !== undefined
      ? Math.max(0, Math.min(1, propProgress / 100))
      : isRevealed
      ? Math.max(0.2, Math.min(1, scrollProgress))
      : 0;

  // Dashoffset calculation for drawing the dotted path
  // pathLength * (1 - ratio)
  const strokeOffset = pathLength * (1 - currentDrawRatio);

  return (
    <div
      ref={(el) => {
        // Assign to both containerRef and observerRef
        containerRef.current = el;
        if (typeof observerRef === 'function') {
          (observerRef as (instance: HTMLDivElement | null) => void)(el);
        } else if (observerRef && 'current' in observerRef) {
          (observerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      className={`relative w-full overflow-hidden select-none ${className}`}
      style={{ minHeight: typeof height === 'number' ? `${height}px` : height }}
    >
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Intense Glow Filter */}
          <filter id="dreamGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gentle Ambient Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>

          {/* Starlight Gradient */}
          <linearGradient id="dreamPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#c084fc" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#f1c66d" stopOpacity="0.95" />
          </linearGradient>

          {/* Ambient Track Gradient */}
          <linearGradient id="dreamTrackGhost" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#f1c66d" stopOpacity="0.12" />
          </linearGradient>

          {/* Traveling Comet Radial Gradient */}
          <radialGradient id="cometGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. FAINT BASELINE GUIDE TRACK (Background guide) */}
        <path
          d={PATH_D}
          stroke="url(#dreamTrackGhost)"
          strokeWidth="2"
          strokeDasharray="4 8"
          strokeLinecap="round"
          className="opacity-40"
        />

        {/* 2. GLOWING AURA PATH (Wide, blurred backlight) */}
        <path
          d={PATH_D}
          stroke="url(#dreamPathGradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={pathLength > 0 ? `${pathLength}` : '1350'}
          strokeDashoffset={strokeOffset}
          filter="url(#dreamGlow)"
          className="opacity-60 transition-all duration-300 ease-out"
        />

        {/* 3. CONTINUOUS GLOWING DOTTED LINE PATH (The primary animated dotted line) */}
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="url(#dreamPathGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 14" // Crisp distinct circular starlight dots
          strokeDashoffset={strokeOffset}
          filter="url(#softGlow)"
          className="transition-all duration-300 ease-out drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
        />

        {/* 4. SECOND CRISP INNER DOTTED PASS for intense pinpoint star luminance */}
        <path
          d={PATH_D}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1 14"
          strokeDashoffset={strokeOffset}
          className="opacity-90 transition-all duration-300 ease-out"
        />

        {/* 5. TRAVELING GLOWING STARDUST COMET (Animates along the revealed portion) */}
        {showTravelingComet && isRevealed && currentDrawRatio > 0.02 && (
          <g className="transition-transform duration-200">
            {/* The tip of the drawn path has a pulsating stardust particle */}
            <circle
              r="14"
              fill="url(#cometGlow)"
              filter="url(#dreamGlow)"
              className="animate-pulse"
              style={{
                offsetPath: `path("${PATH_D}")`,
                offsetDistance: `${currentDrawRatio * 100}%`,
              }}
            />
            <circle
              r="4.5"
              fill="#ffffff"
              className="drop-shadow-[0_0_6px_#38bdf8]"
              style={{
                offsetPath: `path("${PATH_D}")`,
                offsetDistance: `${currentDrawRatio * 100}%`,
              }}
            />
          </g>
        )}

        {/* 6. CONSTELLATION WAYPOINT STOPS (Recipients along the dream delivery flight) */}
        {showWaypoints &&
          DEFAULT_WAYPOINTS.map((wp, index) => {
            const isSelected = selectedWaypointId === wp.id;
            const thresholdRatio = index / (DEFAULT_WAYPOINTS.length - 1);
            const isWaypointReached = currentDrawRatio >= thresholdRatio * 0.95;

            return (
              <g
                key={wp.id}
                transform={`translate(${wp.x}, ${wp.y})`}
                onClick={() => onSelectWaypoint?.(wp.id)}
                className={`transition-all duration-500 ${
                  onSelectWaypoint ? 'cursor-pointer' : ''
                } ${isWaypointReached ? 'opacity-100 scale-100' : 'opacity-35 scale-90'}`}
              >
                {/* Outer Pulsing Beacon */}
                {isWaypointReached && (
                  <circle
                    r={isSelected ? '18' : '13'}
                    fill="none"
                    stroke={isSelected ? '#38bdf8' : '#f472b6'}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin-slow opacity-80"
                  />
                )}

                {/* Soft glow halo */}
                <circle
                  r={isSelected ? '12' : '9'}
                  fill={isSelected ? '#38bdf8' : '#f1c66d'}
                  opacity={isSelected ? '0.45' : '0.25'}
                  filter="url(#dreamGlow)"
                />

                {/* Solid waypoint core star node */}
                <circle
                  r={isSelected ? '6' : '4.5'}
                  fill={isSelected ? '#ffffff' : '#f1c66d'}
                  stroke={isSelected ? '#38bdf8' : '#e0e7ff'}
                  strokeWidth="2"
                  className="transition-transform hover:scale-125"
                />

                {/* Tiny star twinkle inside */}
                <circle r="1.5" fill="#ffffff" />

                {/* Waypoint Label Badge */}
                <g transform="translate(0, 24)">
                  <rect
                    x="-45"
                    y="-10"
                    width="90"
                    height="18"
                    rx="9"
                    fill="#0f172a"
                    fillOpacity="0.85"
                    stroke={isSelected ? '#38bdf8' : 'rgba(244, 114, 182, 0.4)'}
                    strokeWidth="1"
                    className="backdrop-blur-sm"
                  />
                  <text
                    x="0"
                    y="2.5"
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#f8fafc'}
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    className="tracking-tight select-none pointer-events-none"
                  >
                    {wp.name}
                  </text>
                </g>
              </g>
            );
          })}
      </svg>

      {/* Floating Stardust particles along the DreamPath */}
      <div className="absolute inset-0 pointer-events-none">
        <span
          className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-pink-300 animate-twinkle shadow-[0_0_8px_#f472b6]"
          style={{ animationDelay: '0.4s' }}
        />
        <span
          className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-sky-300 animate-twinkle shadow-[0_0_8px_#38bdf8]"
          style={{ animationDelay: '1.2s' }}
        />
        <span
          className="absolute top-1/3 right-1/6 w-1 h-1 rounded-full bg-amber-200 animate-twinkle shadow-[0_0_6px_#f1c66d]"
          style={{ animationDelay: '1.8s' }}
        />
      </div>
    </div>
  );
};
