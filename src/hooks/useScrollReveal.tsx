'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal - Intersection Observer hook for GPU-accelerated scroll entrance animations.
 * Elements are animated in only once when they enter the viewport.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * RevealSection - Wrapper component that applies scroll reveal animation.
 */
export function RevealSection({
  children,
  className = 'reveal',
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, isVisible } = useScrollReveal();
  const delayClass = delay ? `delay-${delay}` : '';

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'visible' : ''} ${delayClass}`}
      style={style}
    >
      {children}
    </div>
  );
}
