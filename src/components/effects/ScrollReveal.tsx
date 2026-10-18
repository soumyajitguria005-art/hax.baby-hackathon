import React from 'react';
import { useScrollReveal, ScrollRevealOptions } from '../../hooks/useScrollReveal';

export interface ScrollRevealProps extends ScrollRevealOptions {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  triggerOnce = true,
  delay = 0,
  distance = 32,
  duration = 700,
  as: Component = 'div',
  ...rest
}) => {
  const { ref, isVisible, prefersReducedMotion } = useScrollReveal<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce,
    delay,
  });

  const animatedStyle: React.CSSProperties = prefersReducedMotion
    ? {
        opacity: 1,
        transform: 'none',
        transition: 'none',
      }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: delay ? `${delay}ms` : undefined,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      };

  return (
    <Component
      ref={ref}
      style={animatedStyle}
      className={`reveal-fade-up ${isVisible ? 'is-revealed' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};
