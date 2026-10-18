import { useState, useRef, useEffect, useCallback } from 'react';

interface CardTiltResult {
  ref: React.RefObject<HTMLDivElement | null>;
  tiltStyle: React.CSSProperties;
  glareStyle: React.CSSProperties;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: () => void;
  isHovered: boolean;
}

export function use3DCardTilt(maxTilt: number = 10): CardTiltResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchOrReduced(touch || motion);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isTouchOrReduced || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
    setIsHovered(true);
  }, [isTouchOrReduced, maxTilt]);

  const onPointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setIsHovered(false);
  }, []);

  const tiltStyle: React.CSSProperties = isTouchOrReduced
    ? {}
    : {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform',
      };

  const glareStyle: React.CSSProperties = isTouchOrReduced
    ? { display: 'none' }
    : {
        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)`,
        opacity: glare.opacity > 0 ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
        pointerEvents: 'none',
      };

  return {
    ref,
    tiltStyle,
    glareStyle,
    onPointerMove,
    onPointerLeave,
    isHovered,
  };
}
