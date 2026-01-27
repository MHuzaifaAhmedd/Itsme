import { CaseStudyData } from '../types';

/**
 * Centralized Case Study Data
 * 
 * PLACEHOLDER STRUCTURE - Ready for real project data
 * 
 * To populate with real data:
 * 1. Replace placeholder text with actual project details
 * 2. Add real tech stacks, challenges, solutions
 * 3. Update metrics and outcomes
 * 4. Add real flow diagrams and architecture
 */

export const caseStudies: Record<string, CaseStudyData> = {
  'employee-management-system': {
    slug: 'employee-management-system',
    hero: {
      projectName: 'Employee Management System',
      impactLine: '[AWAITING: One-line impact statement about how this system transformed employee management]',
      role: '[AWAITING: Your role - e.g., Full-Stack Developer, Lead Engineer]',
      techStack: ['[AWAITING: Tech stack - e.g., React, Node.js, PostgreSQL]'],
      year: '[AWAITING: Year]',
      ctas: {
        live: undefined, // Add URL when available
        demo: undefined,
        github: undefined,
      },
      heroImage: '/images/p2.jpg',
    },
    problem: {
      context: '[AWAITING: Real-world problem context - What was the business/organizational challenge?]',
      painPoints: [
        '[AWAITING: Pain point #1]',
        '[AWAITING: Pain point #2]',
        '[AWAITING: Pain point #3]',
      ],
      whyInsufficient: '[AWAITING: Why existing solutions or manual processes were insufficient]',
    },
    goalsMetrics: {
      objectives: [
        '[AWAITING: Objective #1]',
        '[AWAITING: Objective #2]',
        '[AWAITING: Objective #3]',
      ],
      successMetrics: [
        '[AWAITING: Metric #1 - e.g., Reduce processing time by 50%]',
        '[AWAITING: Metric #2]',
      ],
    },
    userFlow: {
      description: '[AWAITING: Brief description of user journey through the system]',
      nodes: [
        { id: '1', label: '[AWAITING: Start point]', type: 'start' },
        { id: '2', label: '[AWAITING: Action step]', type: 'action' },
        { id: '3', label: '[AWAITING: End result]', type: 'end' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
      ],
    },
    systemArchitecture: {
      description: '[AWAITING: System architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING: Components]'],
          color: '#3b82f6',
        },
        {
          name: 'Backend',
          components: ['[AWAITING: Services]'],
          color: '#10b981',
        },
        {
          name: 'Database',
          components: ['[AWAITING: Database tech]'],
          color: '#f59e0b',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: How data moves through the system]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING: Data entry point]',
        },
        {
          id: '2',
          label: 'Processing',
          description: '[AWAITING: Processing logic]',
        },
        {
          id: '3',
          label: 'Output',
          description: '[AWAITING: Result delivery]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature #1 Name]',
          whatItDoes: '[AWAITING: What it does]',
          whyItMatters: '[AWAITING: Why it matters]',
          howImplemented: '[AWAITING: High-level implementation]',
        },
        {
          name: '[AWAITING: Feature #2 Name]',
          whatItDoes: '[AWAITING: What it does]',
          whyItMatters: '[AWAITING: Why it matters]',
          howImplemented: '[AWAITING: High-level implementation]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Technical challenge description]',
          whyHard: '[AWAITING: Why this was difficult]',
          solution: '[AWAITING: Your solution approach]',
        },
      ],
    },
    performanceSecurity: {
      performance: [
        '[AWAITING: Performance consideration #1]',
        '[AWAITING: Performance consideration #2]',
      ],
      errorHandling: ['[AWAITING: Error handling approach]'],
      security: ['[AWAITING: Security measures implemented]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING: Design aspect - e.g., Color Palette]',
          rationale: '[AWAITING: Why you chose this]',
          details: '[AWAITING: Specific details]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING: What was achieved]',
      whoHelped: '[AWAITING: Who benefited from this]',
      whyMatters: '[AWAITING: Why it matters]',
    },
    learnings: {
      technical: ['[AWAITING: Technical learning #1]'],
      architectural: ['[AWAITING: Architectural insight #1]'],
      improvements: ['[AWAITING: What you would improve next time]'],
    },
    futureImprovements: {
      improvements: [
        '[AWAITING: Future improvement #1]',
        '[AWAITING: Future improvement #2]',
      ],
    },
  },

  'sharaf-ul-quran': {
    slug: 'sharaf-ul-quran',
    hero: {
      projectName: 'Sharaf ul Quran',
      impactLine: '[AWAITING: Impact statement]',
      role: '[AWAITING: Role]',
      techStack: ['[AWAITING: Tech stack]'],
      year: '[AWAITING: Year]',
      ctas: {},
      heroImage: '/images/p1.jpg',
    },
    problem: {
      context: '[AWAITING: Problem context]',
      painPoints: ['[AWAITING: Pain points]'],
      whyInsufficient: '[AWAITING: Why existing solutions failed]',
    },
    goalsMetrics: {
      objectives: ['[AWAITING: Objectives]'],
      successMetrics: ['[AWAITING: Success metrics]'],
    },
    userFlow: {
      description: '[AWAITING: User flow description]',
      nodes: [
        { id: '1', label: '[AWAITING]', type: 'start' },
        { id: '2', label: '[AWAITING]', type: 'end' },
      ],
      connections: [{ from: '1', to: '2' }],
    },
    systemArchitecture: {
      description: '[AWAITING: Architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING]'],
          color: '#3b82f6',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: Data flow]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature]',
          whatItDoes: '[AWAITING]',
          whyItMatters: '[AWAITING]',
          howImplemented: '[AWAITING]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Challenge]',
          whyHard: '[AWAITING]',
          solution: '[AWAITING]',
        },
      ],
    },
    performanceSecurity: {
      performance: ['[AWAITING]'],
      errorHandling: ['[AWAITING]'],
      security: ['[AWAITING]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING]',
          rationale: '[AWAITING]',
          details: '[AWAITING]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING]',
      whoHelped: '[AWAITING]',
      whyMatters: '[AWAITING]',
    },
    learnings: {
      technical: ['[AWAITING]'],
      architectural: ['[AWAITING]'],
      improvements: ['[AWAITING]'],
    },
    futureImprovements: {
      improvements: ['[AWAITING]'],
    },
  },

  'whatsapp-funnel-lead-management-system': {
    slug: 'whatsapp-funnel-lead-management-system',
    hero: {
      projectName: 'WhatsApp Funnel (Lead Management System)',
      impactLine: '[AWAITING: Impact statement]',
      role: '[AWAITING: Role]',
      techStack: ['[AWAITING: Tech stack]'],
      year: '[AWAITING: Year]',
      ctas: {},
      heroImage: '/images/p3.jpg',
    },
    problem: {
      context: '[AWAITING: Problem context]',
      painPoints: ['[AWAITING: Pain points]'],
      whyInsufficient: '[AWAITING: Why existing solutions failed]',
    },
    goalsMetrics: {
      objectives: ['[AWAITING: Objectives]'],
      successMetrics: ['[AWAITING: Success metrics]'],
    },
    userFlow: {
      description: '[AWAITING: User flow description]',
      nodes: [
        { id: '1', label: '[AWAITING]', type: 'start' },
        { id: '2', label: '[AWAITING]', type: 'end' },
      ],
      connections: [{ from: '1', to: '2' }],
    },
    systemArchitecture: {
      description: '[AWAITING: Architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING]'],
          color: '#3b82f6',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: Data flow]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature]',
          whatItDoes: '[AWAITING]',
          whyItMatters: '[AWAITING]',
          howImplemented: '[AWAITING]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Challenge]',
          whyHard: '[AWAITING]',
          solution: '[AWAITING]',
        },
      ],
    },
    performanceSecurity: {
      performance: ['[AWAITING]'],
      errorHandling: ['[AWAITING]'],
      security: ['[AWAITING]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING]',
          rationale: '[AWAITING]',
          details: '[AWAITING]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING]',
      whoHelped: '[AWAITING]',
      whyMatters: '[AWAITING]',
    },
    learnings: {
      technical: ['[AWAITING]'],
      architectural: ['[AWAITING]'],
      improvements: ['[AWAITING]'],
    },
    futureImprovements: {
      improvements: ['[AWAITING]'],
    },
  },

  'naba-hussam': {
    slug: 'naba-hussam',
    hero: {
      projectName: 'Naba Hussam',
      impactLine: '[AWAITING: Impact statement]',
      role: '[AWAITING: Role]',
      techStack: ['[AWAITING: Tech stack]'],
      year: '[AWAITING: Year]',
      ctas: {},
      heroImage: '/images/p4.jpg',
    },
    problem: {
      context: '[AWAITING: Problem context]',
      painPoints: ['[AWAITING: Pain points]'],
      whyInsufficient: '[AWAITING: Why existing solutions failed]',
    },
    goalsMetrics: {
      objectives: ['[AWAITING: Objectives]'],
      successMetrics: ['[AWAITING: Success metrics]'],
    },
    userFlow: {
      description: '[AWAITING: User flow description]',
      nodes: [
        { id: '1', label: '[AWAITING]', type: 'start' },
        { id: '2', label: '[AWAITING]', type: 'end' },
      ],
      connections: [{ from: '1', to: '2' }],
    },
    systemArchitecture: {
      description: '[AWAITING: Architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING]'],
          color: '#3b82f6',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: Data flow]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature]',
          whatItDoes: '[AWAITING]',
          whyItMatters: '[AWAITING]',
          howImplemented: '[AWAITING]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Challenge]',
          whyHard: '[AWAITING]',
          solution: '[AWAITING]',
        },
      ],
    },
    performanceSecurity: {
      performance: ['[AWAITING]'],
      errorHandling: ['[AWAITING]'],
      security: ['[AWAITING]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING]',
          rationale: '[AWAITING]',
          details: '[AWAITING]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING]',
      whoHelped: '[AWAITING]',
      whyMatters: '[AWAITING]',
    },
    learnings: {
      technical: ['[AWAITING]'],
      architectural: ['[AWAITING]'],
      improvements: ['[AWAITING]'],
    },
    futureImprovements: {
      improvements: ['[AWAITING]'],
    },
  },
};

/**
 * Helper function to get case study by slug
 */
export function getCaseStudyBySlug(slug: string): CaseStudyData | undefined {
  return caseStudies[slug];
}

/**
 * Get all case study slugs (useful for static generation)
 */
export function getAllCaseStudySlugs(): string[] {
  return Object.keys(caseStudies);
}

/**
 * Get next case study for navigation
 */
export function getNextCaseStudy(currentSlug: string): CaseStudyData | undefined {
  const slugs = getAllCaseStudySlugs();
  const currentIndex = slugs.indexOf(currentSlug);
  const nextIndex = (currentIndex + 1) % slugs.length;
  return caseStudies[slugs[nextIndex]];
}
