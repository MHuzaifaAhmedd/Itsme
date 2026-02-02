# Sharaf ul Quran — Technical Case Study

**Implementation-accurate technical documentation.**  
Source of truth: `PROJECT_ANALYSIS.md`, `caseStudyData.json`.

---

## 1. Project Overview

### Problem Statement

The platform must coordinate three actor types—students (talib), Quran teachers (Qaris), and admins—around a single goal: structured online Quran education. Students need to discover Qaris, book sessions (one-time or recurring), pay securely, and access learning resources. Qaris need a controlled onboarding path, availability management, earnings visibility, and the ability to upload and share materials. Admins need to vet onboarding, manage enrollments, assign slots, and monitor platform health. All of this must work with payment handling, session scheduling with meeting links, and strict access control to resources.

### Context

Sharaf ul Quran is an Islamic education platform connecting students with Qaris for online Quran learning. The domain includes: course enrollment (e.g. Noorani Qaida, Quran Recitation, Memorization), one-time and monthly session booking, subscription-style course payments, meeting scheduling via Google Meet, recording and transcription via Fireflies.ai, and resource sharing with access gated by paid bookings.

### Motivation

Deliver a full-stack system that supports student/Qari registration, role-based onboarding and approval, one-time and monthly booking with Stripe, course enrollment with admin approval and slot assignment, meeting link generation, session notifications, meeting recordings, and admin oversight—without inventing features beyond what the codebase implements.

---

## 2. System Scale & Complexity

- **Two frontends:** Main (student + Qari portals); Admin (dashboard). Same base stack (React 18, Vite 5, React Router 7, Tailwind, Framer Motion); Admin adds Redux Toolkit, TanStack React Query, ECharts.
- **Two backends:** Main backend (auth, calendar, payment, resources, courses, monthly booking); Admin backend (admin auth, Qari/student management, stats, courses). Both Node.js, Express 4, ES modules; share one PostgreSQL (Neon in production) and, in deployment, the same uploads directory.
- **External integrations:** Stripe (payments + webhooks), Google OAuth2/Calendar (auth + Meet links), Facebook OAuth, Fireflies.ai (recording/transcription + webhook), Gmail SMTP (Nodemailer), WhatsApp Cloud API, Socket.io for real-time updates.
- **Data surface:** PostgreSQL holds users, student_details, qari_details, calendar_availability, calendar_bookings, payment_intents, meeting_recordings, qari_resources, qari_onboarding, student_onboarding, courses, course_enrollments, course_payments, course_sessions, webhook_events, course_enrollment_audit, monthly_* tables, stripe_customers; file system holds uploads/certificates and uploads/resources; in-memory cache for admin stats only.
- **Concurrency and consistency:** Stripe webhooks drive payment outcomes; course payments use a `webhook_events` table with atomic claim-for-processing to achieve idempotency and avoid duplicate handling under retries. Course enrollment lifecycle is enforced via a state machine (pending_approval → approved_unpaid → active → completed).

Scale is not specified in the sources; complexity is in the number of flows (auth, two onboarding types, one-time booking, monthly enrollment, course enrollment, resources, recordings, admin, crons, real-time) and in integration surface (payments, calendar, email, WhatsApp, Fireflies).

---

## 3. Architecture Overview

### Why This Architecture Exists

- **Dual backends:** Main backend serves students and Qaris; Admin backend serves admins only. This gives a clear security boundary: admin tokens are rejected on the main backend (403 + cookie clear), so student/Qari and admin traffic are separated at the API layer while sharing the same database and auth tables.
- **Single PostgreSQL:** One database for both apps simplifies operations and keeps transactional consistency for shared entities (users, bookings, enrollments). Migrations live in `Backend/database/migrations/`.
- **Webhook-driven payments:** Stripe is the source of truth for payment success/failure. The backend creates PaymentIntents and persists booking/enrollment state only after webhook verification; this avoids relying on client-side success and handles failures and refunds consistently.
- **Cookie-based JWT for main app:** JWT in httpOnly cookie with `credentials: include` reduces XSS exposure and keeps the main frontend stateless (no Redux); Admin uses Redux for its own auth slice.

### Constraints That Shaped It

- **Raw body for webhooks:** Stripe (and Fireflies) require the raw request body for signature verification. Express’s global `express.json()` would consume the body, so webhook routes are mounted before `express.json()` and use `express.raw()` for those paths.
- **Shared auth store:** Both apps use the same `users` table and JWT issuance; role (`student` | `qari` | `admin`) determines which backend accepts the token. No separate admin_users table.
- **Google Meet via OAuth:** Meet links are created via Google Calendar API using OAuth. Access tokens expire; the implementation relies on `GOOGLE_REFRESH_TOKEN` in env and refreshes on use to avoid broken Meet creation.
- **File storage:** Certificates and resources are on the file system (uploads/); in deployment both backends need access to the same uploads directory for serving and admin certificate views.

---

## 4. High-Level Architecture Breakdown

| Layer | Components |
|-------|------------|
| **Frontend** | Main Frontend (React, Vite) — Student and Qari portals. Admin Frontend (React, Vite, Redux, React Query, ECharts) — Admin dashboard. |
| **Backend** | Main Backend (Node/Express) — Auth, calendar, payment, resources, courses, monthly booking, Socket.io, cron jobs. Admin Backend (Node/Express) — Admin auth, Qari/student management, stats, courses. |
| **Database** | PostgreSQL (Neon in production). |
| **Services** | Stripe (payments, webhooks); Google Calendar API (Meet links); Fireflies.ai (recording, transcription, webhook); Gmail SMTP (Nodemailer); WhatsApp Cloud API; Socket.io (real-time). |
| **External entry points** | Stripe webhooks (payment_intent.succeeded, payment_intent.payment_failed, charge.refunded); Fireflies webhook; Google OAuth2 callback; Facebook OAuth callback. |

Request path: User → Frontend → Backend (auth/onboarding/resource middleware) → Controllers → Models / Services (Stripe, Google, Fireflies, SMTP, WhatsApp) → PostgreSQL / file system. Webhooks and cron jobs run on the main backend; Admin backend serves only admin API and stats.

---

## 5. Authentication & Authorization Flow

- **Registration:** Email/password or OAuth (Google, Facebook). Role chosen at signup (student or Qari). Email verification uses OTP (verify-registration, resend-registration-code). Passwords hashed with bcrypt.
- **Login:** Same channels; JWT issued and stored in httpOnly cookie. Token carries userId and role. Frontend uses `credentials: include`; Bearer token is supported as fallback (e.g. for tools or admin).
- **Profile resolution:** Cookie-only clients call a profile endpoint; backend verifies JWT and returns user (id, email, role, name). Frontend uses this in `useAuth` and role utils for redirects (e.g. Qari → `/qari/overview`, Student → `/portal`).
- **Authorization:** Middleware verifies JWT and user existence; rejects or clears cookie on failure (401/403). Main backend explicitly rejects tokens with role `admin` (403 + clear cookie). Admin backend accepts only admin tokens.
- **Password reset:** Forgot password → OTP email → verify OTP → reset password (authController; ForgotPasswordModal on frontend).
- **Resource access:** Students access Qari resources only if they have a paid booking with that Qari; `resourceAccessMiddleware` derives qariId from the path and checks `calendar_bookings` (and equivalent for other booking types as implemented) before serving files.

---

## 6. Core Feature Deep Dives

*Only features explicitly present in the analysis are covered.*

### Authentication

- **Purpose:** Identify users and enforce role-based access across main and admin apps using a single user store.
- **Internal flow:** Register/verify (OTP) or OAuth callback → create/update user → issue JWT (httpOnly cookie) → subsequent requests send cookie → middleware verifies JWT and user → role used for route access and backend acceptance (main vs admin).
- **Key decisions:** JWT in httpOnly cookie to limit XSS; cookie + Bearer fallback; main backend rejects admin tokens to enforce backend split; profile endpoint for cookie-based clients.

### Qari Onboarding

- **Purpose:** Collect Qari identity, education, and availability; gate platform use on admin approval.
- **Internal flow:** Qari submits form (name, phone, DOB, hifz, experience, certificate upload, availability JSONB) → stored in `qari_onboarding` with status pending/submitted → admin reviews in Admin backend → approved/rejected → status drives redirect (e.g. submitted → under-review, approved → dashboard).
- **Key decisions:** Availability as JSONB; certificate on file system; status lifecycle (pending → submitted → approved/rejected); Admin backend owns approval routes.

### Student Onboarding

- **Purpose:** Collect student and guardian data and level; gate platform use on admin approval.
- **Internal flow:** Student submits form (personal, guardian, CNIC, student_level, etc.) → stored in `student_onboarding` → admin reviews → approved/rejected; CNIC validated (express-validator/custom).
- **Key decisions:** Guardian and CNIC required; same approval pattern as Qari; validation at API layer.

### One-Time Booking

- **Purpose:** Let students book a single session with a Qari, pay via Stripe, and receive a Meet link and notifications.
- **Internal flow:** Student selects Qari and slot → backend creates Stripe PaymentIntent and calendar booking record (or similar) → on success client may redirect; actual confirmation is driven by Stripe webhook `payment_intent.succeeded` → backend updates booking, creates Google Calendar event with Meet link (utils/googleMeet.js), sends email (emailService) and WhatsApp (whatsappService). calendarRoutes, paymentRoutes, and webhook in app.js.
- **Key decisions:** Webhook as source of truth for payment success; Meet link created on confirmation; email/WhatsApp best-effort (logged failures do not block confirmation).

### Monthly Enrollment

- **Purpose:** Recurring monthly plans (5 or 6 days/week) with Qari availability and generated sessions.
- **Internal flow:** Qari sets monthly availability (monthlyAvailabilityService, qari_monthly_availability / monthly_slots) → student selects Qari, package (5/6 days), slot → payment for first month via Stripe → backend creates monthly_enrollment and generates monthly_sessions (monthlySessionGenerator). monthlyBookingRoutes, Frontend QariAvailability and BookingManager.
- **Key decisions:** Package-based enrollment; session generation tied to availability and package; first payment via same Stripe flow as one-time.

### Course Enrollment

- **Purpose:** Multi-month courses with admin approval, slot assignment, and monthly Stripe payments.
- **Internal flow:** Student enrolls → course_enrollment in pending_approval → admin approves and assigns slot → approved_unpaid → student pays (Stripe) → webhook (courseWebhookService) processes payment with idempotency (webhook_events, claimForProcessing) → state machine (enrollmentStateMachine) moves to active → course_sessions generated. Monthly renewals and payment reminders via cron (cronJobManager). Status flow: pending_approval → approved_unpaid → active → completed.
- **Key decisions:** State machine for status transitions; idempotent webhook processing to handle Stripe retries and concurrency; course webhook returns 200 even on processing error to avoid retry storms while marking event processed/failed.

### Resource Management

- **Purpose:** Qaris upload lessons, PDFs, session videos; students access only for Qaris they have paid bookings with.
- **Internal flow:** Qari uploads via resource routes (multipart; resource_type: lesson/pdf/session_video) → stored in qari_resources and file system. Student requests resource by qari → resourceAccessMiddleware resolves qariId from path, checks calendar_bookings (and equivalent) for that student and Qari → denies if no paid booking; otherwise serves file via stream (e.g. /uploads/resources).
- **Key decisions:** Access control at serve time via middleware; file streaming for large files; no public URLs without middleware check.

### Meeting Recordings (Fireflies)

- **Purpose:** Attach Fireflies.ai recording and transcription to meetings.
- **Internal flow:** Fireflies bot joins meeting; when recording/transcript is ready, Fireflies sends webhook → backend (firefliesWebhookHandlers) and/or polling job (firefliesPolling) update meeting_recordings with transcript_url, audio_url, video_url. firefliesRoutes, firefliesService.
- **Key decisions:** Webhook + polling for robustness; meeting_recordings linked to booking/meeting.

### Admin Panel

- **Purpose:** Overview, Qari/student management, appointments, transactions, course and monthly enrollments, settings.
- **Internal flow:** Admin logs in (email/password or Google) against Admin backend → Redux auth → Admin frontend calls Admin backend only → stats from adminStatsService with in-memory cache (30s summary, 2 min recent users); CRUD and approval actions via admin routes; certificates served by Admin backend.
- **Key decisions:** Separate backend and frontend for admin; Redux + React Query for admin UX; stats cached in-process (no Redis); admin users in same users table with role=admin.

### Session Notifications

- **Purpose:** Remind users of upcoming monthly and course sessions and ensure a Meet link exists.
- **Internal flow:** node-cron every 5 minutes (monthlySessionNotificationJob.js) → find sessions in 55–65 minute window → create Meet link if missing → send email to student and Qari.
- **Key decisions:** Cron on main backend; same Google Meet creation path as booking confirmation; email-only (no WhatsApp mentioned for this job).

---

## 7. Request → Processing → Response Lifecycle

1. **User action:** User interacts with frontend (login, book slot, enroll, upload resource, etc.).
2. **Request:** Frontend sends HTTP request (cookie or Bearer); for file uploads, multipart to the relevant route.
3. **Gateway:** Nginx (in deployment) terminates TLS and proxies to the appropriate backend (main or admin).
4. **Middleware:** CORS, then for webhooks raw body parser; for other routes express.json(). Then auth (JWT verify, user load, admin rejection on main backend), then route-specific (e.g. resourceAccessMiddleware for resource GET).
5. **Routing:** Express routes to controller (authController, calendarRoutes, paymentRoutes, courseController, etc.).
6. **Processing:** Controller uses models (PostgreSQL via pg) and services (Stripe, Google Calendar, emailService, whatsappService, firefliesService, etc.). Validation (express-validator) and business rules (e.g. enrollment state machine, slot checks) run here.
7. **Side effects:** Stripe PaymentIntent creation; Google Calendar event creation; email/WhatsApp send; file write to uploads; Socket.io emit for booking updates (room-based).
8. **Response:** JSON (success/data/message) or file stream (certificates, resources). 401/403/404 and DB errors (e.g. 23505, 23503) handled by error handler.
9. **Async:** Stripe/Fireflies webhooks hit dedicated routes (raw body, signature verification); webhook handler updates DB and may send notifications. Cron jobs (session notification, Fireflies polling, course payment reminders) run on a schedule on the main backend.

---

## 8. Data Flow Explanation

- **Frontend → Backend:** Auth credentials (cookie), booking payload, enrollment payload on login, book slot, enroll. Trigger: user action.
- **Backend → Stripe:** PaymentIntent creation, customer creation. Trigger: booking payment, course payment, monthly payment.
- **Stripe → Backend:** Webhook payload (payment_intent.succeeded, payment_intent.payment_failed, charge.refunded). Trigger: payment completion or failure.
- **Backend → PostgreSQL:** User, booking, enrollment, payment, session, onboarding, resource metadata, webhook_events. Trigger: all write/read operations.
- **Backend → Google Calendar API:** Event creation request (with Meet). Trigger: booking confirmed, session notification job.
- **Backend → SMTP:** Email (booking confirmation, payment, notification, password reset, OTP). Trigger: booking, payment, cron, auth flows.
- **Backend → WhatsApp:** Template message. Trigger: booking confirmation, payment confirmation.
- **Fireflies → Backend:** Webhook event. Trigger: recording/transcript ready.
- **Backend → Frontend:** Socket event (booking created/updated/cancelled, availability). Trigger: server-side booking/availability change.

Admin frontend talks only to Admin backend; Admin backend reads/writes the same PostgreSQL and, in deployment, the same uploads.

---

## 9. Performance & Scalability Decisions

- **Admin stats:** In-memory cache (e.g. Map) with TTL (30s for summary, 2 min for recent users) to avoid repeated heavy queries. Not shared across instances; cache lost on restart.
- **PostgreSQL:** Indexes on bookings, enrollments, payments, sessions, availability (and likely users, onboarding); composite indexes where queries filter on multiple columns. Connection pooling (pg Pool).
- **File serving:** Streaming (ReadStream) for certificates and resources instead of loading full file into memory.
- **Rate limiting:** express-rate-limit (e.g. 10000/15min main backend, 1000/15min admin) to cap abuse.
- **No Redis:** No distributed cache or queue in the documented design; cron and in-memory cache are process-local. Horizontal scaling of the main backend would duplicate cron and lose cache coherence unless changed.

---

## 10. Security Considerations & Trade-offs

- **Auth:** JWT in httpOnly cookie; bcrypt for passwords; token verified and user existence checked; admin tokens rejected on main backend.
- **Validation:** express-validator on auth and other inputs; CNIC and availability validated; multer file filter (e.g. PDF, JPG, PNG) and size limits.
- **Resource access:** resourceAccessMiddleware enforces “paid booking with this Qari” before serving resources; no public unauthenticated resource URLs.
- **CORS:** Allowed origins from config (e.g. env); credentials: true for cookie.
- **SQL:** Parameterized queries (pg); no raw string interpolation in SQL described.
- **Helmet:** Used in Admin backend; disabled in main backend (e.g. for CORS debugging), which weakens main backend headers.
- **Secrets:** Deployment docs reference credentials; recommended to move to a secrets manager. STRIPE_WEBHOOK_SECRET can be optional in dev; verification must be strict in production.
- **Webhooks:** Stripe and Fireflies signature verification before processing. Course webhook returns 200 on processing error to avoid Stripe retries while still recording failure.

---

## 11. Engineering Challenges

- **Stripe webhook and raw body:** express.json() consumes the body and breaks Stripe signature verification. **Solution:** Register Stripe (and Fireflies) webhook routes before express.json(), and use express.raw() for those routes only.
- **Course webhook idempotency and concurrency:** Stripe can retry; multiple workers could process the same event. **Solution:** webhook_events table; claimForProcessing-style atomic lock; mark processed or failed with retry count so duplicates are skipped.
- **Resource access for students:** Students must only see resources for Qaris they have paid bookings with. **Solution:** resourceAccessMiddleware derives qariId from path, queries calendar_bookings (and equivalent) for the current user, denies if no paid booking.
- **Admin tokens on main backend:** Shared auth table but separate backends; admin tokens must not be accepted on main. **Solution:** Main backend checks role and returns 403 and clears cookie for admin tokens.
- **Google OAuth token expiry:** Meet creation depends on Google access token. **Solution:** Store refresh token (GOOGLE_REFRESH_TOKEN); set credentials and refresh on use so Meet creation keeps working.

---

## 12. Limitations in Current Implementation

- **No automated tests:** package.json test scripts show “no test specified” or equivalent; no test suite described.
- **Helmet disabled on main backend:** Left off for CORS debugging; main backend does not benefit from Helmet’s security headers.
- **Admin stats cache in-memory:** Lost on restart; not shared across multiple backend instances; limits horizontal scaling of admin without adding a shared cache.
- **Calendly:** calendly_url, calendly_api_key, event_type_uuid exist in qari_details; Calendly booking flow may be partial or legacy; not the primary booking path.
- **ML/AI:** Not implemented.
- **Credentials in deployment docs:** Should be moved to a secrets manager or env/secrets pipeline.
- **Course webhook secret:** Can fall back to STRIPE_WEBHOOK_SECRET if STRIPE_WEBHOOK_SECRET_COURSES is not set; separate secret is clearer for isolation.
- **Legacy routes:** /wari → /qari, /qari/quran-resources → /qari/resources; redirects kept for backward compatibility.
- **Error handling:** No structured retry for transient failures; no circuit breaker for external APIs (Stripe, Google, Fireflies, SMTP, WhatsApp). Email/WhatsApp failures are logged and do not block booking confirmation.

---

## 13. Future Improvements

*Derived only from stated gaps and constraints; no speculative features.*

- **Enable Helmet on main backend** once CORS and deployment are stable, to restore security headers.
- **Introduce automated tests** (unit for state machine and webhook idempotency, integration for auth and booking flows) and wire test script in package.json.
- **Replace in-memory admin stats cache** with a shared store (e.g. Redis) and define TTLs so admin can scale horizontally and survive restarts without cache loss.
- **Move credentials out of deployment docs** into a secrets manager or CI/CD secrets and document only secret names/usage.
- **Use a dedicated STRIPE_WEBHOOK_SECRET_COURSES** for course webhooks to isolate and rotate independently.
- **Add structured retries and circuit breakers** for external calls (Stripe, Google, Fireflies, SMTP, WhatsApp) to improve resilience to transient failures and avoid cascading load during outages.
- **Clarify or complete Calendly integration:** Either document and support the existing Calendly fields and flow or remove/deprecate them to avoid confusion.

---

## 14. Final Technical Outcome

Sharaf ul Quran is a modular full-stack platform: two Express backends (main and admin) and two React frontends sharing one PostgreSQL database and a shared file store for certificates and resources. Authentication is cookie-based JWT with role-based backend separation (admin tokens rejected on main backend). Payments are webhook-driven (Stripe) with idempotent course payment handling and a clear enrollment state machine. One-time and monthly booking plus course enrollment cover the main business flows; Google Meet, Fireflies, email, and WhatsApp integrate for sessions and notifications. Access to Qari resources is gated by paid booking via middleware. Performance relies on PostgreSQL indexing, connection pooling, in-memory admin stats cache, file streaming, and rate limiting. Security uses bcrypt, httpOnly cookies, validation, parameterized SQL, and resource middleware, with a known gap (Helmet off on main backend). The system is production-oriented but has documented limitations: no tests, in-memory cache, and no retry/circuit-breaker strategy for external services. The enhancements above are confined to those gaps and constraints.

---

## Diagram Explanations

The following diagrams are defined in `sharafulquran.case-study.diagrams.json` and can be rendered with React Flow, D3, or any node-based visualization engine.

### 1. System Architecture Diagram

**What it represents:** The full topology of Sharaf ul Quran: main and admin frontends, main and admin backends, PostgreSQL, and external systems (Stripe, Google Calendar, Fireflies, SMTP, WhatsApp, Socket.io). It shows which components exist and how they are grouped (frontend, backend, db, external).

**How to read the flow:** Nodes are systems or services; edges indicate primary communication (e.g. Frontend → Backend, Backend → PostgreSQL, Backend → Stripe). Follow edges to see request direction (e.g. user → main frontend → main backend) and integration points (webhooks from Stripe/Fireflies to main backend). The split between main and admin is visible in the two frontend and two backend nodes.

**Engineering decisions it highlights:** Dual frontend/backend split for role isolation; single database shared by both backends; webhooks as inbound edges from Stripe and Fireflies; Socket.io as a service used by the main backend to push to the main frontend.

### 2. Authentication Flow Diagram

**What it represents:** The path from user action (register, login, OAuth callback) through backend verification and token issuance to role-based redirect and subsequent authenticated requests. Includes branches for email/password vs OAuth and for student/Qari vs admin.

**How to read the flow:** Start at “User” or “Frontend”; follow edges through “Backend” (auth routes, token generation, cookie set) and back to “Frontend” (profile fetch, redirect). Admin flow goes to Admin Backend and Admin Frontend. Edges are labeled with the main data or action (e.g. “JWT cookie”, “Profile”, “403 if admin on main”).

**Engineering decisions it highlights:** Single user store with role; main backend rejecting admin tokens; cookie-based JWT; profile endpoint for cookie clients; OAuth callback cleanup and profile fetch.

### 3. Core Feature Lifecycle Diagram(s)

**What it represents:** One or more diagrams for critical flows such as one-time booking (student → slot selection → payment → webhook → Meet + notifications) and course enrollment (enroll → admin approval → payment → webhook → state machine → sessions). Nodes are steps or systems; edges are “next step” or “sends to”.

**How to read the flow:** Follow from the first user action (e.g. “Select Qari & slot”) through backend steps (create PaymentIntent, create booking record) to external events (Stripe webhook) and back to backend (update status, create Meet, send email/WhatsApp). For course enrollment, follow state transitions (pending_approval → approved_unpaid → active) and webhook idempotency (webhook_events, claimForProcessing).

**Engineering decisions it highlights:** Webhook as source of truth for payment; separation of “create intent” vs “confirm and fulfill”; state machine for course enrollment; idempotent webhook handling; notifications as best-effort after confirmation.

### 4. Data Processing Flow Diagram

**What it represents:** Movement of data between Frontend, Backend, PostgreSQL, Stripe, Google Calendar, SMTP, WhatsApp, and Fireflies. Emphasizes who sends what and on what trigger (e.g. “Booking payload” Frontend→Backend on book; “Webhook event” Stripe→Backend on payment).

**How to read the flow:** Each edge is a data flow; labels describe the data (e.g. “Auth credentials”, “PaymentIntent creation”, “Webhook event”). Triggers are implied or in edge labels (e.g. “Payment completion”). Bidirectional flows (e.g. Backend ↔ PostgreSQL) show read/write.

**Engineering decisions it highlights:** Webhook-driven payment updates; backend as the only writer to PostgreSQL; backend as orchestrator for Stripe, Google, SMTP, WhatsApp; Fireflies pushing to backend; Socket.io pushing from backend to frontend.

### 5. Performance / Calculation / Decision Flow Diagram

**What it represents:** Where performance and caching decisions are made: admin stats (cache hit vs miss, TTL 30s/2min), rate limiting (request → allow/block), resource serve (middleware check → allow/deny), and optionally indexing (query → index vs table scan). Can include cron schedule (every 5 min → session notification job).

**How to read the flow:** Start at “Request” or “Cron tick”; follow through “Rate limiter”, “Cache lookup”, “DB query”, “Middleware check”. Decision nodes (e.g. “Cache hit?”) branch to “Use cached stats” vs “Query DB & set cache”. Edges can be labeled with “30s TTL”, “Deny if no paid booking”, etc.

**Engineering decisions it highlights:** In-memory cache for admin stats with fixed TTLs; rate limiting at the gateway; resource access as an explicit check before serve; file streaming; no Redis (single-process cache).

---

*End of case study. Diagrams are defined in `sharafulquran.case-study.diagrams.json`.*
