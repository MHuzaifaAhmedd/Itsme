"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DataFlowData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

gsap.registerPlugin(ScrollTrigger);

interface DataFlowProps {
  data: DataFlowData;
}

/**
 * Section 6: Data Flow Diagram
 * 
 * - Input → processing → output → storage
 * - Emphasis on how data moves
 * - Animated arrows or indicators synced with scroll
 */
export default function DataFlow({ data }: DataFlowProps) {
  const flowRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const arrowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const flow = flowRef.current;
    const steps = stepsRef.current.filter(Boolean);
    const arrows = arrowsRef.current.filter(Boolean);
    if (!flow || steps.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set([steps, arrows], { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(steps, { opacity: 0, scale: 0.9 });
    gsap.set(arrows, { opacity: 0, scaleX: 0 });

    const trigger = ScrollTrigger.create({
      trigger: flow,
      start: "top 75%",
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        
        steps.forEach((step, i) => {
          tl.to(
            step,
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.2)",
            },
            i * 0.3
          );

          if (i < arrows.length) {
            tl.to(
              arrows[i],
              {
                opacity: 1,
                scaleX: 1,
                duration: 0.4,
                ease: "power2.out",
              },
              i * 0.3 + 0.2
            );
          }
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [data.steps.length]);

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Data Flow
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              How Data Moves
            </h2>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {data.description}
            </p>
          </div>
        </ScrollReveal>

        {/* Data Flow Visualization */}
        <div
          ref={flowRef}
          className="flex flex-col md:flex-row items-center justify-center gap-4 py-8"
        >
          {data.steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4">
              {/* Step */}
              <div
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className="relative p-6 md:p-8 border-2 border-neutral-700 rounded-xl bg-neutral-900/50 backdrop-blur-sm min-w-[200px] md:min-w-[240px]"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-500 border-4 border-neutral-950 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{i + 1}</span>
                </div>
                <div className="text-sm uppercase tracking-wider text-neutral-400 mb-2">
                  {step.label}
                </div>
                <div className="text-base text-neutral-300 leading-relaxed">
                  {step.description}
                </div>
              </div>

              {/* Arrow */}
              {i < data.steps.length - 1 && (
                <div
                  ref={(el) => {
                    arrowsRef.current[i] = el;
                  }}
                  className="hidden md:flex items-center"
                >
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />
                  <div className="w-0 h-0 border-l-[8px] border-l-blue-400 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
