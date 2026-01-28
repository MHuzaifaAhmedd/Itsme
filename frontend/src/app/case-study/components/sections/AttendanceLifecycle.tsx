"use client";

import ScrollReveal from "../animations/ScrollReveal";
import DiagramWithExplanation from "../diagrams/DiagramWithExplanation";
import { diagramExplanations } from "../diagrams/explanations";

/**
 * Attendance Check-In/Out Lifecycle Section
 * Shows synchronous and asynchronous processing paths
 */
export default function AttendanceLifecycle() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Core Feature
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Attendance Tracking
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Real-time attendance management with IP geofencing, biometric integration, 
              and automatic cache invalidation for instant dashboard updates.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <DiagramWithExplanation
            diagramId="attendance-lifecycle"
            explanation={diagramExplanations['attendance-lifecycle']}
            height="800px"
          />
        </ScrollReveal>

        {/* Key Features Grid */}
        <ScrollReveal delay={0.3}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="text-emerald-400 font-semibold mb-2">80-170ms</div>
              <div className="text-white font-medium mb-1">Response Time</div>
              <div className="text-sm text-neutral-400">
                User confirmation delivered in under 200ms
              </div>
            </div>
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="text-blue-400 font-semibold mb-2">Real-Time</div>
              <div className="text-white font-medium mb-1">WebSocket Updates</div>
              <div className="text-sm text-neutral-400">
                Admin dashboard updates instantly without refresh
              </div>
            </div>
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="text-amber-400 font-semibold mb-2">Async</div>
              <div className="text-white font-medium mb-1">Background Jobs</div>
              <div className="text-sm text-neutral-400">
                FCM notifications queued for batch processing
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
