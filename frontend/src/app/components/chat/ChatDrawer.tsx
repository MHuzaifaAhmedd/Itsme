"use client";

import { useEffect, useRef, useCallback, useReducer, useState } from "react";
import gsap from "gsap";
import ChatMessage from "./ChatMessage";
import ChatInput, { ChatInputHandle } from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import QuickReplies from "./QuickReplies";
import type { ChatMessage as ChatMessageType, ChatState, ChatAction, FeedbackType } from "@/app/lib/chat/types";

// =============================================================================
// Swipe Gesture Hook
// =============================================================================

interface SwipeState {
  startY: number;
  currentY: number;
  isDragging: boolean;
}

function useSwipeToClose(
  elementRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
  isEnabled: boolean
) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startY: 0,
    currentY: 0,
    isDragging: false,
  });
  
  const SWIPE_THRESHOLD = 100; // pixels to trigger close
  const DRAG_RESISTANCE = 0.5; // resistance factor

  useEffect(() => {
    if (!isEnabled || !elementRef.current) return;
    
    const element = elementRef.current;
    
    const handleTouchStart = (e: TouchEvent) => {
      // Only start swipe from top 60px (header area)
      const touch = e.touches[0];
      const rect = element.getBoundingClientRect();
      const relativeY = touch.clientY - rect.top;
      
      if (relativeY <= 60) {
        setSwipeState({
          startY: touch.clientY,
          currentY: touch.clientY,
          isDragging: true,
        });
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!swipeState.isDragging) return;
      
      const touch = e.touches[0];
      const deltaY = touch.clientY - swipeState.startY;
      
      // Only allow downward swipe
      if (deltaY > 0) {
        const dragAmount = deltaY * DRAG_RESISTANCE;
        gsap.set(element, { y: dragAmount });
        setSwipeState(prev => ({ ...prev, currentY: touch.clientY }));
      }
    };
    
    const handleTouchEnd = () => {
      if (!swipeState.isDragging) return;
      
      const deltaY = swipeState.currentY - swipeState.startY;
      
      if (deltaY > SWIPE_THRESHOLD) {
        // Close the drawer
        onClose();
      } else {
        // Snap back to original position
        gsap.to(element, { y: 0, duration: 0.3, ease: "power2.out" });
      }
      
      setSwipeState({ startY: 0, currentY: 0, isDragging: false });
    };
    
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd);
    element.addEventListener("touchcancel", handleTouchEnd);
    
    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [elementRef, onClose, isEnabled, swipeState.isDragging, swipeState.startY, swipeState.currentY]);
  
  return swipeState.isDragging;
}

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
    case "SET_FEEDBACK":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, feedback: action.payload.feedback }
            : msg
        ),
      };
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputHandle>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Check if mobile (for swipe gesture)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  
  // Enable swipe-to-close on mobile
  useSwipeToClose(drawerRef, onClose, isOpen && isMobile);

  // =============================================================================
  // Keyboard Shortcuts
  // =============================================================================
  
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // =============================================================================
  // Focus Management
  // =============================================================================
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure drawer animation has started
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Focus trap - keep focus within drawer when open
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;
    
    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    drawer.addEventListener("keydown", handleTabKey);
    return () => drawer.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

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
      gsap.set(drawerRef.current, { display: "flex", y: 0 });
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
    if (messagesContainerRef.current && state.messages.length > 0) {
      const container = messagesContainerRef.current;
      // Scroll to bottom smoothly
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
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
        const message =
          errorData.error ??
          (typeof errorData.detail === 'string' ? errorData.detail : null) ??
          `Request failed: ${response.status}`;
        throw new Error(message);
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

  // Handle feedback (thumbs up/down)
  const handleFeedback = useCallback(async (messageId: string, feedback: FeedbackType) => {
    dispatch({ type: "SET_FEEDBACK", payload: { id: messageId, feedback } });
    
    // Find the message to get its content
    const message = state.messages.find(m => m.id === messageId);
    if (!message) return;
    
    // Send feedback to analytics endpoint (fire and forget)
    try {
      await fetch("/api/chat/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          feedback,
          messageContent: message.content,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.debug("Failed to send feedback:", err);
    }
  }, [state.messages]);

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
        aria-labelledby="chat-title"
        aria-describedby="chat-description"
        className="fixed bottom-0 right-0 z-70 hidden h-full w-full flex-col overflow-hidden bg-neutral-900/95 backdrop-blur-md md:bottom-24 md:right-6 md:h-[600px] md:w-[400px] md:rounded-3xl md:border md:border-neutral-800 md:shadow-2xl"
      >
        {/* Hidden description for screen readers */}
        <p id="chat-description" className="sr-only">
          Chat with NEXI, the AI Portfolio Assistant. Ask about projects, skills, or how to get in touch.
          Press Escape to close. On mobile, swipe down from the header to close.
        </p>
        {/* Header */}
        <div className="shrink-0 border-b border-neutral-800">
          {/* Swipe indicator - visible on mobile only */}
          <div className="flex justify-center py-2 md:hidden">
            <div className="h-1 w-10 rounded-full bg-neutral-600" aria-hidden="true" />
          </div>
          
          <div className="flex items-center justify-between px-4 py-3 md:py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm font-bold text-white" aria-hidden="true">N</span>
              </div>
              <div>
                <h2 id="chat-title" className="text-sm font-semibold text-neutral-100">NEXI</h2>
                <p className="text-xs text-neutral-400">AI Portfolio Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {state.messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                  aria-label="Clear chat history"
                  title="Clear chat (start fresh)"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
                aria-label="Close chat (or press Escape)"
                title="Close chat (Esc)"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="min-h-0 flex-1 px-4 py-4"
          style={{
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            scrollbarWidth: 'thin',
            scrollbarColor: '#525252 transparent',
          }}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          onWheel={(e) => e.stopPropagation()}
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
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onFeedback={handleFeedback}
                />
              ))}
              {state.isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Banner */}
        {state.error && (
          <div className="mx-4 mb-2 shrink-0 rounded-lg bg-red-900/50 px-3 py-2 text-sm text-red-200">
            {state.error}
          </div>
        )}

        {/* Input */}
        <ChatInput
          ref={inputRef}
          onSend={sendMessage}
          disabled={state.isLoading || state.isStreaming}
        />
      </div>
    </>
  );
}
