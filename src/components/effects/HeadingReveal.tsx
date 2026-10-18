import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export interface HeadingRevealProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

/**
 * Reusable Heading component that wraps h1, h2, or h3 tags and applies
 * the 'reveal-fade-up' scroll-triggered entrance effect via useIntersectionObserver.
 */
export const HeadingReveal: React.FC<HeadingRevealProps> = ({
  as: Component = 'h2',
  children,
  delay = 0,
  distance = 28,
  duration = 700,
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  className = '',
  style,
  ...rest
}) => {
  const { ref, isVisible, revealClass, prefersReducedMotion } = useIntersectionObserver<HTMLHeadingElement>({
    threshold,
    rootMargin,
    triggerOnce: true,
    delay,
  });

  const animatedStyle: React.CSSProperties = prefersReducedMotion
    ? {
        opacity: 1,
        transform: 'none',
        transition: 'none',
        ...style,
      }
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${distance}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: delay ? `${delay}ms` : undefined,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...style,
      };

  return (
    <Component
      ref={ref}
      style={animatedStyle}
      className={`${revealClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default HeadingReveal;
