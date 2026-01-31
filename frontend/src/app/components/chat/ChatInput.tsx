"use client";

import { useState, useRef, useCallback, useEffect, KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MIN_HEIGHT = 44;
const MAX_HEIGHT = 120;

/**
 * ChatInput - Auto-resizing textarea with send button
 */
export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask me anything...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showScrollbar, setShowScrollbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    
    // Only show scrollbar if content exceeds max height
    const needsScroll = scrollHeight > MAX_HEIGHT;
    setShowScrollbar(needsScroll);
    
    // Set to scrollHeight but cap at max height and respect min height
    const newHeight = Math.max(MIN_HEIGHT, Math.min(scrollHeight, MAX_HEIGHT));
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter to send (without shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const isOverLimit = value.length > 300;
  const canSend = value.trim().length > 0 && !disabled && !isOverLimit;

  return (
    <div className="border-t border-neutral-800 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={`w-full resize-none rounded-xl border bg-neutral-800 px-4 py-2.5 text-sm leading-6 text-neutral-100 placeholder-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${
              isOverLimit
                ? "border-red-500/50 focus:ring-red-500/50"
                : "border-neutral-700"
            } ${showScrollbar ? "overflow-y-auto" : "overflow-hidden"}`}
            style={{ minHeight: "44px", maxHeight: `${MAX_HEIGHT}px` }}
            aria-label="Message input"
          />

          {/* Character count (shown when approaching limit) */}
          {value.length > 200 && (
            <span
              className={`absolute bottom-1.5 right-3 text-[10px] ${
                isOverLimit ? "text-red-400" : "text-neutral-500"
              }`}
            >
              {value.length}/300
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-600"
          aria-label="Send message"
        >
          {disabled ? (
            // Loading spinner
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            // Send icon
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="mt-2 text-center text-[10px] text-neutral-500">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
