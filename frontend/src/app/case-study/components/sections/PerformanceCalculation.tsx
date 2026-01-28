"use client";

import ScrollReveal from "../animations/ScrollReveal";
import DiagramWithExplanation from "../diagrams/DiagramWithExplanation";
import { diagramExplanations } from "../diagrams/explanations";

/**
 * Performance Calculation Flow Section
 * Four-metric system with strict_zero policy
 */
export default function PerformanceCalculation() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Algorithm
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Performance Evaluation
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Data-driven four-metric scoring system (A, P, C, T) with configurable weights 
              and strict_zero policy preventing score manipulation.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <DiagramWithExplanation
            diagramId="performance-calculation"
            explanation={diagramExplanations['performance-calculation']}
            height="900px"
          />
        </ScrollReveal>

        {/* Four Metrics Breakdown */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Four-Metric System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-blue-400 mb-2">A</div>
                <div className="text-white font-semibold mb-1">Attendance</div>
                <div className="text-sm text-neutral-400 mb-2">
                  (presentDays / scheduledDays) × 100
                </div>
                <div className="text-xs text-neutral-500">Weight: 30%</div>
              </div>
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-emerald-400 mb-2">P</div>
                <div className="text-white font-semibold mb-1">Punctuality</div>
                <div className="text-sm text-neutral-400 mb-2">
                  max(0, 100 - avgLateMinutes)
                </div>
                <div className="text-xs text-neutral-500">Weight: 20%</div>
              </div>
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-amber-400 mb-2">C</div>
                <div className="text-white font-semibold mb-1">Completion</div>
                <div className="text-sm text-neutral-400 mb-2">
                  (completedTasks / assignedTasks) × 100
                </div>
                <div className="text-xs text-neutral-500">Weight: 30%</div>
              </div>
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="text-3xl font-bold text-purple-400 mb-2">T</div>
                <div className="text-white font-semibold mb-1">Timeliness</div>
                <div className="text-sm text-neutral-400 mb-2">
                  (onTimeTasks / completedTasks) × 100
                </div>
                <div className="text-xs text-neutral-500">Weight: 20%</div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* strict_zero Policy */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 p-8 rounded-xl bg-amber-500/10 border-2 border-amber-500/30">
            <h4 className="text-xl font-semibold text-amber-400 mb-3">
              strict_zero Policy
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Missing metrics are treated as 0% (not excluded from calculation). This prevents 
              score manipulation where employees could delete tasks to improve completion rate, 
              or new employees with no data would score 100% unfairly. Ensures consistent, 
              transparent scoring across all employees.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
