# Project Analysis

## Project Overview

- **Project name:** WhatsApp Funnel (repo: whatsapp-funnel; backend package name: webhook-in-nodejs)
- **Domain / problem space:** WhatsApp Business automation, lead management, multi-channel lead capture (WhatsApp, Facebook Lead Ads, walk-in, webhook, manual), conversation and flow automation.
- **Primary purpose:** Enable businesses to manage WhatsApp and other lead conversations, assign leads to team members (round-robin / biased round-robin), run visual flows for automated messaging, and handle follow-ups and dashboards. Admin panel provides platform-wide business and permission/role management.

---

## Tech Stack

### Frontend (user-app)

- **Framework:** Next.js 15 (React 19)
- **State:** Redux Toolkit (slices: permissions, allPermissions, roles, locations, flows, user, userPermissions, team, conversations, templates, socket, tokenStatus, dashboard, walkin, followUp)
- **UI:** Tailwind CSS, Headless UI, Heroicons, Lucide React, Framer Motion, ApexCharts, Chart.js, react-apexcharts, react-chartjs-2, FullCalendar, react-dnd, react-dropzone, react-hot-toast
- **Real-time:** socket.io-client
- **Push:** Firebase (FCM)
- **Flow builder:** React Flow (reactflow)
- **HTTP:** fetch (credentials: include, cookie-based auth); NEXT_PUBLIC_API_URL for backend base URL
- **Font:** Outfit (Google Fonts)

### Frontend (admin-panel)

- Next.js frontend; separate codebase under admin-panel/frontend

### Backend (user-app)

- **Runtime:** Node.js
- **Framework:** Express 4
- **Language:** TypeScript (compiled to dist/)
- **Database access:** MongoDB native driver (getCollection) for Conversations, Messages, Flows, FollowUps, Users, and many other collections; Mongoose for models: User, TeamMember, Role, Permission, Location, PhoneNumber, OAuthToken, FacebookPage, FacebookLead, FacebookPageRoundRobinTracking, WalkinChannel, WalkinLead, WalkinAssignmentQueue, WalkinChannelRoundRobinTracking, WalkinUnavailabilityLog, WebhookLead, WebhookLeadChannel
- **Auth:** JWT (jsonwebtoken), Passport (Google OAuth20), bcryptjs for passwords, cookie + optional Bearer token
- **Validation:** express-validator, validator (sanitization)
- **Security:** Helmet, CORS, cookie-parser, CSRF token (in-memory), rate limiting (express-rate-limit), request size validation
- **Real-time:** Socket.IO (server)
- **External:** axios, form-data; WhatsApp Cloud API (Graph API), Facebook Graph API; nodemailer (SMTP); Firebase Admin (FCM); AWS SDK (S3)
- **Media:** multer, ffmpeg-static, fluent-ffmpeg; xlsx for spreadsheets

### Backend (admin-panel)

- Express, TypeScript, MongoDB (getCollection + Mongoose), same auth/validation/security patterns; no Socket.IO; port 4001

### Databases

- **MongoDB** (whaDB): single database; collections include Users, TeamMembers, Conversations, Messages, Flows, FollowUps, PhoneNumbers, OAuthTokens, FacebookPages, FacebookLeads, WalkinLeads, WalkinChannels, WalkinAssignmentQueues, WalkinUnavailabilityLogs, WebhookLeads, WebhookLeadChannels, RoundRobinTracking, and various state collections for round-robin

### External Services / APIs

- **WhatsApp Cloud API** (Facebook Graph API) for messaging, phone numbers, media
- **Facebook Graph API** for OAuth, Pages, WABA, Lead Ads, webhooks
- **Facebook webhook** (GET verify, POST handle) at /webhook/facebook
- **SMTP** (nodemailer) for password reset, invitations, follow-up reminders
- **Firebase** (FCM) for push notifications; Firebase Admin in backend
- **AWS S3** for media and call recording storage

### Libraries & Frameworks (actually used)

- express, cors, cookie-parser, body-parser, helmet, passport, passport-google-oauth20, jsonwebtoken, bcryptjs, mongoose, mongodb, axios, multer, nodemailer, socket.io, express-rate-limit, express-validator, validator, dotenv, fluent-ffmpeg, ffmpeg-static, form-data, xlsx, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, firebase-admin

---

## High-Level System Behavior

1. **Request lifecycle:** Client (Next.js) sends requests with credentials (cookies). Backend loads .env by NODE_ENV (local / test / production). Middleware order: trust proxy, Helmet, body parser (55MB), request logging (for import-chat-history), CORS, cookie parser, CSRF attach, request size validation, sanitize body/query, rate limiter (skipped for webhooks and root), passport, static uploads. Routes mounted under /api/* and /webhook/facebook. 404 and global error handler last.
2. **Auth:** Login/register set HTTP-only cookie (token). protect middleware reads cookie or Bearer, verifies JWT, loads user from Users or TeamMembers, attaches req.user (id, userType, entity, name, email). Admin routes use requireAdmin (accountType === 'admin').
3. **User action → output:** User actions (e.g. send message, create follow-up, save flow) go to API routes → controller → getCollection or Mongoose model → MongoDB; WhatsApp/outbound actions call WhatsApp Cloud API; Socket.IO and FCM used for real-time and push. Webhooks (Facebook) bypass rate limit and auth; they verify token (GET) or process payload (POST) and update conversations/messages/leads.

---

## Implemented Features

### Authentication

- **Feature:** Email/password register, login, logout, getMe
- **Location:** user-app/backend: auth.routes.ts, controllers/auth.ts; middlewares: auth.ts (protect, requireAdmin), rateLimiter (authRateLimiter)
- **Inputs:** email, password, name (register); token cookie or Bearer
- **Outputs:** Cookie (token), JSON user or error

### Google OAuth

- **Feature:** Google sign-in; callback issues redirect/JWT
- **Location:** auth.routes.ts (GET /google, /google/callback), controllers/auth.ts (passport GoogleStrategy)
- **Inputs:** OAuth state (optional accountType, businessId)
- **Outputs:** User created/linked, token set, redirect

### Password reset / change

- **Feature:** Forgot password (token sent via email), reset-password (token + new password), change-password (protected, current + new password)
- **Location:** auth.routes.ts, controllers/auth.ts
- **Inputs:** email (forgot); token, password (reset); currentPassword, newPassword (change)
- **Outputs:** Email sent or success/error JSON

### Conversations

- **Feature:** List conversations with filters (phoneNumberId, search, status, teamMembers, leadQualified, source, followUpPeriod, tags, startDate, endDate); get messages; mark read/active; update status; flow-enabled toggle; send message; start with template; tags; comments/timeline; Facebook lead data; assign phone; parse/import chat history; reassign lead; delete leads
- **Location:** conversation.routes.ts, controllers/conversation.ts; utils: conversationService, leadImportService, timelineImportService, MessageImportService, ChatHistoryParser
- **Inputs:** Query params for list; body for send message (type, payload, etc.); multipart for import
- **Outputs:** Paginated conversations/messages, updated conversation, message send result, import job IDs

### Leads (all sources)

- **Feature:** getAllLeads (unified), createManualLead, bulk CSV import (job + status + failures), timeline import (CSV/XLSX for comments), deleteLeads, reassignLead
- **Location:** conversation.routes.ts, controllers/conversation.ts; services: LeadImportService, TimelineImportJobService
- **Inputs:** Filters; CSV for import (up to 100MB for lead import)
- **Outputs:** Lead list, job ID, job status, failure list

### Flow (visual builder)

- **Feature:** saveFlow (nodes, edges, name), getFlowByName, getAllFlows (paginated, search, filters), getFlowById, deleteFlow, checkFlowConflicts, removeFromFlow, updateFlowNumbers, getFlowFilterOptions
- **Location:** flow.routes.ts, controllers/flow.ts; jobs: flowReenableJob.ts
- **Inputs:** name, nodes, edges; query params for list/filters
- **Outputs:** success, flow list or single flow, conflict result

### Follow-ups

- **Feature:** createFollowUp, getFollowUps (filters: conversationId, createdBy, completed, startDate, endDate; role-based visibility), getFollowUpsByConversation, updateFollowUp, completeFollowUp, deleteFollowUp
- **Location:** followUp.routes.ts, controllers/followUp.ts; services: followUpReminderService; jobs: followUpReminderJob.ts
- **Inputs:** conversationId, note, scheduledFor (create); filters (get); id (update/complete/delete)
- **Outputs:** Created/updated follow-up, list with count

### Messages

- **Feature:** Send text, media, button, list, location, template, captureField, contact, textDirective; get templates by phoneNumberId
- **Location:** conversation controller (sendMessage, startConversationWithTemplate); message.routes.ts; utils: sending-message/whatsapp/*, flowMessageService
- **Inputs:** conversationId, type, payload (and optional phone for start-with-template)
- **Outputs:** Message record, WhatsApp API result

### Media

- **Feature:** Upload (multipart), getMediaUrl (WhatsApp), proxyMedia, getCallAudioUrl (S3 presigned)
- **Location:** media.routes.ts, controllers/media.ts; fileUploadRateLimiter; utils: s3Service
- **Inputs:** File upload with optional phoneNumberId
- **Outputs:** Media ID/URL or presigned URL

### Phone numbers

- **Feature:** CRUD and sync with WhatsApp Cloud API; member access; filtering
- **Location:** phoneNumber.routes.ts, controllers/phoneNumber.ts; utils: whatsappService (WhatsAppCloudAPIService)
- **Inputs:** Business/phone identifiers, member IDs
- **Outputs:** Phone number list/details

### Teams

- **Feature:** Invite, accept invite, resend, update, delete members; batch get; walkin/webhook frequency management; allowed members for pages
- **Location:** team.routes.ts, controllers/team.ts
- **Inputs:** Email, role, frequency config, memberId
- **Outputs:** Member list, invite status

### Roles & permissions

- **Feature:** CRUD roles; list permissions; permission categories; role-based menu/access
- **Location:** role.routes.ts, permission.routes.ts, controllers/role.ts, controllers/permissions.ts; models: Role, Permission
- **Inputs:** Role name, permission IDs
- **Outputs:** Roles, permissions, categories

### Dashboard

- **Feature:** Overview metrics, message status, WhatsApp metrics, leads by channel, conversation trends, team leaders/members/details, team competition
- **Location:** dashboard.routes.ts, controllers/dashboard.*.ts
- **Inputs:** Date range, filters
- **Outputs:** Metrics and chart data

### OAuth / Facebook

- **Feature:** Initiate Facebook OAuth, callback, fetch pages/WABA, connect/disconnect, import historical leads, refresh forms, update page allowed members, CAPI settings, simulate test lead
- **Location:** oauth.routes.ts, controllers/oauth.ts; services: facebookGraphService, tokenRefreshService; jobs: tokenRefreshJob
- **Inputs:** State, code, page/WABA selection
- **Outputs:** Tokens, page list, WABA list

### Webhooks

- **Feature:** Facebook webhook verify (GET) and handle (POST); walk-in and webhook-leads webhooks (handled in their routes)
- **Location:** server.ts (webhook path), controllers/webhook.ts; leadWebhookService, ConversationAssignmentService, FlowMessageService, etc.
- **Inputs:** hub.mode, hub.challenge, hub.verify_token (GET); Facebook payload (POST)
- **Outputs:** Challenge string (GET); 200 (POST)

### FCM

- **Feature:** Register/unregister FCM token; backend sends notifications
- **Location:** fcm.routes.ts, controllers/fcm.ts; services: fcmService; frontend: FCMProvider, fcmService
- **Inputs:** FCM token, user context
- **Outputs:** Success/error

### Data deletion

- **Feature:** Facebook data deletion callback; user-initiated data deletion request and status
- **Location:** dataDeletion.routes.ts, controllers/dataDeletion.ts; services: dataDeletionService
- **Inputs:** signed_request / user_id (Facebook); user request (app)
- **Outputs:** Confirmation URL and code (Facebook); status page

### Token status

- **Feature:** Track and display token status for integrations
- **Location:** tokenStatus.routes.ts, controllers/tokenStatus.ts

### Locations

- **Feature:** List/create/update locations (e.g. for location messages)
- **Location:** location.routes.ts, controllers/locations.ts; model: Location

### Walk-in

- **Feature:** Walk-in channels, confirmation, assignment queue, unavailability logs, stats
- **Location:** walkin.routes.ts, controllers/walkin.ts; services: walkinConversationService, walkinDistributionService
- **Inputs:** Channel config, confirmation payload
- **Outputs:** Channels, queue state, confirmation result

### Webhook leads

- **Feature:** Webhook lead channels, token generation, member assignment
- **Location:** webhookLeads.routes.ts, controllers/webhookLeads.ts; services: webhookLeadChannelService
- **Inputs:** Channel config, webhook token
- **Outputs:** Channels, tokens

### Admin panel (backend)

- **Feature:** Auth, permissions, permission categories, roles, businesses list/detail, admin dashboard metrics, business-specific dashboard
- **Location:** admin-panel/backend: server.ts, routes (auth, permission, permissionCategory, role, business, adminDashboard, dashboard)
- **Inputs:** Same auth pattern; businessId for scoped data
- **Outputs:** Businesses, dashboard aggregates

### Background jobs (user-app backend)

- **Feature:** Flow re-enable (interval 30 min); token refresh (24 h); lead import worker (2 s); timeline import worker (2 s); follow-up reminder (5 min); stale socket cleanup (5 min); Facebook rate limiter cleanup (24 h)
- **Location:** server.ts (startFlowReenableJob, startTokenRefreshJob, startLeadImportJob, startTimelineImportJob, startFollowUpReminderJob); jobs/*.ts; socketService cleanup; FacebookRateLimiter.cleanupOldEntries

---

## Data Handling

- **Data in:** User credentials, conversation/message payloads, flow nodes/edges, follow-up note/scheduledFor, lead CSV, timeline CSV, chat history file, webhook payloads (Facebook, walk-in, webhook-leads), OAuth callbacks, FCM tokens, file uploads (media, CSV/XLSX).
- **Processing:** Validation (express-validator, custom); sanitization (validator.escape, trim); business rules in controllers and services (round-robin, flow execution, lead assignment); WhatsApp/Facebook API calls; email sending; Socket.IO emit; FCM send.
- **Storage:** MongoDB (whaDB): Users, TeamMembers, Conversations, Messages, Flows, FollowUps, PhoneNumbers, OAuthTokens, FacebookPages, FacebookLeads, WalkinLeads, WalkinChannels, WalkinAssignmentQueues, WalkinUnavailabilityLogs, WebhookLeads, WebhookLeadChannels, RoundRobinTracking, etc. Media/call recordings: AWS S3. Uploaded CSV under backend uploads/lead-imports/.
- **Returned:** JSON responses (lists, single docs, job status); cookies (token); Socket events (new_message, message_status_update, etc.); redirects (OAuth, data-deletion-status).

---

## Architecture Observations

- **Structure:** Monolith per app: one Express server for user-app backend, one for admin-panel backend; one Next.js app for user-app frontend, one for admin-panel frontend. Shared database (whaDB).
- **Separation:** Routes → controllers → services/utils and getCollection/Mongoose; middlewares for auth, validation, rate limit, CSRF, size, sanitization, errors.
- **Patterns:** Role-based access (team lead vs member vs business owner) in conversation and follow-up controllers; round-robin and biased round-robin services; webhook handlers that delegate to assignment and flow services; background jobs via setInterval.

---

## Performance Considerations

- **Optimizations:** Pagination on conversations, flows, messages; request deduplication middleware (frontend); body limit 55MB for large imports; lead import 100MB path; Socket.IO ping/pong and buffer size 100MB; periodic cleanup of stale socket users and rate-limit entries.
- **Limitations:** CSRF tokens in memory (not shared across instances); getCollection connects on every call (MongoClient reused but connect() per call); no explicit caching layer in code; heavy conversation controller (single large file).

---

## Security Considerations

- **Auth:** JWT in cookie or Bearer; bcrypt for passwords; protect and requireAdmin middlewares; Google OAuth with state.
- **Validation/sanitization:** express-validator on auth and selected routes; sanitizeBody/sanitizeQuery (validator.escape, trim) globally; ObjectId validation where used.
- **Headers and CORS:** Helmet (CSP, etc.); CORS with allowed origins (FRONTEND_URI, admin, test-frontend, reception-form).
- **Rate limiting:** Auth 50/15min; general API 10000/15min (by user or IP); file upload 100/hour; webhooks and root excluded.
- **Request size:** validateRequestSize middleware (16MB default; 100MB for lead import; 10MB JSON; 2048 URL length).
- **CSRF:** attachCsrfToken on all responses; csrfProtection middleware exists but is not applied globally (only attach is used in server.ts).
- **Gaps:** CSRF not enforced on state-changing routes in server (only attach); Facebook data deletion “delete user data” is commented out in code; .env.test contains real-looking secrets (repo-specific risk).

---

## Error Handling & Edge Cases

- **Handled:** entity.too.large, LIMIT_FILE_SIZE → 413; ValidationError → 400; CastError/Invalid ObjectId → 400; JWT errors → 401; ECONNREFUSED/ETIMEDOUT → 503; generic statusCode/status; production vs non-production message/stack exposure; notFoundHandler for 404.
- **Not handled explicitly:** Many controller catch blocks return generic 500 and log; no global handling for unhandled promise rejections in jobs (only try/catch inside job runners).

---

## Deployment & Environment

- **Assumptions:** Node (backend); Next.js build/start (frontend); MongoDB available (MONGODB_URI); reverse proxy (trust proxy 1). Dockerfile (user-app backend): Node 22-alpine, npm ci, tsc, non-root user, dumb-init, HEALTHCHECK on GET /.
- **Env vars (backend):** PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE, FRONTEND_URI, NODE_ENV, COOKIE_SAMESITE, SMTP_*, WHATSAPP_TOKEN_ENCRYPTION_KEY, GOOGLE_CLIENT_ID/SECRET, NEXTAUTH_*, META_APP_ID, META_APP_SECRET, FACEBOOK_WEBHOOK_VERIFY_TOKEN, META_OAUTH_REDIRECT_URI, FIREBASE_SERVICE_ACCOUNT_PATH, FIREBASE_PROJECT_ID, AWS_*.
- **Env vars (frontend):** NEXT_PUBLIC_API_URL, NEXT_PUBLIC_FIREBASE_*, ENV_MODE (build/start).
- **Build/runtime:** Backend: npm run build (tsc), node dist/server.js. Frontend: next build, next start. Admin backend: same pattern; port 4001.

---

## Known Limitations

- **Partial/implied:** Facebook data deletion callback does not call delete user data (commented). deleteAllConversationsAndMessages testing route is commented out. CSRF protection middleware not mounted globally.
- **Not implemented:** No automated test suite (npm test exits with “no test specified”). No Redis or shared store for CSRF or rate limit in code. Admin panel frontend not fully analyzed in this document (separate codebase).
