"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Request Processing & Data Flow Section with Interactive Diagram
 * Shows the complete request lifecycle through middleware stack
 */
export default function WhatsAppFunnelRequestLifecycle() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Data Flow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Request Processing Lifecycle
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              The complete request journey from client through the Express middleware stack 
              (Helmet, CORS, body parsing, rate limiting, authentication) to controllers, 
              services, data access, and back. Includes webhook bypass paths.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="data-processing-flow"
            explanation={whatsappFunnelDiagramExplanations['data-processing-flow']}
            height="850px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
