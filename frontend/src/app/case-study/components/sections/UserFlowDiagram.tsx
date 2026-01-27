"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserFlowData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface UserFlowDiagramProps {
  data: UserFlowData;
}

/**
 * Section 4: User Flow Diagram (Visual)
 * 
 * - Vertical or horizontal flow
 * - Clean nodes + arrows
 * - Responsive SVG or component-based diagram
 * - Animate flow paths on scroll
 */
export default function UserFlowDiagram({ data }: UserFlowDiagramProps) {
  const flowRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const flow = flowRef.current;
    const nodes = nodesRef.current.filter(Boolean);
    if (!flow || nodes.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(nodes, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(nodes, { opacity: 0, scale: 0.8 });

    const trigger = ScrollTrigger.create({
      trigger: flow,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.to(nodes, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.4)",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [data.nodes.length]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case "start":
        return "border-green-500 bg-green-500/10";
      case "end":
        return "border-blue-500 bg-blue-500/10";
      case "decision":
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-neutral-500 bg-neutral-500/10";
    }
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              User Flow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              User Journey
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
        </ScrollReveal>

        {/* Flow Diagram */}
        <div
          ref={flowRef}
          className="relative flex flex-col items-center gap-6 py-8"
        >
          {data.nodes.map((node, i) => (
            <div key={node.id} className="flex flex-col items-center gap-4 w-full max-w-md">
              {/* Node */}
              <div
                ref={(el) => {
                  nodesRef.current[i] = el;
                }}
                className={`w-full p-6 border-2 rounded-xl ${getNodeColor(
                  node.type
                )} backdrop-blur-sm`}
              >
                <div className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
                  {node.type}
                </div>
                <div className="text-lg font-semibold text-white">
                  {node.label}
                </div>
              </div>

              {/* Arrow (if not last node) */}
              {i < data.nodes.length - 1 && (
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-neutral-600 to-transparent" />
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-neutral-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
