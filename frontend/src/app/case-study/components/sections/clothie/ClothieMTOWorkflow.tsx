"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import ClothieDiagramWithExplanation from "../../diagrams/ClothieDiagramWithExplanation";
import { clothieDiagramExplanations } from "../../diagrams/clothieExplanations";

/**
 * Made-to-Order Workflow Section with Interactive Diagram
 * Shows the complete MTO product lifecycle with deposits and modifications
 */
export default function ClothieMTOWorkflow() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Custom Orders
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Made-to-Order Workflow
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Specialized workflow for custom products including design selection, 
              deposit payments, modification windows, and production tracking.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <ClothieDiagramWithExplanation
            diagramId="mto-workflow"
            explanation={clothieDiagramExplanations['mto-workflow']}
            height="900px"
          />
        </ScrollReveal>

        {/* MTO Lifecycle Phases */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-white mb-8 text-center">
              MTO Order Lifecycle Phases
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative p-6 rounded-xl bg-linear-to-br from-blue-500/10 to-transparent border border-blue-500/30">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h4 className="text-lg font-semibold text-blue-400 mb-3 mt-2">
                  Selection
                </h4>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• Choose design category</li>
                  <li>• Select custom size</li>
                  <li>• View MTO size chart</li>
                  <li>• Add to cart</li>
                </ul>
              </div>
              
              <div className="relative p-6 rounded-xl bg-linear-to-br from-emerald-500/10 to-transparent border border-emerald-500/30">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h4 className="text-lg font-semibold text-emerald-400 mb-3 mt-2">
                  Checkout
                </h4>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• Bank Transfer enforced</li>
                  <li>• Deposit calculated</li>
                  <li>• Payment proof optional</li>
                  <li>• Order submitted</li>
                </ul>
              </div>
              
              <div className="relative p-6 rounded-xl bg-linear-to-br from-amber-500/10 to-transparent border border-amber-500/30">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h4 className="text-lg font-semibold text-amber-400 mb-3 mt-2">
                  Modification
                </h4>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• Deposit verified</li>
                  <li>• Change window opens</li>
                  <li>• Design adjustments</li>
                  <li>• Deadline locks design</li>
                </ul>
              </div>
              
              <div className="relative p-6 rounded-xl bg-linear-to-br from-purple-500/10 to-transparent border border-purple-500/30">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <h4 className="text-lg font-semibold text-purple-400 mb-3 mt-2">
                  Production
                </h4>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• Production starts</li>
                  <li>• Balance reminder</li>
                  <li>• Payment verified</li>
                  <li>• Ready for delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* MTO vs RTW Comparison */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-xl font-semibold text-white mb-6">
              MTO vs RTW Product Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-700">
                    <th className="text-left py-3 px-4 text-neutral-400 font-medium">Aspect</th>
                    <th className="text-left py-3 px-4 text-purple-400 font-medium">Made-to-Order (MTO)</th>
                    <th className="text-left py-3 px-4 text-blue-400 font-medium">Ready-to-Wear (RTW)</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="border-b border-neutral-800">
                    <td className="py-3 px-4 text-neutral-400">Payment Methods</td>
                    <td className="py-3 px-4">Bank Transfer only</td>
                    <td className="py-3 px-4">COD or Bank Transfer</td>
                  </tr>
                  <tr className="border-b border-neutral-800">
                    <td className="py-3 px-4 text-neutral-400">Payment Structure</td>
                    <td className="py-3 px-4">Deposit + Balance (two-stage)</td>
                    <td className="py-3 px-4">Full payment at delivery</td>
                  </tr>
                  <tr className="border-b border-neutral-800">
                    <td className="py-3 px-4 text-neutral-400">Sizing</td>
                    <td className="py-3 px-4">Custom sizes from MTO chart</td>
                    <td className="py-3 px-4">Standard sizes (S, M, L, XL)</td>
                  </tr>
                  <tr className="border-b border-neutral-800">
                    <td className="py-3 px-4 text-neutral-400">Modifications</td>
                    <td className="py-3 px-4">Within deadline window</td>
                    <td className="py-3 px-4">Not applicable</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400">Fulfillment</td>
                    <td className="py-3 px-4">After production (days/weeks)</td>
                    <td className="py-3 px-4">Immediate from inventory</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
