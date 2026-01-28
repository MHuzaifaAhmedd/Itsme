"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DiagramLoader from './DiagramLoader';

gsap.registerPlugin(ScrollTrigger);

interface DiagramWithExplanationProps {
  diagramId: string;
  explanation: {
    whatItRepresents: string;
    howToRead: string;
    engineeringDecision: string;
  };
  height?: string;
}

export default function DiagramWithExplanation({
  diagramId,
  explanation,
  height = '700px',
}: DiagramWithExplanationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const diagram = diagramRef.current;
    const explanationDiv = explanationRef.current;

    if (!container || !diagram || !explanationDiv) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set([diagram, explanationDiv], { opacity: 1, y: 0 });
      return;
    }

    // Initial state
    gsap.set(diagram, { opacity: 0, scale: 0.95, y: 20 });
    gsap.set(explanationDiv, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        // Animate diagram
        gsap.to(diagram, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Animate explanation after diagram
        gsap.to(explanationDiv, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Diagram */}
      <div ref={diagramRef}>
        <DiagramLoader diagramId={diagramId} height={height} showTitle={true} />
      </div>

      {/* Explanation */}
      <div
        ref={explanationRef}
        className="space-y-6 px-6 py-8 rounded-xl bg-neutral-900/30 border border-neutral-800"
      >
        {/* What It Represents */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            What It Represents
          </h4>
          <p className="text-neutral-300 leading-relaxed">
            {explanation.whatItRepresents}
          </p>
        </div>

        {/* How to Read the Flow */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            How to Read the Flow
          </h4>
          <div className="text-neutral-300 leading-relaxed whitespace-pre-line">
            {explanation.howToRead}
          </div>
        </div>

        {/* Engineering Decision */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Engineering Decision Highlighted
          </h4>
          <div className="text-neutral-300 leading-relaxed whitespace-pre-line">
            {explanation.engineeringDecision}
          </div>
        </div>
      </div>
    </div>
  );
}
