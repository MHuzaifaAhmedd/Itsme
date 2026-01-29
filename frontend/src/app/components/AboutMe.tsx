"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AboutMeProps {
  className?: string;
}

export default function AboutMe({ className = "" }: AboutMeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineLinesRef = useRef<HTMLSpanElement[]>([]);
  const headlineWordsRef = useRef<HTMLSpanElement[]>([]);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listItemsRef = useRef<HTMLLIElement[]>([]);
  const listItemTextsRef = useRef<HTMLSpanElement[]>([]);
  const visualRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    prefersReducedMotionRef.current = prefersReducedMotion;

    // Find next section for exit transition
    const nextSection = section.nextElementSibling as HTMLElement;
    if (nextSection) {
      nextSectionRef.current = nextSection;
    }

    // Split headline into lines (desktop) or words (mobile)
    const headline = headlineRef.current;
    if (headline) {
      const isMobile = window.innerWidth < 768;
      const text = headline.textContent || "";
      
      if (prefersReducedMotion) {
        // No splitting for reduced motion
        headline.style.opacity = "1";
      } else {
        // Clear existing content
        headline.innerHTML = "";
        
        if (isMobile) {
          // Word-based split for mobile
          const words = text.split(" ");
          words.forEach((word, index) => {
            const span = document.createElement("span");
            span.textContent = word;
            span.style.display = "inline-block";
            span.style.opacity = "0";
            span.style.transform = "translateY(8px)";
            // Add margin-right for spacing between words (except last word)
            if (index < words.length - 1) {
              span.style.marginRight = "0.3em";
            }
            headline.appendChild(span);
            headlineWordsRef.current.push(span);
          });
        } else {
          // Line-based split for desktop - target 2 intentional lines
          // Manual split for optimal visual balance
          // "Crafting digital experiences with precision and purpose." (9 words)
          // Line 1 (slightly wider): "Crafting digital experiences with" (5 words)
          // Line 2 (slightly shorter): "precision and purpose." (4 words)
          const words = text.split(" ");
          const lines: string[] = [];
          
          // Intentional split: first line ~56%, second line ~44% for optical balance
          const splitPoint = 5; // Manual control: first 5 words, rest in second line
          const firstLine = words.slice(0, splitPoint).join(" ");
          const secondLine = words.slice(splitPoint).join(" ");
          lines.push(firstLine, secondLine);
          
          lines.forEach((line) => {
            const lineSpan = document.createElement("span");
            lineSpan.style.display = "block";
            lineSpan.style.width = "fit-content";
            lineSpan.style.maxWidth = "100%";
            lineSpan.style.opacity = "0";
            lineSpan.style.transform = "translateY(8px)";
            lineSpan.textContent = line;
            headline.appendChild(lineSpan);
            headlineLinesRef.current.push(lineSpan);
          });
        }
        
        // Set initial states for split elements
        if (!prefersReducedMotion) {
          if (headlineLinesRef.current.length > 0) {
            gsap.set(headlineLinesRef.current, {
              opacity: 0,
              y: 8,
            });
          } else if (headlineWordsRef.current.length > 0) {
            gsap.set(headlineWordsRef.current, {
              opacity: 0,
              y: 8,
            });
          }
        }
      }
    }

    // Set initial states
    gsap.set(containerRef.current, {
      opacity: 0,
      y: 12,
    });
    
    gsap.set([labelRef.current, bodyRef.current], {
      opacity: 0,
      y: 8,
    });

    if (!prefersReducedMotion) {
      gsap.set(visualRef.current, {
        scale: 0.96,
        opacity: 0,
      });
    } else {
      gsap.set(visualRef.current, {
        opacity: 0,
        y: 12,
      });
    }

    const ctx = gsap.context(() => {
      // 1️⃣ SECTION ENTRY (MASTER TIMELINE)
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      // Section container entry
      masterTimeline.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: prefersReducedMotion ? 0.4 : 0.8,
        ease: "power2.out",
      });

      // 2️⃣ STAGGERED TEXT REVEAL
      if (!prefersReducedMotion) {
        // Section label
        masterTimeline.to(
          labelRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "+=0.1"
        );

        // Headline reveal
        if (headlineLinesRef.current.length > 0) {
          // Desktop: line-by-line
          masterTimeline.to(
            headlineLinesRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
            },
            "+=0.1"
          );
        } else if (headlineWordsRef.current.length > 0) {
          // Mobile: word-by-word
          masterTimeline.to(
            headlineWordsRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
            },
            "+=0.1"
          );
        } else {
          // Fallback: entire headline
          masterTimeline.to(
            headlineRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "+=0.1"
          );
        }

        // Body paragraph
        masterTimeline.to(
          bodyRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "+=0.12"
        );

        // Principles list animation
        // Get list items and text spans directly from DOM to ensure they exist
        const listItems = Array.from(listRef.current?.children || []) as HTMLElement[];
        const textSpans: HTMLSpanElement[] = [];
        
        listItems.forEach((li) => {
          const textSpan = li.querySelector('span:last-child') as HTMLSpanElement;
          if (textSpan) {
            textSpans.push(textSpan);
          }
        });

        const isMobileView = window.innerWidth < 768;

        if (listItems.length > 0) {
          if (isMobileView) {
            // MOBILE: Simple staggered fade-in with slide animation (no typewriter)
            // Set initial state for list items on mobile
            gsap.set(listItems, { opacity: 0, x: -20 });
            
            masterTimeline.to(
              listItems,
              {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.12,
                ease: "power2.out",
              },
              "+=0.1"
            );
          } else if (textSpans.length > 0) {
            // DESKTOP: Typewriter effect
            // Store original texts before clearing
            const originalTexts = textSpans.map((span) => span?.textContent || "");
            
            // Clear all texts initially (for typewriter effect)
            textSpans.forEach((textSpan) => {
              if (textSpan) {
                textSpan.textContent = "";
              }
            });

            // Animate list items container first (fade in with bullet points)
            masterTimeline.to(
              listItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.out",
              },
              "+=0.12"
            );

            // Typewriter effect for each text - sequential (one after another)
            const charDelay = 0.01; // Delay between each character (very fast)
            const itemDelay = 0.1; // Delay before starting next item
            
            // Calculate start time for typewriter (after list items fade in)
            const typewriterStartTime = masterTimeline.duration();
            
            originalTexts.forEach((fullText, index) => {
              const textSpan = textSpans[index];
              if (!textSpan || !fullText) return;

              const chars = fullText.split("");
              
              // Calculate when this item should start typing
              let itemStartTime = typewriterStartTime;
              if (index > 0) {
                // Sum up all previous items' typing durations
                for (let i = 0; i < index; i++) {
                  const prevText = originalTexts[i];
                  if (prevText) {
                    itemStartTime += prevText.length * charDelay + itemDelay;
                  }
                }
              }

              // Type each character for this item
              chars.forEach((_, charIndex) => {
                masterTimeline.call(
                  () => {
                    if (textSpan) {
                      textSpan.textContent = fullText.slice(0, charIndex + 1);
                    }
                  },
                  undefined,
                  itemStartTime + charIndex * charDelay
                );
              });
            });
          } else {
            // Fallback: just fade in without typewriter
            masterTimeline.to(
              listItems,
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              },
              "+=0.12"
            );
          }
        }

        // 4️⃣ VISUAL ANCHOR ANIMATION (after headline)
        masterTimeline.to(
          visualRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.8"
        );
      } else {
        // Reduced motion: simple fade in
        masterTimeline.to(
          [labelRef.current, headlineRef.current, bodyRef.current, visualRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "+=0.1"
        );
        
        // For reduced motion, just fade in list items without typewriter
        if (listItemsRef.current.length > 0) {
          masterTimeline.to(
            listItemsRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
            },
            "+=0.1"
          );
        }
      }

      // 5️⃣ SCROLL-BASED PARALLAX (VERY SUBTLE)
      if (!prefersReducedMotion && visualRef.current) {
        gsap.to(visualRef.current, {
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 7️⃣ EXIT TRANSITION (APPROACHING NEXT SECTION)
      if (!prefersReducedMotion && nextSectionRef.current) {
        ScrollTrigger.create({
          trigger: nextSectionRef.current,
          start: "top 90%",
          onEnter: () => {
            gsap.to([labelRef.current, headlineRef.current, bodyRef.current, listRef.current], {
              opacity: 0.85,
              duration: 0.6,
              ease: "power1.out",
            });
            gsap.to(visualRef.current, {
              y: 10,
              duration: 0.6,
              ease: "power1.out",
            });
          },
        });
      }
    }, section);

    // Handle resize for responsive text splitting
    const handleResize = () => {
      if (prefersReducedMotion) return;
      
      // Refresh ScrollTrigger on resize
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative z-10 min-h-fit md:min-h-screen border-t border-neutral-900 bg-neutral-950 overflow-hidden ${className}`}
    >
      <div
        ref={containerRef}
        className="relative flex w-full flex-col gap-6 py-12 px-4 
                   xs:gap-6 xs:py-14 xs:px-5
                   sm:gap-8 sm:py-16 sm:px-6
                   md:flex-row md:items-center md:gap-16 md:py-24 md:px-6 
                   lg:gap-20 lg:px-12"
      >
        {/* Left Column - Text Content (~45%) */}
        <div className="flex flex-1 flex-col gap-4 xs:gap-5 sm:gap-6 md:max-w-[70ch] md:flex-[0.45]">
          {/* Section Label */}
          <p
            ref={labelRef}
            className="text-[10px] xs:text-xs uppercase tracking-[0.4em] xs:tracking-[0.5em] text-neutral-500 opacity-60 text-left"
          >
            About
          </p>

          {/* Headline - Responsive text sizes for all mobile devices */}
          <h2
            ref={headlineRef}
            className="text-left text-2xl font-semibold leading-[1.15] text-neutral-100 
                       xs:text-3xl xs:leading-[1.12]
                       sm:text-4xl sm:leading-[1.1]
                       md:text-5xl 
                       lg:text-6xl"
          >
            Crafting digital experiences with precision and purpose.
          </h2>

          {/* Body Paragraph - Tighter spacing (tight hierarchy) */}
          <p
            ref={bodyRef}
            className="text-left max-w-[60ch] text-sm leading-relaxed text-neutral-300 
                       xs:text-base 
                       sm:text-base 
                       md:text-lg 
                       -mt-1 xs:-mt-1.5 sm:-mt-2"
          >
            With a focus on elegant design and performance-driven engineering,
            I create digital products that resonate with users and deliver
            measurable business outcomes. Every project is an opportunity to
            push boundaries and set new standards.
          </p>

          {/* Principles List - Compact and secondary */}
          <ul
            ref={listRef}
            className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 text-neutral-400"
          >
            {[
              "User-centered design thinking",
              "Performance-first development",
              "Iterative refinement process",
              "Collaborative partnership approach",
            ].map((item, index) => (
              <li
                key={index}
                ref={(el) => {
                  if (el) {
                    listItemsRef.current[index] = el;
                    // Initial state is set in useEffect based on device type
                    // Desktop: opacity 0, y: 8 (for typewriter effect)
                    // Mobile: opacity 0, x: -20 (for slide-in effect)
                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                    if (!prefersReducedMotionRef.current) {
                      if (isMobile) {
                        gsap.set(el, { opacity: 0, x: -20 });
                      } else {
                        gsap.set(el, { opacity: 0, y: 8 });
                      }
                    }
                  }
                }}
                className="flex items-start gap-2 xs:gap-2.5 sm:gap-3"
              >
                <span className="mt-1.5 h-1 w-1 xs:h-1.5 xs:w-1.5 shrink-0 rounded-full bg-neutral-500" />
                <span
                  ref={(el) => {
                    if (el) {
                      listItemTextsRef.current[index] = el;
                    }
                  }}
                  className="text-xs leading-relaxed xs:text-sm sm:text-sm md:text-base"
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Visual Anchor (~55%, full-bleed right) */}
        <div className="relative w-full mt-2 xs:mt-3 sm:mt-4 md:mt-0
                        md:sticky md:top-24 md:flex-[0.55] md:ml-16
                        lg:flex-[0.6] lg:ml-32">
          <div
            ref={visualRef}
            className="relative overflow-hidden bg-neutral-900/80 shadow-2xl 
                       rounded-xl sm:rounded-2xl md:rounded-lg
                       aspect-4/3 xs:aspect-4/3 sm:aspect-16/10
                       md:aspect-auto md:h-[70vh]
                       w-full"
            style={{
              willChange: 'transform',
            }}
          >
            {/* Image */}
            <Image 
              src="/images/about.jpeg" 
              alt="About me" 
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 55vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
