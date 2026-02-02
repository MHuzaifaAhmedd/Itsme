"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CaseStudyData } from "../types";
import { getNextCaseStudy } from "../data/caseStudies";

import CaseStudyHero from "./sections/CaseStudyHero";
import ProblemStatement from "./sections/ProblemStatement";
import GoalsMetrics from "./sections/GoalsMetrics";
import UserFlowDiagram from "./sections/UserFlowDiagram";
import DataFlow from "./sections/DataFlow";
import CoreFeatures from "./sections/CoreFeatures";
import TechnicalChallenges from "./sections/TechnicalChallenges";
import PerformanceSecurity from "./sections/PerformanceSecurity";
import VisualUIDecisions from "./sections/VisualUIDecisions";
import FinalOutcome from "./sections/FinalOutcome";
import Learnings from "./sections/Learnings";
import FutureImprovements from "./sections/FutureImprovements";
import NextProjectNav from "./sections/NextProjectNav";

import {
  SharafulQuranSystemArchitecture,
  SharafulQuranAuthenticationFlow,
  SharafulQuranBookingLifecycle,
  SharafulQuranCourseLifecycle,
  SharafulQuranDataProcessingFlow,
  SharafulQuranPerformanceFlow,
} from "./sections/sharafulquran";

import CaseStudyIntro from "./animations/CaseStudyIntro";

gsap.registerPlugin(ScrollTrigger);

interface SharafulQuranCaseStudyTemplateProps {
  data: CaseStudyData;
}

/**
 * Sharaf ul Quran Case Study Template
 *
 * Custom template with 6 interactive React Flow diagrams:
 * - System Architecture
 * - Authentication Flow
 * - One-Time Booking Lifecycle
 * - Course Enrollment Lifecycle
 * - Data Processing Flow
 * - Performance / Decision Flow
 */
export default function SharafulQuranCaseStudyTemplate({
  data,
}: SharafulQuranCaseStudyTemplateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const nextProject = getNextCaseStudy(data.slug);

  const [showIntro, setShowIntro] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setContentVisible(true);

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            ScrollTrigger.refresh();
            window.dispatchEvent(new CustomEvent("heroLoaded"));
          },
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
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      rafFunction = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(rafFunction);
      gsap.ticker.lagSmoothing(0);
    }

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
      {showIntro && (
        <CaseStudyIntro
          projectName={data.hero.projectName}
          onComplete={handleIntroComplete}
        />
      )}

      <div ref={contentRef} style={{ opacity: contentVisible ? 1 : 0 }}>
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

        <main className="relative">
          <CaseStudyHero data={data.hero} />

          <ProblemStatement data={data.problem} />

          <GoalsMetrics data={data.goalsMetrics} />

          <UserFlowDiagram data={data.userFlow} />

          <SharafulQuranSystemArchitecture
            description={data.systemArchitecture?.description}
            layers={data.systemArchitecture?.layers}
          />

          <SharafulQuranAuthenticationFlow />

          <SharafulQuranBookingLifecycle />

          <SharafulQuranCourseLifecycle />

          <DataFlow data={data.dataFlow} />

          <SharafulQuranDataProcessingFlow />

          <CoreFeatures data={data.coreFeatures} />

          <SharafulQuranPerformanceFlow />

          <TechnicalChallenges data={data.technicalChallenges} />

          <PerformanceSecurity data={data.performanceSecurity} />

          <VisualUIDecisions data={data.visualUI} />

          <FinalOutcome data={data.finalOutcome} />

          <Learnings data={data.learnings} />

          <FutureImprovements data={data.futureImprovements} />

          <NextProjectNav nextProject={nextProject} />
        </main>

        <footer className="relative border-t border-neutral-900 bg-neutral-950 px-6 py-12">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
            <p className="text-sm text-neutral-500">
              © 2024 Portfolio Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <a
                href="https://github.com/MHuzaifaAhmedd/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 hover:text-neutral-300"
              >
                GitHub
              </a>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <a
                href="https://www.linkedin.com/in/huzaifa-ahmed-38755b1b7/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 hover:text-neutral-300"
              >
                LinkedIn
              </a>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <a
                href="mailto:ahmedhuzaifa451@gmail.com"
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
