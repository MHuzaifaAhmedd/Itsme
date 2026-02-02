"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import SharafulQuranDiagramWithExplanation from "../../diagrams/SharafulQuranDiagramWithExplanation";
import { sharafulQuranDiagramExplanations } from "../../diagrams/sharafulQuranExplanations";

export default function SharafulQuranAuthenticationFlow() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Security
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Authentication & Authorization Flow
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              JWT in httpOnly cookie with role-based backend separation; main backend rejects admin tokens. Email/password and OAuth (Google, Facebook); profile endpoint for cookie clients.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <SharafulQuranDiagramWithExplanation
            diagramId="authentication-flow"
            explanation={sharafulQuranDiagramExplanations["authentication-flow"]}
            height="750px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
