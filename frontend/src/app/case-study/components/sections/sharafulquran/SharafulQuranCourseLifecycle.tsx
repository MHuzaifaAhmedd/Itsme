"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import SharafulQuranDiagramWithExplanation from "../../diagrams/SharafulQuranDiagramWithExplanation";
import { sharafulQuranDiagramExplanations } from "../../diagrams/sharafulQuranExplanations";

export default function SharafulQuranCourseLifecycle() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Core Feature
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Course Enrollment Lifecycle
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Submit → admin approval → slot assignment → payment → idempotent webhook → state machine → course_sessions.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <SharafulQuranDiagramWithExplanation
            diagramId="core-feature-lifecycle-course"
            explanation={sharafulQuranDiagramExplanations["core-feature-lifecycle-course"]}
            height="700px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
