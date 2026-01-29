"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import WhatsAppFunnelDiagramWithExplanation from "../../diagrams/WhatsAppFunnelDiagramWithExplanation";
import { whatsappFunnelDiagramExplanations } from "../../diagrams/whatsappfunnelExplanations";

/**
 * Real-Time Messaging Section with Interactive Diagram
 * Shows how messages flow with Socket.IO real-time updates
 */
export default function WhatsAppFunnelRealTimeMessaging() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Real-Time
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Real-Time Message Flow
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Instant message delivery and status updates via Socket.IO without polling. 
              Room-based routing ensures only users viewing a conversation receive updates, 
              while FCM push notifications reach users when offline.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <WhatsAppFunnelDiagramWithExplanation
            diagramId="real-time-message-flow"
            explanation={whatsappFunnelDiagramExplanations['real-time-message-flow']}
            height="700px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
