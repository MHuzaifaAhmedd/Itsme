"use client";

import { useEffect, useRef, memo, useState, useCallback } from "react";
import gsap from "gsap";
import type { ChatMessage as ChatMessageType, FeedbackType } from "@/app/lib/chat/types";

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback?: (messageId: string, feedback: FeedbackType) => void;
}

/**
 * ChatMessage - Individual message bubble with smooth streaming support
 */
function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const messageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<FeedbackType>(message.feedback || null);
  const isUser = message.role === "user";
  const isStreaming = message.isStreaming && !isUser;

  // Copy message content to clipboard
  const handleCopy = useCallback(async () => {
    if (!message.content || isStreaming) return;
    
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [message.content, isStreaming]);

  // Handle feedback (thumbs up/down)
  const handleFeedback = useCallback((feedback: FeedbackType) => {
    // Toggle off if clicking same feedback
    const newFeedback = localFeedback === feedback ? null : feedback;
    setLocalFeedback(newFeedback);
    onFeedback?.(message.id, newFeedback);
  }, [localFeedback, message.id, onFeedback]);

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
      className={`group/message mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "w-fit rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md bg-neutral-800 text-neutral-100"
        }`}
      >
        {/* Avatar for assistant */}
        {!isUser && (
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30">
                <span className="text-[10px] font-bold text-blue-400">N</span>
              </div>
              <span className="text-xs font-medium text-neutral-400">NEXI</span>
            </div>
            {/* Copy button - always visible for assistant messages */}
            {!isStreaming && message.content && (
              <button
                onClick={handleCopy}
                className="ml-2 rounded p-1 text-neutral-500 transition-all hover:bg-neutral-700 hover:text-neutral-300"
                aria-label={copied ? "Copied!" : "Copy message"}
                title={copied ? "Copied!" : "Copy message"}
              >
                {copied ? (
                  <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            )}
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

        {/* Footer: Timestamp and Feedback */}
        {!isStreaming && (
          <div className={`mt-2 flex items-center justify-between ${isUser ? "" : "border-t border-neutral-700/50 pt-2"}`}>
            {/* Timestamp */}
            <div
              className={`text-[10px] opacity-0 transition-opacity group-hover/message:opacity-100 ${
                isUser ? "text-blue-200" : "text-neutral-500"
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            
            {/* Feedback buttons - only for assistant messages */}
            {!isUser && message.content && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/message:opacity-100">
                <span className="mr-1 text-[10px] text-neutral-500">Helpful?</span>
                <button
                  onClick={() => handleFeedback("positive")}
                  className={`rounded p-1 transition-all ${
                    localFeedback === "positive"
                      ? "bg-green-600/20 text-green-400"
                      : "text-neutral-500 hover:bg-neutral-700 hover:text-green-400"
                  }`}
                  aria-label="This response was helpful"
                  title="Helpful"
                >
                  <svg className="h-3.5 w-3.5" fill={localFeedback === "positive" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                </button>
                <button
                  onClick={() => handleFeedback("negative")}
                  className={`rounded p-1 transition-all ${
                    localFeedback === "negative"
                      ? "bg-red-600/20 text-red-400"
                      : "text-neutral-500 hover:bg-neutral-700 hover:text-red-400"
                  }`}
                  aria-label="This response was not helpful"
                  title="Not helpful"
                >
                  <svg className="h-3.5 w-3.5" fill={localFeedback === "negative" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders of non-streaming messages
// Note: copied and localFeedback states are internal and don't affect memo
export default memo(ChatMessage, (prevProps, nextProps) => {
  // Always re-render if streaming state, content, or feedback changes
  if (prevProps.message.isStreaming !== nextProps.message.isStreaming) return false;
  if (prevProps.message.content !== nextProps.message.content) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.feedback !== nextProps.message.feedback) return false;
  if (prevProps.onFeedback !== nextProps.onFeedback) return false;
  return true;
});
