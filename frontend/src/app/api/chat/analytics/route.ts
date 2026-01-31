/**
 * NEXI AI Chatbot - Analytics API Route
 * 
 * Tracks conversation analytics including:
 * - Popular questions/topics
 * - Response times
 * - Drop-off points
 * - Usage patterns
 */

import { NextRequest, NextResponse } from "next/server";

// =============================================================================
// Analytics Data Structures
// =============================================================================

interface AnalyticsEvent {
  id: string;
  event: string;
  timestamp: string;
  sessionId?: string;
  data?: Record<string, unknown>;
}

interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  avgMessagesPerConversation: number;
  avgResponseTime: number;
  popularTopics: { topic: string; count: number }[];
}

// In-memory storage (replace with database in production)
const analyticsEvents: AnalyticsEvent[] = [];
const conversationMetrics: Map<string, {
  messageCount: number;
  startTime: number;
  lastMessageTime: number;
  responseTimes: number[];
}> = new Map();

// Topic keywords for categorization
const TOPIC_KEYWORDS: Record<string, string[]> = {
  projects: ["project", "built", "work", "portfolio", "case study", "ems", "whatsapp", "naba"],
  skills: ["skill", "tech", "technology", "stack", "language", "framework", "react", "node", "python"],
  contact: ["contact", "hire", "work with", "email", "reach", "available"],
  experience: ["experience", "years", "background", "career"],
  general: ["hello", "hi", "hey", "help", "what can you"],
};

// =============================================================================
// Helper Functions
// =============================================================================

function categorizeMessage(content: string): string {
  const lowerContent = content.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(kw => lowerContent.includes(kw))) {
      return topic;
    }
  }
  
  return "other";
}

function calculateStats(): ConversationStats {
  const conversations = Array.from(conversationMetrics.values());
  const totalConversations = conversations.length;
  const totalMessages = conversations.reduce((sum, c) => sum + c.messageCount, 0);
  
  const allResponseTimes = conversations.flatMap(c => c.responseTimes);
  const avgResponseTime = allResponseTimes.length > 0
    ? allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length
    : 0;
  
  // Count topics
  const topicCounts: Record<string, number> = {};
  analyticsEvents
    .filter(e => e.event === "message_sent")
    .forEach(e => {
      const topic = e.data?.topic as string || "other";
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  
  const popularTopics = Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    totalConversations,
    totalMessages,
    avgMessagesPerConversation: totalConversations > 0 ? totalMessages / totalConversations : 0,
    avgResponseTime: Math.round(avgResponseTime),
    popularTopics,
  };
}

// =============================================================================
// API Routes
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, sessionId, data } = body;

    // Validate event type
    const validEvents = [
      "chat_opened",
      "chat_closed",
      "message_sent",
      "response_received",
      "quick_reply_clicked",
      "chat_cleared",
    ];
    
    if (!validEvents.includes(event)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }

    // Create analytics event
    const analyticsEvent: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      event,
      timestamp: new Date().toISOString(),
      sessionId,
      data: {
        ...data,
        topic: data?.messageContent ? categorizeMessage(data.messageContent) : undefined,
      },
    };

    // Store event
    analyticsEvents.push(analyticsEvent);

    // Keep only last 5000 events in memory
    if (analyticsEvents.length > 5000) {
      analyticsEvents.shift();
    }

    // Update conversation metrics
    if (sessionId) {
      let metrics = conversationMetrics.get(sessionId);
      
      if (!metrics) {
        metrics = {
          messageCount: 0,
          startTime: Date.now(),
          lastMessageTime: Date.now(),
          responseTimes: [],
        };
        conversationMetrics.set(sessionId, metrics);
      }

      if (event === "message_sent") {
        metrics.messageCount++;
        metrics.lastMessageTime = Date.now();
      }

      if (event === "response_received" && data?.responseTime) {
        metrics.responseTimes.push(data.responseTime as number);
      }
    }

    return NextResponse.json({
      success: true,
      id: analyticsEvent.id,
    });
  } catch (error) {
    console.error("[Analytics API] Error:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const stats = calculateStats();
  
  // Get recent events (last 20)
  const recentEvents = analyticsEvents.slice(-20).reverse().map(e => ({
    id: e.id,
    event: e.event,
    timestamp: e.timestamp,
    topic: e.data?.topic,
  }));

  // Get hourly distribution (last 24 hours)
  const now = Date.now();
  const hourlyDistribution: Record<number, number> = {};
  
  analyticsEvents
    .filter(e => now - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000)
    .forEach(e => {
      const hour = new Date(e.timestamp).getHours();
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
    });

  return NextResponse.json({
    statistics: stats,
    recentEvents,
    hourlyDistribution,
    eventCount: analyticsEvents.length,
    uniqueSessions: conversationMetrics.size,
  });
}
