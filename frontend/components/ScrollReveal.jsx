'use client';

import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, className = '', threshold = 0.15, delay = 0 }) {
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (domRef.current) {
                domRef.current.classList.add('active');
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    const currentTarget = domRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, delay]);

  return (
    <div ref={domRef} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
