"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import ClothieDiagramWithExplanation from "../../diagrams/ClothieDiagramWithExplanation";
import { clothieDiagramExplanations } from "../../diagrams/clothieExplanations";

/**
 * Authentication Flow Section with Interactive Diagram
 * Shows customer/admin auth and guest order linking
 */
export default function ClothieAuthenticationFlow() {
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
              JWT-based authentication with separate customer and admin flows, plus 
              automatic guest order linking on account registration.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <ClothieDiagramWithExplanation
            diagramId="authentication-flow"
            explanation={clothieDiagramExplanations['authentication-flow']}
            height="750px"
          />
        </ScrollReveal>

        {/* Key Features */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">
                Customer Authentication
              </h4>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Email/password login with bcrypt verification
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  JWT tokens stored in localStorage
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Guest checkout with email-based order tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  Automatic order linking on registration
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <h4 className="text-lg font-semibold text-amber-400 mb-3">
                Admin Authentication
              </h4>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  Dual system: DB admins + environment fallback
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  Admin JWT includes isAdmin flag
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  Separate adminAuth middleware for protected routes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  No access to customer endpoints from admin tokens
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
