"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Import Clothie diagram data
import clothieDiagramsData from '@/../clothie.case-study.diagrams.json';

interface ClothieDiagramNode {
  id: string;
  label: string;
  type: string;
  [key: string]: unknown;
}

interface ClothieDiagramEdge {
  source: string;
  target: string;
  label?: string;
}

interface ClothieDiagram {
  id: string;
  title: string;
  description: string;
  nodes: ClothieDiagramNode[];
  edges: ClothieDiagramEdge[];
}

interface ClothieDiagramData {
  diagrams: ClothieDiagram[];
}

// Dynamic import to prevent SSR issues with React Flow
const ClothieCaseStudyDiagram = dynamic(
  () => import('./ClothieCaseStudyDiagram'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
        <div 
          className="bg-neutral-950 flex items-center justify-center" 
          style={{ height: '650px' }}
        >
          <div className="text-neutral-500 text-sm flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin" />
            Loading interactive diagram...
          </div>
        </div>
      </div>
    ),
  }
);

interface ClothieDiagramLoaderProps {
  diagramId: string;
  height?: string;
  showTitle?: boolean;
}

export default function ClothieDiagramLoader({
  diagramId,
  height = '650px',
  showTitle = true,
}: ClothieDiagramLoaderProps) {
  const typedData = clothieDiagramsData as ClothieDiagramData;

  const diagram = useMemo(() => {
    return typedData.diagrams.find((d) => d.id === diagramId);
  }, [diagramId, typedData.diagrams]);

  if (!diagram) {
    return (
      <div className="w-full p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 text-center">
        <p className="text-neutral-400">Diagram not found: {diagramId}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ClothieCaseStudyDiagram
        diagramId={diagram.id}
        nodes={diagram.nodes}
        edges={diagram.edges}
        title={showTitle ? diagram.title : undefined}
        height={height}
      />
    </div>
  );
}
