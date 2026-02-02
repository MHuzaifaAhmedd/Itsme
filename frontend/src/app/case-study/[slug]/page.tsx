"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { getCaseStudyBySlug } from "../data/caseStudies";
import CaseStudyTemplate from "../components/CaseStudyTemplate";
import EMSCaseStudyTemplate from "../components/EMSCaseStudyTemplate";
import ClothieCaseStudyTemplate from "../components/ClothieCaseStudyTemplate";
import WhatsAppFunnelCaseStudyTemplate from "../components/WhatsAppFunnelCaseStudyTemplate";
import SharafulQuranCaseStudyTemplate from "../components/SharafulQuranCaseStudyTemplate";

/**
 * Dynamic Case Study Page
 * 
 * Routes: /case-study/[slug]
 * 
 * Renders complete case study with all 14 sections
 * using the centralized data structure
 * 
 * Custom templates for projects with interactive diagrams:
 * - EMS: Employee Management System
 * - Naba Hussam: Clothie E-commerce Platform
 * - WhatsApp Funnel: Lead Management System
 * - Sharaf ul Quran: Quranic Platform
 */
export default function CaseStudyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const project = getCaseStudyBySlug(slug);

  // Scroll to top immediately on page load (before paint)
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

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

  // Use EMS-specific template for employee-management-system
  if (slug === 'employee-management-system') {
    return <EMSCaseStudyTemplate data={project} />;
  }

  // Use Clothie-specific template for naba-hussam (Clothie E-commerce)
  if (slug === 'naba-hussam') {
    return <ClothieCaseStudyTemplate data={project} />;
  }

  // Use WhatsApp Funnel-specific template for whatsapp-funnel-lead-management-system
  if (slug === 'whatsapp-funnel-lead-management-system') {
    return <WhatsAppFunnelCaseStudyTemplate data={project} />;
  }

  // Use Sharaf ul Quran-specific template for sharaf-ul-quran
  if (slug === 'sharaf-ul-quran') {
    return <SharafulQuranCaseStudyTemplate data={project} />;
  }

  return <CaseStudyTemplate data={project} />;
}
