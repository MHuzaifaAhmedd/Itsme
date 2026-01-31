"use client";

/**
 * TypingIndicator - Animated dots showing AI is responding
 */
export default function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-neutral-800 px-4 py-3">
        {/* Mini avatar */}
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600/30">
          <span className="text-[10px] font-bold text-blue-400">N</span>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: "0ms", animationDuration: "600ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: "150ms", animationDuration: "600ms" }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"
            style={{ animationDelay: "300ms", animationDuration: "600ms" }}
          />
        </div>
      </div>
    </div>
  );
}
