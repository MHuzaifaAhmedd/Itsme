// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const PROJECTS = [
//   {
//     name: "Luxury wellness platform",
//     image: "/images/project1.jpg",
//     line: "Strategy, brand systems, and immersive UI that lifts conversion.",
//   },
//   {
//     name: "Fintech onboarding redesign",
//     image: "/images/proejct2.jpg",
//     line: "Streamlined flows and trust-driven design for higher completion.",
//   },
//   {
//     name: "Architectural studio identity",
//     image: "/images/project3.jpg",
//     line: "Quietly iconic digital presence that reflects craft and scale.",
//   },
//   {
//     name: "SaaS dashboard & analytics",
//     image: "/images/project4.jpg",
//     line: "Data clarity and actionable insights through elegant interfaces.",
//   },
// ];

// const STACK_OFFSET_REM = 3;

// export default function ProjectCardsLeft({
//   sectionRef,
// }: {
//   sectionRef: React.RefObject<HTMLElement | null>;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const stackRef = useRef<HTMLDivElement>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const prefersReducedMotionRef = useRef(false);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const stack = stackRef.current;
//     const cards = cardRefs.current.filter(Boolean);
//     if (!section || !stack || cards.length === 0) return;

//     prefersReducedMotionRef.current = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const reduced = prefersReducedMotionRef.current;

//     gsap.set(cards, {
//       y: "100%",
//       opacity: 0,
//     });

//     const ctx = gsap.context(() => {
//       if (reduced) {
//         const tl = gsap.timeline({
//           scrollTrigger: { trigger: section, start: "top 80%", once: true },
//         });
//         cards.forEach((card, i) => {
//           tl.to(
//             card,
//             { y: "0%", opacity: 1, duration: 0.35, ease: "power2.out" },
//             i * 0.08
//           );
//         });
//       } else {
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top 75%",
//             end: "bottom 15%",
//             scrub: 1.2,
//           },
//         });
//         cards.forEach((card, i) => {
//           tl.to(
//             card,
//             {
//               y: "0%",
//               opacity: 1,
//               duration: 0.2,
//               ease: "power2.out",
//             },
//             i * 0.22
//           );
//         });
//       }
//     }, stack);

//     return () => ctx.revert();
//   }, [sectionRef]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative flex flex-1 items-center justify-end w-full h-[45vh] md:h-[58vh] md:flex-[0.52] lg:flex-[0.55] md:mr-12 lg:mr-24 md:w-auto md:max-w-[50%]"
//     >
//       <div
//         ref={stackRef}
//         className="relative w-full h-full max-h-[45vh] md:max-h-[58vh] flex justify-end overflow-visible"
//         style={{ perspective: "1200px" }}
//       >
//         {PROJECTS.map((p, i) => (
//           <div
//             key={p.name}
//             ref={(el) => {
//               cardRefs.current[i] = el;
//             }}
//             className="absolute right-0 bottom-0 w-full max-w-[90%] md:max-w-[85%] h-[34vh] md:h-[42vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl"
//             style={{
//               bottom: `${i * STACK_OFFSET_REM}rem`,
//               zIndex: i,
//             }}
//           >
//             <Image
//               src={p.image}
//               alt={p.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 90vw, 45vw"
//             />
//             <div className="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
//               <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-sm">
//                 {p.name}
//               </h3>
//               <p className="mt-1.5 text-sm text-neutral-300 max-w-[85%]">
//                 {p.line}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

//version 2
// This version is a more refined implementation of the project cards left component.
// It uses a more efficient approach to animate the cards and uses a more precise scroll trigger.
// It also uses a more precise animation duration and ease.
// It also uses a more precise animation duration and ease.
// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const PROJECTS = [
//   {
//     name: "Luxury wellness platform",
//     image: "/images/project1.jpg",
//     line: "Strategy, brand systems, and immersive UI that lifts conversion.",
//   },
//   {
//     name: "Fintech onboarding redesign",
//     image: "/images/proejct2.jpg",
//     line: "Streamlined flows and trust-driven design for higher completion.",
//   },
//   {
//     name: "Architectural studio identity",
//     image: "/images/project3.jpg",
//     line: "Quietly iconic digital presence that reflects craft and scale.",
//   },
//   {
//     name: "SaaS dashboard & analytics",
//     image: "/images/project4.jpg",
//     line: "Data clarity and actionable insights through elegant interfaces.",
//   },
// ];

// const STACK_OFFSET_REM = 3;

// export default function ProjectCardsLeft({
//   sectionRef,
// }: {
//   sectionRef: React.RefObject<HTMLElement | null>;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const stackRef = useRef<HTMLDivElement>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const prefersReducedMotionRef = useRef(false);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const container = containerRef.current;
//     const cards = cardRefs.current.filter(Boolean);
//     if (!section || !container || cards.length === 0) return;

//     prefersReducedMotionRef.current = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const reduced = prefersReducedMotionRef.current;

//     // Set initial position - cards start below their normal position
//     gsap.set(cards, {
//       yPercent: 120,
//       opacity: 0,
//     });

//     const ctx = gsap.context(() => {
//       if (reduced) {
//         const tl = gsap.timeline({
//           scrollTrigger: { trigger: section, start: "top 80%", once: true },
//         });
//         cards.forEach((card, i) => {
//           tl.to(
//             card,
//             { yPercent: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
//             i * 0.08
//           );
//         });
//       } else {
//         // Create animation for cards without pinning the section
//         // Instead, we'll just animate them on scroll
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: container,
//             start: "top 60%",
//             end: "bottom 20%",
//             scrub: 1.5,
//           },
//         });
        
//         // Animate each card from bottom to top with stagger
//         cards.forEach((card, i) => {
//           tl.to(
//             card,
//             {
//               yPercent: 0,
//               opacity: 1,
//               duration: 0.3,
//               ease: "power2.out",
//             },
//             i * 0.25 // Stagger timing
//           );
//         });
//       }
//     }, container);

//     return () => ctx.revert();
//   }, [sectionRef]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative flex flex-1 items-center justify-end w-full h-[45vh] md:h-[58vh] md:flex-[0.52] lg:flex-[0.55] md:mr-12 lg:mr-24 md:w-auto md:max-w-[50%]"
//     >
//       <div
//         ref={stackRef}
//         className="relative w-full h-full max-h-[45vh] md:max-h-[58vh] flex justify-end"
//         style={{ perspective: "1200px" }}
//       >
//         {PROJECTS.map((p, i) => (
//           <div
//             key={p.name}
//             ref={(el) => {
//               cardRefs.current[i] = el;
//             }}
//             className="absolute right-0 bottom-0 w-full max-w-[90%] md:max-w-[85%] h-[34vh] md:h-[42vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl"
//             style={{
//               bottom: `${i * STACK_OFFSET_REM}rem`,
//               zIndex: i,
//             }}
//           >
//             <Image
//               src={p.image}
//               alt={p.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 90vw, 45vw"
//             />
//             <div className="absolute inset-0 bg-linear-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
//               <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-sm">
//                 {p.name}
//               </h3>
//               <p className="mt-1.5 text-sm text-neutral-300 max-w-[85%]">
//                 {p.line}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


//version 3
// This version is a more refined implementation of the project cards left component.
// It uses a more efficient approach to animate the cards and uses a more precise scroll trigger.
// It also uses a more precise animation duration and ease.
// It also uses a more precise animation duration and ease.

// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const PROJECTS = [
//   {
//     name: "Luxury wellness platform",
//     image: "/images/project1.jpg",
//     line: "Strategy, brand systems, and immersive UI that lifts conversion.",
//   },
//   {
//     name: "Fintech onboarding redesign",
//     image: "/images/proejct2.jpg",
//     line: "Streamlined flows and trust-driven design for higher completion.",
//   },
//   {
//     name: "Architectural studio identity",
//     image: "/images/project3.jpg",
//     line: "Quietly iconic digital presence that reflects craft and scale.",
//   },
//   {
//     name: "SaaS dashboard & analytics",
//     image: "/images/project4.jpg",
//     line: "Data clarity and actionable insights through elegant interfaces.",
//   },
// ];

// const STACK_OFFSET_REM = 2.5; // Space between stacked cards

// export default function ProjectCardsLeft({
//   sectionRef,
// }: {
//   sectionRef: React.RefObject<HTMLElement | null>;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const stackRef = useRef<HTMLDivElement>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const prefersReducedMotionRef = useRef(false);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const container = containerRef.current;
//     const cards = cardRefs.current.filter(Boolean);
//     if (!section || !container || cards.length === 0) return;

//     prefersReducedMotionRef.current = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const reduced = prefersReducedMotionRef.current;

//     // Calculate final stacked positions for each card
//     const finalPositions = cards.map((_, i) => ({
//       bottom: i * STACK_OFFSET_REM, // Each card stacks with offset
//     }));

//     // Set initial position - all cards start way below viewport
//     gsap.set(cards, {
//       bottom: "-100%",
//       opacity: 0,
//       scale: 0.9,
//     });

//     const ctx = gsap.context(() => {
//       if (reduced) {
//         const tl = gsap.timeline({
//           scrollTrigger: { trigger: section, start: "top 80%", once: true },
//         });
//         cards.forEach((card, i) => {
//           tl.to(
//             card,
//             { 
//               bottom: `${finalPositions[i].bottom}rem`,
//               opacity: 1,
//               scale: 1,
//               duration: 0.4, 
//               ease: "power2.out" 
//             },
//             i * 0.1
//           );
//         });
//       } else {
//         // Smooth scroll-based stacking animation
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top top",
//             end: "bottom bottom",
//             scrub: 2, // Increased scrub for ultra-smooth animation
//           },
//         });
        
//         // Each card animates to its stacked position sequentially
//         cards.forEach((card, i) => {
//           // Start position for this card's animation
//           const startLabel = i === 0 ? 0 : `card${i}`;
          
//           tl.to(
//             card,
//             {
//               bottom: `${finalPositions[i].bottom}rem`,
//               opacity: 1,
//               scale: 1,
//               duration: 1, // Duration in timeline units
//               ease: "power2.out",
//             },
//             i * 0.6 // Stagger - each card starts 0.6 units after previous
//           );
//         });
//       }
//     }, container);

//     return () => ctx.revert();
//   }, [sectionRef]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative flex flex-1 items-center justify-end w-full h-[50vh] md:h-[65vh] md:flex-[0.52] lg:flex-[0.55] md:mr-12 lg:mr-24 md:w-auto md:max-w-[50%]"
//     >
//       <div
//         ref={stackRef}
//         className="relative w-full h-full flex justify-end"
//         style={{ perspective: "1500px" }}
//       >
//         {PROJECTS.map((p, i) => (
//           <div
//             key={p.name}
//             ref={(el) => {
//               cardRefs.current[i] = el;
//             }}
//             className="absolute right-0 w-full max-w-[90%] md:max-w-[85%] h-[36vh] md:h-[44vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl will-change-transform"
//             style={{
//               zIndex: i,
//             }}
//           >
//             <Image
//               src={p.image}
//               alt={p.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 90vw, 45vw"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
//               <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-lg">
//                 {p.name}
//               </h3>
//               <p className="mt-2 text-sm md:text-base text-neutral-300 max-w-[85%]">
//                 {p.line}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

//version 4
// This version is a more refined implementation of the project cards left component.
// It uses a more efficient approach to animate the cards and uses a more precise scroll trigger.
// It also uses a more precise animation duration and ease.
// It also uses a more precise animation duration and ease.

// "use client";

// import { useEffect, useRef } from "react";
// import Image from "next/image";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// const PROJECTS = [
//   {
//     name: "Luxury wellness platform",
//     image: "/images/project1.jpg",
//     line: "Strategy, brand systems, and immersive UI that lifts conversion.",
//   },
//   {
//     name: "Fintech onboarding redesign",
//     image: "/images/proejct2.jpg",
//     line: "Streamlined flows and trust-driven design for higher completion.",
//   },
//   {
//     name: "Architectural studio identity",
//     image: "/images/project3.jpg",
//     line: "Quietly iconic digital presence that reflects craft and scale.",
//   },
//   {
//     name: "SaaS dashboard & analytics",
//     image: "/images/project4.jpg",
//     line: "Data clarity and actionable insights through elegant interfaces.",
//   },
// ];

// const STACK_OFFSET_REM = 2.5; // Space between stacked cards

// export default function ProjectCardsLeft({
//   sectionRef,
// }: {
//   sectionRef: React.RefObject<HTMLElement | null>;
// }) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const stackRef = useRef<HTMLDivElement>(null);
//   const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const prefersReducedMotionRef = useRef(false);

//   useEffect(() => {
//     const section = sectionRef.current;
//     const container = containerRef.current;
//     const cards = cardRefs.current.filter(Boolean);
//     if (!section || !container || cards.length === 0) return;

//     prefersReducedMotionRef.current = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const reduced = prefersReducedMotionRef.current;

//     // Calculate final stacked positions for each card
//     const finalPositions = cards.map((_, i) => ({
//       bottom: i * STACK_OFFSET_REM, // Each card stacks with offset
//     }));

//     // Set initial position - all cards start way below viewport
//     gsap.set(cards, {
//       bottom: "-100%",
//       opacity: 0,
//       scale: 0.9,
//     });

//     const ctx = gsap.context(() => {
//       if (reduced) {
//         const tl = gsap.timeline({
//           scrollTrigger: { trigger: section, start: "top 80%", once: true },
//         });
//         cards.forEach((card, i) => {
//           tl.to(
//             card,
//             { 
//               bottom: `${finalPositions[i].bottom}rem`,
//               opacity: 1,
//               scale: 1,
//               duration: 0.4, 
//               ease: "power2.out" 
//             },
//             i * 0.1
//           );
//         });
//       } else {
//         // Smooth scroll-based stacking animation
//         const tl = gsap.timeline({
//           scrollTrigger: {
//             trigger: section,
//             start: "top top",
//             end: "bottom bottom",
//             scrub: 2, // Increased scrub for ultra-smooth animation
//           },
//         });
        
//         // Each card animates to its stacked position sequentially
//         cards.forEach((card, i) => {
//           // Start position for this card's animation
//           const startLabel = i === 0 ? 0 : `card${i}`;
          
//           tl.to(
//             card,
//             {
//               bottom: `${finalPositions[i].bottom}rem`,
//               opacity: 1,
//               scale: 1,
//               duration: 1, // Duration in timeline units
//               ease: "power2.out",
//             },
//             i * 0.6 // Stagger - each card starts 0.6 units after previous
//           );
//         });
//       }
//     }, container);

//     return () => ctx.revert();
//   }, [sectionRef]);

//   return (
//     <div
//       ref={containerRef}
//       className="relative flex flex-1 items-center justify-center w-full h-[70vh] md:h-[80vh] md:flex-[0.52] lg:flex-[0.55] md:mr-12 lg:mr-24 md:w-auto md:max-w-[50%]"
//     >
//       <div
//         ref={stackRef}
//         className="relative w-full h-full flex justify-start"
//         style={{ perspective: "1500px" }}
//       >
//         {PROJECTS.map((p, i) => (
//           <div
//             key={p.name}
//             ref={(el) => {
//               cardRefs.current[i] = el;
//             }}
//             className="absolute -left-8 md:-left-12 lg:-left-16 w-[90vw] md:w-[48vw] lg:w-[50vw] h-[50vh] md:h-[58vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl will-change-transform"
//             style={{
//               zIndex: i,
//             }}
//           >
//             <Image
//               src={p.image}
//               alt={p.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 90vw, 45vw"
//             />
//             <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
//               <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-lg">
//                 {p.name}
//               </h3>
//               <p className="mt-2 text-sm md:text-base text-neutral-300 max-w-[85%]">
//                 {p.line}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

//version 5
// This version is a more refined implementation of the project cards left component.
// It uses a more efficient approach to animate the cards and uses a more precise scroll trigger.
// It also uses a more precise animation duration and ease.
// It also uses a more precise animation duration and ease.

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createSlug } from "../utils/slug";

gsap.registerPlugin(ScrollTrigger);

export const PROJECTS = [
  {
    name: "Employee Management System",
    image: "/images/p2.jpg",
    line: "Comprehensive system for managing employee data, attendance, and organizational workflows.",
  },
  {
    name: "Sharaf ul Quran",
    image: "/images/p1.jpg",
    line: "Digital platform for Quranic learning and spiritual guidance.",
  },
  {
    name: "Whatsapp funnel (Lead Management system)",
    image: "/images/p3.jpg",
    line: "Automated lead generation and management system integrated with WhatsApp messaging.",
  },
  {
    name: "Naba Hussam",
    image: "/images/p4.jpg",
    line: "Ecommerce platform specializing in women's clothing with elegant design and seamless shopping experience.",
  },
];

const STACK_OFFSET_REM = 2.5; // Space between stacked cards

// Desktop version - pinned stacking animation
export default function ProjectCardsLeft({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!section || !container || cards.length === 0) return;

    prefersReducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const reduced = prefersReducedMotionRef.current;

    // Calculate final stacked positions for each card
    const finalPositions = cards.map((_, i) => ({
      bottom: i * STACK_OFFSET_REM, // Each card stacks with offset
    }));

    // Set initial position - all cards start way below viewport
    gsap.set(cards, {
      bottom: "-100%",
      opacity: 0,
      scale: 0.9,
    });

    const ctx = gsap.context(() => {
      if (reduced) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
        cards.forEach((card, i) => {
          tl.to(
            card,
            { 
              bottom: `${finalPositions[i].bottom}rem`,
              opacity: 1,
              scale: 1,
              duration: 0.4, 
              ease: "power2.out" 
            },
            i * 0.1
          );
        });
      } else {
        // Smooth scroll-based stacking animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 2, // Increased scrub for ultra-smooth animation
          },
        });
        
        // Each card animates to its stacked position sequentially
        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              bottom: `${finalPositions[i].bottom}rem`,
              opacity: 1,
              scale: 1,
              duration: 1, // Duration in timeline units
              ease: "power2.out",
            },
            i * 0.6 // Stagger - each card starts 0.6 units after previous
          );
        });
      }
    }, container);

    return () => ctx.revert();
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-end w-full h-[80vh] md:h-[90vh] md:flex-[0.85] lg:flex-[0.9] md:mr-0 lg:mr-0 md:w-auto"
    >
      <div
        ref={stackRef}
        className="relative w-full h-full flex justify-end"
        style={{ perspective: "1500px" }}
      >
        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute right-0 w-full max-w-full md:max-w-full lg:max-w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl will-change-transform"
            style={{
              zIndex: i,
            }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 45vw"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 z-10 pointer-events-auto">
              <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-lg">
                {p.name}
              </h3>
              <p className="mt-2 text-sm md:text-base text-neutral-300 max-w-[85%]">
                {p.line}
              </p>
              <Link
                href={`/case-study/${createSlug(p.name)}`}
                className="inline-block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 relative z-20 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                View Case Study
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mobile version - horizontal swipe carousel with staggered reveal
export function MobileProjectCards({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reveal animation on mount
  useEffect(() => {
    const container = containerRef.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!container || cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Set initial state - cards start invisible and slightly below
    gsap.set(cards, {
      y: 40,
      opacity: 0,
    });

    const ctx = gsap.context(() => {
      // Staggered reveal animation when section enters viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          once: true,
        },
      });

      // Animate cards with staggered timing
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            duration: prefersReducedMotion ? 0.3 : 0.5,
            ease: "power3.out",
          },
          prefersReducedMotion ? i * 0.05 : i * 0.1
        );
      });

      // Fade out the swipe hint after a delay
      if (hintRef.current) {
        tl.to(
          hintRef.current,
          {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "+=2.5"
        );
      }
    }, container);

    return () => ctx.revert();
  }, []);

  // Track active card using native scroll with debounce
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce the index update to avoid flickering
      scrollTimeoutRef.current = setTimeout(() => {
        const cards = cardRefs.current.filter(Boolean);
        if (cards.length === 0) return;

        // Find the card closest to the center of the viewport
        const carouselRect = carousel.getBoundingClientRect();
        const carouselCenter = carouselRect.left + carouselRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, i) => {
          if (!card) return;
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const distance = Math.abs(cardCenter - carouselCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        setActiveIndex(closestIndex);
      }, 50);
    };

    carousel.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      carousel.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to specific card when pagination dot is clicked
  const scrollToCard = (index: number) => {
    const card = cardRefs.current[index];
    if (!card || !carouselRef.current) return;

    // Use native scrollIntoView for smooth, hardware-accelerated scrolling
    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveIndex(index);
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Carousel Container - Pure native scroll */}
      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        {/* Left padding spacer for first card centering */}
        <div className="shrink-0 w-[7.5vw]" aria-hidden="true" />
        
        {PROJECTS.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="shrink-0 w-[85vw] h-[55vh] min-h-[380px] max-h-[500px] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/90 shadow-2xl snap-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
                sizes="85vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/95 via-neutral-950/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-lg font-semibold text-white drop-shadow-lg leading-tight">
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-300 line-clamp-2">
                  {p.line}
                </p>
                <Link
                  href={`/case-study/${createSlug(p.name)}`}
                  className="inline-block mt-4 px-5 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/25 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm font-medium transition-all duration-200 active:scale-95"
                >
                  View Case Study
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Right padding spacer for last card centering */}
        <div className="shrink-0 w-[7.5vw]" aria-hidden="true" />
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "bg-white w-6"
                : "bg-neutral-600 hover:bg-neutral-500 w-2"
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint - shows briefly on first load */}
      <p
        ref={hintRef}
        className="text-center text-xs text-neutral-500 mt-3 animate-pulse"
      >
        Swipe to explore projects
      </p>
    </div>
  );
}

//version 6