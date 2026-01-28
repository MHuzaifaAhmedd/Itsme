"use client";

import { useState } from "react";
import { CoreFeaturesData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface CoreFeaturesProps {
  data: CoreFeaturesData;
}

/**
 * Section 7: Core Features (Deep Dive)
 * 
 * For each major feature:
 * - What it does
 * - Why it matters
 * - How it was implemented (high-level)
 * - Feature cards with hover + micro-interactions
 */
export default function CoreFeatures({ data }: CoreFeaturesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Core Features
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Key Functionality
            </h2>
          </div>
        </ScrollReveal>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {data.features.map((feature, i) => (
            <ScrollReveal key={i} delay={i * 0.1} className="h-full">
              <div
                className="group relative h-full p-6 md:p-8 border border-neutral-800 rounded-xl bg-neutral-900/30 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/50 hover:scale-[1.02] cursor-pointer flex flex-col"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Feature Number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Feature Name */}
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {feature.name}
                </h3>

                {/* What It Does */}
                <div className="mb-4">
                  <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
                    What it does
                  </h4>
                  <p className="text-neutral-300 leading-relaxed">
                    {feature.whatItDoes}
                  </p>
                </div>

                {/* Why It Matters */}
                <div className="mb-4 flex-1">
                  <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
                    Why it matters
                  </h4>
                  <p className="text-neutral-300 leading-relaxed">
                    {feature.whyItMatters}
                  </p>
                </div>

                {/* How Implemented */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    hoveredIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
                    Implementation
                  </h4>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {feature.howImplemented}
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
