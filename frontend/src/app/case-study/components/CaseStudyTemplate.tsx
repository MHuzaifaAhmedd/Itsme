"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CaseStudyData } from "../types";
import { getNextCaseStudy } from "../data/caseStudies";

// Import all section components
import CaseStudyHero from "./sections/CaseStudyHero";
import ProblemStatement from "./sections/ProblemStatement";
import GoalsMetrics from "./sections/GoalsMetrics";
import UserFlowDiagram from "./sections/UserFlowDiagram";
import SystemArchitecture from "./sections/SystemArchitecture";
import DataFlow from "./sections/DataFlow";
import CoreFeatures from "./sections/CoreFeatures";
import TechnicalChallenges from "./sections/TechnicalChallenges";
import PerformanceSecurity from "./sections/PerformanceSecurity";
import VisualUIDecisions from "./sections/VisualUIDecisions";
import FinalOutcome from "./sections/FinalOutcome";
import Learnings from "./sections/Learnings";
import FutureImprovements from "./sections/FutureImprovements";
import NextProjectNav from "./sections/NextProjectNav";

// Import intro animation
import CaseStudyIntro from "./animations/CaseStudyIntro";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudyTemplateProps {
  data: CaseStudyData;
}

/**
 * Complete Case Study Template
 * 
 * Combines all 14 mandatory sections with:
 * - Smooth scroll (Lenis)
 * - GSAP ScrollTrigger animations
 * - Premium transitions
 * - Responsive design
 */
export default function CaseStudyTemplate({ data }: CaseStudyTemplateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextProject = getNextCaseStudy(data.slug);
  
  // State for intro animation
  const [showIntro, setShowIntro] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    // Also reset any scroll position in the document
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Handle intro animation completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setContentVisible(true);
    
    // Animate main content in
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.6, 
          ease: "power2.out",
          onComplete: () => {
            // Refresh ScrollTrigger after content is visible
            ScrollTrigger.refresh();
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initialize Lenis smooth scroll
    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          lerp: 0.1,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 1.5,
          infinite: false,
        });

    let rafFunction: ((time: number) => void) | null = null;
    if (lenis) {
      // Update ScrollTrigger on scroll
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      // GSAP ticker integration
      rafFunction = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(rafFunction);
      gsap.ticker.lagSmoothing(0);
    }

    // Refresh ScrollTrigger after mount
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      if (lenis) {
        lenis.destroy();
        if (rafFunction) {
          gsap.ticker.remove(rafFunction);
        }
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleBackClick = () => {
    try {
      window.sessionStorage.setItem("skipHomeLoader", "1");
    } catch {
      // ignore
    }
    router.push("/#projects");
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-neutral-950 text-white">
      {/* Premium Intro Animation */}
      {showIntro && (
        <CaseStudyIntro 
          projectName={data.hero.projectName} 
          onComplete={handleIntroComplete} 
        />
      )}

      {/* Main Content - Hidden until intro completes */}
      <div 
        ref={contentRef}
        style={{ opacity: contentVisible ? 1 : 0 }}
      >
        {/* Back Button - Fixed */}
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={handleBackClick}
            className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            type="button"
          >
            <svg
              className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        {/* All 14 Sections */}
        <main className="relative">
        {/* 1. Hero Section */}
        <CaseStudyHero data={data.hero} />

        {/* 2. Problem Statement */}
        <ProblemStatement data={data.problem} />

        {/* 3. Goals & Metrics */}
        <GoalsMetrics data={data.goalsMetrics} />

        {/* 4. User Flow Diagram */}
        <UserFlowDiagram data={data.userFlow} />

        {/* 5. System Architecture */}
        <SystemArchitecture data={data.systemArchitecture} />

        {/* 6. Data Flow */}
        <DataFlow data={data.dataFlow} />

        {/* 7. Core Features */}
        <CoreFeatures data={data.coreFeatures} />

        {/* 8. Technical Challenges */}
        <TechnicalChallenges data={data.technicalChallenges} />

        {/* 9. Performance & Security */}
        <PerformanceSecurity data={data.performanceSecurity} />

        {/* 10. Visual & UI Decisions */}
        <VisualUIDecisions data={data.visualUI} />

        {/* 11. Final Outcome */}
        <FinalOutcome data={data.finalOutcome} />

        {/* 12. Learnings */}
        <Learnings data={data.learnings} />

        {/* 13. Future Improvements */}
        <FutureImprovements data={data.futureImprovements} />

        {/* 14. Next Project Navigation */}
        <NextProjectNav nextProject={nextProject} />
      </main>

        {/* Footer */}
        <footer className="relative border-t border-neutral-900 bg-neutral-950 px-6 py-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
            <p className="text-sm text-neutral-500">
              © 2024 Portfolio Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 hover:text-neutral-300"
              >
                GitHub
              </a>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 hover:text-neutral-300"
              >
                LinkedIn
              </a>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <a
                href="mailto:hello@studio.com"
                className="transition duration-200 hover:text-neutral-300"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
