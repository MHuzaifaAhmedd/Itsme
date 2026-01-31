/**
 * NEXI AI Chatbot - AI Provider Adapter
 * 
 * Supports OpenAI and Groq with single active provider at runtime.
 * Provider is selected via AI_PROVIDER environment variable.
 */

import type { AIProvider, AIProviderConfig, AIStreamOptions } from './types';

// =============================================================================
// Configuration
// =============================================================================

const PROVIDER_CONFIGS: Record<AIProvider, { defaultModel: string; baseUrl: string }> = {
  openai: {
    defaultModel: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
  },
  groq: {
    defaultModel: 'llama-3.1-8b-instant',
    baseUrl: 'https://api.groq.com/openai/v1',
  },
};

// =============================================================================
// Provider Detection
// =============================================================================

export function getActiveProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'groq';
  
  if (!['openai', 'groq'].includes(provider)) {
    console.warn(`Invalid AI_PROVIDER: ${provider}, falling back to groq`);
    return 'groq';
  }
  
  return provider as AIProvider;
}

export function getProviderConfig(): AIProviderConfig {
  const provider = getActiveProvider();
  const config = PROVIDER_CONFIGS[provider];
  
  // Get API key based on provider
  const apiKey = provider === 'openai' 
    ? process.env.OPENAI_API_KEY 
    : process.env.GROQ_API_KEY;
  
  // Get model from env or use default
  const model = process.env.AI_MODEL || config.defaultModel;
  
  // Max tokens for response
  const maxTokens = parseInt(process.env.AI_MAX_TOKENS || '500', 10);
  
  return {
    provider,
    model,
    apiKey: apiKey || '',
    maxTokens,
  };
}

export function isProviderConfigured(): boolean {
  const config = getProviderConfig();
  return !!config.apiKey;
}

// =============================================================================
// Streaming Implementation
// =============================================================================

export async function* streamChatCompletion(
  options: AIStreamOptions
): AsyncGenerator<string, void, unknown> {
  const config = getProviderConfig();
  
  if (!config.apiKey) {
    throw new Error(`API key not configured for provider: ${config.provider}`);
  }
  
  const providerConfig = PROVIDER_CONFIGS[config.provider];
  
  // Build messages array with system prompt
  const messages = [
    { role: 'system' as const, content: options.systemPrompt },
    ...options.messages,
  ];
  
  // Make streaming request
  const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: options.maxTokens || config.maxTokens,
      stream: true,
      temperature: 0.7,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AI Provider Error (${config.provider}):`, errorText);
    throw new Error(`AI provider returned ${response.status}: ${response.statusText}`);
  }
  
  if (!response.body) {
    throw new Error('Response body is null');
  }
  
  // Process the stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete SSE messages
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine || trimmedLine === 'data: [DONE]') {
          continue;
        }
        
        if (trimmedLine.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmedLine.slice(6));
            const content = json.choices?.[0]?.delta?.content;
            
            if (content) {
              yield content;
            }
          } catch {
            // Skip malformed JSON chunks
            console.debug('Skipping malformed chunk:', trimmedLine);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// =============================================================================
// Non-Streaming Implementation (Fallback)
// =============================================================================

export async function getChatCompletion(
  options: AIStreamOptions
): Promise<string> {
  const config = getProviderConfig();
  
  if (!config.apiKey) {
    throw new Error(`API key not configured for provider: ${config.provider}`);
  }
  
  const providerConfig = PROVIDER_CONFIGS[config.provider];
  
  const messages = [
    { role: 'system' as const, content: options.systemPrompt },
    ...options.messages,
  ];
  
  const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      max_tokens: options.maxTokens || config.maxTokens,
      stream: false,
      temperature: 0.7,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`AI Provider Error (${config.provider}):`, errorText);
    throw new Error(`AI provider returned ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
