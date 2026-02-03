"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CaseStudySummaryData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudySummaryProps {
  data: CaseStudySummaryData;
  onViewFullCaseStudy: () => void;
}

/**
 * Case Study Summary Section
 *
 * Displays a condensed 1-2 page overview of the case study with scroll-reveal
 * animations. Users can read the summary and click "View whole case study"
 * to proceed to the full detailed content.
 */
export default function CaseStudySummary({
  data,
  onViewFullCaseStudy,
}: CaseStudySummaryProps) {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(cta, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(cta, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: cta,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(cta, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Executive Summary
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Case Study Overview
            </h2>
          </div>
        </ScrollReveal>

        {/* Overview Paragraph */}
        <ScrollReveal delay={0.1}>
          <p className="text-lg md:text-xl text-neutral-300 leading-relaxed mb-16">
            {data.overview}
          </p>
        </ScrollReveal>

        {/* Summary Sections */}
        <div className="space-y-12 md:space-y-16">
          {data.sections.map((section, index) => (
            <ScrollReveal key={index} delay={0.1 * (index + 1)}>
              <div className="border-l-2 border-neutral-700 pl-6 md:pl-8 py-2">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA: View Whole Case Study */}
        <div
          ref={ctaRef}
          className="mt-20 md:mt-24 pt-16 border-t border-neutral-800 flex flex-col items-center"
        >
          <p className="text-neutral-500 text-sm md:text-base mb-6 text-center">
            Want to dive deeper? Explore the full technical case study with
            architecture diagrams, implementation details, and outcomes.
          </p>
          <button
            onClick={onViewFullCaseStudy}
            type="button"
            className="group inline-flex h-14 items-center justify-center rounded-full border-2 border-neutral-600 bg-transparent px-10 text-base font-medium uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-neutral-950 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center gap-3">
              View Whole Case Study
              <svg
                className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
