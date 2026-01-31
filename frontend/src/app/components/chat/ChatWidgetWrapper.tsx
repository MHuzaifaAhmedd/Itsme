"use client";

import dynamic from "next/dynamic";

// Lazy-load ChatWidget for performance (no SSR needed)
// This must be in a Client Component to use ssr: false
const ChatWidget = dynamic(() => import("./ChatWidget"), {
  ssr: false,
});

/**
 * ChatWidgetWrapper - Client component wrapper for lazy-loading ChatWidget
 * Required because `ssr: false` is not allowed in Server Components
 */
export default function ChatWidgetWrapper() {
  return <ChatWidget />;
}
