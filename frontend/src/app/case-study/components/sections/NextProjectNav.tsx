"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { CaseStudyData } from "../../types";

interface NextProjectNavProps {
  nextProject?: CaseStudyData;
}

/**
 * Section 14: Next Case Study Navigation
 * 
 * - "Next Project →"
 * - Smooth transition animation
 * - Keeps user engaged
 */
export default function NextProjectNav({ nextProject }: NextProjectNavProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(image, {
        rotateX,
        rotateY,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!nextProject) {
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
            Next Project
          </p>
        </div>

        <Link
          href={`/case-study/${nextProject.slug}`}
          ref={containerRef}
          className="group block relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 transition-all duration-500"
          style={{ perspective: "1000px" }}
        >
          <div className="relative h-[50vh] md:h-[60vh]">
            {/* Image */}
            <div
              ref={imageRef}
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src={nextProject.hero.heroImage}
                alt={nextProject.hero.projectName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-neutral-400">Next Project</span>
                  <div className="flex-1 h-px bg-neutral-700" />
                  <svg
                    className="w-6 h-6 text-neutral-400 transform transition-transform duration-500 group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {nextProject.hero.projectName}
                </h3>
                <p className="text-lg md:text-xl text-neutral-300 max-w-2xl">
                  {nextProject.hero.impactLine}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
