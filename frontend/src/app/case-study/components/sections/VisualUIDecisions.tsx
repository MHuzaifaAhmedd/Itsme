"use client";

import Image from "next/image";
import { VisualUIData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface VisualUIDecisionsProps {
  data: VisualUIData;
}

/**
 * Section 10: Visual & UI Decisions
 * 
 * - Color usage rationale
 * - Typography choices
 * - UX decisions
 * - Horizontal scroll gallery or pinned sections
 */
export default function VisualUIDecisions({ data }: VisualUIDecisionsProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Design Decisions
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Visual & UX Choices
            </h2>
          </div>
        </ScrollReveal>

        {/* Design Decision Cards */}
        <div className="space-y-8">
          {data.decisions.map((decision, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="p-6 md:p-8 border border-neutral-800 rounded-xl bg-neutral-900/30">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Aspect */}
                  <div className="md:w-1/4">
                    <h3 className="text-xl font-semibold text-white">
                      {decision.aspect}
                    </h3>
                  </div>

                  {/* Rationale & Details */}
                  <div className="md:w-3/4 space-y-4">
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
                        Rationale
                      </h4>
                      <p className="text-neutral-300 leading-relaxed">
                        {decision.rationale}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-neutral-500 mb-2">
                        Details
                      </h4>
                      <p className="text-neutral-400 leading-relaxed">
                        {decision.details}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Optional Gallery */}
        {data.gallery && data.gallery.length > 0 && (
          <ScrollReveal delay={0.3}>
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Visual Gallery
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.gallery.map((image, i) => (
                  <div
                    key={i}
                    className="relative aspect-video rounded-lg bg-neutral-800 border border-neutral-700 overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Visual example ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
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
