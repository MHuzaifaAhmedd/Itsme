/**
 * NEXI AI Chatbot - Library Exports
 */

// Types
export * from './types';

// AI Provider
export {
  getActiveProvider,
  getProviderConfig,
  isProviderConfigured,
  streamChatCompletion,
  getChatCompletion,
} from './ai-provider';

// System Prompt
export {
  buildSystemPrompt,
  getWelcomeMessage,
  ERROR_MESSAGES,
} from './system-prompt';

// Rate Limiter
export {
  checkRateLimit,
  getClientIP,
  resetRateLimit,
  resetAllRateLimits,
} from './rate-limiter';

// Portfolio Context
export {
  getPortfolioContext,
  getContextSummary,
  searchProjects,
  findSkillCategory,
} from './portfolio-context';
