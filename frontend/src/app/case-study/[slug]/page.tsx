"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { PROJECTS } from "@/app/components/ProjectCardsLeft";
import { createSlug } from "@/app/utils/slug";

// Helper function to find project by slug
function findProjectBySlug(slug: string) {
  return PROJECTS.find((project) => {
    const projectSlug = createSlug(project.name);
    return projectSlug === slug;
  });
}

export default function CaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const project = findProjectBySlug(slug);

  const titleRef = useRef<HTMLDivElement>(null);
  const typeWrapRef = useRef<HTMLDivElement>(null);
  const typeInnerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  useEffect(() => {
    if (!project) {
      router.push("/");
      return;
    }

    const title = titleRef.current;
    const typeWrap = typeWrapRef.current;
    const typeInner = typeInnerRef.current;
    const content = contentRef.current;

    if (!title || !typeWrap || !typeInner || !content) return;

    const totalSteps = Math.max(1, project.name.length);
    const fullWidthPx = typeInner.scrollWidth;

    // Initial states
    gsap.set(title, { opacity: 1, y: 0 });
    gsap.set(typeWrap, { width: 0, overflow: "hidden" });
    gsap.set(content, { opacity: 0, y: 30 });

    // Create the intro animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsIntroComplete(true);
      },
    });

    // Typewriter (fast) via width reveal + steps easing
    tl.to(typeWrap, {
      width: fullWidthPx,
      duration: 0.45, // fast typing
      ease: `steps(${totalSteps})`,
    })
      // Tiny pause so it reads before exiting
      .to({}, { duration: 0.25 })
      // Move title up and fade out
      .to(
        title,
        {
          y: -60,
          opacity: 0,
          duration: 0.55,
          ease: "power3.in",
        },
        "-=0.15"
      )
      // Reveal content
      .to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.15"
      );

    return () => {
      tl.kill();
    };
  }, [project, router]);

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      {/* Intro Title - Centered on screen */}
      <div
        ref={titleRef}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <div className="px-4">
          <div ref={typeWrapRef} className="mx-auto">
            <div ref={typeInnerRef} className="inline-flex items-baseline">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center whitespace-nowrap">
                {project.name}
              </h1>
              <span
                className="ml-2 inline-block h-[0.9em] w-[2px] bg-white/80 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className={`relative z-10 pt-20 pb-24 px-4 md:px-8 lg:px-16 ${
          isIntroComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              // Returning to Home should feel instant + land back in Projects.
              // We set a session flag so Home can skip its loader animation on mount.
              try {
                window.sessionStorage.setItem("skipHomeLoader", "1");
              } catch {
                // ignore
              }
              router.push("/#projects");
            }}
            className="mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            type="button"
          >
            ← Back
          </button>

          {/* Project Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {project.name}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl">
              {project.line}
            </p>
          </div>

          {/* Project Image */}
          <div className="mb-12 rounded-xl overflow-hidden border border-neutral-800 relative h-[60vh] md:h-[70vh]">
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Case Study Content */}
          <div className="prose prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Overview</h2>
              <p className="text-lg text-neutral-300 leading-relaxed mb-4">
                This case study explores the design and development process behind{" "}
                {project.name}. The project demonstrates modern web development
                practices and user-centered design principles.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Key Features</h2>
              <ul className="list-disc list-inside text-lg text-neutral-300 space-y-2">
                <li>Modern and responsive design</li>
                <li>Optimized performance and user experience</li>
                <li>Clean and intuitive interface</li>
                <li>Scalable architecture</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Technologies</h2>
              <div className="flex flex-wrap gap-3">
                {["Next.js", "React", "TypeScript", "Tailwind CSS"].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-neutral-800 rounded-lg text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

