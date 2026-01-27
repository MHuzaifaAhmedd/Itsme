/**
 * Complete TypeScript definitions for case study content
 * 
 * This provides type safety for all 14 mandatory sections
 * Fill in real data when ready - no placeholder content invented
 */

export interface CaseStudyHeroData {
  projectName: string;
  impactLine: string; // One-line impact-driven description
  role: string;
  techStack: string[];
  year: string;
  ctas: {
    live?: string;
    demo?: string;
    github?: string;
  };
  heroImage: string;
}

export interface ProblemStatementData {
  context: string; // Real-world problem context
  painPoints: string[]; // User pain points
  whyInsufficient: string; // Why existing solutions were insufficient
}

export interface GoalsMetricsData {
  objectives: string[]; // Clear project objectives
  successMetrics: string[]; // Measurable success indicators
}

export interface UserFlowNode {
  id: string;
  label: string;
  type: 'start' | 'action' | 'decision' | 'end';
}

export interface UserFlowConnection {
  from: string;
  to: string;
  label?: string;
}

export interface UserFlowData {
  description: string;
  nodes: UserFlowNode[];
  connections: UserFlowConnection[];
}

export interface SystemLayer {
  name: string;
  components: string[];
  color: string; // For visual distinction
}

export interface SystemArchitectureData {
  description: string;
  layers: SystemLayer[];
}

export interface DataFlowStep {
  id: string;
  label: string;
  description: string;
}

export interface DataFlowData {
  description: string;
  steps: DataFlowStep[];
}

export interface Feature {
  name: string;
  whatItDoes: string;
  whyItMatters: string;
  howImplemented: string;
  icon?: string; // Optional icon identifier
}

export interface CoreFeaturesData {
  features: Feature[];
}

export interface Challenge {
  challenge: string;
  whyHard: string;
  solution: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface TechnicalChallengesData {
  challenges: Challenge[];
}

export interface PerformanceSecurityData {
  performance: string[];
  errorHandling: string[];
  security: string[];
}

export interface VisualUIDecision {
  aspect: string; // e.g., "Color Palette", "Typography"
  rationale: string;
  details: string;
}

export interface VisualUIData {
  decisions: VisualUIDecision[];
  gallery?: string[]; // Optional image gallery
}

export interface FinalOutcomeData {
  achieved: string;
  whoHelped: string;
  whyMatters: string;
  metrics?: string[]; // Optional measurable outcomes
}

export interface LearningsData {
  technical: string[];
  architectural: string[];
  improvements: string[];
}

export interface FutureImprovementsData {
  improvements: string[];
}

/**
 * Complete Case Study Data Structure
 * 
 * All 14 mandatory sections included
 * Ready to accept real project data
 */
export interface CaseStudyData {
  slug: string;
  hero: CaseStudyHeroData;
  problem: ProblemStatementData;
  goalsMetrics: GoalsMetricsData;
  userFlow: UserFlowData;
  systemArchitecture: SystemArchitectureData;
  dataFlow: DataFlowData;
  coreFeatures: CoreFeaturesData;
  technicalChallenges: TechnicalChallengesData;
  performanceSecurity: PerformanceSecurityData;
  visualUI: VisualUIData;
  finalOutcome: FinalOutcomeData;
  learnings: LearningsData;
  futureImprovements: FutureImprovementsData;
}
