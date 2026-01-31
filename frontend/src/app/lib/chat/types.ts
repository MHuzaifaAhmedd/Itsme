/**
 * NEXI AI Chatbot - Type Definitions
 */

// =============================================================================
// Message Types
// =============================================================================

export type MessageRole = 'user' | 'assistant' | 'system';
export type FeedbackType = 'positive' | 'negative' | null;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  feedback?: FeedbackType;
}

export interface StreamingMessage {
  id: string;
  role: 'assistant';
  content: string;
  isStreaming: boolean;
  timestamp: Date;
}

// =============================================================================
// API Types
// =============================================================================

export interface ChatRequest {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
}

export interface ChatResponse {
  success: boolean;
  error?: string;
}

export interface StreamChunk {
  type: 'content' | 'done' | 'error';
  content?: string;
  error?: string;
}

// =============================================================================
// AI Provider Types
// =============================================================================

export type AIProvider = 'openai' | 'groq';

export interface AIProviderConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  maxTokens: number;
}

export interface AIStreamOptions {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  systemPrompt: string;
  maxTokens?: number;
}

// =============================================================================
// Rate Limiting Types
// =============================================================================

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
  error?: string;
}

export interface RateLimitConfig {
  perMinute: number;
  perHour: number;
  perDay: number;
}

// =============================================================================
// Portfolio Context Types
// =============================================================================

export interface PortfolioOwner {
  name: string;
  title: string;
  bio: string;
  location: string;
}

export interface PortfolioProject {
  name: string;
  slug: string;
  type: string;
  description: string;
  techStack: string[];
  highlights: string[];
  features: string[];
  year: string;
  role: string;
  liveUrl?: string;
}

export interface PortfolioSkills {
  frontend: string[];
  backend: string[];
  cloud: string[];
  integrations: string[];
  practices: string[];
}

export interface PortfolioContact {
  email: string;
  github: string;
  linkedin: string;
  cta: string;
}

export interface PortfolioContext {
  owner: PortfolioOwner;
  projects: PortfolioProject[];
  skills: PortfolioSkills;
  contact: PortfolioContact;
  quickFacts: string[];
}

// =============================================================================
// Chat UI State Types
// =============================================================================

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export type ChatAction =
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_STREAMING_MESSAGE'; payload: { id: string; content: string } }
  | { type: 'FINISH_STREAMING'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STREAMING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_FEEDBACK'; payload: { id: string; feedback: FeedbackType } };

// =============================================================================
// Quick Reply Types
// =============================================================================

export interface QuickReply {
  id: string;
  text: string;
  category: 'projects' | 'skills' | 'contact' | 'general';
}

// =============================================================================
// Validation Types
// =============================================================================

export interface ValidationLimits {
  maxMessageLength: number;
  maxConversationHistory: number;
  maxResponseTokens: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedContent?: string;
}

// =============================================================================
// Analytics Types (Phase 4)
// =============================================================================

export interface ChatAnalyticsEvent {
  event: 'chat_opened' | 'message_sent' | 'response_received' | 'feedback_given' | 'quick_reply_clicked' | 'chat_cleared';
  timestamp: number;
  sessionId?: string;
  data?: {
    messageId?: string;
    messageLength?: number;
    responseTime?: number;
    feedbackType?: FeedbackType;
    quickReply?: string;
  };
}

export interface FeedbackPayload {
  messageId: string;
  feedback: FeedbackType;
  messageContent: string;
  conversationContext?: string;
}
