/**
 * NEXI AI Chatbot - Sentry Server Configuration
 * 
 * This file configures the Sentry SDK for server-side error tracking.
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

    // Debug mode for development
    debug: false,

    // Tag chat-related errors
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Add extra context for chat errors
      if (error instanceof Error && error.message.includes("chat")) {
        event.tags = {
          ...event.tags,
          feature: "nexi-chat",
        };
      }

      return event;
    },
  });
}

export {};
