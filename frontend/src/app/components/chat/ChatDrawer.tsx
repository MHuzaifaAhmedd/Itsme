"use client";

import { useEffect, useRef, useCallback, useReducer } from "react";
import gsap from "gsap";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import QuickReplies from "./QuickReplies";
import type { ChatMessage as ChatMessageType, ChatState, ChatAction } from "@/app/lib/chat/types";

// =============================================================================
// State Reducer
// =============================================================================

const initialState: ChatState = {
  messages: [],
  isOpen: false,
  isLoading: false,
  isStreaming: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "OPEN_CHAT":
      return { ...state, isOpen: true };
    case "CLOSE_CHAT":
      return { ...state, isOpen: false };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "UPDATE_STREAMING_MESSAGE":
      return {
        ...state,
        isStreaming: true,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: msg.content + action.payload.content, isStreaming: true }
            : msg
        ),
      };
    case "FINISH_STREAMING":
      return {
        ...state,
        isStreaming: false,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? { ...msg, isStreaming: false } : msg
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_STREAMING":
      return { ...state, isStreaming: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    default:
      return state;
  }
}

// =============================================================================
// ChatDrawer Component
// =============================================================================

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // =============================================================================
  // Animations
  // =============================================================================

  useEffect(() => {
    if (!drawerRef.current || !backdropRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isOpen) {
      // Show drawer
      gsap.set(drawerRef.current, { display: "flex" });
      gsap.set(backdropRef.current, { display: "block" });

      if (prefersReducedMotion) {
        gsap.set(drawerRef.current, { opacity: 1, y: 0 });
        gsap.set(backdropRef.current, { opacity: 1 });
      } else {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.fromTo(
          drawerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
        );
      }
    } else {
      // Hide drawer
      if (prefersReducedMotion) {
        gsap.set(drawerRef.current, { display: "none" });
        gsap.set(backdropRef.current, { display: "none" });
      } else {
        gsap.to(drawerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => {
            gsap.set(drawerRef.current, { display: "none" });
          },
        });
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(backdropRef.current, { display: "none" });
          },
        });
      }
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages, state.isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // =============================================================================
  // Message Handling
  // =============================================================================

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading || state.isStreaming) return;

    // Add user message
    const userMessage: ChatMessageType = {
      id: generateMessageId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    // Prepare messages for API (last 6 messages)
    const conversationHistory = [...state.messages, userMessage]
      .slice(-6)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Create assistant message placeholder (starts as streaming)
    const assistantMessageId = generateMessageId();
    const assistantMessage: ChatMessageType = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
    dispatch({ type: "SET_LOADING", payload: false });
    dispatch({ type: "SET_STREAMING", payload: true });

    // Start streaming
    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: conversationHistory }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Process SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Mark as streaming
      dispatch({ type: "SET_LOADING", payload: false });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmedLine.slice(6));

            if (data.type === "content" && data.content) {
              dispatch({
                type: "UPDATE_STREAMING_MESSAGE",
                payload: { id: assistantMessageId, content: data.content },
              });
            } else if (data.type === "done") {
              dispatch({ type: "FINISH_STREAMING", payload: { id: assistantMessageId } });
            } else if (data.type === "error") {
              throw new Error(data.error || "Stream error");
            }
          } catch {
            // Skip malformed chunks
            console.debug("Skipping malformed SSE chunk");
          }
        }
      }

      dispatch({ type: "FINISH_STREAMING", payload: { id: assistantMessageId } });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return; // User cancelled
      }

      console.error("[ChatDrawer] Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      dispatch({ type: "SET_ERROR", payload: errorMessage });

      // Update assistant message with error
      dispatch({
        type: "UPDATE_STREAMING_MESSAGE",
        payload: {
          id: assistantMessageId,
          content: "Sorry, I encountered an error. Please try again.",
        },
      });
      dispatch({ type: "FINISH_STREAMING", payload: { id: assistantMessageId } });
    }
  }, [state.messages, state.isLoading, state.isStreaming]);

  const handleQuickReply = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleClearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    dispatch({ type: "CLEAR_MESSAGES" });
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  // =============================================================================
  // Render
  // =============================================================================

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-60 hidden bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="nexi-chat-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Chat with NEXI"
        className="fixed bottom-0 right-0 z-70 hidden h-full w-full flex-col bg-neutral-900/95 backdrop-blur-md md:bottom-24 md:right-6 md:h-[600px] md:w-[400px] md:rounded-3xl md:border md:border-neutral-800 md:shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-100">NEXI</h2>
              <p className="text-xs text-neutral-400">AI Portfolio Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {state.messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
                aria-label="Clear chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200 md:hidden"
              aria-label="Close chat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {state.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
                <span className="text-2xl font-bold text-blue-500">N</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-100">
                Hi, I&apos;m NEXI!
              </h3>
              <p className="mb-6 max-w-[280px] text-sm text-neutral-400">
                I can tell you about projects, skills, and how to get in touch. What would you like to know?
              </p>
              <QuickReplies onSelect={handleQuickReply} />
            </div>
          ) : (
            <>
              {state.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {state.isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Banner */}
        {state.error && (
          <div className="mx-4 mb-2 rounded-lg bg-red-900/50 px-3 py-2 text-sm text-red-200">
            {state.error}
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={state.isLoading || state.isStreaming}
        />
      </div>
    </>
  );
}
