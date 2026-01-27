"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SystemArchitectureData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface SystemArchitectureProps {
  data: SystemArchitectureData;
}

/**
 * Section 5: System Architecture Diagram
 * 
 * - Frontend, backend, services, database layers
 * - Color-coded logical layers
 * - Minimal labels (no clutter)
 * - Step-wise reveal animation
 */
export default function SystemArchitecture({ data }: SystemArchitectureProps) {
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const layers = layersRef.current.filter(Boolean);
    if (!container || layers.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(layers, { opacity: 1, x: 0 });
      return;
    }

    gsap.set(layers, { opacity: 0, x: -40 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(layers, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [data.layers.length]);

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Architecture
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              System Design
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
        </ScrollReveal>

        {/* Architecture Layers */}
        <div
          ref={containerRef}
          className="space-y-6"
        >
          {data.layers.map((layer, i) => (
            <div
              key={i}
              ref={(el) => {
                layersRef.current[i] = el;
              }}
              className="p-6 md:p-8 border-2 rounded-xl backdrop-blur-sm"
              style={{
                borderColor: layer.color,
                backgroundColor: `${layer.color}15`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <h3 className="text-2xl font-semibold text-white">
                  {layer.name}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.components.map((component, j) => (
                  <span
                    key={j}
                    className="px-3 py-1.5 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm text-neutral-300"
                  >
                    {component}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
