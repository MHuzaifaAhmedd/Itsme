/**
 * NEXI AI Chatbot - Sentry Client Configuration
 * 
 * This file configures the Sentry SDK for client-side error tracking.
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

    // Session Replay (optional - captures user interactions)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only enable in production
    enabled: process.env.NODE_ENV === "production",

    // Debug mode for development
    debug: process.env.NODE_ENV === "development",

    // Filter out specific errors
    beforeSend(event, hint) {
      const error = hint.originalException;

      // Ignore network errors from ad blockers, extensions, etc.
      if (error instanceof Error) {
        if (
          error.message.includes("Network request failed") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("Load failed")
        ) {
          // Only report if it's related to our API
          const errorString = String(error);
          if (!errorString.includes("/api/chat")) {
            return null;
          }
        }
      }

      return event;
    },

    // Tag chat-related errors
    beforeSendTransaction(event) {
      if (event.transaction?.includes("/api/chat")) {
        event.tags = {
          ...event.tags,
          feature: "nexi-chat",
        };
      }
      return event;
    },

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
  });
}

export {};
