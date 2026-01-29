"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TESTIMONIALS = [
  {
    quote:
      "Exceptional attention to detail and a deep understanding of user experience. The final product exceeded all expectations.",
    author: "Sarah Chen",
    role: "Product Lead, TechCorp",
  },
  {
    quote:
      "Working together was seamless. The design process was collaborative, and the results speak for themselves.",
    author: "Michael Rodriguez",
    role: "Founder, StartupXYZ",
  },
  {
    quote:
      "A rare combination of aesthetic sensibility and technical rigor. Delivered on time and above expectations.",
    author: "Elena Vassiliev",
    role: "CDO, Atelier Studio",
  },
  {
    quote:
      "From concept to launch, every step felt intentional. The team still references our project as a benchmark.",
    author: "James Okonkwo",
    role: "Head of Product, FinFlow",
  },
];

// Responsive card widths and gaps
const MOBILE_CARD_WIDTH = 260;
const MOBILE_GAP = 12;
const TABLET_CARD_WIDTH = 300;
const TABLET_GAP = 16;
const DESKTOP_CARD_WIDTH = 400;
const DESKTOP_GAP = 24;

export default function TestimonialsSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculate total width of one set of cards for each breakpoint
  const mobileSetWidth = TESTIMONIALS.length * (MOBILE_CARD_WIDTH + MOBILE_GAP);
  const tabletSetWidth = TESTIMONIALS.length * (TABLET_CARD_WIDTH + TABLET_GAP);
  const desktopSetWidth = TESTIMONIALS.length * (DESKTOP_CARD_WIDTH + DESKTOP_GAP);

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  }, []);

  const handleCardEnter = useCallback((index: number) => {
    setIsPaused(true);
    setHoveredIndex(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    setIsPaused(false);
    setHoveredIndex(null);
  }, []);

  // Triple the testimonials for seamless infinite loop
  const tripled = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden">
      {/* CSS Keyframes for smooth infinite scroll - responsive */}
      <style jsx>{`
        /* Mobile (default) */
        @keyframes scroll-left-mobile {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${mobileSetWidth}px);
          }
        }
        
        /* Tablet */
        @keyframes scroll-left-tablet {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${tabletSetWidth}px);
          }
        }
        
        /* Desktop */
        @keyframes scroll-left-desktop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${desktopSetWidth}px);
          }
        }
        
        .testimonial-track {
          animation: scroll-left-mobile 30s linear infinite;
          will-change: transform;
          gap: ${MOBILE_GAP}px;
        }
        
        @media (min-width: 640px) {
          .testimonial-track {
            animation: scroll-left-tablet 35s linear infinite;
            gap: ${TABLET_GAP}px;
          }
        }
        
        @media (min-width: 768px) {
          .testimonial-track {
            animation: scroll-left-desktop 40s linear infinite;
            gap: ${DESKTOP_GAP}px;
          }
        }
        
        .testimonial-track:hover,
        .testimonial-track.paused {
          animation-play-state: paused;
        }
        
        /* Card responsive styles */
        .testimonial-card {
          min-width: ${MOBILE_CARD_WIDTH}px;
          width: ${MOBILE_CARD_WIDTH}px;
          padding: 1rem 1rem;
        }
        
        @media (min-width: 640px) {
          .testimonial-card {
            min-width: ${TABLET_CARD_WIDTH}px;
            width: ${TABLET_CARD_WIDTH}px;
            padding: 1.25rem;
          }
        }
        
        @media (min-width: 768px) {
          .testimonial-card {
            min-width: ${DESKTOP_CARD_WIDTH}px;
            width: ${DESKTOP_CARD_WIDTH}px;
            padding: 2rem;
          }
        }
      `}</style>
      
      <div
        ref={trackRef}
        className={`testimonial-track flex flex-nowrap items-stretch py-2 ${isPaused ? 'paused' : ''}`}
        style={{
          width: "max-content",
        }}
      >
        {tripled.map((t, i) => (
          <div
            key={i}
            className="testimonial-card shrink-0 rounded-xl sm:rounded-2xl md:rounded-3xl border border-neutral-800/60 bg-neutral-900/50 text-neutral-300"
            style={{
              transform: hoveredIndex === i ? 'scale(1.03)' : 'scale(1)',
              boxShadow: hoveredIndex === i 
                ? '0 25px 50px -12px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)' 
                : 'none',
              transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
            }}
            onMouseEnter={() => handleCardEnter(i)}
            onMouseLeave={handleCardLeave}
          >
            <p className="mb-3 sm:mb-4 md:mb-6 text-[13px] sm:text-sm md:text-lg leading-normal sm:leading-relaxed text-neutral-300 md:text-neutral-200">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs sm:text-sm md:text-base font-medium text-neutral-100">{t.author}</span>
              <span className="text-[11px] sm:text-xs md:text-sm text-neutral-500">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
