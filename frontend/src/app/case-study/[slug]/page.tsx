"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCaseStudyBySlug } from "../data/caseStudies";
import CaseStudyTemplate from "../components/CaseStudyTemplate";

/**
 * Dynamic Case Study Page
 * 
 * Routes: /case-study/[slug]
 * 
 * Renders complete case study with all 14 sections
 * using the centralized data structure
 */
export default function CaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const project = getCaseStudyBySlug(slug);

  useEffect(() => {
    if (!project) {
      // Redirect to home if project not found
      router.push("/");
    }
  }, [project, router]);

  // Show loading while redirecting if project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return <CaseStudyTemplate data={project} />;
}
