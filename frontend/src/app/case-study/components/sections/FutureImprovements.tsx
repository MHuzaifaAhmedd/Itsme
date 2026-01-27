"use client";

import { FutureImprovementsData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface FutureImprovementsProps {
  data: FutureImprovementsData;
}

/**
 * Section 13: Future Improvements
 * 
 * - Clearly scoped future ideas
 * - No fluff
 */
export default function FutureImprovements({ data }: FutureImprovementsProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Roadmap
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Future Enhancements
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {data.improvements.map((improvement, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="flex gap-4 p-6 md:p-8 border border-neutral-800 rounded-xl bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  <span className="text-sm font-semibold text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
                    {improvement}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
