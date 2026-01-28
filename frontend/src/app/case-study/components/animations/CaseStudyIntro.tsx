"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CaseStudyIntroProps {
  projectName: string;
  onComplete: () => void;
}

/**
 * Premium Case Study Intro Animation
 * 
 * Creates an Awwwards-level intro sequence:
 * 1. Project title centered on screen
 * 2. Letters animate in one-by-one (upward motion + opacity)
 * 3. Brief pause to let the name breathe
 * 4. Title moves up and fades out
 * 5. Triggers onComplete to reveal main content
 */
export default function CaseStudyIntro({ projectName, onComplete }: CaseStudyIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [letters, setLetters] = useState<string[]>([]);

  useEffect(() => {
    // Split project name into individual characters (preserve spaces)
    const chars = projectName.split("");
    setLetters(chars);
  }, [projectName]);

  useEffect(() => {
    if (letters.length === 0) return;

    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Skip animation for reduced motion preference
      onComplete();
      return;
    }

    // Get all letter spans
    const letterSpans = title.querySelectorAll(".letter");
    
    // Initial state - hide all letters
    gsap.set(letterSpans, { 
      opacity: 0, 
      y: 40,
      rotateX: -90,
    });
    gsap.set(container, { opacity: 1 });

    // Create master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Phase 1: Animate letters in one-by-one
    tl.to(letterSpans, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.5,
      stagger: 0.04,
      ease: "power3.out",
    });

    // Phase 2: Brief pause to let the name breathe
    tl.to({}, { duration: 0.6 });

    // Phase 3: Move title up and fade out
    tl.to(title, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.inOut",
    });

    // Phase 4: Fade out the container
    tl.to(container, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, [letters, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-950"
      style={{ opacity: 0 }}
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-neutral-900/50 via-neutral-950 to-neutral-900/50" />
      
      {/* Animated title */}
      <h1
        ref={titleRef}
        className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-center px-6 max-w-[90vw]"
        style={{ perspective: "1000px" }}
      >
        {letters.map((char, index) => (
          <span
            key={index}
            className="letter inline-block"
            style={{
              // Preserve spaces
              whiteSpace: char === " " ? "pre" : "normal",
              transformStyle: "preserve-3d",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-8 h-px bg-neutral-700" />
        <div className="w-2 h-2 rounded-full bg-neutral-600 animate-pulse" />
        <div className="w-8 h-px bg-neutral-700" />
      </div>
    </div>
  );
}
