"use client";

import { useEffect, useMemo } from 'react';
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
import { ClothieCustomNode } from './ClothieCustomNode';

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

interface ClothieCaseStudyDiagramProps {
  diagramId: string;
  nodes: ClothieDiagramNode[];
  edges: ClothieDiagramEdge[];
  title?: string;
  height?: string;
}

const nodeTypes: NodeTypes = {
  custom: ClothieCustomNode,
};

/**
 * Node type colors matching ClothieCustomNode
 */
const nodeTypeColors: Record<string, string> = {
  frontend: '#60A5FA',
  backend: '#34D399',
  service: '#FBBF24',
  db: '#A78BFA',
  external: '#F87171',
};

/**
 * Layout configuration per diagram
 */
function getLayoutConfig(diagramId: string): {
  direction: 'TB' | 'LR';
  nodeWidth: number;
  nodeHeight: number;
  rankSep: number;
  nodeSep: number;
} {
  switch (diagramId) {
    case 'system-architecture':
      return {
        direction: 'LR',
        nodeWidth: 200,
        nodeHeight: 100,
        rankSep: 280,
        nodeSep: 80,
      };
    case 'authentication-flow':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 80,
        rankSep: 100,
        nodeSep: 60,
      };
    case 'order-placement-lifecycle':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 70,
        rankSep: 90,
        nodeSep: 50,
      };
    case 'product-data-flow':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 80,
        rankSep: 100,
        nodeSep: 60,
      };
    case 'cart-state-management':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 70,
        rankSep: 90,
        nodeSep: 55,
      };
    case 'mto-workflow':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 70,
        rankSep: 85,
        nodeSep: 50,
      };
    default:
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 80,
        rankSep: 100,
        nodeSep: 70,
      };
  }
}

/**
 * Build adjacency list from edges
 */
function buildGraph(nodes: Node[], edges: Edge[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  nodes.forEach(node => graph.set(node.id, new Set()));
  edges.forEach(edge => {
    const children = graph.get(edge.source);
    if (children) children.add(edge.target);
  });
  return graph;
}

/**
 * Find root nodes (no incoming edges)
 */
function findRoots(nodes: Node[], edges: Edge[]): string[] {
  const hasIncoming = new Set<string>();
  edges.forEach(edge => hasIncoming.add(edge.target));
  return nodes.filter(node => !hasIncoming.has(node.id)).map(node => node.id);
}

/**
 * Assign levels using BFS
 */
function assignLevels(nodes: Node[], edges: Edge[]): Map<string, number> {
  const graph = buildGraph(nodes, edges);
  const roots = findRoots(nodes, edges);
  const levels = new Map<string, number>();
  const queue: Array<{ id: string; level: number }> = roots.map(id => ({ id, level: 0 }));
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    levels.set(id, level);
    
    const children = graph.get(id) || new Set();
    children.forEach(childId => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }
  
  // Handle orphans
  nodes.forEach(node => {
    if (!levels.has(node.id)) levels.set(node.id, 0);
  });
  
  return levels;
}

/**
 * Apply hierarchical layout
 */
function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  diagramId: string
): { nodes: Node[]; edges: Edge[] } {
  const config = getLayoutConfig(diagramId);
  const levels = assignLevels(nodes, edges);
  
  // Group by level
  const nodesByLevel = new Map<number, Node[]>();
  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!nodesByLevel.has(level)) nodesByLevel.set(level, []);
    nodesByLevel.get(level)!.push(node);
  });
  
  // Calculate positions
  const layoutedNodes = nodes.map(node => {
    const level = levels.get(node.id) || 0;
    const nodesInLevel = nodesByLevel.get(level) || [];
    const indexInLevel = nodesInLevel.findIndex(n => n.id === node.id);
    
    let x: number, y: number;
    
    if (config.direction === 'TB') {
      x = indexInLevel * (config.nodeWidth + config.nodeSep) + 100;
      y = level * (config.nodeHeight + config.rankSep) + 50;
    } else {
      x = level * (config.nodeWidth + config.rankSep) + 50;
      y = indexInLevel * (config.nodeHeight + config.nodeSep) + 100;
    }
    
    return { ...node, position: { x, y } };
  });
  
  return { nodes: layoutedNodes, edges };
}

export default function ClothieCaseStudyDiagram({
  diagramId,
  nodes: initialNodes,
  edges: initialEdges,
  title,
  height = '650px',
}: ClothieCaseStudyDiagramProps) {
  // Convert to React Flow nodes
  const reactFlowNodes: Node[] = useMemo(() => {
    return initialNodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { ...node },
    }));
  }, [initialNodes]);

  // Convert to React Flow edges
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
        fontSize: '10px',
        fill: '#a3a3a3',
        fontWeight: '500',
      },
      labelBgStyle: {
        fill: '#171717',
        fillOpacity: 0.95,
      },
      labelBgPadding: [6, 4] as [number, number],
      labelBgBorderRadius: 4,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 16,
        color: '#525252',
      },
    }));
  }, [initialEdges]);

  // Apply layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(reactFlowNodes, reactFlowEdges, diagramId);
  }, [reactFlowNodes, reactFlowEdges, diagramId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // Get unique node types for legend
  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    initialNodes.forEach(n => {
      if (n.type && nodeTypeColors[n.type]) {
        types.add(n.type);
      }
    });
    return Array.from(types);
  }, [initialNodes]);

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
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.15,
            maxZoom: 1.2,
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
            gap={20}
            size={1}
            className="bg-neutral-950"
          />
          <Controls
            className="bg-neutral-900! border! border-neutral-800! rounded-lg! [&>button]:bg-neutral-800! [&>button]:border-neutral-700! [&>button]:text-neutral-400! [&>button:hover]:bg-neutral-700!"
            showInteractive={false}
          />
          <MiniMap
            nodeColor={(node) => {
              const nodeType = node.data?.type as string;
              return nodeTypeColors[nodeType] || '#525252';
            }}
            className="bg-neutral-900! border! border-neutral-800! rounded-lg!"
            maskColor="rgba(0, 0, 0, 0.7)"
            style={{ height: 100, width: 150 }}
          />
          <Panel position="top-right" className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-800 rounded-lg p-3 text-xs">
            <div className="space-y-1.5">
              <div className="text-neutral-400 font-medium mb-2">Node Types</div>
              {uniqueTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: nodeTypeColors[type] }}
                  />
                  <span className="text-neutral-300 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
