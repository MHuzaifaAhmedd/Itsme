"use client";

import { PerformanceSecurityData } from "../../types";
import ScrollReveal from "../animations/ScrollReveal";

interface PerformanceSecurityProps {
  data: PerformanceSecurityData;
}

/**
 * Section 9: Performance, Security & Optimization
 * 
 * - Performance considerations
 * - Error handling
 * - Security decisions
 * - Show senior-level thinking
 */
export default function PerformanceSecurity({ data }: PerformanceSecurityProps) {
  const categories = [
    {
      title: "Performance",
      items: data.performance,
      color: "blue",
      icon: "⚡",
    },
    {
      title: "Error Handling",
      items: data.errorHandling,
      color: "yellow",
      icon: "🛡️",
    },
    {
      title: "Security",
      items: data.security,
      color: "green",
      icon: "🔒",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "border-blue-500/30 bg-blue-500/5",
      yellow: "border-yellow-500/30 bg-yellow-500/5",
      green: "border-green-500/30 bg-green-500/5",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 bg-neutral-950 border-t border-neutral-900">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 mb-4">
              Engineering Excellence
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Performance, Security & Resilience
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div
                className={`p-6 md:p-8 border-2 rounded-xl ${getColorClasses(
                  category.color
                )}`}
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-white">
                    {category.title}
                  </h3>
                </div>

                {/* Items */}
                <ul className="space-y-3">
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
