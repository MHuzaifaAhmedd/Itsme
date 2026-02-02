/**
 * Diagram explanations for Sharaf ul Quran Case Study
 * Based on CASE_STUDY_ENHANCED.md Diagram Explanations section
 */

export interface DiagramExplanation {
  whatItRepresents: string;
  howToRead: string;
  engineeringDecision: string;
}

export const sharafulQuranDiagramExplanations: Record<string, DiagramExplanation> = {
  'system-architecture': {
    whatItRepresents:
      'The full topology of Sharaf ul Quran: main and admin frontends, main and admin backends, PostgreSQL, and external systems (Stripe, Google Calendar, Fireflies, SMTP, WhatsApp, Socket.io). It shows which components exist and how they are grouped (frontend, backend, db, external).',
    howToRead: `Nodes are systems or services; edges indicate primary communication (e.g. Frontend → Backend, Backend → PostgreSQL, Backend → Stripe). Follow edges to see request direction (e.g. user → main frontend → main backend) and integration points (webhooks from Stripe/Fireflies to main backend). The split between main and admin is visible in the two frontend and two backend nodes.`,
    engineeringDecision:
      'Dual frontend/backend split for role isolation; single database shared by both backends; webhooks as inbound edges from Stripe and Fireflies; Socket.io as a service used by the main backend to push to the main frontend.',
  },

  'authentication-flow': {
    whatItRepresents:
      'The path from user action (register, login, OAuth callback) through backend verification and token issuance to role-based redirect and subsequent authenticated requests. Includes branches for email/password vs OAuth and for student/Qari vs admin.',
    howToRead: `Start at "User" or "Frontend"; follow edges through "Backend" (auth routes, token generation, cookie set) and back to "Frontend" (profile fetch, redirect). Admin flow goes to Admin Backend and Admin Frontend. Edges are labeled with the main data or action (e.g. "JWT cookie", "Profile", "403 if admin on main").`,
    engineeringDecision:
      'Single user store with role; main backend rejecting admin tokens; cookie-based JWT; profile endpoint for cookie clients; OAuth callback cleanup and profile fetch.',
  },

  'core-feature-lifecycle-booking': {
    whatItRepresents:
      'One-time booking flow: student → slot selection → payment → webhook → Meet + notifications. Nodes are steps or systems; edges are "next step" or "sends to".',
    howToRead: `Follow from the first user action ("Select Qari & slot") through backend steps (create PaymentIntent, create booking record) to external events (Stripe webhook) and back to backend (update status, create Meet, send email/WhatsApp).`,
    engineeringDecision:
      'Webhook as source of truth for payment; separation of "create intent" vs "confirm and fulfill"; notifications as best-effort after confirmation.',
  },

  'core-feature-lifecycle-course': {
    whatItRepresents:
      'Course enrollment flow: enroll → admin approval → payment → webhook → state machine → sessions. Shows state transitions and idempotent webhook handling.',
    howToRead: `Follow state transitions (pending_approval → approved_unpaid → active) and webhook idempotency (webhook_events, claimForProcessing). Admin approves and assigns slot; Stripe webhook triggers state machine; course_sessions generated on active.`,
    engineeringDecision:
      'State machine for course enrollment; idempotent webhook processing to handle Stripe retries and concurrency; course webhook returns 200 on processing error to avoid retry storms.',
  },

  'data-processing-flow': {
    whatItRepresents:
      'Movement of data between Frontend, Backend, PostgreSQL, Stripe, Google Calendar, SMTP, WhatsApp, and Fireflies. Emphasizes who sends what and on what trigger.',
    howToRead: `Each edge is a data flow; labels describe the data (e.g. "Auth credentials", "PaymentIntent creation", "Webhook event"). Triggers are implied or in edge labels (e.g. "Payment completion"). Bidirectional flows (e.g. Backend ↔ PostgreSQL) show read/write.`,
    engineeringDecision:
      'Webhook-driven payment updates; backend as the only writer to PostgreSQL; backend as orchestrator for Stripe, Google, SMTP, WhatsApp; Fireflies pushing to backend; Socket.io pushing from backend to frontend.',
  },

  'performance-decision-flow': {
    whatItRepresents:
      'Where performance and caching decisions are made: admin stats (cache hit vs miss, TTL 30s/2min), rate limiting (request → allow/block), resource serve (middleware check → allow/deny), and cron schedule (every 5 min → session notification job).',
    howToRead: `Start at "Request" or "Cron tick"; follow through "Rate limiter", "Cache lookup", "DB query", "Middleware check". Decision nodes (e.g. "Cache hit?") branch to "Use cached stats" vs "Query DB & set cache". Edges can be labeled with "30s TTL", "Deny if no paid booking", etc.`,
    engineeringDecision:
      'In-memory cache for admin stats with fixed TTLs; rate limiting at the gateway; resource access as an explicit check before serve; file streaming; no Redis (single-process cache).',
  },
};
