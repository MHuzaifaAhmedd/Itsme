# Project Overview

- **Project name:** Sharaf ul Quran (Quranic Platform)
- **Domain / problem space:** Islamic education platform connecting students (talib) with Quran teachers (Qaris) for online Quran learning, course enrollment, scheduling, and resource sharing.
- **Primary purpose:** A full-stack platform for managing Quran teaching: student registration, Qari onboarding and approval, one-time and monthly session booking, course enrollment with subscription payments, meeting scheduling with Google Meet, recording/transcription via Fireflies.ai, and admin oversight.

---

# Tech Stack

## Frontend
- **Main Frontend:** React 18, Vite 5, React Router 7, Tailwind CSS, Framer Motion, Lucide React, Stripe React (Stripe.js), Socket.io-client, react-phone-number-input
- **Admin Frontend:** Same stack plus Redux Toolkit, TanStack React Query, ECharts
- No Redux in main frontend; uses React hooks, localStorage, and custom events for auth state.

## Backend
- **Main Backend (quranic-backend):** Node.js, Express 4, ES modules
- **Admin Backend:** Same stack; separate Express app with admin-specific routes
- **Libraries:** bcryptjs, cookie-parser, cors, dotenv, express-rate-limit, express-validator, googleapis, helmet, jsonwebtoken, moment-timezone, multer, node-cron, node-fetch, nodemailer, pdfkit, pg (PostgreSQL), socket.io, stripe

## Databases
- **PostgreSQL** (Neon in production)
- Schema managed via migrations in `Backend/database/migrations/`

## External Services / APIs
- **Stripe:** Payment processing (one-time, monthly enrollment, course payments)
- **Google OAuth2 / Calendar API:** Auth and Meet links via calendar events
- **Facebook OAuth:** Social login
- **Fireflies.ai:** Meeting transcription and recording
- **Gmail SMTP (Nodemailer):** Email notifications
- **WhatsApp Cloud API:** Booking and payment notifications
- **Calendly:** Referenced in code (calendly_url, calendly_api_key, event_type_uuid in qari_details)

## Libraries & Frameworks Actually Used
- express-validator for request validation
- multer for file uploads (certificates, resources)
- node-cron for Fireflies polling, monthly session notifications, course payment cron jobs

---

# High-Level System Behavior

1. **User Action:** User interacts with frontend (e.g., books a slot, enrolls in course, logs in).
2. **Request:** Frontend sends HTTP request to backend (cookie-based auth or Bearer token).
3. **Routing:** Express routes to controllers; middleware checks auth, resource access, onboarding.
4. **Processing:** Controllers call models, services (email, Stripe, Google Meet, Fireflies, WhatsApp).
5. **Data:** PostgreSQL stores users, bookings, enrollments, payments, sessions.
6. **Webhooks:** Stripe and Fireflies send webhooks; backend updates payment/session state.
7. **Real-time:** Socket.io broadcasts booking updates to clients.
8. **Response:** JSON responses; file streams for certificates and resources.
9. **Cron:** Scheduled jobs handle session notifications, Fireflies polling, payment reminders.

---

# Implemented Features

## Authentication & Authorization
- **What:** Email/password registration and login; Google and Facebook OAuth; JWT stored in cookies; role-based access (student, qari, admin).
- **Where:** `Backend/src/controllers/authController.js`, `authRoutes.js`, `middlewares/authMiddleware.js`, `utils/generateToken.js`; `Frontend/src/hooks/useAuth.js`, `utils/roleUtils.js`
- **Inputs:** Email, password, OAuth callback; role selection on register.
- **Outputs:** JWT cookie, user profile (id, email, role, name).

## Qari Onboarding
- **What:** Qaris submit personal, educational, and professional details plus availability; admin approves or rejects.
- **Where:** `Backend/src/routes/onboardingRoutes.js`, `OnboardingModel.js`; `Frontend/src/components/Onboarding/`; `Admin-backend` routes and models
- **Inputs:** Full name, phone, DOB, hifz completion, experience, certificate upload, availability JSONB.
- **Outputs:** Onboarding record with status (pending, submitted, approved, rejected).

## Student Onboarding
- **What:** Students submit personal, guardian, and level info; admin approves or rejects.
- **Where:** `Backend/src/routes/studentOnboardingRoutes.js`, `StudentOnboardingModel.js`; `Frontend` student onboarding flow
- **Inputs:** Full name, email, country, city, phone, DOB, address, education, guardian details, CNIC, student_level.
- **Outputs:** Student onboarding record with status.

## One-Time Booking (Calendar)
- **What:** Students book individual sessions with Qaris; payment via Stripe; Google Meet link generated; email and WhatsApp notifications.
- **Where:** `Backend/src/routes/calendarRoutes.js`, `paymentRoutes.js`; Stripe webhook in `app.js`; `utils/googleMeet.js`, `emailService.js`, `whatsappService.js`; `Frontend` Calendly/Enhanced calendar components
- **Inputs:** Qari ID, slot date/time, payment; Stripe payment_intent.succeeded webhook.
- **Outputs:** calendar_bookings record, meeting_link, emails and WhatsApp messages.

## Monthly Enrollment (Recurring Slots)
- **What:** Students enroll in monthly plans (5-day or 6-day); Qaris set monthly availability; system generates monthly_sessions; payment for first month via Stripe.
- **Where:** `Backend/src/routes/monthlyBookingRoutes.js`, `utils/monthlyAvailabilityService.js`, `monthlySessionGenerator.js`; `Frontend/src/components/QariAvailability/`, `BookingManager/`
- **Inputs:** Qari ID, package (5/6 days), slot selection, payment.
- **Outputs:** monthly_enrollments, monthly_sessions; payment_intents.

## Course Enrollment
- **What:** Students enroll in courses (Noorani Qaida, Quran Recitation, Memorization); admin approves and assigns slot; monthly payments via Stripe; course_sessions generated.
- **Where:** `Backend/src/routes/courseRoutes.js`, `controllers/courseController.js`, `services/courseWebhookService.js`, `utils/enrollmentStateMachine.js`; `Frontend` CourseEnrollmentReview, CoursePayment, CourseRenewal
- **Inputs:** Course ID, student details; admin approval with slot; Stripe payment_intent.succeeded for course payments.
- **Outputs:** course_enrollments (status: pending_approval → approved_unpaid → active → completed); course_payments; course_sessions.

## Resource Management
- **What:** Qaris upload lessons, PDFs, session videos; students access resources only if they have paid bookings with that Qari.
- **Where:** `Backend/src/routes/resourceRoutes.js`, `controllers/resourcesController.js`, `middlewares/resourceAccessMiddleware.js`; `Frontend/src/components/Resources/`, `StudentResources/`
- **Inputs:** Multipart file, resource_type, title, description; GET by qari ID.
- **Outputs:** qari_resources records; file stream via `/uploads/resources`.

## Meeting Recordings (Fireflies)
- **What:** Fireflies bot records/transcribes meetings; webhook and polling for transcript/recording status.
- **Where:** `Backend/src/routes/firefliesRoutes.js`, `utils/firefliesService.js`, `firefliesWebhookHandlers.js`, `jobs/firefliesPolling.js`
- **Inputs:** Webhook events; meeting_link, booking ID.
- **Outputs:** meeting_recordings; transcript_url, audio_url, video_url.

## Admin Panel
- **What:** Admin overview, Qari management (onboarding review, profiles), student management, appointments, transactions, settings, course enrollments, monthly enrollments.
- **Where:** `Admin-frontend/src/`, `Admin-backend/src/`; Redux (authSlice, adminSlice); admin stats with caching
- **Inputs:** Admin login (email/password or Google OAuth); admin actions (approve/reject, assign slots, etc.).
- **Outputs:** Dashboard stats, lists, detail pages; admin-only API responses.

## Admin Stats
- **What:** Cached summary stats (time-filtered), daily income, recent users; category filter.
- **Where:** `Admin-backend/src/services/adminStatsService.js`, `AdminStatsModel.js`; 30s TTL for summary, 2 min for recent users.

## Session Notifications
- **What:** Cron job finds monthly and course sessions starting in ~1 hour; creates Google Meet link if missing; sends email to student and Qari.
- **Where:** `Backend/src/jobs/monthlySessionNotificationJob.js`

## Course Payment Cron
- **What:** Handles payment reminders and overdue status for course enrollments.
- **Where:** `Backend/src/services/cronJobManager.js`

## Real-Time Updates (Socket.io)
- **What:** Room-based updates for Qari availability; booking created/updated/cancelled events.
- **Where:** `Backend/src/services/socketService.js`; `Frontend/src/hooks/useSocket.js`, `services/socketService.js`

## Password Reset
- **What:** Forgot password → OTP email → verify OTP → reset password.
- **Where:** `Backend/src/controllers/authController.js`; `Frontend` ForgotPasswordModal

## Email Verification
- **What:** OTP-based verification for registration.
- **Where:** `Backend` verify-registration, resend-registration-code; `Frontend` EmailVerificationModal

## PDF Receipt Generation
- **What:** Generates PDF receipts for payments.
- **Where:** `Backend/src/utils/pdfReceiptGenerator.js`

---

# Data Handling

## Data Entry
- User registration (email, password, role, certificate for Qaris)
- Onboarding (Qari: availability, experience; Student: guardian, level, CNIC)
- Booking creation (slot selection, payment metadata)
- Course enrollment (course, duration, monthly fee)
- Resource uploads (file, type, metadata)
- Admin actions (approve/reject, assign slots, notes)

## Processing
- Validation: express-validator, custom validation (CNIC, availability)
- Auth: JWT verification, cookie parsing, role checks
- Business logic: enrollment state machine, slot availability checks, payment flow
- External: Stripe, Google Calendar, Fireflies, SMTP, WhatsApp

## Storage
- **PostgreSQL:** users, student_details, qari_details, calendar_availability, calendar_bookings, calendly_events, payment_intents, meeting_recordings, qari_resources, qari_onboarding, student_onboarding, courses, course_enrollments, course_payments, course_sessions, webhook_events, course_enrollment_audit, monthly_* tables, stripe_customers
- **File system:** uploads/certificates, uploads/resources
- **In-memory:** Admin stats cache (Map with TTL)

## Returned to User
- JSON responses (success, data, message)
- File streams (certificates, resources)
- Real-time Socket events

---

# Architecture Observations

- **Modular monolith:** Main backend and admin backend are separate Express apps but share the same PostgreSQL and (in deployment) uploads directory.
- **Separation of concerns:** Routes → Controllers → Models; Services for email, Stripe, Google, Fireflies, WhatsApp, cron.
- **Webhook-first payment flow:** Stripe webhooks drive payment success/failure handling; idempotency via webhook_events for course payments.
- **State machine:** Course enrollment status transitions enforced in enrollmentStateMachine.js.
- **Cookie-based auth:** JWT in httpOnly cookie; credentials: include for API calls.
- **Role separation:** Admin tokens rejected on main backend; student/qari tokens on main backend only.

---

# Performance Considerations

- **Indexes:** On users, bookings, enrollments, payments, sessions, availability; composite indexes for common queries.
- **Caching:** Admin stats with 30s–2min TTL.
- **Connection pooling:** pg Pool for PostgreSQL.
- **Rate limiting:** express-rate-limit (10000/15min main backend, 1000/15min admin).
- **File streaming:** ReadStream for large files instead of loading into memory.
- **Limitations:** No Redis; cache is in-memory; no CDN mentioned for static assets.

---

# Security Considerations

- **Auth:** JWT in httpOnly cookie; bcrypt for passwords; token verification with user existence check.
- **Validation:** express-validator on auth; multer file filter (PDF, JPG, PNG); file size limits.
- **Resource access:** Middleware checks user role and paid booking before serving resources.
- **CORS:** Allowed origins configurable via env; credentials: true.
- **Helmet:** Used in admin backend; commented out in main backend (per comments).
- **SQL:** Parameterized queries via pg; no raw string interpolation observed.
- **Gaps:** Credentials in DEPLOY_BACKEND.md (should use secrets); STRIPE_WEBHOOK_SECRET optional in dev.

---

# Error Handling & Edge Cases

- **Handled:** PostgreSQL unique (23505), foreign key (23503) in errorHandler; 401/403 for auth; 404 for missing routes; Stripe webhook signature verification; Fireflies webhook verification; idempotent webhook processing.
- **Partial:** Course webhook returns 200 on processing failure to avoid Stripe retries; Google Meet fallback if OAuth not configured; email/WhatsApp failures logged but do not block booking confirmation.
- **Unhandled:** Not Implemented: structured retry for transient failures; circuit breaker for external APIs.

---

# Deployment & Environment

- **Hosting:** Docker containers; Nginx reverse proxy; backend on 127.0.0.1:3000 (localhost-only).
- **Environment variables:** DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET, FRONTEND_URL, STRIPE_*, GOOGLE_*, FACEBOOK_*, SMTP_*, FIREFLIES_*, WHATSAPP_*, CORS_ORIGIN, TIMEZONE, etc.
- **Build/runtime:** Vite build for frontends; node src/server.js for backends; Dockerfile for each app.

---

# Known Limitations

- **Helmet:** Disabled in main backend for CORS debugging.
- **Calendly:** Integration fields exist but Calendly booking flow may be partially implemented or legacy.
- **ML / AI:** Not Implemented.
- **Tests:** "Error: no test specified" in package.json test scripts.
- **Admin users:** Stored in same `users` table with role='admin'; no separate admin_users table.
- **Course webhook secret:** Can reuse STRIPE_WEBHOOK_SECRET if STRIPE_WEBHOOK_SECRET_COURSES not set.
- **Legacy routes:** /wari redirects to /qari; /qari/quran-resources redirects to /qari/resources.
