"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    name: "Luxury wellness platform",
    image: "/images/project1.jpg",
    line: "Strategy, brand systems, and immersive UI that lifts conversion.",
  },
  {
    name: "Fintech onboarding redesign",
    image: "/images/proejct2.jpg",
    line: "Streamlined flows and trust-driven design for higher completion.",
  },
  {
    name: "Architectural studio identity",
    image: "/images/project3.jpg",
    line: "Quietly iconic digital presence that reflects craft and scale.",
  },
  {
    name: "SaaS dashboard & analytics",
    image: "/images/project4.jpg",
    line: "Data clarity and actionable insights through elegant interfaces.",
  },
];

const STACK_OFFSET_REM = 3;

export default function ProjectCardsLeft({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stack = stackRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!section || !stack || cards.length === 0) return;

    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const reduced = prefersReducedMotionRef.current;

    gsap.set(cards, {
      y: "100%",
      opacity: 0,
    });

    const ctx = gsap.context(() => {
      if (reduced) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
        cards.forEach((card, i) => {
          tl.to(
            card,
            { y: "0%", opacity: 1, duration: 0.35, ease: "power2.out" },
            i * 0.08
          );
        });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 15%",
            scrub: 1.2,
          },
        });
        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              y: "0%",
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
            },
            i * 0.22
          );
        });
      }
    }, stack);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-end w-full h-[45vh] md:h-[58vh] md:flex-[0.52] lg:flex-[0.55] md:mr-12 lg:mr-24 md:w-auto md:max-w-[50%]"
    >
      <div
        ref={stackRef}
        className="relative w-full h-full max-h-[45vh] md:max-h-[58vh] flex justify-end overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute right-0 bottom-0 w-full max-w-[90%] md:max-w-[85%] h-[34vh] md:h-[42vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl"
            style={{
              bottom: `${i * STACK_OFFSET_REM}rem`,
              zIndex: i,
            }}
          >
            <Image
              src={p.image}
              alt={p.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 45vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-sm">
                {p.name}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-300 max-w-[85%]">
                {p.line}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
