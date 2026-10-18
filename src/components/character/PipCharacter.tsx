import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PipCharacterProps, PipState } from '../../types/character';
import { PIP_STATE_CONFIGS } from './characterStateMap';
import { PipArtwork } from './PipArtwork';
import { soundEngine } from '../../utils/soundEffects';

export const PipCharacter: React.FC<PipCharacterProps> = ({
  state = 'idle',
  size = 'md',
  enableTilt = true,
  ambientGlow = true,
  theme = 'night',
  showSpeechBubble = false,
  speechText,
  showParticles = true,
  className = '',
  interactive = true,
  onClick,
  onStateChange,
  role = 'img',
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tiltAngle, setTiltAngle] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const config = useMemo(() => PIP_STATE_CONFIGS[state] || PIP_STATE_CONFIGS.idle, [state]);

  // Determine size in pixels or CSS classes
  const sizeClasses = useMemo(() => {
    if (typeof size === 'number') {
      return '';
    }
    switch (size) {
      case 'sm':
        return 'w-24 h-24';
      case 'md':
        return 'w-44 h-44';
      case 'lg':
        return 'w-64 h-64';
      case 'xl':
        return 'w-80 h-80';
      default:
        return 'w-44 h-44';
    }
  }, [size]);

  const customStyle = useMemo(() => {
    if (typeof size === 'number') {
      return { width: `${size}px`, height: `${size}px` };
    }
    return {};
  }, [size]);

  // Check touch devices and reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const touchQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(touchQuery.matches || 'ontouchstart' in window);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    try {
      motionQuery.addEventListener('change', handleMotionChange);
      return () => motionQuery.removeEventListener('change', handleMotionChange);
    } catch {
      // Fallback for older browsers
      motionQuery.addListener(handleMotionChange);
      return () => motionQuery.removeListener(handleMotionChange);
    }
  }, []);

  // Pointer movement listener for subtle head/body tilt (-8deg to +8deg)
  useEffect(() => {
    if (!enableTilt || isTouchDevice || prefersReducedMotion) {
      setTiltAngle(0);
      return;
    }

    let rafId: number | null = null;

    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.hypot(deltaX, deltaY);

        // Only react within comfortable viewport proximity (within 900px)
        if (distance > 900) {
          setTiltAngle(0);
          return;
        }

        // Clamp tilt smoothly between -8 and +8 degrees
        const rawTilt = (deltaX / 400) * 8;
        const clampedTilt = Math.max(-8, Math.min(8, rawTilt));
        setTiltAngle(clampedTilt);
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enableTilt, isTouchDevice, prefersReducedMotion]);

  // Handle click on character (bounce animation + soft pop / sound)
  const handleClick = () => {
    if (!interactive) return;

    soundEngine.playGentlePop();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);

    if (onClick) {
      onClick();
    } else if (onStateChange) {
      // Cycle playful reaction
      if (state === 'idle') onStateChange('excited');
      else if (state === 'excited') onStateChange('happy');
      else if (state === 'happy') onStateChange('curious');
      else onStateChange('idle');
    }
  };

  // Active posture and emotion
  const posture = config.posture;
  const emotion = config.emotion;

  // Animation classes
  const animationClass = useMemo(() => {
    if (prefersReducedMotion) return '';
    if (isBouncing || state === 'excited') return 'animate-pip-bounce';
    if (state === 'sleeping' || state === 'sleepy') return 'animate-pip-breathe';
    if (state === 'flying') return 'animate-pip-float';
    return 'animate-pip-float';
  }, [isBouncing, state, prefersReducedMotion]);

  const activeSpeech = speechText || config.speech;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center justify-center select-none ${sizeClasses} ${className}`}
      style={customStyle}
      role={role}
      aria-label={ariaLabel || `Pip character, current state: ${config.label}`}
    >
      {/* AMBIENT GLOW BACKDROP */}
      {ambientGlow && (
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-opacity duration-700"
          style={{
            backgroundColor: config.accentColor,
            opacity: theme === 'night' ? 0.22 : 0.12,
            transform: 'scale(1.15)',
          }}
          aria-hidden="true"
        />
      )}

      {/* SPEECH BUBBLE */}
      {showSpeechBubble && (
        <div
          className="absolute -top-12 z-20 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-800 bg-white/95 dark:bg-slate-900/95 dark:text-slate-100 shadow-lg border border-pink-200 dark:border-pink-500/30 whitespace-nowrap backdrop-blur-sm pointer-events-none transition-all duration-300 transform -translate-y-1 animate-fade-in"
          role="status"
        >
          {activeSpeech}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white/95 dark:bg-slate-900/95 border-r border-b border-pink-200 dark:border-pink-500/30 transform rotate-45" />
        </div>
      )}

      {/* FLOATING PARTICLES */}
      {showParticles && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {/* Musical Notes when Happy or with Music Box */}
          {(config.hasParticles === 'notes' || state === 'happy') && (
            <>
              <span className="absolute top-2 right-4 text-pink-400 text-lg font-bold animate-float-note">
                ♪
              </span>
              <span
                className="absolute top-8 left-4 text-purple-400 text-sm font-bold animate-float-note"
                style={{ animationDelay: '0.8s' }}
              >
                ♫
              </span>
            </>
          )}

          {/* Sleepy zZz */}
          {(config.hasParticles === 'zzz' || state === 'sleepy' || state === 'sleeping') && (
            <>
              <span className="absolute -top-3 right-8 text-blue-400 text-xs font-bold font-mono animate-float-zzz">
                z
              </span>
              <span
                className="absolute -top-6 right-5 text-indigo-400 text-sm font-bold font-mono animate-float-zzz"
                style={{ animationDelay: '1s' }}
              >
                Z
              </span>
              <span
                className="absolute -top-10 right-2 text-pink-400 text-base font-bold font-mono animate-float-zzz"
                style={{ animationDelay: '2s' }}
              >
                Z
              </span>
            </>
          )}

          {/* Sparkles / Twinkling Stars */}
          {(config.hasParticles === 'stars' || state === 'surprised' || state === 'excited') && (
            <>
              <span className="absolute top-4 left-6 text-yellow-300 text-xs animate-twinkle">
                ✦
              </span>
              <span
                className="absolute top-6 right-6 text-yellow-300 text-xs animate-twinkle"
                style={{ animationDelay: '1.2s' }}
              >
                ✦
              </span>
            </>
          )}
        </div>
      )}

      {/* CHARACTER ARTWORK WRAPPER WITH GENTLE TILT & BOUNCE */}
      <div
        onClick={handleClick}
        className={`w-full h-full cursor-pointer transition-transform duration-300 ease-out ${animationClass}`}
        style={{
          transform: `rotate(${tiltAngle}deg)`,
          transformOrigin: 'bottom center',
        }}
        tabIndex={interactive ? 0 : -1}
        onKeyDown={(e) => {
          if (interactive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`${config.label} - Click to interact`}
      >
        <PipArtwork
          posture={posture}
          emotion={emotion}
          theme={theme}
          lanternGlow={state === 'holding-lantern' || state === 'excited'}
        />
      </div>
    </div>
  );
};
