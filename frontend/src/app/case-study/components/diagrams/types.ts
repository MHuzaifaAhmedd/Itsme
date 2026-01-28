/**
 * Type definitions for diagram data from ems.case-study.diagrams.json
 */

export interface DiagramNode {
  id: string;
  label: string;
  type: string;
  group?: string;
  tech?: string;
  port?: string;
  lines?: string;
  collections?: string;
  hitRate?: string;
  purpose?: string;
  [key: string]: string | undefined; // Allow additional properties
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
}

export interface Diagram {
  id: string;
  title: string;
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface DiagramData {
  version: string;
  diagrams: Diagram[];
  metadata: {
    createdFrom: string;
    purpose: string;
    renderEngines: string[];
    nodeTypes: Record<string, string>;
    groupColors: Record<string, string>;
  };
}
