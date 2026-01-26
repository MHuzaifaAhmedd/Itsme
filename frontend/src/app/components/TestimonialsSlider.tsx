"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

gsap.config({ nullTargetWarn: false });

const TESTIMONIALS = [
  {
    quote:
      "Exceptional attention to detail and a deep understanding of user experience. The final product exceeded all expectations.",
    author: "Sarah Chen",
    role: "Product Lead, TechCorp",
  },
  {
    quote:
      "Working together was seamless. The design process was collaborative, and the results speak for themselves.",
    author: "Michael Rodriguez",
    role: "Founder, StartupXYZ",
  },
  {
    quote:
      "A rare combination of aesthetic sensibility and technical rigor. Delivered on time and above expectations.",
    author: "Elena Vassiliev",
    role: "CDO, Atelier Studio",
  },
  {
    quote:
      "From concept to launch, every step felt intentional. The team still references our project as a benchmark.",
    author: "James Okonkwo",
    role: "Head of Product, FinFlow",
  },
];

const CARD_WIDTH = 400;
const BASE_DURATION = 45;
const SCROLL_SPEED_MULTIPLIER = 1.35;

export default function TestimonialsSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollAccumRef = useRef(0);
  const timeScaleTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const setTimeScale = useCallback(
    (value: number) => {
      const tl = timelineRef.current;
      if (!tl) return;
      timeScaleTweenRef.current?.kill();
      timeScaleTweenRef.current = gsap.to(tl, {
        timeScale: value,
        duration: 0.4,
        ease: "power2.inOut",
      });
    },
    [],
  );

  useEffect(() => {
    const track = trackRef.current;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!track || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(track, { force3D: true, willChange: "transform" });

      const tl = gsap.timeline({
        repeat: -1,
        ease: "none",
      });

      tl.to(track, {
        xPercent: -50,
        duration: BASE_DURATION,
        ease: "none",
        overwrite: true,
      });

      timelineRef.current = tl;
    }, track);

    return () => {
      ctx.revert();
      timelineRef.current = null;
      timeScaleTweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onTick = () => {
      const tl = timelineRef.current;
      if (!tl) return;

      if (isHovered) {
        setTimeScale(0);
        return;
      }

      const y = typeof window !== "undefined" ? window.scrollY ?? document.documentElement.scrollTop : 0;
      const delta = Math.abs(y - lastScrollYRef.current);
      lastScrollYRef.current = y;

      if (delta > 0.5) {
        scrollAccumRef.current = 8;
      } else if (scrollAccumRef.current > 0) {
        scrollAccumRef.current -= 1;
      }

      const targetScale = scrollAccumRef.current > 0 ? SCROLL_SPEED_MULTIPLIER : 1;
      if (Math.abs(tl.timeScale() - targetScale) > 0.01) {
        setTimeScale(targetScale);
      }
    };

    gsap.ticker.add(onTick);
    return () => {
      gsap.ticker.remove(onTick);
    };
  }, [isHovered, setTimeScale]);

  useEffect(() => {
    if (!isHovered) return;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    setTimeScale(0);
  }, [isHovered, setTimeScale]);

  const handleCardEnter = useCallback(
    (el: HTMLDivElement) => {
      setIsHovered(true);
      gsap.set(el, { transformOrigin: "center center" });
      gsap.to(el, {
        scale: 1.03,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    },
    [],
  );

  const handleCardLeave = useCallback(
    (el: HTMLDivElement) => {
      setIsHovered(false);
      gsap.to(el, {
        scale: 1,
        boxShadow: "none",
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    },
    [],
  );

  const duplicated = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
      <div
        ref={trackRef}
        className="flex flex-nowrap items-stretch gap-6 py-2"
        style={{
          width: "max-content",
          willChange: "transform",
        }}
      >
        {duplicated.map((t, i) => (
          <div
            key={i}
            className="shrink-0 rounded-3xl border border-neutral-900 bg-neutral-900/40 p-8 text-neutral-300 backdrop-blur-sm transition-shadow"
            style={{
              minWidth: CARD_WIDTH,
              width: CARD_WIDTH,
            }}
            onMouseEnter={(e) => handleCardEnter(e.currentTarget)}
            onMouseLeave={(e) => handleCardLeave(e.currentTarget)}
          >
            <p className="mb-6 text-lg leading-relaxed text-neutral-200">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex flex-col">
              <span className="font-medium text-neutral-100">{t.author}</span>
              <span className="text-sm text-neutral-500">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
