/**
 * Diagram explanations for WhatsApp Funnel case study
 * Each explanation provides context for reading the interactive diagrams
 */

export interface DiagramExplanation {
  whatItRepresents: string;
  howToRead: string;
  engineeringDecision: string;
}

export const whatsappFunnelDiagramExplanations: Record<string, DiagramExplanation> = {
  'system-architecture': {
    whatItRepresents: 
      'The complete system topology showing how the WhatsApp Funnel platform is structured. Two separate frontend applications (User App and Admin Panel) connect to their respective Express backends, which share a single MongoDB database. External integrations include WhatsApp Cloud API, Facebook Graph API, Firebase for push notifications, AWS S3 for media storage, and SMTP for email delivery.',
    howToRead: 
      '1. Start from the frontend layer (blue nodes) - two Next.js applications\n' +
      '2. Follow the HTTP + Cookies connections down to the backend layer (green nodes)\n' +
      '3. Notice the Socket.IO connection enabling real-time bidirectional communication\n' +
      '4. Both backends connect to the shared MongoDB database (purple node)\n' +
      '5. The User App Backend integrates with multiple external services (red nodes)\n' +
      '6. Webhook payloads flow back from Facebook to the backend',
    engineeringDecision: 
      '• Monolith-per-application architecture enables independent deployment while maintaining clear separation\n' +
      '• Single MongoDB instance simplifies data consistency and admin visibility across businesses\n' +
      '• In-memory state (orange node) for CSRF/rate limits is noted as a scalability constraint\n' +
      '• Socket.IO provides room-based real-time updates without polling overhead',
  },

  'authentication-flow': {
    whatItRepresents: 
      'The complete authentication lifecycle covering email/password login, Google OAuth integration, and password reset flows. Also shows how the protect middleware verifies tokens on subsequent requests and applies role-based filtering.',
    howToRead: 
      '1. Auth entry points branch into three paths: email/password, Google OAuth, or password reset\n' +
      '2. Email login validates credentials via bcrypt comparison\n' +
      '3. Google OAuth redirects to consent screen, then handles callback\n' +
      '4. Both paths converge at Find/Create User, then Generate JWT\n' +
      '5. JWT is stored in HTTP-only cookie and user redirects to dashboard\n' +
      '6. Protected routes pass through protect middleware → JWT verification → user loading → role filtering',
    engineeringDecision: 
      '• JWT in HTTP-only cookies prevents XSS token theft while requiring CSRF protection\n' +
      '• Support for both cookie and Bearer token extraction accommodates different client types\n' +
      '• Role-based filtering happens at query time, not just route protection\n' +
      '• Business owners, team leads, and members have different visibility scopes',
  },

  'multi-channel-lead-ingestion': {
    whatItRepresents: 
      'How leads from five different sources (WhatsApp inbound, Facebook Lead Ads, Walk-in QR codes, External Webhooks, and Manual Entry) flow into a unified conversation system and get assigned to team members via configurable algorithms.',
    howToRead: 
      '1. Five lead sources enter at the top - external services and manual frontend entry\n' +
      '2. WhatsApp and Facebook flow through the Webhook Handler (verifies signatures)\n' +
      '3. All sources converge at the Lead Webhook Service for payload parsing\n' +
      '4. Channel validation checks if the channel exists and which members are allowed\n' +
      '5. The Assignment Service uses round-robin or biased round-robin based on config\n' +
      '6. RoundRobinTracking (purple) persists pointer state across server restarts\n' +
      '7. After conversation creation, both Socket.IO and FCM notify the assigned member',
    engineeringDecision: 
      '• Source-agnostic conversation model with a "source" field enables unified querying\n' +
      '• Channel-specific configuration allows different assignment rules per source\n' +
      '• Round-robin tracking persists in MongoDB to survive restarts\n' +
      '• Dual notification (Socket.IO + FCM) ensures delivery whether user is online or offline',
  },

  'flow-execution-lifecycle': {
    whatItRepresents: 
      'The lifecycle of visual automation flows from creation in the React Flow canvas, through storage in MongoDB, to execution when inbound messages arrive. Shows both the design-time save flow and runtime execution flow.',
    howToRead: 
      '1. LEFT PATH (Design): User composes flows on React Flow Canvas\n' +
      '2. Node types include trigger, message, condition, delay, action\n' +
      '3. Save hits POST /api/flow, which checks for phone number conflicts\n' +
      '4. Flows are stored in the Flows Collection\n' +
      '5. RIGHT PATH (Runtime): Inbound messages trigger Flow Message Service\n' +
      '6. Service looks up active flow for the phone number, finds matching trigger\n' +
      '7. Graph execution traverses edges and evaluates conditions\n' +
      '8. WhatsApp responses are sent and saved to Messages collection\n' +
      '9. Flow Re-enable Job periodically reactivates paused flows',
    engineeringDecision: 
      '• Phone number → flow exclusivity (one number, one active flow) prevents routing ambiguity\n' +
      '• Native React Flow nodes/edges storage enables lossless round-trip without transformation\n' +
      '• Background job handles flow re-enablement after rate-limit cooldowns\n' +
      '• Separation of design-time validation from runtime execution',
  },

  'real-time-message-flow': {
    whatItRepresents: 
      'The complete message flow showing how outbound messages travel from user action to WhatsApp and back, how inbound messages from WhatsApp reach the UI, and how status updates (delivered, read) propagate in real-time.',
    howToRead: 
      '1. User Frontend connects to Socket Provider on mount\n' +
      '2. Viewing a conversation triggers join_room with conversationId\n' +
      '3. Socket.IO Server tracks users in rooms with 5-minute stale cleanup\n' +
      '4. OUTBOUND: Send Message → Controller → WhatsApp API → Save → emit new_message\n' +
      '5. STATUS: WhatsApp Status Webhook → Update Status → emit status_update\n' +
      '6. INBOUND: Webhook → Save Inbound → emit new_message → Socket Provider\n' +
      '7. FCM Push fires for offline users when new messages arrive',
    engineeringDecision: 
      '• Room-based Socket.IO routing ensures only users viewing a conversation receive updates\n' +
      '• 5-minute stale connection cleanup prevents memory leaks from abandoned connections\n' +
      '• Dual notification path (Socket.IO for online, FCM for offline) ensures message delivery\n' +
      '• Status updates flow through the same Socket.IO channel as messages',
  },

  'data-processing-flow': {
    whatItRepresents: 
      'The complete request lifecycle from client through the Express middleware stack to controllers, services, data access, and external APIs. Shows how both authenticated API routes and webhook routes are processed.',
    howToRead: 
      '1. Client Request enters with Cookie (token) + JSON body\n' +
      '2. Middleware stack executes in order: trust proxy → Helmet → body-parser → CORS → ...\n' +
      '3. Note the limits: 55MB body for imports, 16MB default request size\n' +
      '4. Rate Limiter: 50/15min for auth routes, 10000/15min for general API\n' +
      '5. Route Match splits into /api/* (protected) or /webhook/* (unprotected)\n' +
      '6. Protected routes pass through protect middleware, webhooks verify tokens differently\n' +
      '7. Controller → Service Layer → Data Access or External APIs → Response\n' +
      '8. Errors are caught by Global Error Handler which maps types to HTTP status codes',
    engineeringDecision: 
      '• Middleware order matters: rate limiting before auth prevents DOS via auth endpoints\n' +
      '• Webhooks bypass rate limiting to ensure Facebook receives 200 response quickly\n' +
      '• 55MB body limit specifically accommodates large CSV lead imports\n' +
      '• CSRF token is attached but not enforced (security gap noted in analysis)',
  },

  'follow-up-system': {
    whatItRepresents: 
      'The follow-up management system showing creation, role-based visibility, automated reminders via background job, and completion workflow. Demonstrates how different user roles see different follow-ups.',
    howToRead: 
      '1. Create Follow-Up form submits to POST /api/followups\n' +
      '2. Follow-Up Controller creates document with createdBy reference\n' +
      '3. Listing follow-ups passes through Role-Based Filtering service\n' +
      '4. Rules: owners see all, team leads see own + team, members see only own\n' +
      '5. Follow-Up Reminder Job runs every 5 minutes\n' +
      '6. Queries for scheduledFor <= now AND !completed\n' +
      '7. Groups pending follow-ups by user, then sends Email and FCM notifications\n' +
      '8. Complete Follow-Up sets completed: true, removing from reminder queries',
    engineeringDecision: 
      '• Role-based visibility at query level, not just API access control\n' +
      '• 5-minute reminder interval balances timeliness with system load\n' +
      '• Dual notification (email + FCM) ensures reminders reach users\n' +
      '• Completion flag rather than deletion preserves audit trail',
  },

  'lead-assignment-algorithms': {
    whatItRepresents: 
      'The two lead assignment algorithms: standard round-robin for equal distribution, and biased round-robin for frequency-weighted distribution. Shows how the pointer state persists and how availability is checked.',
    howToRead: 
      '1. New Lead arrives from any source (WhatsApp, Facebook, Walk-in, Webhook)\n' +
      '2. Load Channel Config determines which algorithm and which members to use\n' +
      '3. LEFT PATH: Standard Round-Robin with equal distribution\n' +
      '   - Member Pool [A, B, C], Pointer cycles through\n' +
      '4. RIGHT PATH: Biased Round-Robin with frequency weights\n' +
      '   - Pool [A:3, B:2, C:1] expands to [A,A,A,B,B,C]\n' +
      '   - Higher frequency = more lead assignments\n' +
      '5. Both paths check member availability before assignment\n' +
      '6. Lead is assigned to Conversation.assignedTo\n' +
      '7. Pointer state updates in database to persist across restarts',
    engineeringDecision: 
      '• Biased round-robin enables workload balancing based on team member capacity\n' +
      '• Pointer state in MongoDB survives server restarts, ensuring fair distribution\n' +
      '• Availability check (WalkinUnavailabilityLogs) respects member unavailability\n' +
      '• Channel-specific configuration allows different algorithms per lead source',
  },
};
