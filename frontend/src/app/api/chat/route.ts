/**
 * NEXI AI Chatbot - API Route Handler
 * 
 * SSE streaming endpoint for chat completions.
 * Proxies requests to Python FastAPI service with fallback to direct LLM calls.
 * 
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

// Python service URL (default to localhost:8000 for development)
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

// Whether to use Python service (set to false to use direct LLM calls)
const USE_PYTHON_SERVICE = process.env.USE_PYTHON_SERVICE !== 'false';

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
// Python Service Proxy
// =============================================================================

async function checkPythonServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.status === 'ok' && data.configured === true;
  } catch {
    return false;
  }
}

async function proxyToPythonService(
  messages: Array<{ role: string; content: string }>,
  sessionId?: string
): Promise<Response> {
  const response = await fetch(`${PYTHON_SERVICE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      session_id: sessionId,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail ?? errorData.error ?? `Python service error: ${response.status}`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  
  return response;
}

// =============================================================================
// SSE Stream Helper (for fallback mode)
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
    // 1. Rate limiting (always in Next.js)
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
    
    // 2. Parse and validate request body (always in Next.js)
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
    
    // 3. Get sanitized messages
    const { messages, sessionId } = body as ChatRequest & { sessionId?: string };
    const sanitizedMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content.replace(/<[^>]*>/g, '').trim(),
    }));
    
    // 4. Try Python service first, fallback to direct LLM calls
    let usePython = USE_PYTHON_SERVICE;
    
    if (usePython) {
      // Check if Python service is healthy
      const pythonHealthy = await checkPythonServiceHealth();
      
      if (pythonHealthy) {
        console.log('[Chat API] Using Python service');
        
        try {
          // Proxy to Python service
          const pythonResponse = await proxyToPythonService(sanitizedMessages, sessionId);
          
          // Forward the SSE stream from Python service
          return new Response(pythonResponse.body, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache, no-transform',
              'Connection': 'keep-alive',
              'X-Accel-Buffering': 'no',
            },
          });
        } catch (error) {
          console.error('[Chat API] Python service error, falling back:', error);
          usePython = false;
        }
      } else {
        console.log('[Chat API] Python service not available, using fallback');
        usePython = false;
      }
    }
    
    // 5. Fallback: Direct LLM calls via Next.js
    if (!usePython) {
      // Check if provider is configured for fallback
      if (!isProviderConfigured()) {
        console.error('[Chat API] AI provider not configured');
        return Response.json(
          { success: false, error: ERROR_MESSAGES.PROVIDER_UNAVAILABLE },
          { status: 503 }
        );
      }
      
      console.log('[Chat API] Using fallback (direct LLM calls)');
      
      // Build system prompt with portfolio context
      const portfolioContext = getPortfolioContext();
      const systemPrompt = buildSystemPrompt(portfolioContext);
      
      // Create streaming response
      const stream = streamChatCompletion({
        messages: sanitizedMessages,
        systemPrompt,
        maxTokens: 500,
      });
      
      const sseStream = createSSEStream(stream, (error) => {
        console.error('[Chat API] Streaming error:', error.message);
      });
      
      return new Response(sseStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }
    
    // Should not reach here
    return Response.json(
      { success: false, error: ERROR_MESSAGES.GENERIC_ERROR },
      { status: 500 }
    );
    
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
  // Check Python service health
  const pythonHealthy = USE_PYTHON_SERVICE ? await checkPythonServiceHealth() : false;
  
  // Check direct provider as fallback
  const directConfigured = isProviderConfigured();
  
  const status = pythonHealthy || directConfigured ? 'ok' : 'not_configured';
  
  return Response.json({
    status,
    message: status === 'ok' 
      ? 'NEXI chat API is ready' 
      : 'AI provider not configured',
    mode: pythonHealthy ? 'python_service' : 'direct_fallback',
    python_service: {
      url: PYTHON_SERVICE_URL,
      enabled: USE_PYTHON_SERVICE,
      healthy: pythonHealthy,
    },
    fallback: {
      configured: directConfigured,
    },
  });
}
