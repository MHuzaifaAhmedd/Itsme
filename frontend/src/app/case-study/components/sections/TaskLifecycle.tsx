"use client";

import ScrollReveal from "../animations/ScrollReveal";
import DiagramWithExplanation from "../diagrams/DiagramWithExplanation";
import { diagramExplanations } from "../diagrams/explanations";

/**
 * Task Assignment & Verification Lifecycle Section
 * Multi-actor workflow across Admin, Backend, Employee
 */
export default function TaskLifecycle() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Workflow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Task Management
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Complete bidirectional workflow from task creation through employee completion 
              and admin verification with S3-based proof file storage.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <DiagramWithExplanation
            diagramId="task-lifecycle"
            explanation={diagramExplanations['task-lifecycle']}
            height="800px"
          />
        </ScrollReveal>

        {/* Assignment Types */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Assignment Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-blue-500/10 border-2 border-blue-500/30">
                <div className="text-blue-400 font-semibold mb-2">Individual</div>
                <div className="text-sm text-neutral-300">
                  Assign to specific employees with independent tracking
                </div>
              </div>
              <div className="p-6 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30">
                <div className="text-emerald-400 font-semibold mb-2">Department</div>
                <div className="text-sm text-neutral-300">
                  Assign to all employees in selected departments
                </div>
              </div>
              <div className="p-6 rounded-xl bg-amber-500/10 border-2 border-amber-500/30">
                <div className="text-amber-400 font-semibold mb-2">Global</div>
                <div className="text-sm text-neutral-300">
                  Assign to all active employees organization-wide
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
