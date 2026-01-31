/**
 * NEXI AI Chatbot - Rate Limiter
 * 
 * In-memory IP-based rate limiting for portfolio-scale usage.
 * Strict limits to control costs: 10 req/min, 50 req/hour, 200 req/day.
 */

import type { RateLimitEntry, RateLimitResult, RateLimitConfig } from './types';

// =============================================================================
// Configuration
// =============================================================================

const DEFAULT_LIMITS: RateLimitConfig = {
  perMinute: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '10', 10),
  perHour: parseInt(process.env.RATE_LIMIT_PER_HOUR || '50', 10),
  perDay: parseInt(process.env.RATE_LIMIT_PER_DAY || '200', 10),
};

// Time windows in milliseconds
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

// =============================================================================
// In-Memory Store
// =============================================================================

interface RateLimitStore {
  minute: Map<string, RateLimitEntry>;
  hour: Map<string, RateLimitEntry>;
  day: Map<string, RateLimitEntry>;
}

const store: RateLimitStore = {
  minute: new Map(),
  hour: new Map(),
  day: new Map(),
};

// =============================================================================
// Cleanup Expired Entries
// =============================================================================

function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, entry] of store.minute) {
    if (entry.resetAt <= now) {
      store.minute.delete(key);
    }
  }
  
  for (const [key, entry] of store.hour) {
    if (entry.resetAt <= now) {
      store.hour.delete(key);
    }
  }
  
  for (const [key, entry] of store.day) {
    if (entry.resetAt <= now) {
      store.day.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * MINUTE_MS);
}

// =============================================================================
// Rate Limit Check
// =============================================================================

function checkWindow(
  map: Map<string, RateLimitEntry>,
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = map.get(ip);
  
  if (!entry || entry.resetAt <= now) {
    // Create new entry
    map.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  
  if (entry.count >= limit) {
    // Rate limited
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  
  // Increment count
  entry.count++;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// =============================================================================
// Public API
// =============================================================================

export function checkRateLimit(
  ip: string,
  limits: RateLimitConfig = DEFAULT_LIMITS
): RateLimitResult {
  // Check minute limit first (most restrictive window)
  const minuteResult = checkWindow(store.minute, ip, limits.perMinute, MINUTE_MS);
  if (!minuteResult.allowed) {
    const retryAfter = Math.ceil((minuteResult.resetAt - Date.now()) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      error: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
    };
  }
  
  // Check hour limit
  const hourResult = checkWindow(store.hour, ip, limits.perHour, HOUR_MS);
  if (!hourResult.allowed) {
    const retryAfter = Math.ceil((hourResult.resetAt - Date.now()) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      error: `Hourly rate limit exceeded. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
    };
  }
  
  // Check day limit (soft limit - log warning but allow)
  const dayResult = checkWindow(store.day, ip, limits.perDay, DAY_MS);
  if (!dayResult.allowed) {
    console.warn(`[Rate Limiter] Daily limit exceeded for IP: ${ip.slice(0, 8)}...`);
    // Still return allowed but with warning (soft limit)
    return {
      allowed: true,
      remaining: 0,
      error: 'Daily limit reached. Responses may be slower.',
    };
  }
  
  return {
    allowed: true,
    remaining: Math.min(minuteResult.remaining, hourResult.remaining),
  };
}

// =============================================================================
// IP Extraction Helper
// =============================================================================

export function getClientIP(request: Request): string {
  // Check various headers for the real IP (behind proxies/CDN)
  const headers = request.headers;
  
  // Vercel/Cloudflare
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  
  // X-Forwarded-For (first IP in chain)
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIP = xForwardedFor.split(',')[0].trim();
    return firstIP;
  }
  
  // X-Real-IP
  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) return xRealIP;
  
  // Vercel specific
  const vercelIP = headers.get('x-vercel-forwarded-for');
  if (vercelIP) {
    const firstIP = vercelIP.split(',')[0].trim();
    return firstIP;
  }
  
  // Fallback
  return 'unknown';
}

// =============================================================================
// Reset Rate Limit (for testing)
// =============================================================================

export function resetRateLimit(ip: string): void {
  store.minute.delete(ip);
  store.hour.delete(ip);
  store.day.delete(ip);
}

export function resetAllRateLimits(): void {
  store.minute.clear();
  store.hour.clear();
  store.day.clear();
}
