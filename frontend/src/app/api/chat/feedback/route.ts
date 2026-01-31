/**
 * NEXI AI Chatbot - Feedback API Route
 * 
 * Handles user feedback (thumbs up/down) on chat messages.
 * Stores feedback for analytics and prompt improvement.
 */

import { NextRequest, NextResponse } from "next/server";

// In-memory storage for feedback (in production, use a database)
interface FeedbackEntry {
  id: string;
  messageId: string;
  feedback: "positive" | "negative" | null;
  messageContent: string;
  timestamp: string;
  userAgent?: string;
}

// Simple in-memory storage (replace with database in production)
const feedbackStore: FeedbackEntry[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, feedback, messageContent, timestamp } = body;

    // Validate required fields
    if (!messageId) {
      return NextResponse.json(
        { error: "messageId is required" },
        { status: 400 }
      );
    }

    // Create feedback entry
    const entry: FeedbackEntry = {
      id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      messageId,
      feedback,
      messageContent: messageContent?.slice(0, 500) || "", // Truncate for storage
      timestamp: timestamp || new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || undefined,
    };

    // Store feedback
    feedbackStore.push(entry);

    // Keep only last 1000 entries in memory
    if (feedbackStore.length > 1000) {
      feedbackStore.shift();
    }

    // Log for monitoring
    console.log(`[Feedback] ${feedback || "removed"} for message ${messageId}`);

    return NextResponse.json({
      success: true,
      id: entry.id,
    });
  } catch (error) {
    console.error("[Feedback API] Error:", error);
    return NextResponse.json(
      { error: "Failed to process feedback" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feedback statistics
export async function GET() {
  // Calculate statistics
  const total = feedbackStore.length;
  const positive = feedbackStore.filter(f => f.feedback === "positive").length;
  const negative = feedbackStore.filter(f => f.feedback === "negative").length;
  
  // Get recent feedback (last 10)
  const recent = feedbackStore.slice(-10).reverse();

  return NextResponse.json({
    statistics: {
      total,
      positive,
      negative,
      positiveRate: total > 0 ? (positive / total * 100).toFixed(1) + "%" : "N/A",
    },
    recent: recent.map(f => ({
      id: f.id,
      feedback: f.feedback,
      timestamp: f.timestamp,
      contentPreview: f.messageContent.slice(0, 100) + (f.messageContent.length > 100 ? "..." : ""),
    })),
  });
}
