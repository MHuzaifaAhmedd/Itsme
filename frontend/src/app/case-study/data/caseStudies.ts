import { CaseStudyData } from '../types';

/**
 * Centralized Case Study Data
 * 
 * PLACEHOLDER STRUCTURE - Ready for real project data
 * 
 * To populate with real data:
 * 1. Replace placeholder text with actual project details
 * 2. Add real tech stacks, challenges, solutions
 * 3. Update metrics and outcomes
 * 4. Add real flow diagrams and architecture
 */

export const caseStudies: Record<string, CaseStudyData> = {
  'employee-management-system': {
    slug: 'employee-management-system',
    hero: {
      projectName: 'Employee Management System (EMS)',
      impactLine: 'A comprehensive enterprise-grade HR platform that achieved 95% API performance improvement, 85%+ cache hit rate, and automated workforce management for thousands of employees with real-time tracking, data-driven performance evaluation, and GDPR compliance',
      role: 'Full-Stack Developer / System Architect',
      techStack: [
        'Next.js 16.0.7',
        'React 19.2.1',
        'React Native 0.81.5',
        'TypeScript 5.9.2',
        'Node.js',
        'Express 4.18.2',
        'MongoDB',
        'Redis',
        'Socket.io 4.8.1',
        'AWS S3',
        'Firebase Cloud Messaging',
        'Docker',
        'Tailwind CSS 4',
      ],
      year: '2024-2026',
      ctas: {
        live: undefined,
        demo: undefined,
        github: undefined,
      },
      heroImage: '/images/p2.jpg',
    },
    summary: {
      overview: 'The Employee Management System (EMS) is an enterprise-grade HR platform built to solve workforce management at scale. This case study documents the architecture, technical decisions, and outcomes of a system that achieved 95% API performance improvement, 85%+ cache hit rate, and automated management for thousands of employees.',
      sections: [
        {
          title: 'The Problem',
          content: 'Organizations struggled with manual HR processes: error-prone attendance tracking, leave management through emails, subjective performance evaluation, scattered documents, and no real-time communication. Existing solutions were costly, inflexible, and lacked biometric integration.',
        },
        {
          title: 'The Solution',
          content: 'A micro-frontend architecture with three Next.js portals (Employee, Admin, SuperAdmin) plus React Native mobile app, all connected to a centralized Express backend. Key innovations include Redis caching, WebSocket real-time updates, ZKTeco biometric integration, IP geofencing, and GDPR-compliant data retention.',
        },
        {
          title: 'Key Outcomes',
          content: '95% improvement in API response times (2-3s → 50-200ms), 85%+ cache hit rate, 60% reduction in database queries, 30-40% storage cost reduction, and 95%+ anomaly detection accuracy. The system supports 4 user roles with granular permissions and delivers real-time updates within milliseconds.',
        },
      ],
    },
    problem: {
      context: 'Organizations were facing significant challenges in managing their workforce efficiently. Traditional HR processes relied heavily on manual paperwork, spreadsheets, and disconnected systems, creating operational inefficiencies and security vulnerabilities. Manual attendance tracking was error-prone, leave management through emails made balance tracking difficult, performance evaluation was subjective, and employee documents were scattered across physical files and multiple systems.',
      painPoints: [
        'Manual attendance tracking was error-prone and lacked real-time visibility into employee presence',
        'Leave management through emails and paper forms made balance tracking and conflict detection difficult',
        'Performance evaluation was subjective without data-driven metrics or historical comparisons',
        'Employee documents scattered across physical files and multiple systems with no centralized access',
        'Task coordination relied on ad-hoc communication channels leading to missed deadlines',
        'No centralized audit logging or security policy enforcement for sensitive HR data',
        'Lack of real-time communication platform for HR updates and notifications',
        'No mobile support for on-the-go employee access to HR services',
      ],
      whyInsufficient: 'Generic HR software lacked customization for specific organizational needs, monolithic legacy solutions were difficult to scale or modify, high licensing costs for enterprise solutions, limited integration capabilities with biometric devices, poor user experience with outdated interfaces, insufficient security features for sensitive employee data, and no support for role-based access with granular permissions.',
    },
    goalsMetrics: {
      objectives: [
        'Automate core HR processes including attendance tracking, leave management, and approval workflows',
        'Provide role-based access through separate portals (Employee, Admin, SuperAdmin) with granular permissions',
        'Implement data-driven performance evaluation system with configurable metrics and transparency',
        'Enable real-time communication via WebSockets and push notifications for instant updates',
        'Ensure security through IP geofencing, device management, CSRF protection, and comprehensive audit logging',
        'Support biometric device integration for accurate attendance tracking and deduplication',
        'Achieve GDPR compliance with privacy consent management and automated data retention policies',
        'Deliver mobile accessibility for employees through React Native mobile application',
      ],
      successMetrics: [
        '95% improvement in API response times (reduced from 2-3 seconds to 50-200ms)',
        '85%+ cache hit rate for frequently accessed data reducing database load',
        '60% reduction in database queries through aggregation pipeline optimization',
        '30-40% storage cost reduction via automated data retention and cleanup',
        '95%+ anomaly detection accuracy in activity tracking using Z-score analysis',
        'Support for 4 user roles (SuperAdmin, Admin, SemiAdmin, Employee) with distinct permissions',
        'Real-time WebSocket updates delivered within milliseconds across all connected clients',
        'ZKTeco biometric device integration with automatic employee PIN mapping',
      ],
    },
    userFlow: {
      description: 'The system handles seven primary user flows: authentication with multi-layer security, employee check-in/out with geofencing, leave request submission and approval, task assignment and verification, automated performance calculation, document management with S3 storage, and real-time admin dashboards with analytics.',
      nodes: [
        { id: '1', label: 'User Login', type: 'start' },
        { id: '2', label: 'JWT Validation', type: 'action' },
        { id: '3', label: 'IP Geofencing Check', type: 'decision' },
        { id: '4', label: 'Device Validation', type: 'action' },
        { id: '5', label: 'Portal Access Granted', type: 'action' },
        { id: '6', label: 'Attendance Check-In', type: 'action' },
        { id: '7', label: 'Leave Request Submission', type: 'action' },
        { id: '8', label: 'Admin Approval', type: 'decision' },
        { id: '9', label: 'Task Assignment', type: 'action' },
        { id: '10', label: 'Performance Calculation', type: 'action' },
        { id: '11', label: 'Real-time Dashboard', type: 'end' },
      ],
      connections: [
        { from: '1', to: '2', label: 'Submit credentials' },
        { from: '2', to: '3', label: 'Token valid' },
        { from: '3', to: '4', label: 'IP allowed' },
        { from: '4', to: '5', label: 'Device trusted' },
        { from: '5', to: '6', label: 'Employee action' },
        { from: '5', to: '7', label: 'Request leave' },
        { from: '7', to: '8', label: 'Pending approval' },
        { from: '5', to: '9', label: 'Admin assigns' },
        { from: '9', to: '10', label: 'Auto calculate' },
        { from: '10', to: '11', label: 'Display results' },
      ],
    },
    systemArchitecture: {
      description: 'Micro-frontend architecture with three separate Next.js portals (Employee, Admin, SuperAdmin) plus React Native mobile app, all connected to a centralized Express backend API. This enables independent deployment cycles, role-specific optimization, security isolation, and team scalability while maintaining consistent business logic through shared services.',
      layers: [
        {
          name: 'Frontend Layer',
          components: [
            'Employee Portal (Next.js 16, Port 3000)',
            'Admin Portal (Next.js 16, Port 3001)',
            'SuperAdmin Portal (Next.js 16, Port 3002)',
            'Mobile App (React Native 0.81.5 with Expo)',
            'Redux Toolkit + TanStack Query + Zustand',
            'Socket.io Client for real-time updates',
            'Tailwind CSS 4 / NativeWind 4.2.1',
          ],
          color: '#60A5FA',
        },
        {
          name: 'Backend Layer',
          components: [
            'Express 4.18.2 REST API (Port 5000)',
            'TypeScript 5.1.6 for type safety',
            'Socket.io 4.8.1 WebSocket server',
            'JWT Authentication + CSRF Protection',
            'IP Geofencing middleware',
            'Device validation middleware',
            'Bull 4.12.0 job queue',
            'node-cron scheduled tasks',
          ],
          color: '#34D399',
        },
        {
          name: 'Data Layer',
          components: [
            'MongoDB 9.0.1 (25+ collections)',
            'Mongoose 9.0.1 ODM',
            'Redis (in-memory cache)',
            'AWS S3 (document storage)',
            'Compound indexes on frequent queries',
            'Aggregation pipelines for analytics',
          ],
          color: '#F59E0B',
        },
        {
          name: 'External Integrations',
          components: [
            'Firebase Cloud Messaging (push notifications)',
            'ZKTeco Biometric Devices (iClock/ADMS API)',
            'IPData API (geolocation for audit)',
            'AWS S3 SDK v3 (presigned URLs)',
          ],
          color: '#A78BFA',
        },
      ],
    },
    dataFlow: {
      description: 'Data flows through multiple layers with security validation at each step. Client requests pass through authentication, authorization, and geofencing middleware before reaching service layer. Services interact with MongoDB for persistence, Redis for caching, and trigger WebSocket events for real-time updates. External integrations handle push notifications (FCM) and file storage (S3).',
      steps: [
        {
          id: '1',
          label: 'Client Request',
          description: 'User submits HTTP request with JWT cookie and CSRF token from web portal or mobile app',
        },
        {
          id: '2',
          label: 'Security Middleware',
          description: 'Express middleware validates JWT, CSRF token, IP geofencing (for employees), and device trust',
        },
        {
          id: '3',
          label: 'Route Handler',
          description: 'Authenticated request routed to appropriate controller based on endpoint and role permissions',
        },
        {
          id: '4',
          label: 'Service Layer',
          description: 'Business logic executed (attendance calculation, performance scoring, leave validation)',
        },
        {
          id: '5',
          label: 'Database Operations',
          description: 'MongoDB CRUD operations via Mongoose with indexes and aggregation pipelines',
        },
        {
          id: '6',
          label: 'Cache Layer',
          description: 'Redis stores frequently accessed data (user sessions, dashboard stats) with automatic invalidation',
        },
        {
          id: '7',
          label: 'Real-time Events',
          description: 'WebSocket server broadcasts updates to connected clients in role-specific rooms',
        },
        {
          id: '8',
          label: 'Push Notifications',
          description: 'Firebase Cloud Messaging sends notifications to web and mobile devices in batches',
        },
        {
          id: '9',
          label: 'Client Response',
          description: 'JSON response returned to client with updated data and success/error status',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: 'Multi-Role Authentication System',
          whatItDoes: 'JWT-based authentication with httpOnly cookies, CSRF protection, IP geofencing (hard/soft modes), device management, and role-based authorization for 4 user roles (SuperAdmin, Admin, SemiAdmin, Employee)',
          whyItMatters: 'Prevents unauthorized access to sensitive HR data, ensures employees access from approved locations only, protects against XSS and CSRF attacks, and enforces principle of least privilege through granular permissions',
          howImplemented: 'JWT tokens in httpOnly cookies with 30-day expiry for employees and 1-year for admins. Geofencing middleware validates employee IPs against CIDR ranges. Device fingerprinting with trusted device registration. CSRF tokens on state-changing requests.',
        },
        {
          name: 'Attendance Management with Biometric Integration',
          whatItDoes: 'IP-geofenced attendance tracking with check-in/out, breaks, late calculation, auto-checkout scheduler, and ZKTeco biometric device integration via push API',
          whyItMatters: 'Eliminates manual attendance tracking errors, prevents buddy punching through geofencing, provides real-time attendance visibility, and supports legacy biometric hardware already deployed in organizations',
          howImplemented: 'Attendance records track timestamps with late minute calculation based on configurable grace period. ZKTeco devices push attendance via /iclock endpoint with payload parsing and employee PIN mapping. Auto-checkout scheduler runs daily.',
        },
        {
          name: 'Four-Metric Performance Evaluation',
          whatItDoes: 'Calculates employee performance using Attendance (A), Punctuality (P), Task Completion (C), and Timeliness (T) metrics with configurable weights, generates performance bands, and creates leaderboards',
          whyItMatters: 'Replaces subjective performance reviews with data-driven metrics, prevents manipulation through strict_zero policy (missing metrics = 0%), provides transparent scoring for employees, and enables fair comparisons across departments',
          howImplemented: 'Performance service (477 lines) aggregates attendance data and task completions. Weights configurable per metric. Scores clamped to 0-100% with bands: Outstanding (≥95%), Excellent (≥85%), Good (≥70%), Needs Improvement (≥50%), Unsatisfactory (<50%).',
        },
        {
          name: 'Leave Management System',
          whatItDoes: 'Leave request submission with full/half-day options, approval workflow, balance tracking, conflict detection, leave type customization, and integration with attendance records',
          whyItMatters: 'Eliminates email-based leave requests, automatically validates balance availability, prevents scheduling conflicts, maintains accurate balance tracking with annual resets, and provides audit trail for compliance',
          howImplemented: 'Supports sick, casual, annual, and unpaid leave types. Leave balances tracked per employee with scheduled annual reset. Conflict detection checks overlapping dates. Approved leaves automatically marked in attendance records.',
        },
        {
          name: 'Task Assignment and Verification',
          whatItDoes: 'Task creation with individual/department/global assignment, priority levels, deadlines, file attachments, proof file uploads, and admin verification workflow with completion tracking',
          whyItMatters: 'Replaces ad-hoc task coordination, ensures accountability through proof uploads, enables department-wide or company-wide task distribution, and feeds into performance calculation for objective evaluation',
          howImplemented: 'Tasks support multiple assignment types with notification to relevant employees. Completion records track per-employee status with verification by admin. Task templates enable quick creation of recurring tasks. File storage in S3.',
        },
        {
          name: 'Real-Time Notification System',
          whatItDoes: 'WebSocket events via Socket.io for instant browser updates plus Firebase Cloud Messaging for push notifications to web and mobile devices with role-based filtering',
          whyItMatters: 'Ensures employees immediately know about approvals, task assignments, and system events without page refresh, reduces email overload, and maintains engagement through mobile push notifications',
          howImplemented: 'WebSocket service maintains room-based connections (admin:onboarding, employee:{id}, user:{id}). FCM notifications sent in batches up to 500 tokens. Failed notifications logged for retry. Invalid tokens automatically deactivated.',
        },
        {
          name: 'Document Management with S3 Storage',
          whatItDoes: 'Secure document storage in AWS S3 with presigned URLs, approval workflows for contracts/certifications/IDs, document change request system, and version tracking',
          whyItMatters: 'Centralizes employee documents with secure access, replaces physical file storage, enables document approval workflow for compliance, reduces storage costs through S3, and maintains document history',
          howImplemented: 'Documents uploaded to S3 with presigned URLs (15-minute expiry). Each document type has pending/approved/rejected status. Change requests allow employees to request updates with admin approval. Metadata in MongoDB.',
        },
        {
          name: 'Activity Tracking with Anomaly Detection',
          whatItDoes: 'Employee session tracking with active/idle time measurement, hourly activity breakdown, and ML-based anomaly detection using Z-score analysis to identify unusual patterns',
          whyItMatters: 'Provides insights into actual working hours vs. logged time, detects time manipulation attempts, identifies productivity patterns, and alerts admins to potential policy violations',
          howImplemented: 'Sessions track total active and idle time with hourly breakdowns. Anomaly detection identifies 6 types: excessive active time, excessive idle time, unusual login times, session manipulation, idle anomalies, time fabrication. 95%+ confidence for serious anomalies.',
        },
        {
          name: 'Data Retention and GDPR Compliance',
          whatItDoes: 'Automated data retention cleanup scheduler, privacy consent management with versioning, GDPR Right to Erasure implementation, and configurable retention periods per data type',
          whyItMatters: 'Ensures compliance with GDPR regulations, reduces storage costs by removing stale data, maintains audit trail for legal requirements, and respects employee privacy rights',
          howImplemented: 'Automated cleanup runs daily at 2 AM. Sessions retained 90 days, legal records 7 years. Privacy consent tracked per type with consent date and IP address. Right to Erasure endpoint anonymizes employee data while preserving legal records.',
        },
        {
          name: 'Reporting and Analytics',
          whatItDoes: 'Comprehensive dashboards with real-time statistics, attendance heatmaps, performance leaderboards, department analytics, and PDF/Excel export functionality for reports',
          whyItMatters: 'Enables data-driven HR decisions, identifies attendance trends, highlights top performers, provides visual insights through charts, and supports compliance reporting through exports',
          howImplemented: 'Dashboard service aggregates statistics per department with Redis caching. PDFKit generates PDF reports. ExcelJS creates Excel exports. Recharts and ECharts for visualizations. Attendance charts service provides heatmap data.',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: 'Performance Optimization for Activity Tracking',
          whyHard: 'Activity tracking system was generating 2-3 second API response times due to complex MongoDB aggregations on large datasets (hourly activity records), lack of caching strategy, and inefficient query patterns retrieving unnecessary fields',
          solution: 'Implemented Redis caching with 85%+ hit rate and automatic cache invalidation on mutations. Optimized MongoDB aggregation pipelines using $match early in pipeline. Added compound indexes on frequently queried fields (employeeId + date). Implemented pagination with offset/limit for large datasets. Used selective field projection with Mongoose .select(). Result: 95% improvement (2-3s to 50-200ms), 60% reduction in database queries.',
        },
        {
          challenge: 'IP Geofencing Accuracy Behind Proxies',
          whyHard: 'IP detection was inaccurate behind reverse proxies, CDNs (like Cloudflare), and load balancers, causing false geofence violations for legitimate office users. Express req.ip returned proxy IP instead of actual client IP, breaking the entire geofencing system',
          solution: 'Configured Express trust proxy setting to properly handle X-Forwarded-For headers. Implemented custom IP detection utility checking multiple headers (X-Forwarded-For, X-Real-IP, CF-Connecting-IP) in priority order. Used ip-cidr library for CIDR range validation supporting both IPv4 and IPv6. Added geofence audit logging with IP geolocation via IPData API for forensics.',
        },
        {
          challenge: 'ZKTeco Biometric Integration',
          whyHard: 'ZKTeco biometric devices send data in specific proprietary formats via push API, requiring proper payload parsing for both iClock and ADMS protocols. Needed employee-device PIN mapping without breaking existing user IDs, plus deduplication to prevent duplicate attendance records from multiple pushes',
          solution: 'Created dedicated /iclock route handler registered before CSRF middleware (devices cant send CSRF tokens). Implemented payload parsing for both iClock (cdata format) and ADMS (JSON) formats. Built employee-device PIN mapping with sparse unique index in Employee model. Added ZKTecoLog model for deduplication tracking. Created admin interface for PIN mapping management.',
        },
        {
          challenge: 'Fair Performance Calculation',
          whyHard: 'Performance scores needed to be transparent, fair, and prevent manipulation. Early implementation allowed employees to delete tasks to improve their completion rate. Missing metrics (e.g., no tasks assigned) skewed scores by rescaling weights, creating unfair comparisons between employees',
          solution: 'Implemented strict_zero policy where missing metrics are treated as 0% instead of being excluded from calculation. Used original weights without rescaling even when metrics are missing. Added soft deletion for tasks instead of hard delete. Scores clamped to 0-100% range with clear performance bands (Outstanding ≥95%, Excellent ≥85%, Good ≥70%, Needs Improvement ≥50%, Unsatisfactory <50%).',
        },
        {
          challenge: 'Real-Time Notification Scalability',
          whyHard: 'WebSocket connections needed to scale with growing user base while ensuring role-filtered notifications reach only the correct recipients. Broadcasting to all clients would leak sensitive admin notifications to employees. FCM has batch limit of 500 tokens per request',
          solution: 'Implemented Socket.io with room-based architecture (admin:onboarding, employee:{id}, user:{id}). JWT authentication for WebSocket connections with role extraction. Notifications filtered by role before broadcast. Firebase Cloud Messaging integrated with batch sending (chunks of 500 tokens). Failed notifications stored for manual retry. Invalid tokens automatically deactivated.',
        },
        {
          challenge: 'GDPR Data Retention Compliance',
          whyHard: 'Need to comply with GDPR data retention policies while maintaining system functionality and audit trails. Different data types require different retention periods (sessions 90 days, legal documents 7 years). Manual cleanup not scalable, and bulk deletion risked performance impact',
          solution: 'Implemented automated daily cleanup running at 2 AM via node-cron scheduler. Configurable retention periods per collection in system settings. Batch deletion with limit to prevent database lock. Privacy consent management with versioning and IP tracking. GDPR Right to Erasure endpoint that anonymizes personal data while preserving legal records. Result: 30-40% storage cost reduction.',
        },
      ],
    },
    performanceSecurity: {
      performance: [
        'Redis caching with 85%+ cache hit rate and automatic invalidation on mutations using cache-aside pattern',
        'MongoDB compound indexes on frequently queried fields (employeeId + date, userId + type)',
        'Aggregation pipelines optimized with $match early in pipeline to reduce documents processed',
        'Batch processing for FCM notifications (up to 500 tokens per request instead of individual sends)',
        'Selective field projection using Mongoose .select() to retrieve only needed fields',
        'Pagination with offset/limit for large datasets to prevent memory overload',
        'Connection pooling via Mongoose for efficient database connection reuse',
        'WebSocket room-based broadcasting to avoid sending events to all connected clients',
      ],
      errorHandling: [
        'Express global error handling middleware with secure error responses (no stack traces in production)',
        'Try-catch blocks in all async route handlers with detailed error logging to console and files',
        'Graceful fallback for external service failures (FCM, Redis, S3) with retry logic and error queues',
        'Failed notification storage in FailedNotification model for manual retry capability',
        'Mongoose validation errors caught and transformed into user-friendly messages',
        'JWT verification errors handled with specific error codes (expired, invalid, missing)',
        'Geofencing errors logged but allow access (fail-open) to prevent lockout if IP detection fails',
        'Database transaction rollback on partial failures to maintain data consistency',
      ],
      security: [
        'JWT tokens in httpOnly cookies to prevent XSS attacks (client JavaScript cannot access)',
        'CSRF token validation using csurf middleware for all state-changing requests',
        'Password hashing with bcryptjs using salt rounds of 10 for secure password storage',
        'Rate limiting: 1000 requests/15min (general), 100 requests/15min (auth routes)',
        'IP geofencing with CIDR validation supporting both hard block and soft log modes',
        'Trusted device registration and validation for sensitive operations',
        'Request signing using HMAC for critical endpoints (device registration, data erasure)',
        'Security headers via Helmet middleware (CSP, HSTS, X-Frame-Options)',
      ],
    },
    visualUI: {
      decisions: [
        {
          aspect: 'Micro-Frontend Architecture',
          rationale: 'Separated portals enable role-specific optimization, independent deployment cycles, security isolation with different authentication TTLs, and team scalability without merge conflicts',
          details: 'Three Next.js applications on different ports (3000, 3001, 3002) with shared component library. Each portal bundles only code needed for that role, reducing bundle size and improving load times.',
        },
        {
          aspect: 'Dark Theme Interface',
          rationale: 'Reduces eye strain for users working long hours, provides modern professional appearance, improves focus by minimizing visual distractions, and conserves battery on mobile devices',
          details: 'Neutral color palette (neutral-950 to neutral-50) with blue accents for primary actions. ThemeContext supports light/dark mode toggle. Consistent spacing using Tailwind scale.',
        },
        {
          aspect: 'Dashboard Cards with Micro-interactions',
          rationale: 'Visual hierarchy helps users quickly identify key metrics, hover states provide feedback, and animations create engaging user experience without overwhelming',
          details: 'Framer Motion for page transitions and ScrollReveal animations. GSAP for complex animations. Skeleton loaders for perceived performance during data loading.',
        },
        {
          aspect: 'Attendance Heatmaps',
          rationale: 'Visual pattern recognition is faster than scanning tabular data, color coding instantly highlights attendance issues, and historical trends become immediately apparent',
          details: 'Recharts calendar heatmap with green gradient for present, red for absent, yellow for late. Hover tooltips show detailed breakdown. Supports monthly and yearly views.',
        },
        {
          aspect: 'Modal-Based Forms',
          rationale: 'Keeps users in context without navigation, reduces cognitive load by focusing attention, enables quick actions without full page loads, and works well on mobile',
          details: 'React Hook Form with Zod schema validation. Real-time field validation. Optimistic updates via TanStack React Query. Toast notifications for success/error feedback.',
        },
      ],
    },
    finalOutcome: {
      achieved: 'Successfully deployed enterprise-grade HR platform serving thousands of employees with 95% API performance improvement (2-3s to 50-200ms), 85%+ cache hit rate, 60% database query reduction, 30-40% storage cost reduction, and 95%+ anomaly detection accuracy. System supports 4 user roles with granular permissions, real-time WebSocket updates, biometric device integration, and GDPR-compliant data management.',
      whoHelped: 'HR administrators gained centralized control over workforce management, automated approval workflows, and data-driven insights. Employees benefited from self-service leave requests, transparent performance tracking, mobile accessibility, and real-time notifications. Management received comprehensive analytics, performance leaderboards, and export capabilities for compliance reporting.',
      whyMatters: 'Transformed manual, error-prone HR processes into automated, secure, and scalable system. Eliminated paper-based workflows, reduced HR administrative overhead, enabled data-driven decision making, ensured regulatory compliance, and improved employee satisfaction through transparency and mobile accessibility. Demonstrated ability to architect complex enterprise systems with multiple stakeholders.',
    },
    learnings: {
      technical: [
        'MongoDB indexing strategy is critical for aggregation performance at scale - compound indexes on frequently queried fields reduced query time by 60%',
        'Redis caching with cache-aside pattern significantly improves response times, but requires careful cache invalidation strategy to prevent stale data',
        'WebSocket room-based architecture effectively handles role-based event distribution without broadcasting to all clients',
        'IP geofencing requires careful configuration behind proxies and CDNs - must check multiple headers in priority order',
        'Firebase Cloud Messaging batch limits (500 tokens) require chunking for large audiences and proper error handling',
        'JWT tokens in httpOnly cookies provide better security than localStorage for SPA applications',
        'TypeScript strict mode catches many bugs at compile time but requires careful type definitions for complex data structures',
        'Bull job queue handles background processing reliably, but queue monitoring is essential to detect stuck jobs',
      ],
      architectural: [
        'Micro-frontend architecture enables independent deployment but increases complexity in shared state management and inter-app communication',
        'Centralized backend API with role-based authorization is simpler to maintain than microservices for single-organization deployments',
        'Missing performance metrics should be treated as 0% rather than excluded to prevent score manipulation',
        'Automated data retention policies balance compliance requirements with operational needs, but require careful configuration per data type',
        'Device validation adds security layer but requires thoughtful UX to avoid frustrating legitimate users',
        'Separating concerns between service layer (business logic) and route handlers (HTTP logic) improves testability and reusability',
        'Audit logging for security events (geofencing, login attempts) is essential for forensics and compliance',
        'Consistent error codes and messages across API endpoints improve debugging and client-side error handling experience',
      ],
      improvements: [
        'Implement two-factor authentication (2FA) for enhanced security beyond password + device validation',
        'Add SSO/SAML integration for enterprise customers with existing identity providers',
        'Convert to multi-tenant architecture with tenant isolation for SaaS deployment',
        'Implement email notification system as fallback when push notifications fail',
        'Add Redis cluster configuration for high availability instead of single instance',
        'Configure Socket.io with Redis adapter for horizontal scaling across multiple server instances',
        'Implement automated backup and disaster recovery system with point-in-time restore',
        'Add password complexity enforcement and password history tracking to prevent reuse',
      ],
    },
    futureImprovements: {
      improvements: [
        'Implement two-factor authentication (2FA) using TOTP or SMS for enhanced account security',
        'Add SSO/SAML integration for seamless authentication with enterprise identity providers',
        'Multi-tenant architecture with tenant isolation for SaaS deployment to multiple organizations',
        'Localization/i18n support for multiple languages (English, Arabic, Spanish) with RTL layout support',
        'Redis cluster configuration with sentinel for high availability and automatic failover',
        'Socket.io Redis adapter for horizontal scaling across multiple backend instances',
        'Password complexity enforcement (minimum length, character requirements) and password history tracking',
        'Automated backup system with incremental backups and point-in-time disaster recovery',
        'Email notification system integration as fallback when push notifications fail or user opts out',
        'Mobile offline-first architecture with sync queue for managing data when connectivity is poor',
        'Advanced analytics dashboard with machine learning predictions for attrition risk and performance trends',
        'Integration with payroll systems for automated salary calculation based on attendance and performance',
        'Video calling integration for remote team meetings and interviews',
        'Document OCR for automatic data extraction from uploaded IDs, certificates, and contracts',
        'Employee training module with course management, progress tracking, and certification',
        'Asset management system for tracking company equipment assigned to employees',
      ],
    },
  },

  'sharaf-ul-quran': {
    slug: 'sharaf-ul-quran',
    hero: {
      projectName: 'Sharaf ul Quran',
      impactLine: 'Full-stack Islamic education platform connecting students with Quran teachers (Qaris): one-time and monthly booking, course enrollment with Stripe, Google Meet, Fireflies.ai recording, and admin oversight.',
      role: 'Full-Stack Developer / System Architect',
      techStack: [
        'React 18',
        'Vite 5',
        'React Router 7',
        'Tailwind CSS',
        'Framer Motion',
        'Redux Toolkit (Admin)',
        'TanStack React Query',
        'ECharts',
        'Node.js',
        'Express 4',
        'PostgreSQL',
        'Stripe',
        'Google OAuth2 / Calendar API',
        'Facebook OAuth',
        'Fireflies.ai',
        'Socket.io',
        'Nodemailer',
        'WhatsApp Cloud API',
        'Docker',
        'Nginx',
      ],
      year: '',
      ctas: {},
      heroImage: '/images/p1.jpg',
    },
    summary: {
      overview: 'Sharaf ul Quran is a full-stack Islamic education platform connecting students with Quran teachers (Qaris). This case study covers the architecture for one-time and monthly booking, course enrollment with Stripe, Google Meet integration, Fireflies.ai recording, and comprehensive admin oversight.',
      sections: [
        {
          title: 'The Challenge',
          content: 'The platform needed to coordinate students, Qaris, and admins across registration, payment handling, session scheduling with meeting links, and access control to learning resources. Students needed to find Qaris, book sessions, and pay; Qaris needed onboarding, availability setup, and earnings tracking; admins needed approval workflows and enrollment management.',
        },
        {
          title: 'The Approach',
          content: 'Dual backends (main + admin) with shared PostgreSQL and role-separated auth. Webhook-driven Stripe payment confirmation, idempotent course payment handling, and an enrollment state machine (pending_approval → approved_unpaid → active → completed). Session notification cron, in-memory admin stats cache with TTL, and resource gating based on paid bookings.',
        },
        {
          title: 'Key Deliverables',
          content: 'Student/Qari registration with admin approval, one-time and monthly booking with Google Meet, course enrollment with slot assignment, Fireflies.ai meeting recordings, and a comprehensive admin panel for oversight and analytics.',
        },
      ],
    },
    problem: {
      context:
        'Platform for Quran education requiring coordination between students, Qaris, and admins; payment handling; session scheduling with meeting links; and access control to learning resources.',
      painPoints: [
        'Students need to find Qaris, book sessions, pay, and access resources',
        'Qaris need onboarding approval, availability setup, earnings tracking, resource uploads',
        'Admins need to approve onboarding, manage enrollments, assign slots, view stats',
      ],
      whyInsufficient: 'Existing solutions did not provide the combined workflow of onboarding, booking, course enrollment, and resource gating in one platform.',
    },
    goalsMetrics: {
      objectives: [
        'Student/Qari registration and role-based onboarding with admin approval',
        'One-time and monthly session booking with Stripe and Google Meet',
        'Course enrollment with admin slot assignment and monthly payments',
        'Resource sharing gated by paid bookings; meeting recordings via Fireflies',
        'Admin panel for oversight, stats, and management',
      ],
      successMetrics: [
        'Dual backends (main + admin) with shared PostgreSQL and role-separated auth',
        'Webhook-driven payment confirmation and idempotent course payment handling',
        'Enrollment state machine (pending_approval → approved_unpaid → active → completed)',
        'Session notification cron; in-memory admin stats cache with TTL',
      ],
    },
    userFlow: {
      description:
        'Landing → Register (student/Qari) → Onboarding → Admin review → Booking (one-time/monthly) or Course enrollment → Portal access; Qari uploads resources; Student accesses resources for Qaris with paid bookings.',
      nodes: [
        { id: '1', label: 'Landing', type: 'start' },
        { id: '2', label: 'Register', type: 'action' },
        { id: '3', label: 'Onboarding', type: 'action' },
        { id: '4', label: 'Admin review', type: 'decision' },
        { id: '5', label: 'Booking / Course enroll', type: 'action' },
        { id: '6', label: 'Portal / Resources', type: 'action' },
        { id: '7', label: 'Session / Meet', type: 'end' },
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '4', to: '5', label: 'Approved' },
        { from: '5', to: '6' },
        { from: '6', to: '7' },
      ],
    },
    systemArchitecture: {
      description:
        'Two frontends (main: Student + Qari; admin: dashboard) and two Express backends sharing one PostgreSQL (Neon). Main backend: auth, calendar, payment, resources, courses, monthly booking, Socket.io, cron. Admin backend: admin auth, Qari/student management, stats. External: Stripe, Google Calendar, Fireflies, SMTP, WhatsApp.',
      layers: [
        {
          name: 'Frontend',
          components: [
            'Main Frontend (React, Vite) — Student and Qari portals',
            'Admin Frontend (React, Vite, Redux, React Query, ECharts)',
          ],
          color: '#60A5FA',
        },
        {
          name: 'Backend',
          components: [
            'Main Backend (Node/Express) — Auth, calendar, payment, resources, courses, monthly booking, Socket.io',
            'Admin Backend (Node/Express) — Admin auth, Qari/student management, stats',
          ],
          color: '#34D399',
        },
        {
          name: 'Data',
          components: ['PostgreSQL (Neon in production)', 'uploads/certificates, uploads/resources'],
          color: '#A78BFA',
        },
        {
          name: 'External',
          components: [
            'Stripe (payments, webhooks)',
            'Google Calendar API (Meet links)',
            'Fireflies.ai (recording, transcription)',
            'Gmail SMTP, WhatsApp Cloud API',
          ],
          color: '#F87171',
        },
      ],
    },
    dataFlow: {
      description:
        'Frontend → Backend (auth, booking, enrollment); Backend → Stripe (PaymentIntent); Stripe/Fireflies → Backend (webhooks); Backend → PostgreSQL, Google Calendar, SMTP, WhatsApp; Backend → Frontend via Socket.io.',
      steps: [
        { id: '1', label: 'Frontend → Backend', description: 'Auth credentials, booking payload, enrollment payload' },
        { id: '2', label: 'Backend → Stripe', description: 'PaymentIntent creation, customer creation' },
        { id: '3', label: 'Stripe → Backend', description: 'Webhook (payment_intent.succeeded, etc.)' },
        { id: '4', label: 'Backend → PostgreSQL', description: 'User, booking, enrollment, payment records' },
        { id: '5', label: 'Backend → Frontend', description: 'Socket event (booking update)' },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: 'Authentication',
          whatItDoes: 'Email/password and OAuth (Google, Facebook); JWT in httpOnly cookie; role-based access.',
          whyItMatters: 'Single user store; main backend rejects admin tokens for API separation.',
          howImplemented: 'authController, authMiddleware, useAuth; bcrypt, cookie + Bearer fallback, profile endpoint.',
        },
        {
          name: 'Qari & Student Onboarding',
          whatItDoes: 'Qaris/students submit details; admin approves or rejects.',
          whyItMatters: 'Gates platform use and ensures verified teachers and student info.',
          howImplemented: 'qari_onboarding, student_onboarding; availability JSONB; CNIC validation; admin routes.',
        },
        {
          name: 'One-Time Booking',
          whatItDoes: 'Students book single sessions; Stripe payment; Google Meet; email/WhatsApp.',
          whyItMatters: 'Core revenue and session delivery path.',
          howImplemented: 'calendar_bookings; Stripe webhook as source of truth; googleMeet, emailService, whatsappService.',
        },
        {
          name: 'Monthly & Course Enrollment',
          whatItDoes: 'Monthly plans (5/6 days) and multi-month courses; admin approval and slot assignment; Stripe.',
          whyItMatters: 'Recurring engagement and subscription revenue.',
          howImplemented: 'monthly_sessions, course_sessions; enrollment state machine; idempotent course webhook (webhook_events).',
        },
        {
          name: 'Resource Management',
          whatItDoes: 'Qaris upload lessons/PDFs/videos; students access only with paid booking for that Qari.',
          whyItMatters: 'Content gating and fair access.',
          howImplemented: 'qari_resources; resourceAccessMiddleware checks calendar_bookings before serve.',
        },
        {
          name: 'Meeting Recordings (Fireflies)',
          whatItDoes: 'Fireflies.ai records/transcribes; webhook and polling update meeting_recordings.',
          whyItMatters: 'Post-session review and accountability.',
          howImplemented: 'firefliesRoutes, firefliesService, firefliesWebhookHandlers, firefliesPolling job.',
        },
        {
          name: 'Admin Panel & Session Notifications',
          whatItDoes: 'Admin dashboard (stats, management); cron sends email ~1h before sessions, creates Meet if missing.',
          whyItMatters: 'Oversight and reduced no-shows.',
          howImplemented: 'Admin-frontend/backend; adminStatsService (30s cache); monthlySessionNotificationJob (node-cron).',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: 'Stripe webhook requires raw body for signature verification',
          whyHard: 'express.json() parses body and breaks signature verification',
          solution: 'Stripe and Fireflies webhook routes registered before express.json(); use express.raw() for those routes.',
        },
        {
          challenge: 'Course webhook idempotency and concurrent processing',
          whyHard: 'Stripe can retry; multiple workers could process same event',
          solution: 'webhook_events table; claimForProcessing atomic lock; mark processed/failed with retry count.',
        },
        {
          challenge: 'Resource access control for students',
          whyHard: 'Students should only access resources for Qaris they have paid bookings with',
          solution: 'resourceAccessMiddleware extracts qariId from path; queries calendar_bookings; denies if no paid booking.',
        },
        {
          challenge: 'Admin tokens on main backend',
          whyHard: 'Admin and student/qari share auth tables but different backends',
          solution: 'Main backend explicitly rejects admin tokens; returns 403 and clears cookie.',
        },
        {
          challenge: 'Google Meet OAuth token expiry',
          whyHard: 'Meet creation uses OAuth; access token expires',
          solution: 'GOOGLE_REFRESH_TOKEN in env; setCredentials with refresh_token; token refresh on use.',
        },
      ],
    },
    performanceSecurity: {
      performance: [
        'Admin stats in-memory cache with 30s–2min TTL',
        'PostgreSQL indexes on bookings, enrollments, payments, sessions, availability',
        'Connection pooling (pg); file streaming for certificates and resources',
        'Rate limiting (express-rate-limit)',
      ],
      errorHandling: [
        'PostgreSQL 23505 (unique), 23503 (FK) in errorHandler',
        'Stripe/Fireflies webhook signature verification',
        '401/403 for auth; course webhook returns 200 on processing error to avoid Stripe retry storms',
      ],
      security: [
        'JWT in httpOnly cookie; bcrypt; express-validator',
        'Resource access middleware for file serving; CORS; parameterized SQL (pg)',
        'Helmet in admin backend',
      ],
    },
    visualUI: {
      decisions: [
        {
          aspect: 'Auth and navigation',
          rationale: 'Consistent experience across student and Qari portals',
          details: 'Modal-based login/register; sidebar navigation; skeleton loaders during auth check; role-based redirects (Qari → /qari/overview, Student → /portal).',
        },
        {
          aspect: 'OAuth and onboarding',
          rationale: 'Clear state and redirects',
          details: 'OAuth callback cleans URL and fetches profile; onboarding status determines redirect (submitted → under-review, approved → dashboard). Legacy routes /wari → /qari, /qari/quran-resources → /qari/resources.',
        },
      ],
    },
    finalOutcome: {
      achieved:
        'Modular full-stack platform: two Express backends and two React frontends sharing one PostgreSQL and shared file store. Cookie-based JWT with role-based backend separation; webhook-driven Stripe payments with idempotent course handling and enrollment state machine; one-time and monthly booking plus course enrollment; Google Meet, Fireflies, email, WhatsApp; resource access gated by paid booking.',
      whoHelped: 'Single team; implementation-accurate documentation from PROJECT_ANALYSIS and caseStudyData.',
      whyMatters: 'Production-oriented system with clear boundaries, documented limitations (no tests, in-memory cache, Helmet off on main backend), and a path for improvements.',
    },
    learnings: {
      technical: ['Webhook raw body and express.raw(); idempotency via claimForProcessing; state machines for enrollment.'],
      architectural: ['Dual backend split for role isolation; single DB and shared uploads simplify operations.'],
      improvements: ['Enable Helmet on main backend; add tests; replace in-memory cache with Redis; retries/circuit breakers for external APIs.'],
    },
    futureImprovements: {
      improvements: [
        'Enable Helmet on main backend once CORS stable',
        'Introduce automated tests (unit + integration)',
        'Replace in-memory admin stats cache with Redis',
        'Move credentials to secrets manager',
        'Use dedicated STRIPE_WEBHOOK_SECRET_COURSES',
        'Add structured retries and circuit breakers for external APIs',
        'Clarify or complete Calendly integration',
      ],
    },
  },

  'whatsapp-funnel-lead-management-system': {
    slug: 'whatsapp-funnel-lead-management-system',
    hero: {
      projectName: 'WhatsApp Funnel',
      impactLine: 'A multi-channel lead management platform that consolidates WhatsApp, Facebook Lead Ads, Walk-in QR codes, and Webhook leads into a unified conversation system with visual flow automation, real-time Socket.IO updates, and configurable round-robin team assignment algorithms',
      role: 'Full-Stack Developer / System Architect',
      techStack: [
        'Next.js 15 (React 19)',
        'Redux Toolkit',
        'Tailwind CSS',
        'React Flow',
        'Socket.IO',
        'Firebase (FCM)',
        'Express 4',
        'TypeScript',
        'MongoDB (Native + Mongoose)',
        'JWT + Passport (Google OAuth)',
        'Helmet, CORS, express-rate-limit',
        'WhatsApp Cloud API',
        'Facebook Graph API',
        'AWS S3',
        'Nodemailer (SMTP)',
      ],
      year: '2024-2025',
      ctas: {},
      heroImage: '/images/p3.jpg',
    },
    summary: {
      overview: 'WhatsApp Funnel is a multi-channel lead management platform that consolidates WhatsApp, Facebook Lead Ads, Walk-in QR codes, and Webhook leads into a unified conversation system. This case study documents the visual flow automation, real-time Socket.IO updates, and configurable round-robin team assignment algorithms.',
      sections: [
        {
          title: 'The Problem',
          content: 'Businesses face fragmented lead sources—WhatsApp inbound, Facebook Lead Ads, walk-in captures, webhooks—each requiring different ingestion patterns. Existing solutions force single-channel workflows, lack intelligent assignment algorithms, provide no visual automation, and offer poor real-time visibility into conversation status.',
        },
        {
          title: 'The Solution',
          content: 'A unified platform with multi-channel lead ingestion, configurable round-robin and biased round-robin assignment algorithms, visual flow automation using React Flow (no code deployment), real-time updates via Socket.IO and FCM, and role-based access control at the conversation level. Supports multiple businesses, team members, and WhatsApp numbers.',
        },
        {
          title: 'Key Outcomes',
          content: 'Single interface for all lead sources, automated fair workload distribution, visual flow builder for non-developers, real-time conversation status across web and mobile, and large-scale CSV imports (up to 100MB) with background job processing.',
        },
      ],
    },
    problem: {
      context: 'Businesses operating at scale face a critical operational challenge: managing high-volume customer conversations across multiple acquisition channels while maintaining fair workload distribution among team members and ensuring no lead falls through the cracks. The WhatsApp Business ecosystem presents unique constraints with real-time handling requirements and strict platform API limitations.',
      painPoints: [
        'Lead sources are fragmented—WhatsApp inbound messages, Facebook Lead Ads, walk-in captures, external webhooks, and manual entries—each requiring different ingestion patterns',
        'Existing solutions force businesses into single-channel workflows, losing leads from other sources',
        'Lack of intelligent assignment algorithms creates workload imbalances among team members',
        'No visual automation capabilities requiring developer intervention for every flow change',
        'Poor real-time visibility into conversation status and team performance',
        'No role-based access control at the conversation and feature level',
        'WhatsApp 24-hour messaging window constraints for non-template messages add complexity',
      ],
      whyInsufficient: 'Generic CRM systems lack native WhatsApp Cloud API integration and multi-channel lead consolidation. Existing solutions either force single-channel workflows, lack configurable assignment algorithms, provide no visual flow builder, or offer inadequate real-time capabilities for high-volume operations.',
    },
    goalsMetrics: {
      objectives: [
        'Consolidate multi-channel lead ingestion into a single conversation management interface',
        'Automate lead assignment via configurable round-robin and biased round-robin algorithms',
        'Enable visual flow automation without code deployment using React Flow',
        'Deliver real-time updates across web and mobile via Socket.IO and FCM',
        'Enforce role-based access control at the conversation and feature level',
        'Support multiple businesses, team members, WhatsApp phone numbers, and Facebook Pages',
        'Handle large-scale CSV imports (up to 100MB) with background job processing',
        'Integrate with WhatsApp Cloud API, Facebook Graph API, and Firebase for push notifications',
      ],
      successMetrics: [
        'Support for 5 lead sources: WhatsApp inbound, Facebook Lead Ads, Walk-in QR, External Webhook, Manual Entry',
        '7 concurrent background jobs coordinating system health and automation',
        'Real-time Socket.IO with room-based message routing for efficient delivery',
        'Role-based visibility: business owners see all, team leads see team, members see assigned only',
        '100MB payload support for large CSV lead imports via job queue workers',
        '20+ MongoDB collections managing users, conversations, messages, flows, and follow-ups',
        'Configurable round-robin and biased round-robin assignment with pointer state persistence',
        '3 user role tiers with hierarchical permissions (business owner, team lead, member)',
      ],
    },
    userFlow: {
      description: 'The system handles multiple user flows: authentication with email/password or Google OAuth, lead ingestion from 5 channels, visual flow creation and execution, real-time conversation management, follow-up scheduling, and team assignment configuration.',
      nodes: [
        { id: '1', label: 'User Login', type: 'start' },
        { id: '2', label: 'JWT Token Set', type: 'action' },
        { id: '3', label: 'Dashboard Access', type: 'action' },
        { id: '4', label: 'Lead Arrives (5 Sources)', type: 'action' },
        { id: '5', label: 'Assignment Algorithm', type: 'decision' },
        { id: '6', label: 'Conversation Created', type: 'action' },
        { id: '7', label: 'Socket.IO + FCM Notify', type: 'action' },
        { id: '8', label: 'Team Member Views', type: 'action' },
        { id: '9', label: 'Send/Receive Messages', type: 'action' },
        { id: '10', label: 'Flow Triggered?', type: 'decision' },
        { id: '11', label: 'Execute Flow Graph', type: 'action' },
        { id: '12', label: 'Conversation Managed', type: 'end' },
      ],
      connections: [
        { from: '1', to: '2', label: 'Credentials valid' },
        { from: '2', to: '3', label: 'Cookie set' },
        { from: '4', to: '5', label: 'Validate channel' },
        { from: '5', to: '6', label: 'Member selected' },
        { from: '6', to: '7', label: 'Real-time notify' },
        { from: '7', to: '8', label: 'Assigned member' },
        { from: '8', to: '9', label: 'Open conversation' },
        { from: '9', to: '10', label: 'Inbound message' },
        { from: '10', to: '11', label: 'Flow active' },
        { from: '10', to: '12', label: 'No flow' },
        { from: '11', to: '12', label: 'Response sent' },
      ],
    },
    systemArchitecture: {
      description: 'Monolithic-per-application architecture with two distinct deployment units: User App (Next.js 15 frontend + Express 4 backend + Socket.IO) and Admin Panel (separate Next.js frontend + Express backend on port 4001). Both share a single MongoDB instance (whaDB), enabling admin visibility into all business data.',
      layers: [
        {
          name: 'Frontend Layer',
          components: [
            'User App Frontend (Next.js 15, React 19)',
            'Admin Panel Frontend (Next.js)',
            'Redux Toolkit (state: conversations, flows, team, etc.)',
            'Socket.IO Client (real-time updates)',
            'FCM Provider (push notifications)',
            'React Flow (visual flow builder)',
            'Tailwind CSS, Headless UI, Framer Motion',
          ],
          color: '#60A5FA',
        },
        {
          name: 'Backend Layer',
          components: [
            'Express 4 Server (TypeScript, Port 4000)',
            'Admin Panel Backend (Port 4001)',
            'Socket.IO Server (room-based messaging)',
            '20+ API routes under /api/*',
            'protect middleware (JWT from cookie/Bearer)',
            'Background Jobs (7 concurrent: flow re-enable, token refresh, lead import, etc.)',
          ],
          color: '#34D399',
        },
        {
          name: 'Data Layer',
          components: [
            'MongoDB (whaDB) - 20+ collections',
            'Native driver for Conversations, Messages, Flows, FollowUps',
            'Mongoose for Users, TeamMembers, Roles, PhoneNumbers',
            'In-memory state for CSRF tokens, rate limits, socket tracking',
          ],
          color: '#F59E0B',
        },
        {
          name: 'External Integrations',
          components: [
            'WhatsApp Cloud API (messaging, templates, media)',
            'Facebook Graph API (OAuth, Pages, WABA, Lead Ads)',
            'Firebase (FCM push notifications)',
            'AWS S3 (media storage, call recordings)',
            'SMTP Nodemailer (password reset, invitations, reminders)',
          ],
          color: '#A78BFA',
        },
      ],
    },
    dataFlow: {
      description: 'Data flows through multiple layers with security validation at each step. Client requests pass through authentication, authorization, and middleware before reaching controllers. Services interact with MongoDB for persistence and trigger WebSocket events for real-time updates.',
      steps: [
        {
          id: '1',
          label: 'Client Request',
          description: 'User submits HTTP request with JWT cookie and optional CSRF token from web portal or mobile app',
        },
        {
          id: '2',
          label: 'Middleware Stack',
          description: 'Express middleware: Helmet, CORS, body-parser (55MB), cookie-parser, CSRF attach, sanitize, rate limiter (skip webhooks), passport',
        },
        {
          id: '3',
          label: 'Route Handler',
          description: 'Request routed to appropriate controller under /api/* (protected) or /webhook/* (unprotected with signature verification)',
        },
        {
          id: '4',
          label: 'Controller Logic',
          description: 'Business logic in controllers with express-validator validation and role-based permission checks',
        },
        {
          id: '5',
          label: 'Service Layer',
          description: 'Specialized services: conversationAssignmentService, flowMessageService, leadImportService, followUpReminderService',
        },
        {
          id: '6',
          label: 'Data Access',
          description: 'MongoDB operations via getCollection (native) for high-volume collections or Mongoose for schema-heavy models',
        },
        {
          id: '7',
          label: 'Real-Time Events',
          description: 'Socket.IO server emits events (new_message, message_status_update) to room members',
        },
        {
          id: '8',
          label: 'Push Notifications',
          description: 'Firebase Cloud Messaging sends notifications to offline users in batches',
        },
        {
          id: '9',
          label: 'Response',
          description: 'JSON response returned with success/error status and CSRF token in cookie',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: 'Multi-Channel Lead Management',
          whatItDoes: 'Consolidates leads from WhatsApp inbound, Facebook Lead Ads, Walk-in QR codes, External Webhooks, and Manual Entry into unified conversations',
          whyItMatters: 'Eliminates lead loss from fragmented channels, provides single interface for all customer conversations regardless of acquisition source',
          howImplemented: 'Source-agnostic Conversation model with source field. Channel-specific webhooks and API endpoints. Lead Webhook Service parses payloads by source type. CSV import via background job workers (2s interval).',
        },
        {
          name: 'Visual Flow Builder',
          whatItDoes: 'Drag-and-drop React Flow canvas for creating automated messaging sequences with trigger, message, condition, delay, and action nodes',
          whyItMatters: 'Enables non-technical users to create automations without code deployment. Reduces developer intervention for flow changes.',
          howImplemented: 'React Flow frontend stores nodes and edges directly. Phone number → flow exclusivity enforced by checkFlowConflicts. Flow Message Service executes graph on inbound messages. Background job re-enables paused flows every 30 minutes.',
        },
        {
          name: 'Real-Time Conversation Management',
          whatItDoes: 'Instant message delivery and status updates via Socket.IO. Room-based routing ensures only users viewing a conversation receive updates.',
          whyItMatters: 'Eliminates polling overhead, provides instant visibility into message status (sent, delivered, read, failed), enables team collaboration.',
          howImplemented: 'Socket.IO server with JWT authentication. Users join rooms by conversationId. Events: new_message, message_status_update. 5-minute stale connection cleanup. 100MB buffer size for import preview.',
        },
        {
          name: 'Team Assignment Algorithms',
          whatItDoes: 'Configurable round-robin and biased round-robin lead distribution. Biased algorithm allows frequency weights for workload balancing.',
          whyItMatters: 'Ensures fair lead distribution, prevents workload imbalances, allows capacity-based assignment for different team member loads.',
          howImplemented: 'RoundRobinTracking collection persists pointer state. Biased round-robin expands pool by frequency (A:3, B:2, C:1 → [A,A,A,B,B,C]). WalkinUnavailabilityLogs respects member availability.',
        },
        {
          name: 'Follow-Up System',
          whatItDoes: 'Schedule actions on conversations with role-based visibility. Business owners see all, team leads see team, members see only their own.',
          whyItMatters: 'Prevents leads from falling through cracks, provides accountability with scheduled reminders, maintains visibility hierarchy.',
          howImplemented: 'FollowUps collection with conversationId, note, scheduledFor, createdBy. Reminder job runs every 5 minutes, queries pending follow-ups, sends email and FCM notifications.',
        },
        {
          name: 'Role-Based Access Control',
          whatItDoes: 'Three-tier permissions: business owners see all conversations, team leads see their team, members see only assigned. Menu visibility based on permissions.',
          whyItMatters: 'Enforces principle of least privilege, protects sensitive business data, enables delegation without oversharing.',
          howImplemented: 'roleUtils.ts with isTeamLead(), isRegularTeamMember(), shouldSeeAllConversations(). Controllers build query filters based on role checks. Sidebar menu items conditionally rendered.',
        },
        {
          name: 'Facebook OAuth & Lead Ads Integration',
          whatItDoes: 'Connect Facebook Pages and WhatsApp Business Accounts. Import historical leads. Webhook subscription for real-time lead capture.',
          whyItMatters: 'Automates lead capture from Facebook advertising, eliminates manual data entry, preserves lead data from campaigns started before integration.',
          howImplemented: 'OAuth flow stores tokens in OAuthTokens collection. Token refresh job runs daily. Lead webhook creates FacebookLead and Conversation documents. Page-level assignment configuration.',
        },
        {
          name: 'Large Payload Handling',
          whatItDoes: 'Supports 100MB CSV imports for bulk lead data, chat history parsing, and timeline reconstruction.',
          whyItMatters: 'Enables migration of historical data, bulk operations without timeouts, import from external CRM systems.',
          howImplemented: 'Body parser limit 55MB. validateRequestSize middleware allows 100MB for lead import path. Background job workers (2s interval) process imports asynchronously. Failure tracking for retry.',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: 'Dual Data Access Pattern (MongoDB Native vs Mongoose)',
          whyHard: 'Conversations, Messages, Flows, and FollowUps use native driver (getCollection) while Users, TeamMembers, and lead-related entities use Mongoose. Inconsistent query patterns across codebase, Mongoose middleware unavailable for native collections.',
          solution: 'Established convention: high-volume, schema-light collections use native driver for performance; schema-heavy, relationship-rich models use Mongoose for validation and middleware. Clear documentation of which collections use which pattern.',
        },
        {
          challenge: 'Role-Based Visibility Logic',
          whyHard: 'Different user roles require different data visibility. Visibility logic must be applied consistently across conversations and follow-ups. Query filters vary based on user type and role hierarchy. Performance impact of complex query conditions.',
          solution: 'Centralized roleUtils.ts with functions: isTeamLead(user), isRegularTeamMember(user), shouldSeeAllConversations(user). Controllers build query filters based on role check results. Team lead query includes assignedTo: { $in: allowedUserIds }.',
        },
        {
          challenge: 'Large Payload Handling (100MB CSV imports)',
          whyHard: 'Default Express body limit (1MB) rejects large payloads. Large imports block the request/response cycle causing timeouts. Memory pressure from parsing large files synchronously.',
          solution: 'Body parser limit increased to 55MB globally. validateRequestSize middleware allows 100MB specifically for lead import path. Asynchronous job queue: import creates job document, background worker (2s interval) processes rows with failure tracking.',
        },
        {
          challenge: 'Real-Time Coordination at Scale',
          whyHard: 'Persistent Socket.IO connections require room management and stale connection cleanup. Broadcasting to wrong users leaks sensitive conversation data. Memory growth from abandoned connections.',
          solution: 'Room-based Socket.IO architecture: users join rooms by conversationId. 5-minute interval job removes disconnected users from tracking. JWT authentication for WebSocket connections. 100MB maxHttpBufferSize for real-time import preview.',
        },
        {
          challenge: 'WhatsApp Cloud API Constraints',
          whyHard: 'Webhook payload delivery requires sub-10-second acknowledgment. Rate limits per phone number and per WABA. 24-hour messaging window for non-template messages. Media URLs expire requiring proxying.',
          solution: 'Webhooks return 200 immediately, process asynchronously. Rate limiting tracked per phone number. Template messages for conversations outside 24-hour window. Media proxying through backend or presigned S3 URLs.',
        },
        {
          challenge: 'Multi-Tenant Data Isolation',
          whyHard: 'Multiple businesses, each with multiple team members, phone numbers, and Facebook Pages. Data must be isolated by business. Admin panel needs cross-business visibility.',
          solution: 'businessId field on all tenant-scoped documents. Query filters always include businessId from JWT. Admin panel uses separate backend (port 4001) with cross-business query capability.',
        },
      ],
    },
    performanceSecurity: {
      performance: [
        'Pagination on conversations, flows, and messages to prevent large result sets',
        'Request deduplication middleware blocks duplicate thunks within 100ms, reuses in-flight requests within 30s',
        'Background job workers (2s interval) process lead and timeline imports asynchronously',
        'Socket.IO room isolation reduces broadcast overhead—messages go only to relevant clients',
        'Stale socket connection cleanup every 5 minutes prevents memory growth',
        'Rate limiter cleanup every 24 hours purges expired Facebook rate limit entries',
      ],
      errorHandling: [
        'Global error handler maps error types to HTTP status: entity.too.large → 413, ValidationError → 400, JWT errors → 401',
        'notFoundHandler returns 404 JSON for unmatched routes',
        'Controllers use try/catch with 500 and console.error for unhandled exceptions',
        'Production mode hides stack traces in error responses',
        'Failed notifications stored for manual retry capability',
      ],
      security: [
        'JWT in HTTP-only cookie prevents XSS token theft',
        'bcrypt password hashing with configurable salt rounds',
        'Helmet middleware sets security headers (CSP, X-Frame-Options)',
        'CORS with explicit origin whitelist (FRONTEND_URI, admin, test-frontend)',
        'Rate limiting: 50/15min auth routes, 10000/15min general API, webhooks excluded',
        'Request size validation: 16MB default, 100MB lead import, 10MB JSON',
        'Google OAuth with state parameter prevents CSRF in OAuth flow',
        'express-validator on auth routes, sanitizeBody/sanitizeQuery globally',
      ],
    },
    visualUI: {
      decisions: [
        {
          aspect: 'Monolith-Per-App Architecture',
          rationale: 'User App and Admin Panel deployed independently for security isolation and role-specific optimization. Single MongoDB enables admin visibility without inter-service communication.',
          details: 'Two Next.js frontends, two Express backends. User App on port 4000, Admin on 4001. Shared whaDB database. Independent deployment cycles.',
        },
        {
          aspect: 'Dark Theme Interface',
          rationale: 'Professional appearance for business users managing conversations throughout the day. Reduces eye strain during extended usage.',
          details: 'Neutral color palette with Tailwind CSS. Headless UI components. Framer Motion for animations. Dark backgrounds with high-contrast text.',
        },
        {
          aspect: 'React Flow for Visual Builder',
          rationale: 'Drag-and-drop interface enables non-technical users to create automation flows without code. Visual representation makes complex logic accessible.',
          details: 'Node types: trigger, message, condition, delay, action. Edges represent flow transitions. Native nodes/edges storage enables lossless round-trip.',
        },
        {
          aspect: 'Sidebar Navigation with Permissions',
          rationale: 'Role-based menu visibility ensures users only see features they can access. Reduces cognitive load and prevents unauthorized action attempts.',
          details: 'Menu items conditionally rendered based on user permissions. Business owners see all, team leads see team features, members see assigned conversations.',
        },
        {
          aspect: 'Real-Time Toast Notifications',
          rationale: 'Immediate feedback for user actions and system events. Socket.IO events surface as toasts for new messages and status updates.',
          details: 'react-hot-toast for transient notifications. Socket.IO events trigger toasts for new_message and message_status_update events.',
        },
      ],
    },
    finalOutcome: {
      achieved: 'Successfully delivered a production-ready multi-channel lead management platform consolidating 5 lead sources into unified conversation management. Visual flow builder enables no-code automation. Real-time Socket.IO and FCM push notifications provide instant updates. Role-based access control at conversation and feature level. 7 background jobs coordinate system health including flow re-enablement, token refresh, and import processing.',
      whoHelped: 'Business owners gained centralized control over multi-channel lead acquisition with fair team assignment algorithms. Team members benefit from clear workload distribution and real-time conversation updates. Marketing teams can create automated response flows without developer intervention.',
      whyMatters: 'Demonstrates ability to architect complex multi-tenant systems with real-time requirements, external API integrations (WhatsApp, Facebook, Firebase), and sophisticated authorization patterns. Shows practical solutions to WhatsApp API constraints, multi-channel ingestion, and large-scale import handling.',
    },
    learnings: {
      technical: [
        'MongoDB native driver outperforms Mongoose for high-volume, schema-light operations like messages and conversations',
        'Socket.IO room-based architecture effectively handles role-filtered real-time event distribution',
        'Background job workers with fixed intervals are simpler than complex queue systems for predictable workloads',
        'WhatsApp Cloud API webhooks require immediate 200 response with asynchronous processing to avoid timeout failures',
        'JWT in HTTP-only cookies provides security against XSS but requires careful CSRF handling',
        'Rate limiting by both user ID and IP address prevents abuse from both authenticated and unauthenticated sources',
      ],
      architectural: [
        'Monolith-per-app architecture balances deployment flexibility with codebase simplicity for small-to-medium scale',
        'Centralized role utilities (roleUtils.ts) prevent visibility logic duplication across controllers',
        'Source-agnostic data models enable unified querying regardless of lead acquisition channel',
        'In-memory state (CSRF, rate limits) simplifies deployment but limits horizontal scaling without Redis',
        'Dual data access pattern (native vs Mongoose) requires clear conventions and documentation',
        'Channel-specific configuration allows different assignment rules per lead source without code changes',
      ],
      improvements: [
        'Implement Redis for shared CSRF tokens, rate limit counters, and Socket.IO adapter for horizontal scaling',
        'Add automated test suite (currently npm test exits with "no test specified")',
        'Mount CSRF protection middleware on state-changing routes (currently only token attach)',
        'Complete Facebook data deletion callback (actual deletion logic is commented out)',
        'Split heavy conversation.controller.ts into domain-specific controllers',
        'Standardize collection naming conventions across database',
      ],
    },
    futureImprovements: {
      improvements: [
        'Implement Redis for shared state enabling horizontal scaling across multiple instances',
        'Add Socket.IO Redis adapter for cross-instance real-time event distribution',
        'Create automated test suite with unit, integration, and end-to-end tests',
        'Enforce CSRF protection middleware on all state-changing routes',
        'Complete Facebook data deletion callback for GDPR compliance',
        'Split conversation.controller.ts into LeadController, MessageController, ImportController',
        'Add health check endpoints for MongoDB, external services, and background job status',
        'Implement structured logging with request correlation IDs for debugging',
        'Add webhook retry mechanism for failed Facebook payload deliveries',
        'Create dashboard analytics for lead conversion rates and team performance metrics',
      ],
    },
  },

  'naba-hussam': {
    slug: 'naba-hussam',
    hero: {
      projectName: 'Clothie E-commerce (Naba Hussam)',
      impactLine: 'A custom e-commerce platform for a Pakistani fashion brand supporting both ready-to-wear and made-to-order products with local payment methods (COD, Bank Transfer), guest checkout with automatic account linking, and comprehensive admin management for orders, products, and settings',
      role: 'Full-Stack Developer',
      techStack: [
        'React 18',
        'Vite',
        'Tailwind CSS',
        'React Router v6',
        'Node.js',
        'Express.js',
        'MongoDB Atlas',
        'Mongoose',
        'AWS S3',
        'JWT Authentication',
        'Docker',
        'Nginx',
      ],
      year: '2024-2025',
      ctas: {
        live: 'https://nabahussam.com',
      },
      heroImage: '/images/p4.jpg',
    },
    summary: {
      overview: 'Clothie (Naba Hussam) is a custom e-commerce platform for a Pakistani fashion brand supporting both ready-to-wear and made-to-order products. This case study covers local payment methods (COD, Bank Transfer), guest checkout with automatic account linking, and comprehensive admin management.',
      sections: [
        {
          title: 'The Challenge',
          content: 'The brand needed to sell through two distinct models: ready-to-wear with immediate fulfillment, and made-to-order with custom sizing and deposit-based payment plans. Local payment preferences (COD, Bank Transfer) were essential for the Pakistani market. Guest checkout with automatic order linking was required for reduced friction.',
        },
        {
          title: 'The Approach',
          content: 'Complete e-commerce platform with distinct checkout flows for RTW and MTO products. COD and Bank Transfer payment methods, dynamic category/subcategory management, guest checkout with automatic order linking when accounts are created, AWS S3 for image storage, and comprehensive admin panel for products, orders, and settings.',
        },
        {
          title: 'Key Deliverables',
          content: 'Dual product types (RTW/MTO) with appropriate workflows, local payment methods, size charts for custom orders, regional shipping (within/outside Karachi), product add-ons support, and GA4-compatible e-commerce analytics.',
        },
      ],
    },
    problem: {
      context: 'A Pakistani fashion brand (Naba Hussam) required a custom e-commerce platform to sell women\'s clothing through two distinct business models: ready-to-wear (RTW) products with immediate fulfillment, and made-to-order (MTO) products with custom sizing and deposit-based payment plans. The platform needed to accommodate local payment preferences—specifically Cash on Delivery and Bank Transfer—while supporting guest checkout for reduced friction and automatic account linking for order history preservation.',
      painPoints: [
        'Need to support both ready-to-wear and custom made-to-order products with different fulfillment workflows',
        'Local payment methods (COD, Bank Transfer) required for Pakistani market where credit cards are not widely adopted',
        'Managing dynamic product categories and subcategories for different clothing types',
        'Supporting guest checkout while allowing account creation for order history preservation',
        'Providing size guidance for custom orders through uploadable size charts',
        'Handling regional shipping options with different delivery charges (within/outside Karachi)',
        'No mechanism for guest-to-authenticated user order linking in existing solutions',
      ],
      whyInsufficient: 'Generic e-commerce platforms failed to address specific requirements: no native support for made-to-order workflows with deposit payments and modification deadlines, international payment gateways created friction for local customers, limited customization for regional shipping zones, and no built-in support for product add-ons like additional clothing pieces.',
    },
    goalsMetrics: {
      objectives: [
        'Build a complete e-commerce platform supporting both RTW and MTO products with distinct checkout flows',
        'Implement COD and Bank Transfer payment methods tailored for local market preferences',
        'Create admin panel for comprehensive product, order, and settings management',
        'Support guest checkout with automatic order linking when accounts are created',
        'Enable dynamic category/subcategory management with MTO/RTW type assignment',
        'Integrate AWS S3 for reliable image storage with aspect ratio validation',
        'Implement GA4-compatible event tracking for e-commerce analytics',
        'Deploy via Docker with Nginx reverse proxy for production security',
      ],
      successMetrics: [
        'Successful order placement through both COD and Bank Transfer payment methods',
        'Admin ability to manage entire product catalog without developer intervention',
        'Guest users can complete checkout without registration',
        'Products correctly categorized as MTO or RTW with appropriate checkout enforcement',
        'Images reliably stored and served from S3 with consistent 2:3 aspect ratio',
        'Analytics events firing correctly for view_item, add_to_cart, and purchase tracking',
        'COD orders trackable with delivery service assignment and attempt logging',
        'MTO orders include deposit/balance tracking with modification deadlines',
      ],
    },
    userFlow: {
      description: 'The system handles the complete e-commerce customer journey: browsing products by category, viewing product details with size options and add-ons, managing cart with size-specific quantities, proceeding through checkout with payment method selection based on product type, and order confirmation with analytics tracking.',
      nodes: [
        { id: '1', label: 'Browse Products', type: 'start' },
        { id: '2', label: 'View Product Details', type: 'action' },
        { id: '3', label: 'Add to Cart', type: 'action' },
        { id: '4', label: 'Review Cart', type: 'action' },
        { id: '5', label: 'Proceed to Checkout', type: 'action' },
        { id: '6', label: 'MTO Items?', type: 'decision' },
        { id: '7', label: 'Select Payment Method', type: 'action' },
        { id: '8', label: 'Force Bank Transfer', type: 'action' },
        { id: '9', label: 'Place Order', type: 'action' },
        { id: '10', label: 'Order Confirmation', type: 'end' },
      ],
      connections: [
        { from: '1', to: '2', label: 'Click product' },
        { from: '2', to: '3', label: 'Select size + add-ons' },
        { from: '3', to: '4', label: 'View cart drawer' },
        { from: '4', to: '5', label: 'Click checkout' },
        { from: '5', to: '6', label: 'Check cart items' },
        { from: '6', to: '7', label: 'RTW only' },
        { from: '6', to: '8', label: 'Has MTO items' },
        { from: '7', to: '9', label: 'COD or Bank Transfer' },
        { from: '8', to: '9', label: 'Bank Transfer required' },
        { from: '9', to: '10', label: 'Order saved' },
      ],
    },
    systemArchitecture: {
      description: 'Modular monolith architecture with two separate React frontend applications (Customer SPA + Admin Dashboard) connected to a unified Express backend API. The backend handles authentication, product management, orders, and cart operations while integrating with MongoDB Atlas for data persistence and AWS S3 for image storage.',
      layers: [
        {
          name: 'Frontend Layer',
          components: [
            'Customer Frontend (React 18 + Vite, Port 7001)',
            'Admin Dashboard (React 18 + Vite, Port 7002)',
            'React Router v6 for client-side routing',
            'ShopContext for global state management',
            'Tailwind CSS for styling',
            'Axios for HTTP requests',
            'LocalStorage for guest cart persistence',
          ],
          color: '#60A5FA',
        },
        {
          name: 'Backend Layer',
          components: [
            'Express.js 4.19.2 REST API (Port 7000)',
            'JWT-based authentication (httpOnly)',
            'Multer for file upload handling',
            'bcrypt password hashing (10 rounds)',
            'CORS with domain whitelist',
            'Separate auth and adminAuth middleware',
          ],
          color: '#34D399',
        },
        {
          name: 'Data Layer',
          components: [
            'MongoDB Atlas (Cloud)',
            'Mongoose 8.5.3 ODM',
            '4 Collections: users, products, orders, settings',
            'Nested cart storage in user document',
            'COD details as order subdocument',
          ],
          color: '#F59E0B',
        },
        {
          name: 'External Integrations',
          components: [
            'AWS S3 (eu-north-1) for images',
            'Google Analytics 4 / GTM',
            'WhatsApp Click-to-Chat',
            'Stripe (integrated, inactive)',
            'Razorpay (integrated, inactive)',
          ],
          color: '#A78BFA',
        },
      ],
    },
    dataFlow: {
      description: 'Data flows through the system starting from user interactions on the frontend, through authenticated API requests to the Express backend, which orchestrates MongoDB operations for data persistence and S3 operations for image storage. Responses are returned as JSON with consistent success/error patterns.',
      steps: [
        {
          id: '1',
          label: 'User Interaction',
          description: 'User clicks, form submissions, and navigation events captured by React components',
        },
        {
          id: '2',
          label: 'Context Update',
          description: 'ShopContext manages global state (products, cart, user session) with automatic sync',
        },
        {
          id: '3',
          label: 'API Request',
          description: 'Axios sends HTTP request with JWT token in headers to Express backend',
        },
        {
          id: '4',
          label: 'Middleware Chain',
          description: 'Request passes through CORS, auth/adminAuth, and Multer middleware as needed',
        },
        {
          id: '5',
          label: 'Controller Logic',
          description: 'Route-specific controller handles business logic with validation',
        },
        {
          id: '6',
          label: 'Database Operation',
          description: 'Mongoose queries MongoDB for CRUD operations on documents',
        },
        {
          id: '7',
          label: 'S3 Operation',
          description: 'If file upload involved, images sent to S3 via PutObjectCommand',
        },
        {
          id: '8',
          label: 'Response',
          description: 'JSON response with success boolean and data/message returned to client',
        },
        {
          id: '9',
          label: 'UI Update',
          description: 'Frontend state updated, toast notification shown, analytics event fired',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: 'Dual Product Type System (MTO + RTW)',
          whatItDoes: 'Supports both immediate-fulfillment ready-to-wear products and custom made-to-order products with different pricing, sizing, and payment structures',
          whyItMatters: 'Enables the brand to serve both quick-purchase customers and those wanting custom-tailored garments from a single platform',
          howImplemented: 'Products flagged with isMakeToOrder and productType fields. MTO products have additional mtoAttributes for design categories, custom sizes, and production time. Checkout enforces Bank Transfer for MTO items.',
        },
        {
          name: 'Shopping Cart with Size-Specific Quantities',
          whatItDoes: 'Tracks cart items with granular size/quantity tracking using nested object structure {itemId: {size: qty}} plus separate add-ons tracking',
          whyItMatters: 'Allows customers to order multiple sizes of the same product (e.g., M:2, L:1) and optional add-ons like dupatta, all in one checkout',
          howImplemented: 'Cart stored as nested object enabling O(1) lookups. Authenticated users sync to user.cartData in MongoDB. Guests use localStorage. Carts merge additively on login.',
        },
        {
          name: 'Guest Checkout with Account Linking',
          whatItDoes: 'Allows order placement without authentication using email, automatically links orders when accounts are created with the same email',
          whyItMatters: 'Reduces checkout friction for new customers while preserving order history capability when they decide to create accounts',
          howImplemented: 'Guest orders stored with guestEmail and isGuestOrder flag. On registration, linkGuestOrders() queries by email and bulk-updates orders to new userId.',
        },
        {
          name: 'COD Management System',
          whatItDoes: 'Full lifecycle management for Cash on Delivery orders including delivery service assignment, attempt tracking, and collection verification',
          whyItMatters: 'COD is the dominant payment method in Pakistan. System provides admin visibility into delivery status and payment collection',
          howImplemented: 'Order model includes codDetails subdocument with deliveryService, trackingId, deliveryAttempts array, and collection status fields.',
        },
        {
          name: 'Dynamic Category Hierarchy',
          whatItDoes: 'Admin-managed category structure supporting subcategories and product type (MTO/RTW) assignment for filtering and navigation',
          whyItMatters: 'Enables the brand to reorganize product catalog without developer intervention as collections change seasonally',
          howImplemented: 'productCategoryTree stored in settings as array of objects with name, type, and subs array. Frontend reads from centralized settings.',
        },
        {
          name: 'S3 Image Management',
          whatItDoes: 'Handles product image uploads with client-side 2:3 aspect ratio validation and public URL generation',
          whyItMatters: 'Ensures consistent product grid display and offloads image serving to S3 CDN infrastructure',
          howImplemented: 'Frontend validates ratio using Image object. Multer uses memory storage. S3 client uploads with unique keys. Public URLs constructed from bucket/region/key pattern.',
        },
        {
          name: 'Product Add-ons System',
          whatItDoes: 'Allows products to have optional purchasable additions (e.g., dupatta, trouser) with per-item pricing tracked separately in cart',
          whyItMatters: 'Traditional Pakistani clothing often includes optional pieces. System enables upselling while maintaining accurate pricing',
          howImplemented: 'Products have addOns array with name/price objects. Frontend renders checkboxes, tracks in cartAddOns state. Order totals include add-on prices.',
        },
        {
          name: 'E-commerce Analytics Tracking',
          whatItDoes: 'Fires GA4-compatible events for view_item, add_to_cart, remove_from_cart, begin_checkout, and purchase with proper e-commerce schema',
          whyItMatters: 'Enables data-driven decision making through Google Analytics and Tag Manager integration',
          howImplemented: 'Events pushed to dataLayer for GTM and directly to gtag. Includes currency (PKR), value, and items array with item_id, item_name, price, quantity.',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: 'Mixed Product Types with Different Payment Rules',
          whyHard: 'MTO products require Bank Transfer deposits, while RTW allows COD. Cart can contain mixed items, but payment method applies to entire order. Cannot split orders by product type due to business constraints.',
          solution: 'Payment validation at both UI (UX) and API (security) layers. Frontend checks for MTO items and disables COD option. Backend rejects COD if any item is MTO. Mixed cart warning informs users that Bank Transfer will apply to entire order.',
        },
        {
          challenge: 'Cart State Synchronization Across Guest and Authenticated Users',
          whyHard: 'User adds items as guest (localStorage), then logs in with existing cart in database. Must merge without losing guest selections, handling size conflicts (different quantities for same product/size).',
          solution: 'Additive merge logic: dbCart + localCart. Size M:2 (guest) + M:1 (db) = M:3 result. Merged cart synced back to backend, localStorage cleared. Prevents data loss from any browsing session.',
        },
        {
          challenge: 'Guest Order Linking Without Email Verification',
          whyHard: 'Link guest orders to new accounts using email, but no email verification exists. Risk: User A places guest order, User B registers with same email first, gains access to orders.',
          solution: 'First-come-first-served email registration. Risk deemed acceptable for MVP. Email verification prioritized for future release. Security trade-off documented explicitly.',
        },
        {
          challenge: 'Image Aspect Ratio Enforcement',
          whyHard: 'Product grid displays images in 2:3 aspect ratio cards. Inconsistent ratios break layout. Backend cannot validate dimensions without decoding buffer. Server-side processing adds latency.',
          solution: 'Client-side validation before upload using Image object. Validates ratio before sending to server (fail-fast). No server-side enforcement (API can be bypassed). Future enhancement: Sharp.js for server resize/crop.',
        },
        {
          challenge: 'Dynamic Category Tree Without Category IDs',
          whyHard: 'Categories referenced by name strings across product documents, navigation, and filters. Category rename requires updating all products. No referential integrity.',
          solution: 'Single source of truth in settings document. String-based references acceptable for slowly-changing dimensions with low cardinality. Category changes are rare in practice. Client-side validation only.',
        },
        {
          challenge: 'COD Delivery Tracking Without Third-Party Integration',
          whyHard: 'Need delivery tracking for COD orders without API integrations for local delivery services (TCS, Leopards, local riders). No standardized API exists.',
          solution: 'Flexible codDetails subdocument with free-text delivery service field, manual tracking ID entry, and delivery attempts array. Admin workflow: assign service, enter tracking, log attempts, mark collected.',
        },
      ],
    },
    performanceSecurity: {
      performance: [
        'Products fetched once on app load and cached in React Context, eliminating repeated API calls during navigation',
        'Search input debounced at 300ms to reduce API calls from ~10/second to ~3/second during typing',
        'Cart persisted in localStorage for guests reducing server roundtrips to zero until checkout',
        'S3 images served directly without server proxying, leveraging S3 CDN infrastructure',
        'Promise.all for parallel image uploads (4 images in ~2s vs ~8s sequential)',
        'Mongoose .select() for selective field projection retrieving only needed fields',
      ],
      errorHandling: [
        'Global Multer error middleware catches file size, file count, and unexpected field errors',
        'Consistent JSON response pattern with success boolean across all endpoints',
        'Try-catch blocks in all controller functions with error.message in response',
        'Frontend toast notifications provide immediate error feedback to users',
        'S3 upload failures caught and re-thrown with context for debugging',
        'MongoDB ObjectId format validation on product pages prevents invalid queries',
        'Empty cart validation prevents order placement attempts with no items',
      ],
      security: [
        'JWT token-based authentication for protected routes with token in headers',
        'bcrypt password hashing with 10 salt rounds meeting OWASP recommendations',
        'CORS configured with explicit origin whitelist (nabahussam.com, admin.nabahussam.com)',
        'Backend binds to localhost only (127.0.0.1:7000), accessible only via Nginx reverse proxy',
        'Separate adminAuth middleware validates isAdmin flag in JWT for admin routes',
        'File upload restrictions: 20MB size limit and image mimetype validation via Multer',
        'Input validation using validator.js library for email format and password length',
      ],
    },
    visualUI: {
      decisions: [
        {
          aspect: 'Separate Frontend Applications',
          rationale: 'Customer and admin UIs deployed independently for security isolation and independent scaling. Admin dashboard never exposed to customer traffic.',
          details: 'Two React SPAs on different subdomains (nabahussam.com, admin.nabahussam.com). Each bundles only code needed for that role. Nginx routes requests based on subdomain.',
        },
        {
          aspect: 'Card-Based Product Grid',
          rationale: 'Consistent 2:3 aspect ratio cards create visual harmony. Hover effects provide interaction feedback without overwhelming the browsing experience.',
          details: 'ProductItem components with image zoom on hover. Loading skeleton during image fetch. Price formatted with PKR currency. Bestseller badge for featured items.',
        },
        {
          aspect: 'Slide-In Cart Drawer',
          rationale: 'Keeps users in context without full page navigation. Quick cart access improves purchase flow by showing immediate feedback on add-to-cart actions.',
          details: 'CartDrawer component slides from right. Shows items with size/quantity breakdown. Add-ons listed separately. Real-time total calculation. Checkout button prominently placed.',
        },
        {
          aspect: 'Modal-Based Size Charts',
          rationale: 'Size guidance critical for custom MTO orders. Modal keeps users on product page while providing detailed measurements.',
          details: 'Separate size charts for MTO and RTW products uploaded by admin to S3. Fetched from settings.sizeCharts. Full-screen modal with close button.',
        },
        {
          aspect: 'Status-Colored Order Badges',
          rationale: 'Visual distinction between order states enables quick scanning in admin dashboard. Color coding follows established UX patterns.',
          details: 'Pending = yellow, Processing = blue, Shipped = purple, Delivered = green, Cancelled = red. Badges used consistently across order list and detail views.',
        },
      ],
    },
    finalOutcome: {
      achieved: 'Successfully deployed complete e-commerce platform with product catalog, cart, and checkout supporting both COD and Bank Transfer payments. Admin dashboard enables full product and order management. Guest checkout with automatic account linking implemented. Dynamic category management with MTO/RTW support operational. S3-based image storage with reliable delivery. GA4-compatible analytics event tracking implemented. Production deployment via Docker with Nginx reverse proxy.',
      whoHelped: 'Brand owner gained ability to manage entire product catalog, process orders, and configure settings without developer intervention. Customers can browse products, use guest checkout with reduced friction, and have orders automatically linked when creating accounts. Admin staff can track COD deliveries, verify bank transfers, and manage MTO orders with deposit/balance tracking.',
      whyMatters: 'Demonstrates ability to build custom e-commerce solutions tailored to specific market requirements (Pakistani payment preferences, dual product types, regional shipping). Shows full-stack capability from React frontend to Express backend to cloud deployment. Addresses real business needs rather than generic solutions.',
    },
    learnings: {
      technical: [
        'S3 direct URLs with proper bucket policies eliminate need for signed URLs for public product images',
        'Multer memory storage simplifies deployment but requires memory awareness for concurrent uploads',
        'DataLayer-based analytics tracking provides flexibility for different analytics tools (GA4, GTM)',
        'Nested object structure for cart enables O(1) lookups but requires careful merge logic',
        'Client-side validation improves UX but must be duplicated server-side for security',
        'JWT tokens without expiration create security risk - future enhancement needed',
      ],
      architectural: [
        'Modular monolith with separate frontend apps balances deployment flexibility with codebase simplicity',
        'Centralized settings document simplifies cross-feature configuration (bank details, shipping, categories)',
        'Guest checkout with email linking provides flexibility without separate guest user documents',
        'Product type flags (MTO/RTW) enable differentiated checkout logic without separate product models',
        'COD details as subdocument keeps order model cohesive while supporting complex tracking',
        'Docker with Nginx reverse proxy provides secure production deployment pattern with localhost binding',
      ],
      improvements: [
        'Add JWT token expiration with refresh token mechanism for improved security',
        'Implement rate limiting on API endpoints to prevent brute force attacks',
        'Add email verification on registration to secure guest order linking',
        'Implement server-side image processing with Sharp.js for guaranteed aspect ratios',
        'Add database indexing strategy for better query performance at scale',
        'Consider Redis caching layer for frequently accessed settings and products',
      ],
    },
    futureImprovements: {
      improvements: [
        'Enable email notifications for order confirmations and status updates',
        'Implement password reset flow with email-based reset tokens',
        'Add inventory management with stock tracking and out-of-stock indicators',
        'Enable Stripe/Razorpay for online payments (already integrated, currently disabled)',
        'Implement rate limiting for API protection (express-rate-limit)',
        'Add JWT token expiration and refresh mechanism (currently no expiration)',
        'Implement product reviews and ratings (schema exists, code commented out)',
        'Add admin analytics dashboard with sales reports and metrics',
        'Implement bulk product operations (CSV import/export)',
        'Add CloudFront CDN for S3 images to improve global load times',
        'Implement server-side pagination for large product catalogs',
        'Add wishlist functionality for customers',
      ],
    },
  },
};

/**
 * Helper function to get case study by slug
 */
export function getCaseStudyBySlug(slug: string): CaseStudyData | undefined {
  return caseStudies[slug];
}

/**
 * Get all case study slugs (useful for static generation)
 */
export function getAllCaseStudySlugs(): string[] {
  return Object.keys(caseStudies);
}

/**
 * Get next case study for navigation
 */
export function getNextCaseStudy(currentSlug: string): CaseStudyData | undefined {
  const slugs = getAllCaseStudySlugs();
  const currentIndex = slugs.indexOf(currentSlug);
  const nextIndex = (currentIndex + 1) % slugs.length;
  return caseStudies[slugs[nextIndex]];
}
