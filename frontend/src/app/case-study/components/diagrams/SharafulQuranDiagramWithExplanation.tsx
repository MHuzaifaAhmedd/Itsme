"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SharafulQuranDiagramLoader from './SharafulQuranDiagramLoader';
import type { DiagramExplanation } from './sharafulQuranExplanations';

gsap.registerPlugin(ScrollTrigger);

interface SharafulQuranDiagramWithExplanationProps {
  diagramId: string;
  explanation: DiagramExplanation;
  height?: string;
}

export default function SharafulQuranDiagramWithExplanation({
  diagramId,
  explanation,
  height = '700px',
}: SharafulQuranDiagramWithExplanationProps) {
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
      gsap.set([diagram, explanationDiv], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(diagram, { opacity: 0, scale: 0.96, y: 30 });
    gsap.set(explanationDiv, { opacity: 0, y: 40 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(diagram, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        });
        gsap.to(explanationDiv, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.35,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      <div ref={diagramRef}>
        <SharafulQuranDiagramLoader diagramId={diagramId} height={height} showTitle={true} />
      </div>
      <div
        ref={explanationRef}
        className="space-y-6 px-6 py-8 rounded-xl bg-neutral-900/30 border border-neutral-800"
      >
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            What This Diagram Represents
          </h4>
          <p className="text-neutral-300 leading-relaxed">{explanation.whatItRepresents}</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            How to Read the Flow
          </h4>
          <div className="text-neutral-300 leading-relaxed whitespace-pre-line text-sm">
            {explanation.howToRead}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Key Engineering Decisions
          </h4>
          <div className="text-neutral-300 leading-relaxed whitespace-pre-line text-sm">
            {explanation.engineeringDecision}
          </div>
        </div>
      </div>
    </div>
  );
}
