"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Note: SplitText is a GSAP premium plugin
// For production, either use GSAP Club membership or implement custom text split
// This is a fallback that splits by line using CSS

gsap.registerPlugin(ScrollTrigger);

interface LineRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Line-by-line text reveal animation
 * 
 * Reveals text line by line on scroll
 * Premium effect for problem statements and long-form content
 */
export default function LineReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.08,
}: LineRevealProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = textRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // No animation for reduced motion preference
      gsap.set(container, { opacity: 1 });
      return;
    }

    // Split text into lines manually (simple approach)
    const lines = container.querySelectorAll(".line-reveal-item");

    if (lines.length === 0) {
      // Fallback: animate entire block
      gsap.set(container, { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: "power3.out",
          });
        },
      });
      return;
    }

    // Initial state
    gsap.set(lines, { opacity: 0, y: 20 });

    // Scroll-triggered line-by-line reveal
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(lines, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay,
          stagger,
          ease: "power2.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [delay, stagger]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
