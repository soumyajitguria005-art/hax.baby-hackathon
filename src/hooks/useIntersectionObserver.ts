import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export interface UseIntersectionObserverReturn<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T | null>;
  isRevealed: boolean;
  isIntersecting: boolean;
  isVisible: boolean;
  hasIntersected: boolean;
  revealClass: string;
  prefersReducedMotion: boolean;
}

/**
 * Reusable Intersection Observer hook.
 * Monitors when an element enters the viewport and triggers visibility state
 * with optional delay and automatic `prefers-reduced-motion` compliance.
 *
 * Provides `isRevealed` boolean state and `revealClass`: "reveal-fade-up" -> "reveal-fade-up is-revealed".
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Accessibility: Honor user's prefers-reduced-motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      const reduce = motionQuery.matches;
      setPrefersReducedMotion(reduce);
      if (reduce) {
        setIsIntersecting(true);
        setIsRevealed(true);
        setHasIntersected(true);
      }
    };

    updateMotion();

    try {
      motionQuery.addEventListener('change', updateMotion);
    } catch {
      motionQuery.addListener?.(updateMotion);
    }

    if (motionQuery.matches) {
      return () => {
        try {
          motionQuery.removeEventListener('change', updateMotion);
        } catch {
          motionQuery.removeListener?.(updateMotion);
        }
      };
    }

    const node = ref.current;
    if (!node) return;

    // Graceful fallback for non-supporting environments
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      setIsRevealed(true);
      setHasIntersected(true);
      return;
    }

    let timeoutId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);

        if (intersecting) {
          setHasIntersected(true);

          if (delay > 0) {
            timeoutId = window.setTimeout(() => {
              setIsRevealed(true);
            }, delay);
          } else {
            setIsRevealed(true);
          }

          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      observer.disconnect();
      try {
        motionQuery.removeEventListener('change', updateMotion);
      } catch {
        motionQuery.removeListener?.(updateMotion);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  const revealClass = `reveal-fade-up ${isRevealed ? 'is-revealed' : ''}`.trim();

  return {
    ref,
    isRevealed,
    isVisible: isRevealed,
    isIntersecting,
    hasIntersected,
    revealClass,
    prefersReducedMotion,
  };
}
