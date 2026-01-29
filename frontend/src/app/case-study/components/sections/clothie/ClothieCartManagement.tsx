"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import ClothieDiagramWithExplanation from "../../diagrams/ClothieDiagramWithExplanation";
import { clothieDiagramExplanations } from "../../diagrams/clothieExplanations";

/**
 * Cart State Management Section with Interactive Diagram
 * Shows cart synchronization between client, server, and storage
 */
export default function ClothieCartManagement() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              State Management
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Shopping Cart
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Cart state synchronization between client, server, and storage with 
              seamless merge logic when guest users create accounts.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <ClothieDiagramWithExplanation
            diagramId="cart-state-management"
            explanation={clothieDiagramExplanations['cart-state-management']}
            height="750px"
          />
        </ScrollReveal>

        {/* Data Structure Visualization */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <h4 className="text-lg font-semibold text-white mb-4">
                Cart Data Structure
              </h4>
              <pre className="text-sm text-neutral-300 bg-neutral-950 p-4 rounded-lg overflow-x-auto">
{`// Nested object for O(1) lookups
cartData = {
  "product_id_1": {
    "M": 2,   // Size M, qty 2
    "L": 1    // Size L, qty 1
  },
  "product_id_2": {
    "S": 3    // Size S, qty 3
  }
}`}
              </pre>
            </div>
            
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <h4 className="text-lg font-semibold text-white mb-4">
                Add-ons Structure
              </h4>
              <pre className="text-sm text-neutral-300 bg-neutral-950 p-4 rounded-lg overflow-x-auto">
{`// Separate state avoids deep nesting
cartAddOns = {
  "product_id_1": [
    { name: "Dupatta", price: 500 },
    { name: "Trouser", price: 800 }
  ]
}`}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        {/* Key Features */}
        <ScrollReveal delay={0.4}>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h5 className="font-semibold text-blue-400 mb-2">Guest Users</h5>
              <p className="text-sm text-neutral-400">
                Cart stored in localStorage only. Zero backend calls until checkout.
              </p>
            </div>
            <div className="p-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <h5 className="font-semibold text-emerald-400 mb-2">Authenticated</h5>
              <p className="text-sm text-neutral-400">
                Cart synced to MongoDB via user.cartData field. Persists across devices.
              </p>
            </div>
            <div className="p-5 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <h5 className="font-semibold text-amber-400 mb-2">Cart Merge</h5>
              <p className="text-sm text-neutral-400">
                Additive merge on login. Guest M:2 + DB M:1 = Result M:3. No data loss.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
