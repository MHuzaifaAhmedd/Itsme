"use client";

import ScrollReveal from "../../animations/ScrollReveal";
import ClothieDiagramWithExplanation from "../../diagrams/ClothieDiagramWithExplanation";
import { clothieDiagramExplanations } from "../../diagrams/clothieExplanations";

interface SystemLayer {
  name: string;
  components: string[];
  color: string;
}

interface ClothieSystemArchitectureProps {
  description: string;
  layers: SystemLayer[];
}

/**
 * System Architecture Section with Interactive Diagram
 * Shows the Clothie e-commerce platform architecture
 */
export default function ClothieSystemArchitecture({
  description,
  layers,
}: ClothieSystemArchitectureProps) {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Architecture
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              System Design
            </h2>
            <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </ScrollReveal>

        {/* Interactive Diagram */}
        <ScrollReveal delay={0.2}>
          <div className="mb-16">
            <ClothieDiagramWithExplanation
              diagramId="system-architecture"
              explanation={clothieDiagramExplanations['system-architecture']}
              height="700px"
            />
          </div>
        </ScrollReveal>

        {/* Layer Breakdown */}
        <ScrollReveal delay={0.3}>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Layer Breakdown
            </h3>
            {layers.map((layer, i) => (
              <div
                key={i}
                className="p-6 md:p-8 border-2 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01]"
                style={{
                  borderColor: layer.color,
                  backgroundColor: `${layer.color}10`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <h4 className="text-2xl font-semibold text-white">
                    {layer.name}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.components.map((component, j) => (
                    <span
                      key={j}
                      className="px-3 py-1.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700/50 transition-colors"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
