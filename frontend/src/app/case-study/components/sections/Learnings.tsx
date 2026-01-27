"use client";

import { LearningsData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface LearningsProps {
  data: LearningsData;
}

/**
 * Section 12: Learnings & Takeaways
 * 
 * - Technical learnings
 * - Architectural insights
 * - What I would improve next time
 */
export default function Learnings({ data }: LearningsProps) {
  const categories = [
    {
      title: "Technical Learnings",
      items: data.technical,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Architectural Insights",
      items: data.architectural,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
    },
    {
      title: "What I'd Improve",
      items: data.improvements,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Reflections
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Key Learnings
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div
                className={`p-6 md:p-8 border-2 rounded-xl ${category.bgColor} ${category.borderColor}`}
              >
                <h3 className={`text-xl font-semibold ${category.color} mb-6`}>
                  {category.title}
                </h3>
                <ul className="space-y-4">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-neutral-300 text-sm leading-relaxed">
                      <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
