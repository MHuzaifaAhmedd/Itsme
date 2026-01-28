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
      impactLine: '[AWAITING: Impact statement]',
      role: '[AWAITING: Role]',
      techStack: ['[AWAITING: Tech stack]'],
      year: '[AWAITING: Year]',
      ctas: {},
      heroImage: '/images/p1.jpg',
    },
    problem: {
      context: '[AWAITING: Problem context]',
      painPoints: ['[AWAITING: Pain points]'],
      whyInsufficient: '[AWAITING: Why existing solutions failed]',
    },
    goalsMetrics: {
      objectives: ['[AWAITING: Objectives]'],
      successMetrics: ['[AWAITING: Success metrics]'],
    },
    userFlow: {
      description: '[AWAITING: User flow description]',
      nodes: [
        { id: '1', label: '[AWAITING]', type: 'start' },
        { id: '2', label: '[AWAITING]', type: 'end' },
      ],
      connections: [{ from: '1', to: '2' }],
    },
    systemArchitecture: {
      description: '[AWAITING: Architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING]'],
          color: '#3b82f6',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: Data flow]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature]',
          whatItDoes: '[AWAITING]',
          whyItMatters: '[AWAITING]',
          howImplemented: '[AWAITING]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Challenge]',
          whyHard: '[AWAITING]',
          solution: '[AWAITING]',
        },
      ],
    },
    performanceSecurity: {
      performance: ['[AWAITING]'],
      errorHandling: ['[AWAITING]'],
      security: ['[AWAITING]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING]',
          rationale: '[AWAITING]',
          details: '[AWAITING]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING]',
      whoHelped: '[AWAITING]',
      whyMatters: '[AWAITING]',
    },
    learnings: {
      technical: ['[AWAITING]'],
      architectural: ['[AWAITING]'],
      improvements: ['[AWAITING]'],
    },
    futureImprovements: {
      improvements: ['[AWAITING]'],
    },
  },

  'whatsapp-funnel-lead-management-system': {
    slug: 'whatsapp-funnel-lead-management-system',
    hero: {
      projectName: 'WhatsApp Funnel (Lead Management System)',
      impactLine: '[AWAITING: Impact statement]',
      role: '[AWAITING: Role]',
      techStack: ['[AWAITING: Tech stack]'],
      year: '[AWAITING: Year]',
      ctas: {},
      heroImage: '/images/p3.jpg',
    },
    problem: {
      context: '[AWAITING: Problem context]',
      painPoints: ['[AWAITING: Pain points]'],
      whyInsufficient: '[AWAITING: Why existing solutions failed]',
    },
    goalsMetrics: {
      objectives: ['[AWAITING: Objectives]'],
      successMetrics: ['[AWAITING: Success metrics]'],
    },
    userFlow: {
      description: '[AWAITING: User flow description]',
      nodes: [
        { id: '1', label: '[AWAITING]', type: 'start' },
        { id: '2', label: '[AWAITING]', type: 'end' },
      ],
      connections: [{ from: '1', to: '2' }],
    },
    systemArchitecture: {
      description: '[AWAITING: Architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING]'],
          color: '#3b82f6',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: Data flow]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature]',
          whatItDoes: '[AWAITING]',
          whyItMatters: '[AWAITING]',
          howImplemented: '[AWAITING]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Challenge]',
          whyHard: '[AWAITING]',
          solution: '[AWAITING]',
        },
      ],
    },
    performanceSecurity: {
      performance: ['[AWAITING]'],
      errorHandling: ['[AWAITING]'],
      security: ['[AWAITING]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING]',
          rationale: '[AWAITING]',
          details: '[AWAITING]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING]',
      whoHelped: '[AWAITING]',
      whyMatters: '[AWAITING]',
    },
    learnings: {
      technical: ['[AWAITING]'],
      architectural: ['[AWAITING]'],
      improvements: ['[AWAITING]'],
    },
    futureImprovements: {
      improvements: ['[AWAITING]'],
    },
  },

  'naba-hussam': {
    slug: 'naba-hussam',
    hero: {
      projectName: 'Naba Hussam',
      impactLine: '[AWAITING: Impact statement]',
      role: '[AWAITING: Role]',
      techStack: ['[AWAITING: Tech stack]'],
      year: '[AWAITING: Year]',
      ctas: {},
      heroImage: '/images/p4.jpg',
    },
    problem: {
      context: '[AWAITING: Problem context]',
      painPoints: ['[AWAITING: Pain points]'],
      whyInsufficient: '[AWAITING: Why existing solutions failed]',
    },
    goalsMetrics: {
      objectives: ['[AWAITING: Objectives]'],
      successMetrics: ['[AWAITING: Success metrics]'],
    },
    userFlow: {
      description: '[AWAITING: User flow description]',
      nodes: [
        { id: '1', label: '[AWAITING]', type: 'start' },
        { id: '2', label: '[AWAITING]', type: 'end' },
      ],
      connections: [{ from: '1', to: '2' }],
    },
    systemArchitecture: {
      description: '[AWAITING: Architecture overview]',
      layers: [
        {
          name: 'Frontend',
          components: ['[AWAITING]'],
          color: '#3b82f6',
        },
      ],
    },
    dataFlow: {
      description: '[AWAITING: Data flow]',
      steps: [
        {
          id: '1',
          label: 'Input',
          description: '[AWAITING]',
        },
      ],
    },
    coreFeatures: {
      features: [
        {
          name: '[AWAITING: Feature]',
          whatItDoes: '[AWAITING]',
          whyItMatters: '[AWAITING]',
          howImplemented: '[AWAITING]',
        },
      ],
    },
    technicalChallenges: {
      challenges: [
        {
          challenge: '[AWAITING: Challenge]',
          whyHard: '[AWAITING]',
          solution: '[AWAITING]',
        },
      ],
    },
    performanceSecurity: {
      performance: ['[AWAITING]'],
      errorHandling: ['[AWAITING]'],
      security: ['[AWAITING]'],
    },
    visualUI: {
      decisions: [
        {
          aspect: '[AWAITING]',
          rationale: '[AWAITING]',
          details: '[AWAITING]',
        },
      ],
    },
    finalOutcome: {
      achieved: '[AWAITING]',
      whoHelped: '[AWAITING]',
      whyMatters: '[AWAITING]',
    },
    learnings: {
      technical: ['[AWAITING]'],
      architectural: ['[AWAITING]'],
      improvements: ['[AWAITING]'],
    },
    futureImprovements: {
      improvements: ['[AWAITING]'],
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
