import { useEffect, useRef, useState } from 'react';

export interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      const reduce = motionQuery.matches;
      setPrefersReducedMotion(reduce);
      if (reduce) {
        setIsVisible(true);
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

    // Fallback if IntersectionObserver is unsupported in environment
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    let timeoutId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = window.setTimeout(() => {
              setIsVisible(true);
            }, delay);
          } else {
            setIsVisible(true);
          }

          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else if (!triggerOnce) {
          if (timeoutId) clearTimeout(timeoutId);
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      try {
        motionQuery.removeEventListener('change', updateMotion);
      } catch {
        motionQuery.removeListener?.(updateMotion);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isVisible, prefersReducedMotion };
}
