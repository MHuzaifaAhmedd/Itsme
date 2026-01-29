# WhatsApp Funnel: Technical Case Study

## 1. Project Overview

### Problem Statement

Businesses operating at scale face a critical operational challenge: managing high-volume customer conversations across multiple acquisition channels while maintaining fair workload distribution among team members and ensuring no lead falls through the cracks.

### Context

The WhatsApp Business ecosystem presents unique constraints. Unlike traditional CRM systems, WhatsApp conversations require real-time handling with strict platform API limitations. Lead sources are fragmented—WhatsApp inbound messages, Facebook Lead Ads, walk-in captures, external webhooks, and manual entries—each requiring different ingestion patterns and assignment logic.

Existing solutions either:
- Force businesses into a single-channel workflow, losing leads from other sources
- Lack intelligent assignment algorithms, creating workload imbalances
- Provide no visual automation capabilities, requiring developer intervention for every flow change
- Offer poor real-time visibility into conversation status and team performance

### Motivation

WhatsApp Funnel addresses these gaps by providing a unified platform that:

1. **Consolidates multi-channel lead ingestion** into a single conversation management interface
2. **Automates lead assignment** via configurable round-robin and biased round-robin algorithms
3. **Enables visual flow automation** without code changes
4. **Delivers real-time updates** across web and mobile via Socket.IO and FCM
5. **Enforces role-based access control** at the conversation and feature level

---

## 2. System Scale & Complexity

### Multi-Tenancy Architecture

The system supports multiple businesses, each with:
- Multiple team members with hierarchical roles (business owner → team lead → member)
- Multiple WhatsApp phone numbers per business
- Multiple Facebook Pages and WhatsApp Business Accounts (WABA)
- Independent flow configurations per phone number

### Data Model Complexity

The MongoDB database (`whaDB`) manages 20+ collections:

| Domain | Collections |
|--------|-------------|
| Core | Users, TeamMembers, Conversations, Messages |
| Automation | Flows, FollowUps |
| Integration | PhoneNumbers, OAuthTokens, FacebookPages, FacebookLeads |
| Lead Sources | WalkinLeads, WalkinChannels, WebhookLeads, WebhookLeadChannels |
| Assignment State | RoundRobinTracking, WalkinAssignmentQueues, FacebookPageRoundRobinTracking |
| Operations | WalkinUnavailabilityLogs, WalkinChannelRoundRobinTracking |

### Real-Time Coordination

The system maintains persistent Socket.IO connections for:
- Live message delivery and status updates
- Conversation room management (join/leave on view)
- User presence tracking with stale connection cleanup (5-minute interval)

### Background Processing

Seven concurrent background jobs coordinate system health:

| Job | Interval | Purpose |
|-----|----------|---------|
| Flow Re-enable | 30 min | Re-activate paused flows after cooldown |
| Token Refresh | 24 h | Refresh Facebook OAuth tokens before expiry |
| Lead Import Worker | 2 s | Process queued CSV imports asynchronously |
| Timeline Import Worker | 2 s | Process timeline/comment imports |
| Follow-up Reminder | 5 min | Send email/push notifications for due follow-ups |
| Stale Socket Cleanup | 5 min | Remove disconnected users from room tracking |
| Rate Limiter Cleanup | 24 h | Purge expired Facebook rate limit entries |

---

## 3. Architecture Overview

### Why This Architecture Exists

The system employs a **monolithic-per-application** architecture with two distinct deployment units:

1. **User App**: Next.js 15 frontend + Express 4 backend + Socket.IO
2. **Admin Panel**: Separate Next.js frontend + Express backend (port 4001)

Both share a single MongoDB instance (`whaDB`), enabling:
- Admin visibility into all business data without complex inter-service communication
- Simplified deployment with clear separation of concerns
- Consistent data access patterns across applications

### Constraints That Shaped It

**WhatsApp Cloud API Constraints:**
- Webhook payload delivery requires sub-10-second acknowledgment
- Rate limits per phone number and per WABA
- 24-hour messaging window constraints for non-template messages
- Media URLs expire; require proxying or re-fetching

**Multi-Channel Ingestion:**
- Facebook Lead Ads deliver via webhook with signed payloads
- Walk-in leads arrive via QR code scans at physical locations
- External systems push leads via token-authenticated webhook channels

**Team Dynamics:**
- Business owners need full visibility
- Team leads see their team's conversations
- Members see only assigned conversations
- Permissions control sidebar menu visibility

**Import Scale:**
- CSV imports can reach 100MB
- Chat history imports require parsing and timeline reconstruction
- Background job workers prevent request timeout

---

## 4. High-Level Architecture Breakdown

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js 15 (React 19) App Router                                           │
│  ├─ ReduxProvider (state management)                                        │
│  ├─ SocketProvider (real-time connection)                                   │
│  ├─ FCMProvider (push notifications)                                        │
│  ├─ ThemeProvider (dark mode)                                               │
│  └─ AlertProvider (global notifications)                                    │
│                                                                             │
│  Pages: dashboard, leads/*, flow/*, follow-ups, team-*, profile, settings   │
│  Auth: signin, signup, forgot-password, reset-password/[token]              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Express 4 Server (TypeScript)                                              │
│                                                                             │
│  Middleware Stack:                                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ trust proxy → Helmet → body-parser (55MB) → CORS → cookie-parser →   │  │
│  │ CSRF attach → request size → sanitize → rate limiter → passport      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Routes: /api/* (20+ route modules) + /webhook/facebook                     │
│  Auth: protect middleware (JWT from cookie/Bearer) + requireAdmin           │
│  Real-time: Socket.IO server (auth via token, room management)              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────┐ ┌─────────────────────┐
│      MongoDB         │ │  External APIs   │ │   AWS S3            │
│      (whaDB)         │ │                  │ │                     │
├──────────────────────┤ ├──────────────────┤ ├─────────────────────┤
│ Native driver:       │ │ WhatsApp Cloud   │ │ Media uploads       │
│ - Conversations      │ │ Facebook Graph   │ │ Call recordings     │
│ - Messages           │ │ Firebase (FCM)   │ │ Presigned URLs      │
│ - Flows              │ │ SMTP (Nodemailer)│ └─────────────────────┘
│ - FollowUps          │ └──────────────────┘
│                      │
│ Mongoose models:     │
│ - User, TeamMember   │
│ - Role, Permission   │
│ - PhoneNumber        │
│ - FacebookPage, etc. │
└──────────────────────┘
```

---

## 5. Authentication & Authorization Flow

### Authentication Mechanisms

The system supports two authentication methods:

**1. Email/Password Authentication**
```
User → POST /api/auth/login → validate credentials → bcrypt.compare() 
    → generate JWT → set HTTP-only cookie → return user object
```

**2. Google OAuth 2.0**
```
User → GET /api/auth/google → redirect to Google consent 
    → callback with code → exchange for tokens → find/create user 
    → generate JWT → set cookie → redirect to frontend
```

### Token Structure

JWT payload includes:
- `id`: User or TeamMember ObjectId
- `userType`: 'user' | 'teamMember'
- `businessId`: Scoping for multi-tenant queries
- `exp`: Expiration timestamp

### Authorization Layers

**Layer 1: Route Protection (`protect` middleware)**
```typescript
// Extracts token from cookie or Authorization header
// Verifies JWT signature and expiration
// Loads user from Users or TeamMembers collection
// Attaches req.user with id, userType, entity, name, email
```

**Layer 2: Admin Restriction (`requireAdmin` middleware)**
```typescript
// Checks req.user.entity.accountType === 'admin'
// Returns 403 if not admin
```

**Layer 3: Role-Based Query Filtering**

Implemented in controllers for conversations and follow-ups:

| Role | Visibility |
|------|------------|
| Business Owner | All conversations/follow-ups in business |
| Team Lead | Own + team members' conversations/follow-ups |
| Regular Member | Only assigned conversations/follow-ups |

```typescript
// roleUtils.ts
isTeamLead(user)          → checks role hierarchy
isRegularTeamMember(user) → !isTeamLead && !isBusinessOwner
shouldSeeAllConversations(user) → isBusinessOwner || hasPermission
```

### Password Reset Flow

```
User → POST /forgot-password (email) → generate reset token 
    → store hashed token + expiry in user doc → send email via SMTP
    → User clicks link → POST /reset-password (token, newPassword)
    → verify token not expired → hash new password → update user → clear token
```

---

## 6. Core Feature Deep Dives

### 6.1 Multi-Channel Lead Management

**Purpose:** Consolidate leads from WhatsApp, Facebook Lead Ads, walk-in QR codes, external webhooks, and manual entry into a unified conversation interface.

**Internal Flow:**

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Facebook Lead  │     │   Walk-in QR    │     │ External Webhook│
│  Ads Webhook    │     │   Scan          │     │ (Token Auth)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Lead Webhook Service                          │
│  • Parse payload by source type                                  │
│  • Validate against registered channels                          │
│  • Create/update Conversation document                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               Conversation Assignment Service                    │
│  • Load assignment configuration for channel                     │
│  • Execute round-robin or biased round-robin                    │
│  • Update RoundRobinTracking state                               │
│  • Assign conversation to selected team member                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Notification Layer                            │
│  • Socket.IO: emit new_conversation to assigned member          │
│  • FCM: push notification if member has registered token         │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Source-agnostic conversation model:** All leads become `Conversation` documents with a `source` field (`whatsapp`, `facebook`, `walkin`, `webhook`, `manual`), enabling unified querying and filtering.

2. **Channel-specific configuration:** Each walk-in channel or webhook channel has its own assignment rules, frequency settings, and allowed team members.

3. **Bulk import via job queue:** CSV imports create a job document; a background worker (2s interval) processes rows asynchronously, tracking failures separately for retry/reporting.

---

### 6.2 Visual Flow Builder

**Purpose:** Enable non-technical users to create automated messaging sequences triggered by inbound messages, without code deployment.

**Internal Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Flow Canvas                             │
│  • Drag-and-drop node placement                                  │
│  • Edge connections between nodes                                │
│  • Node types: trigger, message, condition, delay, action        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ saveFlow()
┌─────────────────────────────────────────────────────────────────┐
│                    Flow Controller                               │
│  POST /api/flow                                                  │
│  • Validate nodes and edges structure                            │
│  • Check for phone number conflicts (one number → one flow)      │
│  • Store in Flows collection with userId, businessId             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Inbound message arrives
┌─────────────────────────────────────────────────────────────────┐
│                    Flow Message Service                          │
│  • Look up active flow for phoneNumberId                         │
│  • Find trigger node matching inbound message                    │
│  • Execute flow graph: traverse edges, evaluate conditions       │
│  • Send responses via WhatsApp Cloud API                         │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Phone number → flow exclusivity:** A phone number can only be assigned to one active flow, enforced by `checkFlowConflicts` before save. This prevents message routing ambiguity.

2. **Flow re-enable job:** Flows may be temporarily disabled (e.g., rate limit hit). A 30-minute interval job checks for re-enablement conditions.

3. **Node/edge serialization:** Flows store React Flow's native `nodes` and `edges` arrays directly, enabling lossless round-trip between frontend and backend.

---

### 6.3 Real-Time Conversation Management

**Purpose:** Deliver instant message updates and status changes to connected clients without polling.

**Internal Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Socket.IO Server                              │
│  • Authentication: verify JWT on connection                      │
│  • Room management: join_room(conversationId, phoneNumberId)     │
│  • Events: new_message, message_status_update                    │
└─────────────────────────────────────────────────────────────────┘
         │                              │
         │ User opens conversation      │ Webhook delivers message
         ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│ Frontend emits   │          │ Backend saves    │
│ join_room        │          │ message to DB    │
└──────────────────┘          └──────────────────┘
         │                              │
         │                              ▼
         │                    ┌──────────────────┐
         │                    │ Backend emits    │
         │                    │ new_message to   │
         │                    │ room members     │
         │                    └──────────────────┘
         │                              │
         └──────────────┬───────────────┘
                        ▼
              ┌──────────────────┐
              │ Frontend Redux   │
              │ updates state    │
              │ UI re-renders    │
              └──────────────────┘
```

**Key Design Decisions:**

1. **Room-based message routing:** Only users viewing a conversation receive updates, minimizing unnecessary network traffic.

2. **Stale connection cleanup:** A 5-minute interval job removes disconnected users from room tracking, preventing memory leaks.

3. **100MB buffer size:** Socket.IO configured with large `maxHttpBufferSize` to support real-time preview of imported data.

---

### 6.4 Follow-Up System

**Purpose:** Track scheduled actions on conversations with role-based visibility and automated reminders.

**Internal Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Create Follow-Up                              │
│  POST /api/followups                                             │
│  Body: { conversationId, note, scheduledFor }                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Follow-Up Controller                          │
│  • Validate conversationId exists and user has access            │
│  • Create FollowUp document with createdBy                       │
│  • Return created follow-up                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Every 5 minutes
┌─────────────────────────────────────────────────────────────────┐
│                Follow-Up Reminder Job                            │
│  • Query FollowUps where scheduledFor <= now AND !completed     │
│  • Group by createdBy                                            │
│  • Send email via SMTP                                           │
│  • Send push notification via FCM                                │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Role-based query filtering:** Team leads see their own + team members' follow-ups; regular members see only their own. Business owners see all.

2. **Conversation-scoped retrieval:** `getFollowUpsByConversation` returns all follow-ups for a conversation the user can access.

3. **Dual notification channels:** Both email and FCM ensure reminders reach users regardless of whether they're in the app.

---

### 6.5 Team Management & Assignment Algorithms

**Purpose:** Enable business owners to invite team members with specific roles and configure fair lead distribution.

**Internal Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Team Invitation                               │
│  POST /api/teams/invite                                          │
│  Body: { email, role, walkinFrequency, webhookFrequency }        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Team Controller                               │
│  • Create TeamMember document with pending status                │
│  • Send invitation email via SMTP                                │
│  • Store invite token for acceptance                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Member clicks invite link
┌─────────────────────────────────────────────────────────────────┐
│                    Accept Invitation                             │
│  POST /api/teams/accept                                          │
│  • Validate invite token                                         │
│  • Set password, activate member                                 │
│  • Add to round-robin pool                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Assignment Algorithms:**

**Round-Robin:**
```
Pool: [A, B, C]  Pointer: 0
Lead 1 → A, Pointer: 1
Lead 2 → B, Pointer: 2
Lead 3 → C, Pointer: 0
```

**Biased Round-Robin:**
```
Pool with frequency: [A:3, B:2, C:1]
Expanded: [A, A, A, B, B, C]
Pointer cycles through expanded pool
Higher frequency = more leads
```

**Key Design Decisions:**

1. **Frequency-based configuration:** Walk-in and webhook channels support per-member frequency settings, stored in assignment queue documents.

2. **Unavailability tracking:** `WalkinUnavailabilityLogs` track when members mark themselves unavailable, removing them from the assignment pool.

3. **State persistence:** `RoundRobinTracking` documents maintain pointer state across server restarts.

---

### 6.6 Facebook OAuth & Lead Ads Integration

**Purpose:** Connect businesses to their Facebook Pages and WhatsApp Business Accounts for lead capture and messaging.

**Internal Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Initiate OAuth                                │
│  GET /api/oauth/facebook                                         │
│  • Build authorization URL with required scopes                  │
│  • Include state parameter (accountType, businessId)             │
│  • Redirect user to Facebook consent screen                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OAuth Callback                                │
│  GET /api/oauth/facebook/callback                                │
│  • Exchange code for access token                                │
│  • Fetch long-lived token                                        │
│  • Store in OAuthTokens collection                               │
│  • Fetch available Pages and WABAs                               │
│  • Redirect to frontend with success/error                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Connect Page/WABA                             │
│  POST /api/oauth/connect                                         │
│  • Subscribe to page webhooks                                    │
│  • Store FacebookPage document                                   │
│  • Configure Lead Ads form subscription                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ Facebook delivers lead
┌─────────────────────────────────────────────────────────────────┐
│                    Webhook Handler                               │
│  POST /webhook/facebook                                          │
│  • Verify signature with app secret                              │
│  • Parse leadgen payload                                         │
│  • Fetch lead data from Graph API                                │
│  • Create FacebookLead and Conversation                          │
│  • Assign via facebookPageAssignmentService                      │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

1. **Token refresh job:** A 24-hour interval job refreshes tokens before expiry, preventing integration disconnection.

2. **Page-level assignment:** Each Facebook Page can have its own allowed team members and assignment configuration.

3. **Historical import:** `importHistoricalLeads` fetches existing leads from the Graph API for Pages connected mid-campaign.

---

## 7. Request → Processing → Response Lifecycle

### Standard API Request

```
1. Client sends request
   ├─ Cookie: token=<JWT>
   └─ Body: JSON payload

2. Middleware stack executes
   ├─ trust proxy (for rate limiting by real IP)
   ├─ Helmet (security headers, CSP)
   ├─ body-parser (limit: 55MB)
   ├─ CORS (allow list: FRONTEND_URI, admin, test-frontend, reception-form)
   ├─ cookie-parser
   ├─ CSRF attach (token in response, not enforced on requests)
   ├─ validateRequestSize (16MB default, 100MB for lead import)
   ├─ sanitizeBody / sanitizeQuery (validator.escape, trim)
   ├─ rateLimiter (50/15min auth, 10000/15min general, skip webhooks)
   └─ passport.initialize()

3. Route matched under /api/*
   └─ protect middleware executes
      ├─ Extract token from cookie or Authorization header
      ├─ Verify JWT
      ├─ Load user from Users or TeamMembers
      └─ Attach req.user

4. Controller function executes
   ├─ Validate request body (express-validator)
   ├─ Check role-based permissions
   ├─ Execute business logic via services
   ├─ Query/mutate MongoDB (getCollection or Mongoose)
   └─ Call external APIs if needed (WhatsApp, Facebook, FCM, S3)

5. Response sent
   ├─ JSON body (success or error)
   ├─ HTTP status code
   └─ CSRF token in cookie

6. Error handling (if error thrown)
   ├─ Global error handler catches
   ├─ Map error type to status (413, 400, 401, 503, 500)
   └─ Hide stack in production
```

### Webhook Request (Facebook)

```
1. Facebook sends POST /webhook/facebook
   └─ Body: signed payload

2. Middleware stack (partial)
   ├─ Rate limiter: SKIPPED (webhook path excluded)
   └─ Auth: SKIPPED (webhook handler does own verification)

3. Webhook controller
   ├─ Verify hub.verify_token (GET) or signature (POST)
   ├─ Parse payload type (messages, leadgen, etc.)
   ├─ Delegate to appropriate handler
   │   ├─ messages → ConversationAssignmentService, FlowMessageService
   │   └─ leadgen → LeadWebhookService
   └─ Return 200 within timeout (Facebook requires < 10s)

4. Async processing continues
   ├─ Create/update Conversation
   ├─ Emit Socket.IO events
   └─ Send FCM notifications
```

---

## 8. Data Flow Explanation

### Inbound Message Flow

```
Facebook Webhook
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Verify      │────▶│ Parse       │────▶│ Save        │
│ Signature   │     │ Payload     │     │ Message     │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                    ┌─────────────────────────┼──────────────────────────┐
                    ▼                         ▼                          ▼
            ┌─────────────┐           ┌─────────────┐            ┌─────────────┐
            │ Check Flow  │           │ Emit        │            │ Send FCM    │
            │ Trigger     │           │ Socket.IO   │            │ Push        │
            └─────────────┘           └─────────────┘            └─────────────┘
                    │
                    ▼ (if flow active)
            ┌─────────────┐
            │ Execute     │
            │ Flow Graph  │
            └─────────────┘
                    │
                    ▼
            ┌─────────────┐
            │ Send Reply  │
            │ via WA API  │
            └─────────────┘
```

### Outbound Message Flow

```
User clicks Send
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ POST        │────▶│ Build       │────▶│ Call        │
│ /messages   │     │ WA Payload  │     │ Graph API   │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                      ┌─────────────┐
                                      │ Save to     │
                                      │ Messages    │
                                      └─────────────┘
                                              │
                    ┌─────────────────────────┼──────────────────────────┐
                    ▼                         ▼                          ▼
            ┌─────────────┐           ┌─────────────┐            ┌─────────────┐
            │ Update      │           │ Emit        │            │ WA Webhook  │
            │ Conversation│           │ new_message │            │ delivers    │
            │ lastMessage │           │ to room     │            │ status      │
            └─────────────┘           └─────────────┘            └─────────────┘
                                                                        │
                                                                        ▼
                                                                ┌─────────────┐
                                                                │ Emit        │
                                                                │ status_upd  │
                                                                └─────────────┘
```

---

## 9. Performance & Scalability Decisions

### Implemented Optimizations

| Optimization | Implementation | Impact |
|--------------|----------------|--------|
| **Pagination** | Conversations, flows, messages use skip/limit | Prevents large result sets from blocking responses |
| **Request Deduplication** | Frontend Redux middleware blocks duplicate thunks within 100ms, reuses in-flight requests within 30s | Eliminates redundant API calls on rapid user clicks |
| **Background Job Workers** | Lead import, timeline import processed via 2s interval workers | Prevents 100MB imports from timing out HTTP requests |
| **Socket.IO Room Isolation** | Users join only viewed conversation rooms | Reduces broadcast overhead; messages go only to relevant clients |
| **Stale Connection Cleanup** | 5-minute interval removes disconnected users | Prevents memory growth from abandoned connections |
| **Rate Limit Entry Cleanup** | 24-hour interval clears expired Facebook rate limit entries | Prevents unbounded in-memory object growth |

### Scalability Considerations

**Current Limitations:**

1. **In-memory state:** CSRF tokens and rate limit counters stored in memory. Multi-instance deployment would require Redis or similar shared store.

2. **Single database connection pattern:** `getCollection` reuses `MongoClient` but calls `connect()` per invocation. Under high concurrency, connection pooling configuration becomes critical.

3. **Heavy controller file:** `conversation.controller.ts` handles multiple responsibilities. Future scaling would benefit from splitting into domain-specific controllers.

**Design for Future Scale:**

1. **Job queue architecture:** Lead import already uses a job + worker pattern, demonstrating the path for other heavy operations.

2. **Room-based Socket.IO:** The room isolation pattern scales horizontally—each server instance manages its own rooms; cross-instance communication would require Socket.IO Redis adapter.

---

## 10. Security Considerations & Trade-offs

### Authentication Security

| Mechanism | Implementation | Trade-off |
|-----------|----------------|-----------|
| **JWT in HTTP-only cookie** | Prevents XSS from accessing token | Requires CSRF protection for state-changing requests |
| **bcrypt password hashing** | Cost factor protects against brute force | Adds ~100ms to login/register |
| **Google OAuth state parameter** | Prevents CSRF in OAuth flow | Adds complexity to redirect handling |

### Input Validation & Sanitization

| Layer | Implementation | Coverage |
|-------|----------------|----------|
| **express-validator** | Per-route validation | Auth routes, selected data routes |
| **sanitizeBody / sanitizeQuery** | Global middleware (validator.escape, trim) | All routes |
| **ObjectId validation** | Where used in controllers | Partial—not all routes validate IDs |

### Rate Limiting

| Endpoint Type | Limit | Rationale |
|---------------|-------|-----------|
| Auth routes | 50 requests / 15 min | Prevent credential stuffing |
| General API | 10,000 requests / 15 min | Allow normal usage, block abuse |
| File upload | 100 requests / hour | Prevent storage abuse |
| Webhooks | Excluded | Facebook must receive 200 quickly |

### Security Gaps (From Analysis)

1. **CSRF middleware not enforced:** `attachCsrfToken` sets token in response, but `csrfProtection` middleware is not mounted on state-changing routes. This means the system relies on HTTP-only cookie security without CSRF verification.

2. **Facebook data deletion incomplete:** The data deletion callback returns a confirmation URL but the actual deletion logic is commented out.

3. **Environment secrets:** `.env.test` contains real-looking secrets in the repository (repo-specific risk).

---

## 11. Engineering Challenges

### Challenge 1: Dual Data Access Pattern (MongoDB Native vs Mongoose)

**Problem:** The codebase uses both MongoDB native driver (`getCollection`) and Mongoose models for different collections. Conversations, Messages, Flows, and FollowUps use native driver; Users, TeamMembers, and lead-related entities use Mongoose.

**Why It Was Hard:**
- Inconsistent query patterns across codebase
- Mongoose middleware (hooks, virtuals) unavailable for native collections
- Transaction coordination across mixed access patterns

**Solution:**
- Established convention: high-volume, schema-light collections use native driver for performance
- Schema-heavy, relationship-rich models use Mongoose for validation and middleware
- Clear documentation of which collections use which pattern

---

### Challenge 2: Role-Based Visibility Logic

**Problem:** Different user roles require different data visibility: business owners see all, team leads see their team, members see only assigned.

**Why It Was Hard:**
- Visibility logic must be applied consistently across conversations and follow-ups
- Query filters vary based on user type and role hierarchy
- Performance impact of complex query conditions

**Solution:**
- Centralized role utilities (`roleUtils.ts`) with functions:
  - `isTeamLead(user)`
  - `isRegularTeamMember(user)`
  - `shouldSeeAllConversations(user)`
- Controllers build query filters based on role check results
- Example: team lead query includes `assignedTo: { $in: allowedUserIds }` where `allowedUserIds` contains lead's ID + team member IDs

---

### Challenge 3: Large Payload Handling

**Problem:** Lead imports and chat history uploads can reach 100MB, exceeding default body parser limits and causing request timeouts.

**Why It Was Hard:**
- Default Express body limit (1MB) rejects large payloads
- Large imports block the request/response cycle
- Memory pressure from parsing large files synchronously

**Solution:**
- Body parser limit increased to 55MB globally
- `validateRequestSize` middleware allows 100MB specifically for lead import path
- Asynchronous job queue: import creates job document, background worker (2s interval) processes rows
- Socket.IO `maxHttpBufferSize` set to 100MB for real-time import preview

---

## 12. Limitations in Current Implementation

### Documented Limitations

1. **CSRF Protection Incomplete**
   - Token attached to responses but middleware not enforced on routes
   - State-changing requests accept without CSRF validation

2. **No Automated Test Suite**
   - `npm test` exits with "no test specified"
   - No unit, integration, or end-to-end tests in codebase

3. **In-Memory State Not Multi-Instance Safe**
   - CSRF tokens stored in memory
   - Rate limit counters stored in memory
   - Horizontal scaling requires Redis or shared store

4. **Facebook Data Deletion Not Executed**
   - Callback endpoint returns confirmation URL and code
   - Actual user data deletion code is commented out

5. **Admin Panel Frontend Not Fully Analyzed**
   - Separate codebase under `admin-panel/frontend`
   - Documentation incomplete for admin UI implementation

### Implicit Technical Debt

1. **Heavy Controller File**
   - `conversation.controller.ts` handles conversations, leads, messages, imports
   - Violates single responsibility principle

2. **Connection Per Call Pattern**
   - `getCollection` calls `connect()` on each invocation
   - MongoClient reused but connect() overhead on every request

3. **Mixed Collection Naming**
   - Some collections use camelCase, some use PascalCase
   - No consistent naming convention across database

---

## 13. Future Improvements

Based on gaps and constraints visible in the provided analysis:

### Infrastructure Improvements

1. **Implement Redis for Shared State**
   - Move CSRF tokens to Redis
   - Move rate limit counters to Redis
   - Add Socket.IO Redis adapter for horizontal scaling

2. **Add Automated Test Suite**
   - Unit tests for services and utilities
   - Integration tests for API routes
   - End-to-end tests for critical user flows

3. **Implement CSRF Enforcement**
   - Mount `csrfProtection` middleware on state-changing routes
   - Update frontend to include CSRF token in requests

### Code Quality Improvements

1. **Split Heavy Controllers**
   - Extract `LeadController` from conversation controller
   - Extract `MessageController` for message-specific logic
   - Extract `ImportController` for CSV/timeline imports

2. **Standardize Data Access**
   - Document when to use native vs Mongoose
   - Consider migrating high-touch collections to Mongoose for consistency

3. **Implement Facebook Data Deletion**
   - Uncomment and complete deletion logic
   - Add audit logging for compliance

### Operational Improvements

1. **Add Health Check Endpoints**
   - MongoDB connectivity check
   - External service reachability checks
   - Background job health reporting

2. **Implement Structured Logging**
   - Replace `console.error` with structured logger
   - Add request correlation IDs
   - Enable log aggregation for debugging

---

## 14. Final Technical Outcome

WhatsApp Funnel delivers a production-ready multi-channel lead management platform with:

**Core Capabilities:**
- Unified conversation management across 5 lead sources
- Visual flow automation without code deployment
- Real-time messaging with Socket.IO and FCM push
- Role-based access control at conversation and feature level
- Background job processing for large imports

**Technical Implementation:**
- Next.js 15 + Express 4 monolithic architecture
- MongoDB with hybrid native driver / Mongoose access
- WhatsApp Cloud API and Facebook Graph API integration
- JWT authentication with HTTP-only cookies
- Comprehensive middleware stack for security and validation

**Engineering Trade-offs:**
- In-memory state simplifies deployment but limits horizontal scaling
- Dual data access pattern optimizes performance but adds cognitive load
- CSRF token attachment without enforcement balances developer experience vs security

**Production Readiness:**
- Dockerized deployment with health checks
- Environment-based configuration
- Rate limiting and request size validation
- Global error handling with production-safe messages

The system demonstrates practical solutions to real-world constraints: WhatsApp API limitations, multi-channel ingestion complexity, team workload balancing, and large-scale data imports—all within a maintainable monolithic architecture suitable for small-to-medium deployment scale.

---

## Diagram Explanations

### System Architecture Diagram

**What it represents:** The complete system topology showing frontend applications, backend servers, databases, and external service integrations.

**How to read the flow:**
1. Start from the frontend layer (Next.js apps)
2. Follow arrows down through the middleware stack
3. Observe the backend's connections to MongoDB and external APIs
4. Note the bidirectional Socket.IO connection for real-time updates

**Engineering decisions highlighted:**
- Monolith-per-app architecture (user-app vs admin-panel)
- Single MongoDB instance shared across applications
- Multiple external integrations (WhatsApp, Facebook, Firebase, AWS)

---

### Authentication Flow Diagram

**What it represents:** The complete authentication lifecycle including email/password login, Google OAuth, token verification, and password reset.

**How to read the flow:**
1. Entry points on the left (login, OAuth, password reset)
2. Processing in the center (validation, token generation)
3. Outcomes on the right (success, error, redirect)

**Engineering decisions highlighted:**
- JWT in HTTP-only cookie as primary auth mechanism
- Support for both cookie and Bearer token extraction
- Dual user types (User vs TeamMember) resolved at auth time

---

### Multi-Channel Lead Ingestion Diagram

**What it represents:** How leads from different sources flow into the unified conversation system.

**How to read the flow:**
1. Five source types enter at the top
2. Converge into lead webhook service
3. Pass through assignment algorithm
4. Result in conversation creation and notification

**Engineering decisions highlighted:**
- Source-agnostic conversation model
- Pluggable assignment algorithms (round-robin, biased)
- Notification fanout (Socket.IO + FCM)

---

### Flow Execution Diagram

**What it represents:** The lifecycle of a visual flow from creation to execution on inbound messages.

**How to read the flow:**
1. Flow created in React Flow canvas (left)
2. Stored in MongoDB (center)
3. Triggered by inbound webhook (right)
4. Executes graph and sends responses

**Engineering decisions highlighted:**
- Phone number → flow exclusivity constraint
- Node/edge storage preserves React Flow structure
- Background job handles flow re-enablement

---

### Real-Time Message Flow Diagram

**What it represents:** How messages flow between users, the backend, and WhatsApp in real-time.

**How to read the flow:**
1. Inbound: Webhook → Backend → Socket.IO → Frontend
2. Outbound: Frontend → Backend → WhatsApp API → Status webhook → Frontend

**Engineering decisions highlighted:**
- Room-based Socket.IO for efficient routing
- Status updates delivered via separate webhook callback
- Optimistic UI update with server confirmation

---

### Data Processing Flow Diagram

**What it represents:** The request lifecycle from client to database and back, including middleware processing.

**How to read the flow:**
1. Request enters middleware stack (top)
2. Passes through validation, sanitization, rate limiting
3. Reaches controller and database
4. Response returns through error handler if needed

**Engineering decisions highlighted:**
- Middleware order matters (auth after rate limit)
- Webhooks bypass rate limiting
- Global error handler maps error types to HTTP status codes
