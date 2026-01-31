/**
 * NEXI AI Chatbot - Sentry Edge Configuration
 * 
 * This file configures the Sentry SDK for edge runtime error tracking.
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize if DSN is configured
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment
    environment: process.env.NODE_ENV,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Only enable in production
    enabled: process.env.NODE_ENV === "production",

    // Debug mode
    debug: false,
  });
}

export {};
