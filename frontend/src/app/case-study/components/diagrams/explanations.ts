/**
 * Diagram explanations from EMS_DIAGRAM_EXPLANATIONS.md
 * Structured data for rendering below each diagram
 */

export interface DiagramExplanation {
  whatItRepresents: string;
  howToRead: string;
  engineeringDecision: string;
}

export const diagramExplanations: Record<string, DiagramExplanation> = {
  'system-architecture': {
    whatItRepresents:
      'This diagram shows the complete EMS system at the highest level, illustrating how four separate frontend applications (Employee Portal, Admin Portal, SuperAdmin Portal, and Mobile App) communicate with a centralized Express backend, which in turn interacts with databases, caches, and external services.',
    howToRead: `Horizontal Layers (Left to Right):
1. Frontend Layer: Four independent Next.js/React Native applications
2. Backend Layer: Express API Gateway + Service modules (Performance, Attendance, Notification, ZKTeco, WebSocket)
3. Data Layer: MongoDB (primary database), Redis (cache), Bull (job queue)
4. External Services: AWS S3, Firebase Cloud Messaging, IPData API, ZKTeco devices

Key Connections:
• All frontend applications connect to the Express API via HTTP/WebSocket
• Express API delegates to specialized service modules
• Services query MongoDB for persistent data and Redis for cached data
• Notification Service enqueues jobs in Bull queue for background FCM processing
• WebSocket Service broadcasts real-time events back to connected frontend clients
• External devices (ZKTeco biometric) push data to backend endpoints`,
    engineeringDecision: `Micro-Frontend + Centralized Backend: This hybrid architecture provides deployment flexibility (frontends can ship independently) while maintaining data consistency and business logic centralization in the backend. The single backend avoids microservices complexity while the separate frontends enable role-specific optimization.

Why Redis Sits Between Services and MongoDB: Redis serves as both a cache layer (85%+ hit rate reducing MongoDB load) and a job queue backend (Bull), demonstrating the architectural pattern of using in-memory storage for performance-critical hot paths.`,
  },

  'authentication-flow': {
    whatItRepresents:
      'This diagram traces a complete authentication request through the Express middleware chain, showing how a user\'s login attempt passes through 11 security layers before reaching the route handler. Each middleware node represents a security checkpoint that validates, enriches, or potentially rejects the request.',
    howToRead: `Vertical Flow (Top to Bottom):
1. User enters credentials in frontend
2. Frontend sends POST /api/auth/login
3. Request enters Express and flows through middleware chain sequentially (order matters!)
4. Each middleware either passes request to next layer or returns error response

Middleware Chain Order (Critical):
1. Helmet: Sets security headers (CSP, X-Frame-Options)
2. CORS: Validates origin against whitelist
3. Rate Limiting: Checks IP request count in Redis (1000/15min general, 100/15min auth)
4. CSRF: Validates token from header against stored token
5. JWT Authentication: Verifies JWT from httpOnly cookie, queries User in MongoDB
6. Role Authorization: Checks if user role matches required role for endpoint
7. IP Geofencing: Validates client IP against office CIDR ranges (employees only)
8. Device Validation: Checks if device ID is in trusted devices (sensitive operations only)

Database Interactions:
• JWT middleware queries MongoDB to fetch User document (verify account is active)
• Geofencing middleware queries Redis for SystemSettings (cached office IP ranges)
• Geofencing middleware calls IPData API for IP geolocation (audit logging)
• Device validation queries MongoDB to check Employee.trustedDevice array`,
    engineeringDecision: `Defense in Depth: Instead of a single authentication check, requests pass through 8+ validation layers. This provides security redundancy—if one layer fails (e.g., CSRF tokens disabled for mobile app), other layers (JWT + device validation) still protect the system.

IP Geofencing Trade-off: The diagram shows geofencing querying IPData API for geolocation. This external dependency could slow requests or fail, but the system is designed to fail-open (allow access with warning) prioritizing availability over strict security for non-critical operations. Audit logs capture all geofence violations for post-incident review.

Trust Proxy Configuration: The diagram shows multiple IP sources (X-Forwarded-For, X-Real-IP, req.ip). This highlights the engineering challenge of accurate IP detection behind proxies/load balancers, solved by configuring Express to trust proxy headers and implementing fallback logic.`,
  },

  'attendance-lifecycle': {
    whatItRepresents:
      'This diagram shows the complete journey of a single attendance check-in action, from the moment an employee clicks the "Check-In" button through validation, database storage, cache invalidation, real-time WebSocket updates, background FCM job queuing, and final UI confirmation. It illustrates both the synchronous response path (user gets confirmation) and asynchronous background paths (admin dashboard updates, push notifications sent).',
    howToRead: `Main Synchronous Path (Left Side, ~80-170ms total):
1. Employee clicks Check-In button
2. Client validates (already checked in?)
3. API request with JWT + Device ID
4. Middleware chain validates (JWT + CSRF + Geofence + Device)
5. Route handler calls Attendance Service
6. Service fetches SystemSettings from Redis (work hours, grace period)
7. Service creates Attendance record in MongoDB
8. MongoDB returns created record
9. JSON response returned to client
10. UI updates (button disabled, confirmation shown)

Parallel Asynchronous Paths (Right Side):

Path A: Cache Invalidation
• MongoDB post-save hook triggers
• Redis cache key deleted: attendance:summary:{userId}
• Next request will fetch fresh data

Path B: Real-Time WebSocket Update
• Attendance Service calls WebSocket Service
• WebSocket emits event to admin:onboarding room
• All connected admin dashboards receive event instantly
• Admin dashboard shows new check-in without page refresh

Path C: Push Notification (Background)
• Attendance Service calls Notification Service
• Notification stored in MongoDB
• FCM job enqueued in Bull queue
• Background worker picks up job
• Firebase Cloud Messaging sends push notification (batched, up to 500 tokens)
• Admin mobile devices receive push notification`,
    engineeringDecision: `Synchronous vs. Asynchronous Processing: The diagram clearly separates the critical path (user confirmation must be fast) from nice-to-have features (real-time dashboard updates, push notifications). By making cache invalidation, WebSocket events, and FCM jobs non-blocking, the user receives confirmation in 80-170ms even if Redis is slow, WebSocket clients are disconnected, or FCM API is down.

Cache Invalidation Placement: Notice cache invalidation happens after the database write (post-save hook). This ensures cache and database never have conflicting data. The trade-off is a brief window where cached data is stale, but this is acceptable for attendance data (not mission-critical for immediate consistency).

Idempotent Design: The diagram shows a "Already checked in?" validation step in the route handler. If the user clicks Check-In twice (network retry, user impatience), the second request returns the same attendance record without creating a duplicate. This idempotent design prevents data corruption from retries.`,
  },

  'task-lifecycle': {
    whatItRepresents:
      'This diagram shows the complete multi-actor workflow of task management, involving three participants (Admin, Backend, Employee) across four distinct phases: Task Creation, Notification, Employee Completion, and Admin Verification. The diagram emphasizes the bidirectional communication (admin ↔ backend ↔ employee) and state transitions of the Task record.',
    howToRead: `Phase 1: Task Creation (Top Section)
1. Admin fills create task form (title, deadline, priority, assignees)
2. API request: POST /api/tasks
3. Task Service processes assignment logic (individual → specific employees, department → all in department, global → all active employees)
4. Task record created with completedBy array (one entry per assignee)
5. MongoDB stores Task document
6. Notification Service triggers WebSocket events + FCM push to all assignees

Phase 2: Employee Work (Middle Section)
7. Employee views task in task list (receives via WebSocket or polls API)
8. Employee clicks "Start Task" → status changes to active in MongoDB
9. Employee works on task (external to system)
10. Employee uploads proof files via presigned S3 URL
11. Employee clicks "Mark Complete" → POST /api/tasks/:id/complete
12. Backend updates completedBy array entry with proof files and verification status

Phase 3: Admin Verification (Bottom Section)
13. Admin receives notification: "Task completed by Employee X"
14. Admin reviews proof files (downloads from S3)
15. Admin approves or rejects → PATCH /api/tasks/:id/verify/:employeeId
16. Backend updates verificationStatus
17. If verified, performance calculation cache invalidated (completion rate changes)
18. Employee receives notification of verification result`,
    engineeringDecision: `Array-Based Completion Tracking: The diagram shows the Task model uses a completedBy array with one entry per assignee. This design enables independent tracking (each employee's completion tracked separately), partial completion visibility (admins see which employees completed vs. pending), and re-submission support (if rejected, employee can re-upload proof without creating new task).

Why S3 for Proof Files: Proof files flow directly from employee to S3 (via presigned URL), then S3 URLs stored in MongoDB. This design avoids large file uploads through backend (saves bandwidth, reduces latency), file storage in MongoDB (documents limited to 16MB, file storage not optimal use case), and complicated file serving logic (S3 handles range requests, CDN distribution, durability).

Performance Integration: Notice the diagram shows task completion triggering performance calculation cache invalidation. This illustrates how the performance system is event-driven—every task completion potentially changes the Completion (C) and Timeliness (T) metrics, requiring leaderboard recalculation on next request.`,
  },

  'performance-calculation': {
    whatItRepresents:
      'This diagram shows the algorithmic flow of calculating employee performance scores using the four-metric system (A, P, C, T) with configurable weights. It traces both the cache hit path (fast, ~50ms) and the cache miss path (compute-intensive, ~200-500ms) that fetches data from MongoDB, calculates metrics, applies the strict_zero policy, and generates the final leaderboard.',
    howToRead: `Cache Hit Path (Fast Path, Left Side):
1. Admin dashboard loads → GET /api/dashboard/leaderboard
2. Check Redis cache for key leaderboard:all
3. Cache hit: Return cached leaderboard (TTL: 3 minutes)
4. Response to frontend in ~50ms

Cache Miss Path (Compute Path, Right Side):
1. Cache miss: Calculate fresh leaderboard
2. Fetch all active employees from MongoDB
3. For each employee (loop):
   - Aggregate attendance data
   - Aggregate task data
   - Calculate A, P, C, T metrics
   - Apply strict_zero policy (missing data = 0%)
   - Fetch configurable weights from SystemSettings
   - Calculate final score with weights
   - Clamp score to 0-100%
   - Assign performance band
4. Sort employees by score descending
5. Store leaderboard in Redis cache (TTL: 3 minutes)
6. Return leaderboard to frontend (~200-500ms)`,
    engineeringDecision: `strict_zero Policy: This is the most critical engineering decision in the performance system. If attendance data is missing (new employee), A = 0%, P = 0% (not 100% or excluded). If task data is missing (no tasks assigned), C = 0%, T = 0%. This prevents gaming: new employees with no data would otherwise score 100% (unfair advantage), employees could delete assigned tasks to inflate completion rate, and missing metrics would be excluded, rescaling weights (inconsistent scoring).

Cache TTL Trade-off: The diagram shows Redis cache with 3-minute TTL. This means leaderboard updates every 3 minutes (near real-time), reduces MongoDB query load by ~95%, but may show slightly stale data for up to 3 minutes. Cache is invalidated explicitly when attendance or task records saved (post-save hooks).

Serial vs. Parallel Calculation: The diagram shows a loop indicating serial calculation (one employee at a time). This is a known performance bottleneck (100 employees = 100 sequential aggregations), but acceptable because leaderboard is cached for 3 minutes, individual aggregations are fast (~2-5ms with proper indexes), and future optimization can use Promise.all() for parallel calculation.`,
  },
};
