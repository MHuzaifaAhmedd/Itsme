"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import ClothieDiagramWithExplanation from "../../diagrams/ClothieDiagramWithExplanation";
import { clothieDiagramExplanations } from "../../diagrams/clothieExplanations";

/**
 * Product Data Flow Section with Interactive Diagram
 * Shows product lifecycle from creation to display
 */
export default function ClothieProductDataFlow() {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Data Pipeline
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Product Data Flow
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              Complete product lifecycle from admin creation through S3 image storage 
              to customer display, including search functionality.
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <ClothieDiagramWithExplanation
            diagramId="product-data-flow"
            explanation={clothieDiagramExplanations['product-data-flow']}
            height="850px"
          />
        </ScrollReveal>

        {/* Key Features */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Image Validation
              </h4>
              <p className="text-sm text-neutral-400">
                Client-side 2:3 aspect ratio validation ensures consistent product 
                grid display before upload begins.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                S3 Storage
              </h4>
              <p className="text-sm text-neutral-400">
                Images uploaded via Multer memory buffer to AWS S3. Public URLs 
                served directly without backend proxying.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Debounced Search
              </h4>
              <p className="text-sm text-neutral-400">
                300ms debounce reduces API calls. Regex query matches product 
                name, category, and subcategory fields.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
