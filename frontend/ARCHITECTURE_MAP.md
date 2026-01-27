# Case Study System - Architecture Map

Visual guide to understand how everything connects.

---

## 🗺️ System Flow

```
User Navigation
     ↓
Home Page (/src/app/page.tsx)
     ↓
Projects Section
     ↓
Click "View Case Study"
     ↓
Dynamic Route: /case-study/[slug]
     ↓
CaseStudy Page (/src/app/case-study/[slug]/page.tsx)
     ↓
Fetch Data from caseStudies.ts
     ↓
Render CaseStudyTemplate.tsx
     ↓
14 Section Components Rendered
     ↓
Lenis Smooth Scroll + GSAP Animations
     ↓
User Experience ✨
```

---

## 📁 File Dependency Map

```
case-study/
│
├── types.ts
│   └── Defines TypeScript interfaces for all data structures
│
├── data/
│   └── caseStudies.ts
│       ├── Imports types from types.ts
│       ├── Stores all project data
│       └── Exports helper functions (getCaseStudyBySlug, getNextCaseStudy)
│
├── [slug]/
│   └── page.tsx
│       ├── Imports getCaseStudyBySlug from data/caseStudies.ts
│       ├── Fetches project data by slug
│       └── Renders CaseStudyTemplate
│
└── components/
    │
    ├── animations/
    │   ├── ScrollReveal.tsx
    │   │   └── Used by: All section components
    │   └── LineReveal.tsx
    │       └── Used by: ProblemStatement.tsx
    │
    ├── CaseStudyTemplate.tsx
    │   ├── Imports all 14 section components
    │   ├── Initializes Lenis smooth scroll
    │   ├── Sets up GSAP ScrollTrigger
    │   └── Orchestrates entire page layout
    │
    └── sections/
        ├── index.ts (exports all sections)
        ├── CaseStudyHero.tsx
        ├── ProblemStatement.tsx
        ├── GoalsMetrics.tsx
        ├── UserFlowDiagram.tsx
        ├── SystemArchitecture.tsx
        ├── DataFlow.tsx
        ├── CoreFeatures.tsx
        ├── TechnicalChallenges.tsx
        ├── PerformanceSecurity.tsx
        ├── VisualUIDecisions.tsx
        ├── FinalOutcome.tsx
        ├── Learnings.tsx
        ├── FutureImprovements.tsx
        └── NextProjectNav.tsx
```

---

## 🎯 Data Flow

### 1. Data Definition
```typescript
// types.ts
interface CaseStudyData {
  hero: CaseStudyHeroData;
  problem: ProblemStatementData;
  // ... all 14 sections
}
```

### 2. Data Storage
```typescript
// data/caseStudies.ts
export const caseStudies: Record<string, CaseStudyData> = {
  'employee-management-system': {
    hero: { /* data */ },
    problem: { /* data */ },
    // ... all sections
  },
}
```

### 3. Data Retrieval
```typescript
// [slug]/page.tsx
const project = getCaseStudyBySlug(slug);
```

### 4. Data Rendering
```typescript
// CaseStudyTemplate.tsx
<CaseStudyHero data={project.hero} />
<ProblemStatement data={project.problem} />
// ... all 14 sections
```

---

## 🎨 Animation Architecture

### Layer 1: Global Smooth Scroll
```
CaseStudyTemplate.tsx
  └── Lenis Instance
      └── Synced with GSAP ticker
          └── ScrollTrigger.update() on scroll
```

### Layer 2: Section-Level Animations
```
Each Section Component
  └── useEffect hook
      └── GSAP context
          └── ScrollTrigger.create()
              └── Animate on scroll into view
```

### Layer 3: Reusable Animation Utilities
```
ScrollReveal.tsx
  └── Wraps any content
      └── Fades in + translates on scroll
          └── Respects prefers-reduced-motion

LineReveal.tsx
  └── Splits text into lines
      └── Reveals line-by-line
          └── Premium text reveal effect
```

---

## 🔄 Component Communication

### Parent → Child (Props)
```
CaseStudyTemplate
  ↓ (passes data)
CaseStudyHero
  ↓ (renders)
Hero UI
```

### Child → Animation System
```
Section Component
  ↓ (creates trigger)
ScrollTrigger
  ↓ (animates)
GSAP Timeline
  ↓ (updates)
DOM Elements
```

### Smooth Scroll Integration
```
User Scrolls
  ↓
Lenis captures scroll
  ↓
Updates ScrollTrigger
  ↓
GSAP animates elements
  ↓
Smooth 60fps experience
```

---

## 🛠️ Technology Stack Map

```
Frontend Framework
  ├── Next.js 16 (App Router)
  │   ├── Dynamic routing: [slug]
  │   ├── Server Components
  │   └── Image optimization
  │
  ├── React 19
  │   ├── Hooks: useEffect, useRef, useState
  │   ├── Client Components ("use client")
  │   └── Component composition
  │
  └── TypeScript 5
      ├── Strict type checking
      ├── Interface definitions
      └── Type safety across data flow

Styling
  └── Tailwind CSS 4
      ├── Utility classes
      ├── Responsive breakpoints
      └── Custom theme integration

Animations
  ├── GSAP 3.14
  │   ├── Timeline animations
  │   ├── Easing functions
  │   └── Performance optimization
  │
  ├── ScrollTrigger
  │   ├── Scroll-based animations
  │   ├── Progressive reveals
  │   └── Pin/scrub effects
  │
  └── Lenis 1.3
      ├── Smooth scroll
      ├── Lerp interpolation
      └── GSAP ticker integration

Images
  └── Next.js Image
      ├── Automatic optimization
      ├── Lazy loading
      └── Responsive srcsets
```

---

## 📊 Performance Architecture

### Code Splitting
```
Main Bundle
  ├── CaseStudyTemplate
  │   └── Loaded when case study route accessed
  │
  └── Section Components
      └── Loaded with template (small bundle)

Animations
  └── GSAP + Lenis
      └── Already loaded globally
```

### Rendering Strategy
```
Server-Side
  └── Generate static HTML structure

Client-Side
  └── Hydrate interactive elements
      └── Initialize animations
          └── Attach scroll listeners
```

### Animation Performance
```
GSAP Animations
  ├── Hardware-accelerated transforms
  ├── RequestAnimationFrame based
  ├── 60fps target
  └── Respects device capabilities

Lenis Smooth Scroll
  ├── Lerp-based smoothing
  ├── RAF-driven updates
  └── Lightweight (~2KB gzipped)
```

---

## 🔐 Type Safety Flow

```
1. Define Types (types.ts)
     ↓
2. Apply Types to Data (caseStudies.ts)
     ↓
3. TypeScript Validates Data
     ↓
4. Components Receive Typed Props
     ↓
5. Autocomplete in IDE
     ↓
6. Compile-Time Error Checking
     ↓
7. Zero Runtime Type Errors
```

---

## 🎯 User Journey Map

```
Landing on Home Page
  ↓
Scroll to Projects Section
  ↓
See Project Cards (stacked animation)
  ↓
Click "View Case Study"
  ↓
Typewriter intro animation (project name)
  ↓
Hero section fades in (parallax bg)
  ↓
Scroll down
  ↓
Each section reveals progressively
  ├── Problem statement (line-by-line)
  ├── Goals & metrics (stagger)
  ├── Diagrams (animated)
  ├── Features (hover reveal)
  ├── Challenges (accordion)
  └── Outcome (metric cards)
  ↓
Reach bottom
  ↓
Next Project Nav (3D tilt on hover)
  ↓
Click to continue journey
  ↓
Repeat for next case study
```

---

## 🔄 State Management

### Global State
```
None needed! 
  └── Each case study is self-contained
      └── Data flows one-way: Data → Components → UI
```

### Local State
```
Section Components
  └── useState for UI interactions
      ├── Hover states (CoreFeatures)
      ├── Accordion states (TechnicalChallenges)
      └── Image loading states
```

### Animation State
```
GSAP Context
  └── useEffect manages lifecycle
      ├── Create animations on mount
      ├── Cleanup on unmount
      └── Isolated per component
```

---

## 📱 Responsive Strategy

```
Mobile First Approach
  ↓
Base Styles (Mobile)
  ├── Single column layouts
  ├── Larger touch targets
  └── Stacked sections
  ↓
Tablet (md: 768px)
  ├── 2-column grids where appropriate
  ├── Side-by-side content
  └── Optimized spacing
  ↓
Desktop (lg: 1024px)
  ├── Multi-column layouts
  ├── Full diagrams
  └── Enhanced animations
```

---

## 🧩 Modularity Map

### Highly Reusable
- ✅ ScrollReveal.tsx - Used by all sections
- ✅ Animation utilities - Shared timing/easing
- ✅ Type definitions - Single source of truth

### Section Specific
- 🔷 Each section component is independent
- 🔷 Can be reordered without breaking
- 🔷 Can be customized individually

### Easy to Extend
- ➕ Add new section: Create component + type
- ➕ Add new project: Copy data structure
- ➕ Add new animation: Extend utilities

---

## 🎓 Learning Path

### For Understanding the System
```
1. Read QUICK_START_GUIDE.md
     ↓
2. Browse DATA_EXAMPLES.md
     ↓
3. Open types.ts (see structure)
     ↓
4. Open caseStudies.ts (see data)
     ↓
5. View one section component (see implementation)
     ↓
6. Check CaseStudyTemplate.tsx (see orchestration)
     ↓
7. Test in browser (see result)
```

### For Customizing
```
1. Understand data structure (types.ts)
     ↓
2. Modify section component directly
     ↓
3. Update types if adding fields
     ↓
4. Test with placeholder data
     ↓
5. Populate with real data
```

---

## ✅ Quality Gates

```
TypeScript Compilation
  ├── All types valid
  ├── No 'any' types
  └── Strict mode enabled
  ↓
Runtime Checks
  ├── Animations smooth (60fps)
  ├── Images load correctly
  └── Links functional
  ↓
Responsive Testing
  ├── Mobile (< 768px)
  ├── Tablet (768px - 1024px)
  └── Desktop (> 1024px)
  ↓
Accessibility
  ├── Reduced motion respected
  ├── Semantic HTML
  └── Keyboard navigation
  ↓
Production Ready ✅
```

---

This architecture map shows how every piece connects. The system is modular, maintainable, and scalable—ready for your real project data! 🚀
