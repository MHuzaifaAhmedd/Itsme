"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Lead Assignment Algorithms Section with Interactive Diagram
 * Shows round-robin and biased round-robin distribution
 */
export default function WhatsAppFunnelAssignmentAlgorithms() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Assignment
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Lead Assignment Algorithms
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Fair lead distribution via standard round-robin or biased round-robin 
              with frequency weights. Pointer state persists across server restarts 
              and respects member availability settings.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="lead-assignment-algorithms"
            explanation={whatsappFunnelDiagramExplanations['lead-assignment-algorithms']}
            height="800px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
