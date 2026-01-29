"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Visual Flow Builder Section with Interactive Diagram
 * Shows the flow execution lifecycle from creation to runtime execution
 */
export default function WhatsAppFunnelFlowBuilder() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Automation
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Visual Flow Builder
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Enable non-technical users to create automated messaging sequences using a 
              drag-and-drop React Flow canvas. Flows execute automatically when inbound 
              messages match trigger conditions, without requiring code deployment.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="flow-execution-lifecycle"
            explanation={whatsappFunnelDiagramExplanations['flow-execution-lifecycle']}
            height="650px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
