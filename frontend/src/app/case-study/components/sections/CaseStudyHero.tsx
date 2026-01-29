"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { CaseStudyHeroData } from "../../types";

interface CaseStudyHeroProps {
  data: CaseStudyHeroData;
}

/**
 * Section 1: Hero Section
 * 
 * - Project name
 * - One-line impact-driven description
 * - Role, tech stack, year
 * - CTA buttons (Live / Demo / GitHub)
 * - Subtle parallax + staggered entrance animations
 */
export default function CaseStudyHero({ data }: CaseStudyHeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    const content = contentRef.current;
    if (!image || !content) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set([content.children, image], { opacity: 1, y: 0 });
      return;
    }

    // Initial state
    gsap.set(content.children, { opacity: 0, y: 30 });
    gsap.set(image, { opacity: 0, scale: 1.05 });

    // Staggered entrance
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.to(image, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
    })
    .to(
      content.children,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.8"
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16 py-20 overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0"
      >
        <Image
          src={data.heroImage}
          alt={data.projectName}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-5xl"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        {/* Project Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-5">
          {data.projectName}
        </h1>

        {/* Impact Line */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-neutral-300 mb-8 max-w-2xl">
          {data.impactLine}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 mb-10 text-sm md:text-base text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Role:</span>
            <span className="text-neutral-200">{data.role}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-neutral-600" />
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Year:</span>
            <span className="text-neutral-200">{data.year}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-12">
          {data.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-lg text-xs md:text-sm text-neutral-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
          {data.ctas.live && (
            <a
              href={data.ctas.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-600 bg-neutral-50 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-white hover:scale-105 active:scale-95"
            >
              View Live
            </a>
          )}
          {data.ctas.demo && (
            <a
              href={data.ctas.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-700 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition hover:border-neutral-500 hover:text-white hover:scale-105 active:scale-95"
            >
              Demo
            </a>
          )}
          {data.ctas.github && (
            <a
              href={data.ctas.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-700 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition hover:border-neutral-500 hover:text-white hover:scale-105 active:scale-95"
            >
              GitHub
            </a>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
