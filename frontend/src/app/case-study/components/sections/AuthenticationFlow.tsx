"use client";

import ScrollReveal from "../animations/ScrollReveal";
import DiagramWithExplanation from "../diagrams/DiagramWithExplanation";
import { diagramExplanations } from "../diagrams/explanations";

/**
 * Authentication & Authorization Flow Section
 * Demonstrates multi-layer security architecture
 */
export default function AuthenticationFlow() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Security
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Authentication & Authorization
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Multi-layer security architecture with JWT authentication, CSRF protection, 
              IP geofencing, and device validation ensuring defense in depth.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <DiagramWithExplanation
            diagramId="authentication-flow"
            explanation={diagramExplanations['authentication-flow']}
            height="800px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
