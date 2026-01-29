"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Import WhatsApp Funnel diagram data
import whatsappFunnelDiagramsData from '@/../whatsappfunnel.case-study.diagrams.json';

interface WhatsAppFunnelDiagramNode {
  id: string;
  label: string;
  type: string;
  [key: string]: unknown;
}

interface WhatsAppFunnelDiagramEdge {
  source: string;
  target: string;
  label?: string;
}

interface WhatsAppFunnelDiagram {
  id: string;
  title: string;
  description: string;
  nodes: WhatsAppFunnelDiagramNode[];
  edges: WhatsAppFunnelDiagramEdge[];
}

interface WhatsAppFunnelDiagramData {
  diagrams: WhatsAppFunnelDiagram[];
}

// Dynamic import to prevent SSR issues with React Flow
const WhatsAppFunnelCaseStudyDiagram = dynamic(
  () => import('./WhatsAppFunnelCaseStudyDiagram'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
        <div 
          className="bg-neutral-950 flex items-center justify-center" 
          style={{ height: '650px' }}
        >
          <div className="text-neutral-500 text-sm flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-neutral-600 border-t-green-500 rounded-full animate-spin" />
            Loading interactive diagram...
          </div>
        </div>
      </div>
    ),
  }
);

interface WhatsAppFunnelDiagramLoaderProps {
  diagramId: string;
  height?: string;
  showTitle?: boolean;
}

export default function WhatsAppFunnelDiagramLoader({
  diagramId,
  height = '650px',
  showTitle = true,
}: WhatsAppFunnelDiagramLoaderProps) {
  const typedData = whatsappFunnelDiagramsData as WhatsAppFunnelDiagramData;

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
      <WhatsAppFunnelCaseStudyDiagram
        diagramId={diagram.id}
        nodes={diagram.nodes}
        edges={diagram.edges}
        title={showTitle ? diagram.title : undefined}
        height={height}
      />
    </div>
  );
}
