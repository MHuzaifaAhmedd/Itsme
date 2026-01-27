"use client";

import { useState } from "react";
import { TechnicalChallengesData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface TechnicalChallengesProps {
  data: TechnicalChallengesData;
}

/**
 * Section 8: Technical Challenges & Solutions (CRITICAL)
 * 
 * - Challenge → why it was hard → solution
 * - Accordion or expandable sections
 * - Optional code snippets (only where meaningful)
 */
export default function TechnicalChallenges({ data }: TechnicalChallengesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Technical Challenges
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Problems We Solved
            </h2>
          </div>
        </ScrollReveal>

        {/* Challenge Accordion */}
        <div className="space-y-4">
          {data.challenges.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  expandedIndex === i
                    ? "border-neutral-700 bg-neutral-900/50"
                    : "border-neutral-800 bg-neutral-900/30"
                }`}
              >
                {/* Challenge Header */}
                <button
                  onClick={() => toggleExpand(i)}
                  className="w-full p-6 md:p-8 text-left flex items-start justify-between gap-4 hover:bg-neutral-800/30 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-orange-400">
                        Challenge #{i + 1}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white">
                      {item.challenge}
                    </h3>
                  </div>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center transition-transform duration-300 ${
                      expandedIndex === i ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedIndex === i ? "max-h-[2000px]" : "max-h-0"
                  }`}
                >
                  <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
                    {/* Why Hard */}
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-red-400 mb-2">
                        Why This Was Hard
                      </h4>
                      <p className="text-neutral-300 leading-relaxed">
                        {item.whyHard}
                      </p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-green-400 mb-2">
                        Our Solution
                      </h4>
                      <p className="text-neutral-300 leading-relaxed">
                        {item.solution}
                      </p>
                    </div>

                    {/* Code Snippet (Optional) */}
                    {item.codeSnippet && (
                      <div>
                        <h4 className="text-sm uppercase tracking-wider text-blue-400 mb-2">
                          Code Example
                        </h4>
                        <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg overflow-x-auto text-sm">
                          <code className="text-neutral-300">
                            {item.codeSnippet.code}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
