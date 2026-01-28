"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CollaborateCTAProps {
  className?: string;
}

// Darker Google brand colors for particles
const PARTICLE_COLORS = ['#1a5bc7', '#b8251f', '#c9940a', '#1e6b32'];

// Particle class for the background effect
class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  friction: number;
  ease: number;
  density: number;

  constructor(x: number, y: number, color: string, canvasWidth: number, canvasHeight: number) {
    this.originX = x;
    this.originY = y;
    // Start particles at random positions for a "pop-in" effect
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.color = color;
    this.size = 2;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.90;
    this.ease = 0.12;
    this.density = Math.random() * 25 + 1;
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.size, this.size);
  }

  update(mouseX: number, mouseY: number, mouseRadius: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouseRadius) {
      const force = (mouseRadius - distance) / mouseRadius;
      const dirX = (dx / distance) * force * this.density;
      const dirY = (dy / distance) * force * this.density;
      this.vx -= dirX;
      this.vy -= dirY;
    }

    this.vx += (this.originX - this.x) * this.ease;
    this.vy += (this.originY - this.y) * this.ease;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }
}

export default function CollaborateCTA({ className = "" }: CollaborateCTAProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  const particleArrayRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 120 });
  const animationFrameRef = useRef<number>(0);

  // Reset particles to random positions for the "scatter" effect
  const resetParticlesToRandom = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    particleArrayRef.current.forEach(p => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
      p.vx = 0;
      p.vy = 0;
    });
  }, []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match section
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    particleArrayRef.current = [];

    const text = "MAKE IT REAL";
    const fontSize = Math.min(canvas.width / 5, 220);
    ctx.fillStyle = 'white';
    ctx.font = `900 ${fontSize}px Arial, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const step = 4; // Particle density

    for (let y = 0; y < imageData.height; y += step) {
      for (let x = 0; x < imageData.width; x += step) {
        const alpha = imageData.data[(y * 4 * imageData.width) + (x * 4) + 3];
        if (alpha > 128) {
          // Color based on position for subtle variation
          const colorIndex = Math.floor((x / canvas.width) * PARTICLE_COLORS.length);
          const color = PARTICLE_COLORS[colorIndex] || PARTICLE_COLORS[0];
          particleArrayRef.current.push(new Particle(x, y, color, canvas.width, canvas.height));
        }
      }
    }
  }, []);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // For reduced motion, just show static text
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const text = "MAKE IT REAL";
      const fontSize = Math.min(canvas.width / 5, 220);
      ctx.fillStyle = 'rgba(26, 91, 199, 0.15)';
      ctx.font = `900 ${fontSize}px Arial, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      return;
    }

    initParticles();

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particleArrayRef.current.forEach(p => {
        p.update(mouseRef.current.x, mouseRef.current.y, mouseRef.current.radius);
        p.draw(ctx);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleResize = () => {
      initParticles();
    };

    // ScrollTrigger to reset particles when section enters viewport
    // This makes the "pop-in" animation happen every time you scroll to the section
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => {
        resetParticlesToRandom();
      },
      onEnterBack: () => {
        resetParticlesToRandom();
      },
    });

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      scrollTrigger.kill();
    };
  }, [initParticles, resetParticlesToRandom]);

  // Content animation effect
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Function to reset elements to initial state
      const resetElements = () => {
        gsap.set([headlineRef.current, supportingRef.current, descriptionRef.current, buttonsRef.current], {
          opacity: 0,
          y: 20,
        });

        gsap.set(dividerRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
      };

      // Function to play the animation
      const playAnimation = () => {
        // Reset first
        resetElements();

        // Create and play the timeline
        const masterTimeline = gsap.timeline();

        if (!prefersReducedMotion) {
          // Animated divider line (left to right)
          masterTimeline.to(dividerRef.current, {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.out",
          });

          // Headline fade-up
          masterTimeline.to(
            headlineRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.3"
          );

          // Supporting headline with slight delay
          masterTimeline.to(
            supportingRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.45"
          );

          // Description paragraph
          masterTimeline.to(
            descriptionRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.45"
          );

          // CTA buttons (last)
          masterTimeline.to(
            buttonsRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.4"
          );
        } else {
          // Reduced motion: simple fade in
          masterTimeline.to(
            [headlineRef.current, supportingRef.current, descriptionRef.current, buttonsRef.current],
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              stagger: 0.05,
              ease: "power2.out",
            }
          );

          gsap.set(dividerRef.current, { scaleX: 1 });
        }
      };

      // Set initial state
      resetElements();

      // ScrollTrigger that fires every time section enters viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        onEnter: playAnimation,
        onEnterBack: playAnimation,
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative z-10 overflow-hidden ${className}`}
    >
      {/* Particle text background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main background - slightly different from neutral-950 */}
      <div 
        className="absolute inset-0 bg-linear-to-b from-neutral-950 via-neutral-900/20 to-neutral-950 -z-10"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-32 md:py-40 lg:py-48">
        {/* Animated divider line */}
        <div
          ref={dividerRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-linear-to-r from-transparent via-neutral-600 to-transparent"
          aria-hidden="true"
        />

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="text-center text-4xl font-semibold leading-tight tracking-tight text-neutral-100 md:text-5xl lg:text-6xl"
        >
          Let&apos;s collaborate
        </h2>

        {/* Supporting headline */}
        <p
          ref={supportingRef}
          className="mt-4 text-center text-lg font-normal tracking-wide text-neutral-300 md:text-xl lg:text-2xl"
        >
          Ready to craft your next premium release.
        </p>

        {/* Description paragraph */}
        <p
          ref={descriptionRef}
          className="mt-6 max-w-2xl text-center text-base leading-relaxed text-neutral-400 md:text-lg"
        >
          I believe in clarity, quality, and thoughtful execution. Whether you&apos;re 
          launching a new product or refining an existing experience, I bring focused 
          attention and craft to every collaboration.
        </p>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary Button - Solid */}
          <a
            href="mailto:hello@studio.com"
            className="group relative inline-flex h-13 items-center justify-center overflow-hidden rounded-full bg-neutral-50 px-8 text-sm font-medium uppercase tracking-[0.2em] text-neutral-950 transition-all duration-250 ease-out hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)]"
          >
            <span className="relative z-10">Start a project</span>
            <div 
              className="absolute inset-0 bg-white opacity-0 transition-opacity duration-250 ease-out group-hover:opacity-100"
              aria-hidden="true"
            />
          </a>

          {/* Secondary Button - Outline */}
          <a
            href="#projects"
            className="group relative inline-flex h-13 items-center justify-center overflow-hidden rounded-full border border-neutral-700 px-8 text-sm font-medium uppercase tracking-[0.2em] text-neutral-200 transition-all duration-250 ease-out hover:scale-[1.03] hover:border-neutral-500 hover:text-white hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)]"
          >
            <span className="relative z-10">View work</span>
          </a>
        </div>
      </div>
    </section>
  );
}
