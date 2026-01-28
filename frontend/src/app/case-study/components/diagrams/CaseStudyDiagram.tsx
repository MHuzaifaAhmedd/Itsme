"use client";

import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { DiagramNode, DiagramEdge } from './types';
import { CustomNode } from './CustomNode';
import { getLayoutedElements } from './layoutUtils';

interface CaseStudyDiagramProps {
  diagramId: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  title?: string;
  height?: string;
}

const nodeTypes: NodeTypes = {
  default: CustomNode,
};

const groupColors: Record<string, string> = {
  frontend: '#60A5FA',
  backend: '#34D399',
  data: '#F59E0B',
  external: '#A78BFA',
  client: '#60A5FA',
  middleware: '#FBBF24',
  admin: '#F87171',
  employee: '#60A5FA',
  trigger: '#EC4899',
  request: '#8B5CF6',
  cache: '#F59E0B',
  calculation: '#10B981',
  response: '#3B82F6',
};

export default function CaseStudyDiagram({
  diagramId,
  nodes: initialNodes,
  edges: initialEdges,
  title,
  height = '600px',
}: CaseStudyDiagramProps) {
  // No need for isClient check since component is dynamically imported with ssr: false
  const isClient = true;

  // Convert diagram nodes to React Flow nodes
  const reactFlowNodes: Node[] = useMemo(() => {
    return initialNodes.map((node) => ({
      id: node.id,
      type: 'default',
      position: { x: 0, y: 0 }, // Will be set by layout
      data: {
        ...node,
      },
      style: {
        background: node.group ? `${groupColors[node.group]}15` : '#1f293715',
        border: `2px solid ${node.group ? groupColors[node.group] : '#525252'}`,
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: '500',
        color: '#ffffff',
        width: 'auto',
        minWidth: '140px',
      },
    }));
  }, [initialNodes]);

  // Convert diagram edges to React Flow edges
  const reactFlowEdges: Edge[] = useMemo(() => {
    return initialEdges.map((edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#525252',
        strokeWidth: 2,
      },
      labelStyle: {
        fontSize: '11px',
        fill: '#a3a3a3',
        fontWeight: '500',
      },
      labelBgStyle: {
        fill: '#171717',
        fillOpacity: 0.9,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#525252',
      },
    }));
  }, [initialEdges]);

  // Apply layout synchronously
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(reactFlowNodes, reactFlowEdges, diagramId);
  }, [reactFlowNodes, reactFlowEdges, diagramId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update nodes and edges when layouted elements change
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Optional: Add click handlers for interactivity
      console.log('Node clicked:', node);
    },
    []
  );

  if (!isClient) {
    return (
      <div className="w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
        {title && (
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        )}
        <div
          className="bg-neutral-950 flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-neutral-500 text-sm">Loading diagram...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
      {title && (
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div style={{ height }} className="bg-neutral-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            maxZoom: 1,
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background
            color="#404040"
            gap={16}
            size={1}
            className="bg-neutral-950"
          />
          <Controls
            className="bg-neutral-900 border border-neutral-800 rounded-lg"
            showInteractive={false}
          />
          <MiniMap
            nodeColor={(node) => {
              const group = node.data?.group as string;
              return groupColors[group] || '#525252';
            }}
            className="bg-neutral-900 border border-neutral-800 rounded-lg"
            maskColor="rgba(0, 0, 0, 0.6)"
          />
          <Panel position="top-right" className="bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-lg p-3 text-xs">
            <div className="space-y-1.5">
              <div className="text-neutral-400 font-medium mb-2">Legend</div>
              {Object.entries(groupColors).map(([group, color]) => {
                // Only show groups that exist in this diagram
                const hasGroup = initialNodes.some(n => n.group === group);
                if (!hasGroup) return null;
                
                return (
                  <div key={group} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-neutral-300 capitalize">{group}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
