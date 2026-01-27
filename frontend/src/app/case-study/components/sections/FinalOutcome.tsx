"use client";

import { FinalOutcomeData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface FinalOutcomeProps {
  data: FinalOutcomeData;
}

/**
 * Section 11: Final Outcome & Impact
 * 
 * - What was achieved
 * - Who it helped
 * - Why it matters
 */
export default function FinalOutcome({ data }: FinalOutcomeProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Impact
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              The Result
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* What Was Achieved */}
          <ScrollReveal delay={0.1}>
            <div className="p-6 md:p-8 border-2 border-green-500/30 rounded-xl bg-green-500/5">
              <div className="text-3xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                What We Achieved
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                {data.achieved}
              </p>
            </div>
          </ScrollReveal>

          {/* Who It Helped */}
          <ScrollReveal delay={0.2}>
            <div className="p-6 md:p-8 border-2 border-blue-500/30 rounded-xl bg-blue-500/5">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Who It Helped
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                {data.whoHelped}
              </p>
            </div>
          </ScrollReveal>

          {/* Why It Matters */}
          <ScrollReveal delay={0.3}>
            <div className="p-6 md:p-8 border-2 border-purple-500/30 rounded-xl bg-purple-500/5">
              <div className="text-3xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Why It Matters
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                {data.whyMatters}
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Optional Metrics */}
        {data.metrics && data.metrics.length > 0 && (
          <ScrollReveal delay={0.4}>
            <div className="p-8 md:p-12 border border-neutral-800 rounded-xl bg-neutral-900/30 text-center">
              <h3 className="text-2xl font-semibold text-white mb-8">
                Measurable Outcomes
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {data.metrics.map((metric, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                      {metric.split(':')[0]}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {metric.split(':')[1]?.trim() || metric}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
