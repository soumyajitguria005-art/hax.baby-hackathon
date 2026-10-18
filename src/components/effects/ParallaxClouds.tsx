import React, { useEffect, useState, useRef } from 'react';

export interface ParallaxCloudsProps {
  theme?: 'day' | 'night';
  className?: string;
}

interface CloudLayer {
  id: string;
  top: string; // e.g. '12%', '35%', '60%', '82%'
  initialX: number; // base horizontal % or px
  speed: number; // horizontal parallax multiplier relative to scroll (e.g. 0.08, -0.05)
  scale: number;
  opacityNight: number;
  opacityDay: number;
  blur: number; // px for depth of field
  zIndex: number;
  pathType: 'puffy' | 'wispy' | 'celestial' | 'pillowy';
  gradientId: string;
  hasStar?: boolean;
}

const CLOUDS: CloudLayer[] = [
  // 1. High Hero / Upper Sky - drifts right
  {
    id: 'cloud-hero-right',
    top: '8%',
    initialX: 65,
    speed: 0.09,
    scale: 1.25,
    opacityNight: 0.28,
    opacityDay: 0.38,
    blur: 0,
    zIndex: 1,
    pathType: 'puffy',
    gradientId: 'cloudGradPink',
    hasStar: true,
  },
  // 2. Upper Projects Transition - drifts left
  {
    id: 'cloud-projects-left',
    top: '22%',
    initialX: -8,
    speed: -0.07,
    scale: 1.5,
    opacityNight: 0.22,
    opacityDay: 0.32,
    blur: 1,
    zIndex: 1,
    pathType: 'wispy',
    gradientId: 'cloudGradBlue',
  },
  // 3. Mid About Section - deeper layer, slow drift right
  {
    id: 'cloud-about-mid',
    top: '38%',
    initialX: 72,
    speed: 0.05,
    scale: 1.1,
    opacityNight: 0.18,
    opacityDay: 0.25,
    blur: 2,
    zIndex: 0,
    pathType: 'pillowy',
    gradientId: 'cloudGradPurple',
    hasStar: true,
  },
  // 4. Story Section Horizon - drifts left
  {
    id: 'cloud-story-left',
    top: '54%',
    initialX: 4,
    speed: -0.085,
    scale: 1.35,
    opacityNight: 0.26,
    opacityDay: 0.35,
    blur: 0.5,
    zIndex: 1,
    pathType: 'celestial',
    gradientId: 'cloudGradCyan',
  },
  // 5. Dream Delivery Routes - drifts right
  {
    id: 'cloud-routes-right',
    top: '70%',
    initialX: 60,
    speed: 0.075,
    scale: 1.4,
    opacityNight: 0.24,
    opacityDay: 0.34,
    blur: 1,
    zIndex: 1,
    pathType: 'puffy',
    gradientId: 'cloudGradPink',
    hasStar: true,
  },
  // 6. Character Studio & Footer - deep slow drift left
  {
    id: 'cloud-footer-left',
    top: '88%',
    initialX: 18,
    speed: -0.06,
    scale: 1.6,
    opacityNight: 0.2,
    opacityDay: 0.3,
    blur: 1.5,
    zIndex: 0,
    pathType: 'wispy',
    gradientId: 'cloudGradPurple',
  },
];

export const ParallaxClouds: React.FC<ParallaxCloudsProps> = ({
  theme = 'night',
  className = '',
}) => {
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion media query
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReduced = motionQuery.matches;
    let animId: number | null = null;
    let lastScrollY = -1;

    // Apply baseline transforms when reduced motion is preferred
    const applyReducedMotion = () => {
      cloudRefs.current.forEach((el, index) => {
        if (!el) return;
        const cloud = CLOUDS[index];
        if (cloud) {
          el.style.transform = `translate3d(0, 0, 0) scale(${cloud.scale})`;
        }
      });
    };

    // Continuous requestAnimationFrame loop updating CSS transform based on window.scrollY
    const updateLoop = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;

      if (currentScrollY !== lastScrollY) {
        lastScrollY = currentScrollY;

        cloudRefs.current.forEach((el, index) => {
          if (!el) return;
          const cloud = CLOUDS[index];
          if (!cloud) return;
          const parallaxX = currentScrollY * cloud.speed;
          el.style.transform = `translate3d(${parallaxX.toFixed(2)}px, 0, 0) scale(${cloud.scale})`;
        });
      }

      animId = window.requestAnimationFrame(updateLoop);
    };

    const startOrStopLoop = () => {
      isReduced = motionQuery.matches;
      if (isReduced) {
        if (animId) {
          window.cancelAnimationFrame(animId);
          animId = null;
        }
        applyReducedMotion();
      } else {
        if (!animId) {
          lastScrollY = -1; // force initial update
          animId = window.requestAnimationFrame(updateLoop);
        }
      }
    };

    startOrStopLoop();

    const onMotionChange = () => {
      startOrStopLoop();
    };

    try {
      motionQuery.addEventListener('change', onMotionChange);
    } catch {
      motionQuery.addListener?.(onMotionChange);
    }

    return () => {
      if (animId) {
        window.cancelAnimationFrame(animId);
      }
      try {
        motionQuery.removeEventListener('change', onMotionChange);
      } catch {
        motionQuery.removeListener?.(onMotionChange);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 ${className}`}
      style={{ contain: 'strict' }}
    >
      <svg className="w-0 h-0 absolute pointer-events-none">
        <defs>
          {/* Cloud Gradients for Night / Starlight Palette */}
          <linearGradient id="cloudGradPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="cloudGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="cloudGradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="cloudGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f1c66d" stopOpacity="0.2" />
          </linearGradient>

          {/* Cloud Filter for dreamlike feather edges */}
          <filter id="cloudSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {CLOUDS.map((cloud, index) => {
        const opacity = theme === 'night' ? cloud.opacityNight : cloud.opacityDay;

        return (
          <div
            key={cloud.id}
            ref={(el) => {
              cloudRefs.current[index] = el;
            }}
            className="absolute transition-opacity duration-700 ease-out will-change-transform"
            style={{
              top: cloud.top,
              left: `${cloud.initialX}%`,
              transform: `translate3d(0, 0, 0) scale(${cloud.scale})`,
              opacity,
              filter: cloud.blur > 0 ? `blur(${cloud.blur}px)` : undefined,
              zIndex: cloud.zIndex,
            }}
          >
            <CloudSVG type={cloud.pathType} gradientId={cloud.gradientId} hasStar={cloud.hasStar} />
          </div>
        );
      })}
    </div>
  );
};

interface CloudSVGProps {
  type: 'puffy' | 'wispy' | 'celestial' | 'pillowy';
  gradientId: string;
  hasStar?: boolean;
}

const CloudSVG: React.FC<CloudSVGProps> = ({ type, gradientId, hasStar }) => {
  switch (type) {
    case 'puffy':
      return (
        <svg
          width="260"
          height="140"
          viewBox="0 0 260 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_8px_24px_rgba(56,189,248,0.15)]"
        >
          {/* Main puffy lobes */}
          <path
            d="M 50 110 
               C 30 110, 15 95, 20 75 
               C 22 55, 45 45, 65 52 
               C 75 25, 115 15, 145 32 
               C 165 15, 205 20, 215 48 
               C 235 45, 255 62, 250 85 
               C 252 105, 230 115, 210 112 
               Z"
            fill={`url(#${gradientId})`}
            filter="url(#cloudSoftGlow)"
          />
          {/* Inner highlight rim */}
          <path
            d="M 65 54 C 80 32, 115 25, 142 38 C 160 25, 195 28, 208 50"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          {hasStar && (
            <g transform="translate(145, 30)">
              <circle r="2.5" fill="#fef08a" className="animate-ping opacity-75" />
              <circle r="1.5" fill="#ffffff" />
            </g>
          )}
        </svg>
      );

    case 'wispy':
      return (
        <svg
          width="320"
          height="100"
          viewBox="0 0 320 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_6px_20px_rgba(192,132,252,0.12)]"
        >
          {/* Sleek horizontal drifting cloud streak */}
          <path
            d="M 15 65
               C 50 50, 95 62, 135 52
               C 175 42, 220 35, 260 48
               C 285 55, 310 68, 300 78
               C 280 88, 220 85, 170 82
               C 120 80, 60 85, 25 78
               Z"
            fill={`url(#${gradientId})`}
          />
          <path
            d="M 45 42 C 90 32, 150 38, 205 32 C 240 28, 275 35, 290 44"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      );

    case 'celestial':
      return (
        <svg
          width="280"
          height="130"
          viewBox="0 0 280 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_10px_25px_rgba(244,114,182,0.18)]"
        >
          {/* Multi-tier cluster */}
          <ellipse cx="140" cy="85" rx="100" ry="32" fill={`url(#${gradientId})`} />
          <circle cx="85" cy="72" r="38" fill={`url(#${gradientId})`} />
          <circle cx="140" cy="58" r="46" fill={`url(#${gradientId})`} />
          <circle cx="195" cy="68" r="36" fill={`url(#${gradientId})`} />

          {/* Little stardust twinkle highlight */}
          <circle cx="140" cy="58" r="3" fill="#ffffff" opacity="0.6" />
          <circle cx="140" cy="58" r="6" fill="#fdf2f8" opacity="0.3" className="animate-pulse" />
        </svg>
      );

    case 'pillowy':
    default:
      return (
        <svg
          width="240"
          height="120"
          viewBox="0 0 240 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_8px_20px_rgba(241,198,109,0.14)]"
        >
          <path
            d="M 35 90
               C 18 90, 8 76, 15 60
               C 20 48, 38 42, 52 48
               C 62 28, 92 18, 120 28
               C 138 18, 172 22, 185 42
               C 202 42, 222 55, 218 75
               C 220 90, 202 96, 185 92
               Z"
            fill={`url(#${gradientId})`}
          />
          <path
            d="M 52 48 C 65 30, 92 22, 118 30"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      );
  }
};
