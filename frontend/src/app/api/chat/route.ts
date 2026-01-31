/**
 * NEXI AI Chatbot - API Route Handler
 * 
 * SSE streaming endpoint for chat completions.
 * POST /api/chat
 */

import { NextRequest } from 'next/server';
import {
  streamChatCompletion,
  isProviderConfigured,
  buildSystemPrompt,
  getPortfolioContext,
  checkRateLimit,
  getClientIP,
  ERROR_MESSAGES,
} from '@/app/lib/chat';
import type { ChatRequest, ValidationResult } from '@/app/lib/chat/types';

// =============================================================================
// Configuration
// =============================================================================

const VALIDATION_LIMITS = {
  maxMessageLength: 300,
  maxConversationHistory: 6,
};

// =============================================================================
// Request Validation
// =============================================================================

function validateRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const { messages } = body as ChatRequest;
  
  if (!Array.isArray(messages) || messages.length === 0) {
    return { valid: false, error: 'Messages array is required' };
  }
  
  // Limit conversation history
  if (messages.length > VALIDATION_LIMITS.maxConversationHistory) {
    return { valid: false, error: 'Too many messages in conversation' };
  }
  
  // Validate each message
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return { valid: false, error: 'Invalid message format' };
    }
    
    if (!['user', 'assistant'].includes(msg.role)) {
      return { valid: false, error: 'Invalid message role' };
    }
    
    if (typeof msg.content !== 'string') {
      return { valid: false, error: 'Message content must be a string' };
    }
    
    // Check message length (only for user messages)
    if (msg.role === 'user' && msg.content.length > VALIDATION_LIMITS.maxMessageLength) {
      return { valid: false, error: ERROR_MESSAGES.MESSAGE_TOO_LONG };
    }
  }
  
  // Sanitize content (basic HTML stripping)
  const sanitizedMessages = messages.map(msg => ({
    ...msg,
    content: msg.content
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .trim(),
  }));
  
  return { 
    valid: true, 
    sanitizedContent: JSON.stringify(sanitizedMessages),
  };
}

// =============================================================================
// SSE Stream Helper
// =============================================================================

function createSSEStream(
  generator: AsyncGenerator<string, void, unknown>,
  onError?: (error: Error) => void
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const data = JSON.stringify({ type: 'content', content: chunk });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        
        // Send done signal
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      } catch (error) {
        console.error('[Chat API] Stream error:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorData = JSON.stringify({ type: 'error', error: errorMessage });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        
        if (onError && error instanceof Error) {
          onError(error);
        }
      } finally {
        controller.close();
      }
    },
  });
}

// =============================================================================
// Route Handler
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Check if provider is configured
    if (!isProviderConfigured()) {
      console.error('[Chat API] AI provider not configured');
      return Response.json(
        { success: false, error: ERROR_MESSAGES.PROVIDER_UNAVAILABLE },
        { status: 503 }
      );
    }
    
    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return Response.json(
        { success: false, error: ERROR_MESSAGES.RATE_LIMITED },
        { 
          status: 429,
          headers: rateLimitResult.retryAfter 
            ? { 'Retry-After': String(rateLimitResult.retryAfter) }
            : undefined,
        }
      );
    }
    
    // 3. Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    const validation = validateRequest(body);
    if (!validation.valid) {
      return Response.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }
    
    // 4. Build system prompt with portfolio context
    const portfolioContext = getPortfolioContext();
    const systemPrompt = buildSystemPrompt(portfolioContext);
    
    // 5. Get sanitized messages
    const { messages } = body as ChatRequest;
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content.replace(/<[^>]*>/g, '').trim(),
    }));
    
    // 6. Create streaming response
    const stream = streamChatCompletion({
      messages: sanitizedMessages,
      systemPrompt,
      maxTokens: 500,
    });
    
    const sseStream = createSSEStream(stream, (error) => {
      console.error('[Chat API] Streaming error:', error.message);
    });
    
    // 7. Return SSE response
    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
    
  } catch (error) {
    console.error('[Chat API] Unhandled error:', error);
    
    return Response.json(
      { success: false, error: ERROR_MESSAGES.GENERIC_ERROR },
      { status: 500 }
    );
  }
}

// =============================================================================
// Health Check (GET)
// =============================================================================

export async function GET() {
  const configured = isProviderConfigured();
  
  return Response.json({
    status: configured ? 'ok' : 'not_configured',
    message: configured 
      ? 'NEXI chat API is ready' 
      : 'AI provider not configured',
  });
}
