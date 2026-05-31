'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Shared easing presets
export const ease = {
  smooth: 'power2.out',
  snappy: 'power3.out',
  elastic: 'back.out(1.4)',
  expo: 'expo.out',
} as const;

// Reveal a container's direct children with a staggered fade-up
export function useStaggerReveal<T extends HTMLElement>(
  options: {
    childSelector?: string;
    y?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      childSelector = ':scope > *',
      y = 32,
      duration = 0.7,
      stagger = 0.1,
      delay = 0,
      start = 'top 88%',
    } = options;

    const targets = el.querySelectorAll(childSelector);
    if (!targets.length) return;

    gsap.set(targets, { opacity: 0, y });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: ease.smooth,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === el)
        .forEach((st) => st.kill());
    };
  }, []);

  return ref;
}

// Fade + translate a single element into view
export function useFadeReveal<T extends HTMLElement>(
  options: {
    y?: number;
    x?: number;
    duration?: number;
    delay?: number;
    start?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { y = 40, x = 0, duration = 0.85, delay = 0, start = 'top 88%' } = options;

    gsap.set(el, { opacity: 0, y, x });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: ease.smooth,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === el)
        .forEach((st) => st.kill());
    };
  }, []);

  return ref;
}

// Horizontal reveal (slide in from left or right)
export function useSlideReveal<T extends HTMLElement>(
  direction: 'left' | 'right' = 'left',
  options: { duration?: number; delay?: number; start?: string } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 0.9, delay = 0, start = 'top 85%' } = options;
    const x = direction === 'left' ? -60 : 60;

    gsap.set(el, { opacity: 0, x });

    const tween = gsap.to(el, {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: ease.smooth,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === el)
        .forEach((st) => st.kill());
    };
  }, []);

  return ref;
}

// Scale-up reveal for image / media containers
export function useScaleReveal<T extends HTMLElement>(
  options: { duration?: number; delay?: number; start?: string; from?: number } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { duration = 1.0, delay = 0, start = 'top 88%', from = 0.92 } = options;

    gsap.set(el, { opacity: 0, scale: from });

    const tween = gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: ease.smooth,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === el)
        .forEach((st) => st.kill());
    };
  }, []);

  return ref;
}
