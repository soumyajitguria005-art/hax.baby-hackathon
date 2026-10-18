import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PipCharacterProps } from '../../types/character';
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
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const bounceTimeoutRef = useRef<number | null>(null);

  const config = useMemo(() => PIP_STATE_CONFIGS[state] || PIP_STATE_CONFIGS.idle, [state]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current);
      }
    };
  }, []);

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

  // Handle click / tap on character (bounce animation + soft pop / sound)
  const handleClick = (e?: React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    if (!interactive) return;
    if (e) {
      e.stopPropagation();
    }

    soundEngine.playGentlePop();
    setIsBouncing(true);

    if (bounceTimeoutRef.current) {
      clearTimeout(bounceTimeoutRef.current);
    }
    bounceTimeoutRef.current = window.setTimeout(() => setIsBouncing(false), 600);

    if (onClick) {
      onClick();
    } else if (onStateChange) {
      // Cycle friendly reaction
      if (state === 'idle') onStateChange('happy');
      else if (state === 'happy') onStateChange('curious');
      else if (state === 'curious') onStateChange('excited');
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

  const shouldDisplaySpeech = showSpeechBubble || (isHovered && interactive && state === 'idle');
  const activeSpeech = speechText || (isHovered && state === 'idle' ? '✨ Hello! Ready to dream?' : config.speech);

  const [imageErrorTier, setImageErrorTier] = useState<0 | 1 | 2>(0);
  const expressionAssetPath = `/assets/pip/expressions/${state}.png`;

  // Reset image error tier when state changes to attempt loading the corresponding asset immediately
  useEffect(() => {
    setImageErrorTier(0);
  }, [state]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center justify-center select-none ${sizeClasses} ${className}`}
      style={customStyle}
      role={interactive ? 'button' : role}
      tabIndex={interactive ? 0 : -1}
      onMouseEnter={() => {
        if (interactive) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (interactive) setIsHovered(false);
      }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick(e);
        }
      }}
      aria-label={
        ariaLabel ||
        `Pip the Junior Dream Engineer, current state: ${config.label}.${
          interactive ? ' Press Enter or click to interact.' : ''
        }`
      }
    >
      {/* AMBIENT GLOW BACKDROP */}
      {ambientGlow && (
        <div
          className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-opacity duration-700"
          style={{
            backgroundColor: config.accentColor,
            opacity: theme === 'night' ? (isHovered ? 0.32 : 0.22) : (isHovered ? 0.2 : 0.12),
            transform: isHovered ? 'scale(1.22)' : 'scale(1.15)',
          }}
          aria-hidden="true"
        />
      )}

      {/* SPEECH BUBBLE */}
      {shouldDisplaySpeech && (
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
          {/* Musical Notes when Happy */}
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
          {/* Sleepy zZz - Snug and cozy within Pip's visual avatar area */}
          {(config.hasParticles === 'zzz' || state === 'sleepy' || state === 'sleeping') && (
            <div className="absolute top-1 right-2 pointer-events-none select-none z-10" aria-hidden="true">
              <span className="absolute -top-1 right-3 text-sky-400 text-[10px] font-bold font-mono animate-float-zzz">
                z
              </span>
              <span
                className="absolute -top-3 right-1.5 text-purple-300 text-xs font-bold font-mono animate-float-zzz"
                style={{ animationDelay: '0.9s' }}
              >
                Z
              </span>
              <span
                className="absolute -top-5 right-0 text-pink-300 text-sm font-bold font-mono animate-float-zzz"
                style={{ animationDelay: '1.8s' }}
              >
                Z
              </span>
            </div>
          )}

          {/* Sparkles / Twinkling Stars */}
          {(config.hasParticles === 'stars' || state === 'surprised' || state === 'excited' || isHovered) && (
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
        className={`w-full h-full transition-transform duration-300 ease-out ${animationClass} ${
          interactive ? 'cursor-pointer' : ''
        }`}
        style={{
          transform: `rotate(${tiltAngle}deg) ${isHovered ? 'scale(1.03)' : 'scale(1)'}`,
          transformOrigin: 'bottom center',
        }}
      >
        {imageErrorTier === 0 ? (
          <img
            src={expressionAssetPath}
            alt={`Pip in ${config.label} mood`}
            className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none transition-all duration-300"
            onError={() => setImageErrorTier(1)}
          />
        ) : imageErrorTier === 1 ? (
          <img
            src="/assets/pip-avatar-cloud.png"
            alt={`Pip in ${config.label} mood`}
            className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none transition-all duration-300"
            onError={() => setImageErrorTier(2)}
          />
        ) : (
          <PipArtwork
            posture={posture}
            emotion={emotion}
            theme={theme}
            lanternGlow={state === 'holding-lantern' || state === 'excited'}
          />
        )}
      </div>
    </div>
  );
};
