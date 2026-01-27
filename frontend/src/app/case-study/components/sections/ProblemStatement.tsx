"use client";

import { ProblemStatementData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface ProblemStatementProps {
  data: ProblemStatementData;
}

/**
 * Section 2: Problem Statement
 * 
 * - Real-world problem context
 * - User pain points
 * - Why existing solutions were insufficient
 * - Line-by-line text reveal on scroll
 */
export default function ProblemStatement({ data }: ProblemStatementProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Problem
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              The Challenge
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {/* Context */}
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-semibold text-neutral-300 mb-4">
              Context
            </h3>
            <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
              {data.context}
            </p>
          </div>

          {/* Pain Points */}
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-semibold text-neutral-300 mb-6">
              User Pain Points
            </h3>
            <div className="space-y-4">
              {data.painPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border border-neutral-800 rounded-lg bg-neutral-900/30"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <span className="text-red-400 text-sm font-semibold">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Insufficient */}
          <div className="p-6 md:p-8 border border-neutral-800 rounded-xl bg-neutral-900/30">
            <h3 className="text-xl md:text-2xl font-semibold text-neutral-300 mb-4">
              Why Existing Solutions Failed
            </h3>
            <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
              {data.whyInsufficient}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
