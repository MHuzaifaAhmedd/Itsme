"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lineInnerRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseWheelRef = useRef<HTMLDivElement>(null);
  const wheelTopRef = useRef<HTMLDivElement>(null);
  const wheelMiddleRef = useRef<HTMLDivElement>(null);
  const wheelBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(containerRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });
      gsap.set(lineInnerRef.current, { scaleY: 0, transformOrigin: "top" });
      gsap.set(textRef.current, { autoAlpha: 0, y: 10 });
      gsap.set(glowRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(mouseWheelRef.current, { scale: 0, rotation: -180, autoAlpha: 0 });

      // Create dots for animation
      const dots = Array.from({ length: 3 }, () => {
        const dot = document.createElement("div");
        dot.className = "absolute w-1 h-1 rounded-full bg-neutral-400";
        dotsContainerRef.current?.appendChild(dot);
        gsap.set(dot, { y: -20, opacity: 0 });
        return dot;
      });

      // Initial entrance timeline (only once)
      const entranceTl = gsap.timeline();

      entranceTl
        .to(containerRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .to(
          lineRef.current,
          {
            scaleY: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          lineInnerRef.current,
          {
            scaleY: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          mouseWheelRef.current,
          {
            scale: 1,
            rotation: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.4"
        )
        .to(
          textRef.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          glowRef.current,
          {
            scale: 1,
            opacity: 0.3,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6"
        );

      // Continuous animation loop
      const loopTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

      // Pulsing line animation (breathing effect)
      loopTl
        .to(
          lineInnerRef.current,
          {
            scaleY: 0.4,
            duration: 1.4,
            ease: "power1.inOut",
          },
          0
        )
        .to(
          lineInnerRef.current,
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power1.inOut",
          },
          1.4
        );

      // Glow pulse synchronized with line
      loopTl.to(
        glowRef.current,
        {
          scale: 1.3,
          opacity: 0.6,
          duration: 1.4,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        },
        0
      );

      // Mouse wheel scroll animation
      const wheelAnimation = () => {
        const wheelTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
        
        wheelTl
          .to(wheelTopRef.current, {
            y: 4,
            opacity: 0.3,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(wheelMiddleRef.current, {
            y: 4,
            opacity: 0.5,
            duration: 0.3,
            ease: "power2.out",
          }, "-=0.2")
          .to(wheelBottomRef.current, {
            y: 4,
            opacity: 0.8,
            duration: 0.3,
            ease: "power2.out",
          }, "-=0.2")
          .to([wheelTopRef.current, wheelMiddleRef.current, wheelBottomRef.current], {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.in",
          }, "-=0.1");
      };

      wheelAnimation();

      // Cascading dots animation (particles flowing down)
      dots.forEach((dot, i) => {
        const delay = i * 0.25;
        loopTl.to(
          dot,
          {
            y: 48,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          delay
        )
        .to(
          dot,
          {
            opacity: 0.8,
            duration: 0.3,
            ease: "power2.out",
          },
          delay + 0.3
        )
        .to(
          dot,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            ease: "power2.out",
          },
          delay + 0.6
        );
        loopTl.set(
          dot,
          {
            y: -20,
            opacity: 0,
            scale: 0.5,
          },
          delay + 1.2
        );
      });

      // Text breathing effect (subtle pulse)
      loopTl.to(
        textRef.current,
        {
          opacity: 0.5,
          duration: 1.8,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        },
        0
      );

      // Subtle container float
      loopTl.to(
        containerRef.current,
        {
          y: -4,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: 1,
        },
        0
      );

      return () => {
        dots.forEach((dot) => dot.remove());
      };
    }, containerRef.current);

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-5 text-center"
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute h-16 w-px bg-gradient-to-b from-neutral-400 via-neutral-500 to-transparent"
        style={{ filter: "blur(4px)" }}
        aria-hidden="true"
      />

      {/* Mouse wheel visual */}
      <div
        ref={mouseWheelRef}
        className="relative flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        <div className="h-6 w-4 rounded border border-neutral-600 bg-neutral-900/50 backdrop-blur-sm">
          <div
            ref={wheelTopRef}
            className="absolute left-1/2 top-1 h-0.5 w-1 -translate-x-1/2 rounded-full bg-neutral-400"
          />
          <div
            ref={wheelMiddleRef}
            className="absolute left-1/2 top-1/2 h-0.5 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-300"
          />
          <div
            ref={wheelBottomRef}
            className="absolute bottom-1 left-1/2 h-0.5 w-1 -translate-x-1/2 rounded-full bg-neutral-400"
          />
        </div>
      </div>

      {/* Main line container */}
      <div className="relative flex flex-col items-center">
        {/* Outer line */}
        <div
          ref={lineRef}
          className="h-12 w-px bg-neutral-800"
          style={{ transform: "scaleY(0)" }}
        />

        {/* Inner animated line */}
        <div
          ref={lineInnerRef}
          className="absolute top-0 h-12 w-px bg-gradient-to-b from-neutral-400 via-neutral-300 to-transparent"
          style={{ transform: "scaleY(0)" }}
        />

        {/* Dots container for particles */}
        <div
          ref={dotsContainerRef}
          className="absolute top-0 h-12 w-px overflow-hidden"
        />
      </div>

      {/* Text */}
      <p
        ref={textRef}
        className="text-xs uppercase tracking-[0.3em] text-neutral-500"
      >
        Scroll to explore
      </p>
    </div>
  );
}
