"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import ClothieDiagramWithExplanation from "../../diagrams/ClothieDiagramWithExplanation";
import { clothieDiagramExplanations } from "../../diagrams/clothieExplanations";

/**
 * Order Placement Lifecycle Section with Interactive Diagram
 * Shows the complete checkout flow with payment routing
 */
export default function ClothieOrderLifecycle() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Checkout Flow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Order Lifecycle
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              End-to-end order placement from cart review to confirmation, with 
              intelligent payment method routing for different product types.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <ClothieDiagramWithExplanation
            diagramId="order-placement-lifecycle"
            explanation={clothieDiagramExplanations['order-placement-lifecycle']}
            height="800px"
          />
        </ScrollReveal>

        {/* Payment Methods */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Cash on Delivery (COD)
              </h4>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  Available for Ready-to-Wear (RTW) products only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  COD details subdocument for delivery tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  Delivery service assignment and attempt logging
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">•</span>
                  Collection verification by admin
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/30">
              <h4 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Bank Transfer
              </h4>
              <ul className="space-y-2 text-neutral-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Required for Made-to-Order (MTO) products
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Bank details displayed from settings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Optional payment proof upload to S3
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  Admin verification before processing
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
