# Interactive Case Study Diagrams

This directory contains the implementation of interactive, draggable, zoomable diagrams for the EMS Case Study using React Flow.

## Components

### Core Components

- **`CaseStudyDiagram.tsx`** - Main React Flow diagram renderer with custom styling
- **`CustomNode.tsx`** - Custom node component with rich metadata display
- **`DiagramLoader.tsx`** - Loads diagram data from JSON and renders diagram
- **`DiagramWithExplanation.tsx`** - Combines diagram with engineering explanations
- **`layoutUtils.ts`** - Automatic layout using Dagre algorithm
- **`explanations.ts`** - Engineering explanations for each diagram
- **`types.ts`** - TypeScript type definitions

### Section Components

- **`SystemArchitectureWithDiagram.tsx`** - System architecture with interactive diagram
- **`AuthenticationFlow.tsx`** - Multi-layer security architecture
- **`AttendanceLifecycle.tsx`** - Synchronous and asynchronous processing paths
- **`TaskLifecycle.tsx`** - Multi-actor workflow visualization
- **`PerformanceCalculation.tsx`** - Four-metric scoring algorithm

## Features

### Interactivity

- **Drag nodes** - Reposition nodes for better viewing
- **Zoom/Pan** - Navigate large diagrams easily
- **Minimap** - Bird's eye view with color-coded node groups
- **Hover effects** - Smooth scale and brightness transitions
- **Controls** - Zoom in/out, fit view, fullscreen

### Visual Design

- **Color-coded groups** - Frontend (blue), Backend (green), Data (orange), External (purple)
- **Node metadata** - Display tech stack, ports, line counts, hit rates
- **Edge labels** - Show data flow descriptions
- **Dark theme** - Matches portfolio design
- **Smooth animations** - Fade + scale entrance on scroll

### Layout Algorithms

Different layouts optimized per diagram type:
- **System Architecture** - Left-to-right horizontal flow
- **Authentication Flow** - Top-to-bottom vertical sequence
- **Attendance Lifecycle** - Top-to-bottom with branching paths
- **Task Lifecycle** - Top-to-bottom multi-actor swimlanes
- **Performance Calculation** - Top-to-bottom decision tree

## Usage

### Basic Usage

```tsx
import DiagramLoader from './diagrams/DiagramLoader';

<DiagramLoader 
  diagramId="system-architecture" 
  height="700px" 
  showTitle={true} 
/>
```

### With Explanation

```tsx
import DiagramWithExplanation from './diagrams/DiagramWithExplanation';
import { diagramExplanations } from './diagrams/explanations';

<DiagramWithExplanation
  diagramId="authentication-flow"
  explanation={diagramExplanations['authentication-flow']}
  height="800px"
/>
```

### Adding New Diagrams

1. Add diagram data to `ems.case-study.diagrams.json`
2. Add explanation to `explanations.ts`
3. Create section component in `sections/`
4. Add to `EMSCaseStudyTemplate.tsx`

## Data Format

Diagram data is read from `ems.case-study.diagrams.json`:

```json
{
  "diagrams": [
    {
      "id": "system-architecture",
      "title": "System Architecture Diagram",
      "nodes": [
        {
          "id": "employee-portal",
          "label": "Employee Portal",
          "type": "frontend",
          "tech": "Next.js 16.0.7",
          "port": "3000",
          "group": "frontend"
        }
      ],
      "edges": [
        {
          "source": "employee-portal",
          "target": "express-api",
          "label": "HTTP/WebSocket"
        }
      ]
    }
  ]
}
```

## Styling

Custom styles in `globals.css`:
- Node hover effects
- Control button styling
- Minimap theming
- Edge styling

## Dependencies

- `@xyflow/react` - React Flow library
- `@dagrejs/dagre` - Automatic layout algorithm
- `gsap` - Scroll-triggered animations

## Performance

- Client-side only rendering (SSR disabled for React Flow)
- Lazy loading of diagram components
- Memoized layout calculations
- Optimized re-renders with React Flow hooks
