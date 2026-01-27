"use client";

import { GoalsMetricsData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface GoalsMetricsProps {
  data: GoalsMetricsData;
}

/**
 * Section 3: Goals & Success Metrics
 * 
 * - Clear project objectives
 * - Measurable success indicators
 * - Minimal but visually structured layout
 */
export default function GoalsMetrics({ data }: GoalsMetricsProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Goals & Metrics
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              What We Set Out to Achieve
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Objectives */}
          <ScrollReveal delay={0.1}>
            <div className="p-6 md:p-8 border border-neutral-800 rounded-xl bg-neutral-900/30">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Objectives
              </h3>
              <ul className="space-y-4">
                {data.objectives.map((objective, i) => (
                  <li key={i} className="flex gap-3 text-neutral-300">
                    <span className="text-blue-400 font-semibold mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Success Metrics */}
          <ScrollReveal delay={0.2}>
            <div className="p-6 md:p-8 border border-neutral-800 rounded-xl bg-neutral-900/30">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Success Metrics
              </h3>
              <ul className="space-y-4">
                {data.successMetrics.map((metric, i) => (
                  <li key={i} className="flex gap-3 text-neutral-300">
                    <span className="text-green-400 font-semibold mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
