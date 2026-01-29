"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Authentication Flow Section with Interactive Diagram
 * Shows the complete authentication lifecycle including email/password and Google OAuth
 */
export default function WhatsAppFunnelAuthenticationFlow() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Security
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Authentication Flow
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Complete authentication lifecycle including email/password login, Google OAuth, 
              token verification, and role-based authorization for team members and business owners.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="authentication-flow"
            explanation={whatsappFunnelDiagramExplanations['authentication-flow']}
            height="700px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
