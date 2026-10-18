import React, { useEffect, useState, useRef } from 'react';
import { GhostArtwork, GhostExpression } from './GhostArtwork';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

interface GhostCursorProps {
  theme?: 'day' | 'night';
  chaosMode?: boolean;
}

const SPARKLE_PALETTE = ['#F1C66D', '#F472B6', '#FDE047', '#FFF8F1'];
const CHAOS_PALETTE = ['#F1C66D', '#F472B6', '#38BDF8', '#C084FC', '#FFF8F1'];

export const GhostCursor: React.FC<GhostCursorProps> = ({ theme = 'night', chaosMode = false }) => {
  const [expression, setExpression] = useState<GhostExpression>('default');
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [starGlow, setStarGlow] = useState(false);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  // DOM Refs for 60fps direct transforms (zero React re-render overhead)
  const ghostElementRef = useRef<HTMLDivElement>(null);
  const pointerDotRef = useRef<HTMLDivElement>(null);

  const ghostPos = useRef({ x: -200, y: -200 });
  const targetPos = useRef({ x: -200, y: -200 });
  const tiltRef = useRef(0);
  const isMoving = useRef(false);
  const isHoveringLink = useRef(false);
  const isClickSquash = useRef(false);
  const isInteractingSpecial = useRef<'card' | 'theme' | null>(null);

  const moveTimeoutRef = useRef<number | null>(null);
  const blinkTimeoutRef = useRef<number | null>(null);
  const nextSparkleId = useRef(0);
  const lastSparklePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Accessibility & Touch Device Detection
    const touchMedia = window.matchMedia('(pointer: coarse)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchMedia.matches || motionMedia.matches || 'ontouchstart' in window) {
      setIsTouchOrReduced(true);
      return;
    }

    // Add custom cursor class to document element and body
    document.documentElement.classList.add('has-custom-cursor');
    document.body.classList.add('has-custom-cursor');

    // 2. Mouse Movement & Element Detection Listener
    const handlePointerMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };

      // Initialize ghost on first move if offscreen
      if (ghostPos.current.x < 0) {
        ghostPos.current = { x: e.clientX, y: e.clientY };
      }

      isMoving.current = true;

      // Update pointer dot directly
      if (pointerDotRef.current) {
        pointerDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        pointerDotRef.current.style.opacity = '1';
      }

      // Detect hovered interactive elements
      const target = e.target as HTMLElement | null;
      const isExcludedArea = Boolean(
        target?.closest('header, nav, [data-cursor-exclude]')
      );

      // Hide custom cursor over excluded areas (navbar, character state buttons, developer bar)
      if (isExcludedArea) {
        if (ghostElementRef.current) ghostElementRef.current.style.opacity = '0';
        if (pointerDotRef.current) pointerDotRef.current.style.opacity = '0';
      } else {
        if (ghostElementRef.current) ghostElementRef.current.style.opacity = '1';
        if (pointerDotRef.current) pointerDotRef.current.style.opacity = '1';
      }

      const isProjectCard = Boolean(target?.closest('.perspective-1000, #projects [role="button"]'));
      const isThemeToggle = Boolean(target?.closest('button[aria-label*="Mode"], [title*="Mode"]'));
      const isClickable = Boolean(
        target?.closest('a, button, input, textarea, select, [role="button"], [tabindex="0"], .cursor-pointer')
      );

      isHoveringLink.current = isClickable && !isExcludedArea;

      if (isThemeToggle) {
        isInteractingSpecial.current = 'theme';
        setStarGlow(true);
        if (!isClickSquash.current) setExpression('hover');
      } else {
        setStarGlow(false);
        if (isProjectCard) {
          isInteractingSpecial.current = 'card';
          if (!isClickSquash.current) setExpression('curious');
        } else {
          isInteractingSpecial.current = null;
          if (!isClickSquash.current) {
            setExpression(isClickable && !isExcludedArea ? 'hover' : 'following');
          }
        }
      }

      // Sparkle emission during movement (throttled every ~30px, disabled in excluded areas)
      const dist = Math.hypot(
        e.clientX - lastSparklePos.current.x,
        e.clientY - lastSparklePos.current.y
      );

      if (dist > 30 && !isExcludedArea) {
        lastSparklePos.current = { x: e.clientX, y: e.clientY };
        const palette = chaosMode ? CHAOS_PALETTE : SPARKLE_PALETTE;
        const newSparkle: SparkleParticle = {
          id: nextSparkleId.current++,
          x: e.clientX + 6 + (Math.random() - 0.5) * 16,
          y: e.clientY + 20 + (Math.random() - 0.5) * 14,
          size: Math.random() * 6 + 4,
          opacity: 0.85,
          color: palette[Math.floor(Math.random() * palette.length)],
        };
        setSparkles((prev) => [...prev.slice(-12), newSparkle]);
      }

      // Transition back to idle when stopped
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = window.setTimeout(() => {
        isMoving.current = false;
        if (!isClickSquash.current) {
          if (isInteractingSpecial.current === 'card') {
            setExpression('curious');
          } else if (isInteractingSpecial.current === 'theme') {
            setExpression('hover');
          } else {
            setExpression(isClickable ? 'hover' : 'default');
          }
        }
      }, 140);
    };

    // 3. Click Interaction (Quick Squash & Heart/Sparkle Burst)
    const handlePointerDown = (e: MouseEvent) => {
      isClickSquash.current = true;
      setExpression('click');

      const burst: SparkleParticle[] = Array.from({ length: 3 }).map((_, i) => ({
        id: nextSparkleId.current++,
        x: e.clientX + 8 + Math.cos((i * Math.PI * 2) / 3) * 20,
        y: e.clientY + 8 + Math.sin((i * Math.PI * 2) / 3) * 20,
        size: 8,
        opacity: 0.95,
        color: SPARKLE_PALETTE[i % SPARKLE_PALETTE.length],
      }));
      setSparkles((prev) => [...prev.slice(-8), ...burst]);

      setTimeout(() => {
        isClickSquash.current = false;
        if (isInteractingSpecial.current === 'card') {
          setExpression('curious');
        } else {
          setExpression(isHoveringLink.current ? 'hover' : 'default');
        }
      }, 200);
    };

    // 4. Mouse Window Boundary Handling
    const handleMouseLeave = () => {
      if (ghostElementRef.current) ghostElementRef.current.style.opacity = '0';
      if (pointerDotRef.current) pointerDotRef.current.style.opacity = '0';
      document.documentElement.classList.remove('has-custom-cursor');
      document.body.classList.remove('has-custom-cursor');
    };

    const handleMouseEnter = () => {
      if (ghostElementRef.current) ghostElementRef.current.style.opacity = '1';
      if (pointerDotRef.current) pointerDotRef.current.style.opacity = '1';
      document.documentElement.classList.add('has-custom-cursor');
      document.body.classList.add('has-custom-cursor');
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // 5. Idle Blinking Timer
    const scheduleBlink = () => {
      const delay = Math.random() * 3500 + 3500;
      blinkTimeoutRef.current = window.setTimeout(() => {
        if (!isMoving.current && !isHoveringLink.current && !isClickSquash.current && !isInteractingSpecial.current) {
          setExpression('blink');
          setTimeout(() => {
            setExpression('default');
            scheduleBlink();
          }, 180);
        } else {
          scheduleBlink();
        }
      }, delay);
    };

    scheduleBlink();

    // 6. High-Performance 60fps RequestAnimationFrame Loop
    let animId: number;

    const animateLoop = () => {
      animId = requestAnimationFrame(animateLoop);

      // Spring lerp toward pointer position
      const dx = targetPos.current.x - ghostPos.current.x;
      const dy = targetPos.current.y - ghostPos.current.y;

      ghostPos.current.x += dx * 0.24;
      ghostPos.current.y += dy * 0.24;

      // Dynamic tilt (-15deg to +15deg) based on horizontal movement
      const targetTilt = Math.max(-15, Math.min(15, dx * 0.42));
      tiltRef.current += (targetTilt - tiltRef.current) * 0.2;

      // Calculate scale: 72px base, expands to ~85px on hover, squashes on click
      const scaleX = isClickSquash.current ? 1.25 : isHoveringLink.current ? 1.18 : 1.0;
      const scaleY = isClickSquash.current ? 0.78 : isHoveringLink.current ? 1.18 : 1.0;

      // Apply transform directly to ghost element at 60fps
      if (ghostElementRef.current) {
        ghostElementRef.current.style.transform = `translate3d(${ghostPos.current.x - 14}px, ${ghostPos.current.y - 14}px, 0) scale(${scaleX}, ${scaleY})`;
      }

      // Decay sparkles smoothly only when sparkles exist (avoids re-rendering idle react state)
      setSparkles((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((s) => ({ ...s, opacity: s.opacity - 0.05, size: Math.max(0, s.size - 0.25) }))
          .filter((s) => s.opacity > 0);
      });
    };

    animId = requestAnimationFrame(animateLoop);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      document.body.classList.remove('has-custom-cursor');
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current);
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  if (isTouchOrReduced) {
    return null;
  }

  return (
    <>
      {/* 1. PRECISE GOLDEN STARDUST POINTER TIP AT EXACT MOUSE COORDINATES */}
      <div
        ref={pointerDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] select-none opacity-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="relative -top-1 -left-1 w-2.5 h-2.5 flex items-center justify-center">
          <span
            className={`w-2 h-2 rounded-full transition-transform ${
              starGlow ? 'bg-amber-300 shadow-[0_0_10px_#f59e0b] scale-150' : 'bg-pink-400 shadow-[0_0_6px_#f472b6]'
            }`}
          />
        </div>
      </div>

      {/* 2. GENTLE SPARKLE TRAIL PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-[99998] overflow-hidden" aria-hidden="true">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 select-none"
            style={{
              left: `${s.x}px`,
              top: `${s.y}px`,
              opacity: s.opacity,
              fontSize: `${s.size}px`,
              color: s.color,
              textShadow: `0 0 8px ${s.color}`,
              transition: 'opacity 0.08s linear',
            }}
          >
            {['✦', '✧', '★'][s.id % 3]}
          </span>
        ))}
      </div>

      {/* 3. 72PX EXPRESSIVE GHOST CURSOR COMPANION (EXPANDS TO 85PX ON HOVER) */}
      <div
        ref={ghostElementRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] select-none opacity-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="w-[72px] h-[72px] animate-pip-float">
          <GhostArtwork
            expression={expression}
            theme={theme}
            tilt={tiltRef.current}
            starGlow={starGlow}
          />
        </div>
      </div>
    </>
  );
};
