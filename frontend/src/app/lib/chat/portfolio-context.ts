/**
 * NEXI AI Chatbot - Portfolio Context Loader
 * 
 * Loads and caches the portfolio context for NEXI's knowledge base.
 */

import type { PortfolioContext } from './types';
import portfolioData from '../../data/portfolio-context.json';

// =============================================================================
// Cached Context
// =============================================================================

let cachedContext: PortfolioContext | null = null;

// =============================================================================
// Load Portfolio Context
// =============================================================================

export function getPortfolioContext(): PortfolioContext {
  if (cachedContext) {
    return cachedContext;
  }
  
  // Type assertion since we control the JSON structure
  cachedContext = portfolioData as PortfolioContext;
  
  return cachedContext;
}

// =============================================================================
// Context Summary (for debugging)
// =============================================================================

export function getContextSummary(): string {
  const context = getPortfolioContext();
  
  return `Portfolio Context Summary:
- Owner: ${context.owner.name} (${context.owner.title})
- Projects: ${context.projects.length} (${context.projects.map(p => p.name).join(', ')})
- Skills: ${Object.values(context.skills).flat().length} total
- Quick Facts: ${context.quickFacts.length}`;
}

// =============================================================================
// Search Context (for relevant info retrieval)
// =============================================================================

export function searchProjects(query: string): typeof portfolioData.projects {
  const context = getPortfolioContext();
  const lowerQuery = query.toLowerCase();
  
  return context.projects.filter(project => 
    project.name.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery) ||
    project.techStack.some(tech => tech.toLowerCase().includes(lowerQuery)) ||
    project.type.toLowerCase().includes(lowerQuery)
  );
}

export function findSkillCategory(skill: string): string | null {
  const context = getPortfolioContext();
  const lowerSkill = skill.toLowerCase();
  
  for (const [category, skills] of Object.entries(context.skills)) {
    if (skills.some((s: string) => s.toLowerCase().includes(lowerSkill))) {
      return category;
    }
  }
  
  return null;
}
