"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Multi-Channel Lead Ingestion Section with Interactive Diagram
 * Shows how leads from different sources flow into the unified conversation system
 */
export default function WhatsAppFunnelLeadIngestion() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Lead Management
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Multi-Channel Lead Ingestion
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Five distinct lead sources—WhatsApp inbound, Facebook Lead Ads, Walk-in QR codes, 
              External Webhooks, and Manual Entry—converge into a unified conversation system 
              with configurable assignment algorithms.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="multi-channel-lead-ingestion"
            explanation={whatsappFunnelDiagramExplanations['multi-channel-lead-ingestion']}
            height="750px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
