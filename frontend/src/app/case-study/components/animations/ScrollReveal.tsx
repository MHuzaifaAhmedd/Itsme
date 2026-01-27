"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  once?: boolean;
  className?: string;
}

/**
 * Reusable scroll-reveal animation component
 * 
 * Reveals content with smooth fade + translate on scroll
 * Respects prefers-reduced-motion
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 40,
  stagger = 0,
  once = true,
  className = "",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // No animation for reduced motion preference
      gsap.set(container.children, { opacity: 1, y: 0 });
      return;
    }

    // Initial state
    gsap.set(container.children, { opacity: 0, y });

    // Scroll-triggered animation
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once,
      onEnter: () => {
        gsap.to(container.children, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [delay, duration, y, stagger, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
