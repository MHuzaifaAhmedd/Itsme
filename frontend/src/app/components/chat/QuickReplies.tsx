"use client";

import type { QuickReply } from "@/app/lib/chat/types";

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

/**
 * QuickReplies - Predefined suggested questions
 */
const QUICK_REPLIES: QuickReply[] = [
  {
    id: "projects",
    text: "Tell me about your projects",
    category: "projects",
  },
  {
    id: "skills",
    text: "What's your tech stack?",
    category: "skills",
  },
  {
    id: "contact",
    text: "How can I work with you?",
    category: "contact",
  },
  {
    id: "ems",
    text: "Tell me about the EMS project",
    category: "projects",
  },
  {
    id: "sharaf-ul-quran",
    text: "Tell me about Sharaf ul Quran",
    category: "projects",
  },
];

export default function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {QUICK_REPLIES.map((reply) => (
        <button
          key={reply.id}
          onClick={() => onSelect(reply.text)}
          className="rounded-full border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm text-neutral-300 transition-all hover:border-blue-500/50 hover:bg-neutral-700/50 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {reply.text}
        </button>
      ))}
    </div>
  );
}
