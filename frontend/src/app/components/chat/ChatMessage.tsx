"use client";

import { useEffect, useRef, memo } from "react";
import gsap from "gsap";
import type { ChatMessage as ChatMessageType } from "@/app/lib/chat/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * ChatMessage - Individual message bubble with smooth streaming support
 */
function ChatMessage({ message }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === "user";
  const isStreaming = message.isStreaming && !isUser;

  // Entrance animation (only on first render)
  useEffect(() => {
    if (!messageRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(messageRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      messageRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  // Simple markdown rendering
  const renderContent = (content: string) => {
    if (!content) return null;

    // Process markdown-like syntax
    const processed = content
      // Bold: **text** or __text__
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Inline code: `code`
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded bg-neutral-700/50 px-1.5 py-0.5 text-sm font-mono text-blue-300">$1</code>'
      )
      // Links: [text](url)
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline underline-offset-2 hover:text-blue-300">$1</a>'
      )
      // Line breaks
      .replace(/\n/g, "<br />");

    return processed;
  };

  return (
    <div
      ref={messageRef}
      className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md bg-neutral-800 text-neutral-100"
        }`}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30">
              <span className="text-[10px] font-bold text-blue-400">N</span>
            </div>
            <span className="text-xs font-medium text-neutral-400">NEXI</span>
          </div>
        )}

        {/* Message content with streaming cursor */}
        <div ref={contentRef} className="text-sm leading-relaxed">
          {message.content ? (
            <span className="wrap-break-word">
              <span
                dangerouslySetInnerHTML={{ __html: renderContent(message.content) || "" }}
              />
              {/* Blinking cursor for streaming */}
              {isStreaming && (
                <span className="streaming-cursor ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-blue-400" />
              )}
            </span>
          ) : isStreaming ? (
            // Show cursor even when content is empty (start of stream)
            <span className="streaming-cursor inline-block h-4 w-0.5 animate-pulse bg-blue-400" />
          ) : null}
        </div>

        {/* Timestamp (visible on hover) */}
        {!isStreaming && (
          <div
            className={`mt-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100 ${
              isUser ? "text-blue-200" : "text-neutral-500"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders of non-streaming messages
export default memo(ChatMessage, (prevProps, nextProps) => {
  // Always re-render if streaming state or content changes
  if (prevProps.message.isStreaming !== nextProps.message.isStreaming) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;
  return true;
});
