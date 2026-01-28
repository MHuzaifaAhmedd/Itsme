// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lenis from "lenis";

// gsap.registerPlugin(ScrollTrigger);

// export default function Home() {
//   const rootRef = useRef<HTMLDivElement | null>(null);
//   const loaderRef = useRef<HTMLDivElement | null>(null);
//   const loaderLineRef = useRef<HTMLDivElement | null>(null);
//   const loaderTextRef = useRef<HTMLSpanElement | null>(null);
//   const heroRef = useRef<HTMLElement | null>(null);
//   const heroImageRef = useRef<HTMLDivElement | null>(null);
//   const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
//   const headlineRef = useRef<HTMLHeadingElement | null>(null);
//   const subheadRef = useRef<HTMLParagraphElement | null>(null);
//   const metaRef = useRef<HTMLDivElement | null>(null);
//   const ctaRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const root = rootRef.current;
//     if (!root) {
//       return;
//     }

//     const prefersReducedMotion = window.matchMedia(
//       "(prefers-reduced-motion: reduce)",
//     ).matches;

//     document.documentElement.style.overflow = "hidden";

//     const ctx = gsap.context(() => {
//       gsap.set(heroRef.current, { autoAlpha: 0 });
//       gsap.set([eyebrowRef.current, headlineRef.current, subheadRef.current, metaRef.current, ctaRef.current], {
//         y: 24,
//         autoAlpha: 0,
//       });
//       gsap.set(heroImageRef.current, { scale: 1.1, yPercent: 6, autoAlpha: 0 });

//       const progress = { value: 0 };
//       const loaderTimeline = gsap.timeline({
//         defaults: { ease: "power3.out" },
//         onComplete: () => {
//           document.documentElement.style.overflow = "";
//           ScrollTrigger.refresh();
//         },
//       });

//       loaderTimeline
//         .fromTo(
//           loaderLineRef.current,
//           { scaleX: 0 },
//           { scaleX: 1, duration: prefersReducedMotion ? 0.4 : 1.6, ease: "power2.inOut" },
//         )
//         .fromTo(
//           progress,
//           { value: 0 },
//           {
//             value: 100,
//             duration: prefersReducedMotion ? 0.4 : 1.6,
//             ease: "power2.inOut",
//             onUpdate: () => {
//               if (loaderTextRef.current) {
//                 loaderTextRef.current.textContent = `${Math.round(progress.value)}%`;
//               }
//             },
//           },
//           "<",
//         )
//         .to(
//           loaderRef.current,
//           {
//             autoAlpha: 0,
//             duration: prefersReducedMotion ? 0.2 : 0.6,
//             ease: "power2.out",
//           },
//           "+=0.1",
//         )
//         .set(loaderRef.current, { display: "none" })
//         .to(heroRef.current, { autoAlpha: 1, duration: 0.01 })
//         .to(
//           heroImageRef.current,
//           {
//             autoAlpha: 1,
//             scale: 1,
//             duration: prefersReducedMotion ? 0.3 : 1.2,
//             ease: "expo.out",
//           },
//           "<",
//         )
//         .to(
//           [eyebrowRef.current, headlineRef.current, subheadRef.current, metaRef.current, ctaRef.current],
//           {
//             y: 0,
//             autoAlpha: 1,
//             duration: prefersReducedMotion ? 0.2 : 0.8,
//             stagger: prefersReducedMotion ? 0 : 0.08,
//             ease: "power3.out",
//           },
//           "-=0.6",
//         );

//       if (!prefersReducedMotion && heroImageRef.current) {
//         gsap.to(heroImageRef.current, {
//           yPercent: -8,
//           scale: 1.14,
//           ease: "none",
//           scrollTrigger: {
//             trigger: heroRef.current,
//             start: "top top",
//             end: "bottom top",
//             scrub: true,
//           },
//         });
//       }
//     }, root);

//     const lenis = new Lenis({
//       lerp: 0.08,
//       smoothWheel: true,
//       wheelMultiplier: 1,
//     });

//     lenis.on("scroll", ScrollTrigger.update);
//     const raf = (time: number) => {
//       lenis.raf(time * 1000);
//     };
//     gsap.ticker.add(raf);
//     gsap.ticker.lagSmoothing(0);

//     return () => {
//       lenis.destroy();
//       gsap.ticker.remove(raf);
//       ctx.revert();
//       document.documentElement.style.overflow = "";
//     };
//   }, []);

//   return (
//     <div ref={rootRef} className="bg-neutral-950 text-neutral-100">
//       <div
//         ref={loaderRef}
//         className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 text-neutral-200"
//       >
//         <div className="flex w-[min(420px,80vw)] flex-col items-center gap-6">
//           <div className="text-sm uppercase tracking-[0.4em] text-neutral-500">
//             Studio Portfolio
//           </div>
//           <div className="flex w-full flex-col gap-3">
//             <div className="h-px w-full bg-neutral-800">
//               <div
//                 ref={loaderLineRef}
//                 className="h-px origin-left bg-neutral-200"
//                 style={{ transform: "scaleX(0)" }}
//               />
//             </div>
//             <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
//               <span>Loading</span>
//               <span ref={loaderTextRef}>0%</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <main className="relative">
//         <section
//           ref={heroRef}
//           className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20"
//         >
//           <div
//             ref={heroImageRef}
//             className="pointer-events-none absolute inset-0"
//             aria-hidden="true"
//           >
//             <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
//             <div className="absolute inset-0 bg-linear-to-b from-neutral-950/20 via-neutral-950/50 to-neutral-950" />
//           </div>

//           <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-10 text-center">
//             <p
//               ref={eyebrowRef}
//               className="text-xs uppercase tracking-[0.5em] text-neutral-400"
//             >
//               Product designer &amp; engineer
//             </p>
//             <h1
//               ref={headlineRef}
//               className="text-4xl font-semibold leading-tight text-neutral-100 md:text-6xl lg:text-7xl"
//             >
//               Building elegant, high-trust digital experiences for ambitious
//               teams.
//             </h1>
//             <p
//               ref={subheadRef}
//               className="max-w-2xl text-base leading-relaxed text-neutral-300 md:text-lg"
//             >
//               I design and engineer premium web products that feel effortless,
//               cinematic, and commercially grounded — from concept to launch.
//             </p>
//             <div
//               ref={ctaRef}
//               className="flex flex-wrap items-center justify-center gap-4"
//             >
//               <a
//                 className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-600 bg-neutral-50 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-white"
//                 href="#work"
//               >
//                 View selected work
//               </a>
//               <a
//                 className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-700 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition hover:border-neutral-500 hover:text-white"
//                 href="#contact"
//               >
//                 Book a call
//               </a>
//             </div>
//             <div
//               ref={metaRef}
//               className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-500"
//             >
//               <span>New York · Remote friendly</span>
//               <span>Available for Q1 partnerships</span>
//             </div>
//           </div>
//         </section>

//         <section
//           id="work"
//           className="relative z-10 border-t border-neutral-900 bg-neutral-950 px-6 py-24"
//         >
//           <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
//             <div className="flex flex-col gap-4">
//               <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
//                 Selected work
//               </p>
//               <h2 className="text-3xl font-semibold text-neutral-100 md:text-4xl">
//                 Signature projects that blend craft with measurable outcomes.
//               </h2>
//               <p className="max-w-2xl text-neutral-400">
//                 Each engagement is grounded in research, elevated design systems,
//                 and performance-driven engineering. I partner with teams that
//                 want their digital presence to feel quietly iconic.
//               </p>
//             </div>
//             <div className="grid gap-6 md:grid-cols-3">
//               {[
//                 "Luxury wellness platform",
//                 "Fintech onboarding redesign",
//                 "Architectural studio identity",
//               ].map((item) => (
//                 <div
//                   key={item}
//                   className="rounded-3xl border border-neutral-900 bg-neutral-900/40 p-6 text-neutral-300"
//                 >
//                   <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
//                     Case study
//                   </p>
//                   <h3 className="mt-4 text-lg font-medium text-neutral-100">
//                     {item}
//                   </h3>
//                   <p className="mt-3 text-sm text-neutral-400">
//                     Strategy, brand systems, and immersive UI that lifts
//                     conversion and retention.
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section
//           id="contact"
//           className="relative border-t border-neutral-900 bg-neutral-950 px-6 py-20"
//         >
//           <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
//             <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
//               Let’s collaborate
//             </p>
//             <h2 className="text-2xl font-semibold text-neutral-100 md:text-3xl">
//               Ready to craft your next premium release.
//             </h2>
//             <p className="max-w-2xl text-neutral-400">
//               Share a brief about your product, timeline, and goals. I partner
//               with teams that want a calm, confident digital presence.
//             </p>
//             <div className="flex flex-wrap items-center gap-4">
//               <a
//                 className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-600 bg-neutral-50 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-white"
//                 href="mailto:hello@studio.com"
//               >
//                 Start a project
//               </a>
//               <a
//                 className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-700 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition hover:border-neutral-500 hover:text-white"
//                 href="#work"
//               >
//                 View capabilities
//               </a>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Sidebar from "./components/Sidebar";
import AnimatedHeadline, { AnimatedHeadlineRef } from "./components/AnimatedHeadline";
import ScrollIndicator from "./components/ScrollIndicator";
import AboutMe from "./components/AboutMe";
import ProjectCardsLeft from "./components/ProjectCardsLeft";
import TestimonialsSlider from "./components/TestimonialsSlider";
import CollaborateCTA from "./components/CollaborateCTA";
import { createSlug } from "./utils/slug";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loaderLineRef = useRef<HTMLDivElement | null>(null);
  const loaderTextRef = useRef<HTMLSpanElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const animatedHeadlineRef = useRef<AnimatedHeadlineRef | null>(null);
  const animatedHeadlineContainerRef = useRef<HTMLDivElement | null>(null);
  const mainWrapperRef = useRef<HTMLDivElement | null>(null);
  const projectsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const skipLoader = (() => {
      try {
        const v = window.sessionStorage.getItem("skipHomeLoader") === "1";
        if (v) window.sessionStorage.removeItem("skipHomeLoader");
        return v;
      } catch {
        return false;
      }
    })();

    // CRITICAL: Always reset scroll position to top on mount/reload
    // This ensures the loading animation always starts from the beginning
    // Award-winning sites always reset scroll on page load for consistent UX
    window.history.scrollRestoration = 'manual';
    
    // Immediate scroll reset - before anything else
    const forceScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Also set via style to override any browser behavior
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    };

    // Remove hash from URL to prevent browser auto-scroll to anchors
    // This ensures page always starts from top regardless of URL hash
    if (window.location.hash && !skipLoader) {
      // Only clear hash if we're showing the loader (fresh page load/reload)
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    
    // Force scroll to top immediately
    forceScrollToTop();

    // Force again after a brief delay to override browser scroll restoration
    // This handles cases where browser tries to restore scroll after component mount
    setTimeout(forceScrollToTop, 0);
    setTimeout(forceScrollToTop, 10);
    setTimeout(forceScrollToTop, 50);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.documentElement.style.overflow = skipLoader ? "" : "hidden";
    
    // Lock scroll position at top during loading
    if (!skipLoader) {
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    }

    const ctx = gsap.context(() => {
      if (skipLoader) {
        // Skip loader when returning from Case Study.
        gsap.set(loaderRef.current, { autoAlpha: 0, display: "none" });
        gsap.set(heroRef.current, { autoAlpha: 1 });
        gsap.set([eyebrowRef.current, headlineRef.current, ctaRef.current], {
          y: 0,
          autoAlpha: 1,
        });
        gsap.set(heroImageRef.current, {
          scale: 1.1,
          yPercent: 8,
          autoAlpha: 1,
        });
        // If no hash, ensure we're at the top
        if (!window.location.hash) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      } else {
        // Initial states
        gsap.set(heroRef.current, { autoAlpha: 0 });
        gsap.set([eyebrowRef.current, headlineRef.current, ctaRef.current], {
          y: 24,
          autoAlpha: 0,
        });
        gsap.set(heroImageRef.current, {
          scale: 1.1, // Slightly zoomed in - starting state for scroll animation
          yPercent: 8, // Positioned lower than center - starting state for scroll animation
          autoAlpha: 0,
        });

        const progress = { value: 0 };
        const loaderTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            // Remove fixed positioning and restore normal scroll
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = "";
            
            // Force scroll to top after loading animation completes
            // This ensures we're at the top before revealing content
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            if (document.scrollingElement) {
              document.scrollingElement.scrollTop = 0;
            }
            
            ScrollTrigger.refresh();
          },
        });

        loaderTimeline
          .fromTo(
            loaderLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: prefersReducedMotion ? 0.4 : 1.6,
              ease: "power2.inOut",
            },
          )
          .fromTo(
            progress,
            { value: 0 },
            {
              value: 100,
              duration: prefersReducedMotion ? 0.4 : 1.6,
              ease: "power2.inOut",
              onUpdate: () => {
                if (loaderTextRef.current) {
                  loaderTextRef.current.textContent = `${Math.round(progress.value)}%`;
                }
              },
            },
            "<",
          )
          .to(
            loaderRef.current,
            {
              autoAlpha: 0,
              duration: prefersReducedMotion ? 0.2 : 0.6,
              ease: "power2.out",
            },
            "+=0.1",
          )
          .set(loaderRef.current, { display: "none" })
          .to(heroRef.current, { autoAlpha: 1, duration: 0.01 })
          .to(
            heroImageRef.current,
            {
              autoAlpha: 1,
              // Keep initial scroll animation state (scale: 1.1, yPercent: 8)
              // Don't change these as they are the starting point for scroll animation
              duration: prefersReducedMotion ? 0.3 : 1.2,
              ease: "expo.out",
            },
            "<",
          )
          .to(
            [eyebrowRef.current, headlineRef.current, ctaRef.current],
            {
              y: 0,
              autoAlpha: 1,
              duration: prefersReducedMotion ? 0.2 : 0.8,
              stagger: prefersReducedMotion ? 0 : 0.08,
              ease: "power3.out",
            },
            "-=0.6",
          );
      }

      // ===== CINEMATIC SCROLL-BASED PARALLAX ANIMATION =====
      // Background image must move visibly on scroll - not on load
      if (!prefersReducedMotion && heroImageRef.current && heroRef.current) {
        // Set initial state explicitly to ensure consistent starting point
        gsap.set(heroImageRef.current, {
          scale: 1.1,
          yPercent: 8,
          force3D: true,
        });

        // Scroll-driven animation: image moves upward and scales as user scrolls
        gsap.fromTo(
          heroImageRef.current,
          {
            // Starting state when hero enters viewport: zoomed in and positioned lower
            scale: 1.1,
            yPercent: 8,
          },
          {
            // Ending state when hero leaves viewport: moved upward (parallax) and scaled more
            scale: 1.25,
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          }
        );
      }

      // ===== ANIMATED HEADLINE SCROLL TRIGGER =====
      // Trigger the animated headline when it comes into view
      if (!prefersReducedMotion && animatedHeadlineContainerRef.current) {
        ScrollTrigger.create({
          trigger: animatedHeadlineContainerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            if (animatedHeadlineRef.current) {
              animatedHeadlineRef.current.startAnimation();
            }
          },
        });
      }
    }, root);

    // ===== LENIS SMOOTH SCROLL SETUP WITH GSAP =====
    // Optimized for mouse smoothness using GSAP ticker
    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          lerp: 0.1, // Smooth interpolation for mouse movements (0.1 = very smooth, lower = smoother)
          duration: 1.2, // Animation duration for smooth transitions
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for natural feel
          smoothWheel: true, // Enable smooth mouse wheel scrolling
          wheelMultiplier: 0.8, // Reduced multiplier for smoother, more controlled mouse scrolling
          touchMultiplier: 1.5, // Touch device multiplier
          infinite: false,
        });

    // Enhanced GSAP integration for perfect mouse smoothness
    let rafFunction: ((time: number) => void) | null = null;
    if (lenis) {
      // Update ScrollTrigger on every scroll frame for smooth animations
      lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      // Use GSAP's ticker for frame-perfect synchronization
      // This ensures Lenis runs on the same frame as GSAP animations
      rafFunction = (time: number) => {
        lenis.raf(time * 1000); // Convert GSAP time to milliseconds
      };
      
      // Add to GSAP ticker for synchronized updates
      // This creates perfect sync between Lenis smooth scroll and GSAP animations
      gsap.ticker.add(rafFunction);
      
      // Disable lag smoothing for immediate response to mouse input
      // This ensures mouse movements are processed immediately without delay
      gsap.ticker.lagSmoothing(0);
    }

    // If we returned from Case Study, land at the correct section immediately.
    if (skipLoader) {
      const scrollTarget = () => {
        const hash = window.location.hash;
        if (hash) {
          const el = document.querySelector(hash) as HTMLElement | null;
          if (el) {
            if (lenis) {
              // Lenis-controlled instant jump (no animation)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (lenis as any).scrollTo(el, { immediate: true });
            } else {
              el.scrollIntoView({ behavior: "auto", block: "start" });
            }
          }
        }
      };
      requestAnimationFrame(() => {
        scrollTarget();
        ScrollTrigger.refresh();
      });
    }

    // Handle resize for stability
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        if (lenis) {
          lenis.resize();
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // Refresh ScrollTrigger after Lenis is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (lenis) {
        lenis.destroy();
        if (rafFunction) {
          gsap.ticker.remove(rafFunction);
        }
      }
      ctx.revert();
      // Clean up body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = "";
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // Restore default scroll restoration behavior on cleanup
      window.history.scrollRestoration = 'auto';
    };
  }, []);

  return (
    <div ref={rootRef} className="bg-neutral-950 text-neutral-100">
      <Sidebar contentRef={mainWrapperRef} />
      <div
        ref={loaderRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950 text-neutral-200"
      >
        <div className="flex w-[min(420px,80vw)] flex-col items-center gap-6">
          <div className="text-sm uppercase tracking-[0.4em] text-neutral-500">
            Studio Portfolio
          </div>
          <div className="flex w-full flex-col gap-3">
            <div className="h-px w-full bg-neutral-800">
              <div
                ref={loaderLineRef}
                className="h-px origin-left bg-neutral-200"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
              <span>Loading</span>
              <span ref={loaderTextRef}>0%</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={mainWrapperRef}
        className="relative origin-center will-change-transform"
      >
      <main className="relative">
        <section
          id="home"
          ref={heroRef}
          className="relative flex min-h-[200vh] items-start justify-start overflow-hidden px-6 py-20"
        >
          <div
            ref={heroImageRef}
            className="pointer-events-none absolute inset-0 will-change-transform"
            aria-hidden="true"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center bg-no-repeat"
                style={{
                  imageRendering: "auto",
                  backfaceVisibility: "hidden",
                  transform: "translate3d(0,0,0)"
                }}
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-neutral-950/30 to-neutral-950/85" />
            </div>
          </div>

          {/* Main content - positioned on left, above center */}
          <div className="relative z-10 flex w-full max-w-6xl flex-col items-start gap-10 text-left pt-[52vh] pl-2 md:pl-4 lg:pl-0">
            <p
              ref={eyebrowRef}
              className="text-xs uppercase tracking-[0.5em] text-neutral-400"
            >
              Product designer &amp; engineer
            </p>
            <h1
              ref={headlineRef}
              className="text-4xl font-semibold leading-tight text-neutral-100 md:text-6xl lg:text-7xl"
            >
              Building Experiences, Not Just Interfaces.
            </h1>
            <div
              ref={ctaRef}
              className="flex flex-wrap items-center justify-start gap-4"
            >
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-600 bg-neutral-50 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-white"
                href="#projects"
              >
                View projects
              </a>
              <a
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-700 px-7 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition hover:border-neutral-500 hover:text-white"
                href="#footer"
              >
                Get in touch
              </a>
            </div>
          </div>

          {/* Animated headline on right side - appears after scrolling past hero content */}
          <div
            ref={animatedHeadlineContainerRef}
            className="absolute right-6 md:right-12 lg:right-20 top-[140vh] z-10"
          >
            <AnimatedHeadline 
              ref={animatedHeadlineRef} 
              text="Engineering Digital Experiences"
              subtitle="Crafting seamless, scalable, and user-centered digital solutions that drive results."
            />
          </div>

          {/* Scroll indicator with unique animation */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-[10vh]">
            <ScrollIndicator />
          </div>
        </section>

        <AboutMe />

        {/* Projects Section */}
        <section
          ref={projectsSectionRef}
          id="projects"
          className="relative z-10 min-h-[300vh] border-t border-neutral-900 bg-neutral-950"
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            <div className="relative flex w-full h-full flex-col gap-12 py-24 pl-4 pr-4 md:flex-row md:items-center md:justify-between md:gap-16 lg:gap-20 md:pl-6 md:pr-6 lg:pl-12 lg:pr-12">
              {/* Left Column - Stacking project cards (scroll‑animated) */}
              <div className="hidden md:flex md:flex-[0.85] lg:flex-[0.9] md:items-center md:justify-center">
                <ProjectCardsLeft sectionRef={projectsSectionRef} />
              </div>

              {/* Right Column - Text Content */}
              <div className="flex flex-1 flex-col gap-6 md:max-w-[65ch] md:flex-[0.48] lg:flex-[0.45]">
                {/* Section Label */}
                <p className="text-xs uppercase tracking-[0.5em] text-neutral-500 opacity-60 text-left">
                  Projects
                </p>

                {/* Headline */}
                <h2 className="text-left text-4xl font-semibold leading-[1.1] text-neutral-100 md:text-5xl lg:text-6xl">
                  Signature projects that blend craft with measurable outcomes.
                </h2>

                {/* Body Paragraph */}
                <p className="text-left max-w-[60ch] text-base leading-relaxed text-neutral-300 md:text-lg -mt-2">
                  Each engagement is grounded in research, elevated design systems,
                  and performance-driven engineering. I partner with teams that
                  want their digital presence to feel quietly iconic.
                </p>

                {/* Projects Grid */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-4">
                  {[
                    {
                      name: "Employee Management System",
                      description: "Comprehensive system for managing employee data, attendance, and organizational workflows.",
                    },
                    {
                      name: "Sharaf ul Quran",
                      description: "Digital platform for Quranic learning and spiritual guidance.",
                    },
                    {
                      name: "Whatsapp funnel (Lead Management system)",
                      description: "Automated lead generation and management system integrated with WhatsApp messaging.",
                    },
                    {
                      name: "Naba Hussam",
                      description: "Ecommerce platform specializing in women's clothing with elegant design and seamless shopping experience.",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="rounded-3xl border border-neutral-900 bg-neutral-900/40 p-6 text-neutral-300 flex flex-col"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                        Case study
                      </p>
                      <h3 className="mt-3 text-base font-medium text-neutral-100">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs text-neutral-400 flex-1">
                        {item.description}
                      </p>
                      <Link
                        href={`/case-study/${createSlug(item.name)}`}
                        className="mt-4 w-fit px-4 py-2 text-xs font-medium text-neutral-100 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 rounded-lg transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="relative z-10 overflow-x-hidden border-t border-neutral-900 bg-neutral-950 py-24 pl-4 pr-4 md:pl-6 md:pr-6 lg:pl-12 lg:pr-12"
        >
          <div className="mr-auto flex w-full max-w-5xl flex-col gap-10">
            <div className="flex flex-col gap-4 text-left">
              <p className="text-xs uppercase tracking-[0.5em] text-neutral-500">
                Testimonials
              </p>
              <h2 className="whitespace-nowrap text-4xl font-semibold text-neutral-100 md:text-5xl lg:text-6xl leading-[1.1]">
                What clients say about working together.
              </h2>
              <p className="max-w-2xl text-base text-neutral-400 md:text-lg leading-relaxed">
                Trusted by teams who value exceptional design and seamless execution.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <TestimonialsSlider />
          </div>
        </section>

        {/* Collaborate CTA Section */}
        <CollaborateCTA className="border-t border-neutral-900" />

        {/* Footer */}
        <footer
          id="footer"
          className="relative border-t border-neutral-900 bg-neutral-950 px-6 py-12"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
            <p className="text-sm text-neutral-500">
              © 2024 Portfolio Studio. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 hover:text-neutral-300"
              >
                GitHub
              </a>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-200 hover:text-neutral-300"
              >
                LinkedIn
              </a>
              <span className="h-1 w-1 rounded-full bg-neutral-700" />
              <a
                href="mailto:hello@studio.com"
                className="transition duration-200 hover:text-neutral-300"
              >
                Email
              </a>
            </div>
          </div>
        </footer>
      </main>
      </div>
    </div>
  );
}