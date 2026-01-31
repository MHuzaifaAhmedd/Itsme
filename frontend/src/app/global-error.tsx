"use client";

/**
 * NEXI AI Chatbot - Global Error Boundary
 * 
 * Catches unhandled errors and reports them to Sentry.
 * This file handles errors in the root layout.
 */

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-4 text-center">
          <div className="max-w-md">
            <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-red-600/20">
              <svg 
                className="h-8 w-8 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            
            <h1 className="mb-2 text-2xl font-bold text-white">
              Something went wrong
            </h1>
            
            <p className="mb-6 text-neutral-400">
              An unexpected error occurred. Our team has been notified and is working on a fix.
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={reset}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Try again
              </button>
              
              <button
                onClick={() => window.location.href = "/"}
                className="rounded-lg border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
              >
                Go home
              </button>
            </div>
            
            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-400">
                  Error details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-neutral-800 p-3 text-xs text-red-400">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
