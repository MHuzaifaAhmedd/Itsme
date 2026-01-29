"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Follow-Up Management Section with Interactive Diagram
 * Shows the follow-up creation, role-based visibility, and reminder system
 */
export default function WhatsAppFunnelFollowUpSystem() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Workflow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Follow-Up System
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Track scheduled actions on conversations with role-based visibility. 
              Business owners see all follow-ups, team leads see their team&apos;s, and 
              members see only their own. Automated reminders via email and FCM.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="follow-up-system"
            explanation={whatsappFunnelDiagramExplanations['follow-up-system']}
            height="700px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
