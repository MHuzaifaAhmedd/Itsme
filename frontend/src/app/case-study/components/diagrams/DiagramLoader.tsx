"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { DiagramData } from './types';

// Import diagram data
import diagramsData from '@/../ems.case-study.diagrams.json';

// Dynamic import to prevent SSR and avoid hydration issues
const CaseStudyDiagram = dynamic(() => import('./CaseStudyDiagram'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
      <div className="bg-neutral-950 flex items-center justify-center" style={{ height: '600px' }}>
        <div className="text-neutral-500 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin" />
          Loading diagram...
        </div>
      </div>
    </div>
  ),
});

interface DiagramLoaderProps {
  diagramId: string;
  height?: string;
  showTitle?: boolean;
}

export default function DiagramLoader({
  diagramId,
  height = '600px',
  showTitle = true,
}: DiagramLoaderProps) {
  const typedData = diagramsData as DiagramData;

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
      <CaseStudyDiagram
        diagramId={diagram.id}
        nodes={diagram.nodes}
        edges={diagram.edges}
        title={showTitle ? diagram.title : undefined}
        height={height}
      />
    </div>
  );
}
