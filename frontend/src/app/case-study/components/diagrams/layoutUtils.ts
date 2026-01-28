import { Node, Edge } from '@xyflow/react';

/**
 * Custom hierarchical layout algorithm
 * Replaces dagre to avoid Next.js compatibility issues
 */

interface LayoutConfig {
  direction: 'TB' | 'LR';
  nodeWidth: number;
  nodeHeight: number;
  rankSep: number;
  nodeSep: number;
}

function getLayoutConfig(diagramId: string): LayoutConfig {
  switch (diagramId) {
    case 'system-architecture':
      return {
        direction: 'LR',
        nodeWidth: 200,
        nodeHeight: 100,
        rankSep: 250,
        nodeSep: 100,
      };
    case 'authentication-flow':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 70,
        rankSep: 120,
        nodeSep: 80,
      };
    case 'attendance-lifecycle':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 80,
        rankSep: 110,
        nodeSep: 90,
      };
    case 'task-lifecycle':
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 80,
        rankSep: 110,
        nodeSep: 90,
      };
    case 'performance-calculation':
      return {
        direction: 'TB',
        nodeWidth: 200,
        nodeHeight: 90,
        rankSep: 120,
        nodeSep: 100,
      };
    default:
      return {
        direction: 'TB',
        nodeWidth: 180,
        nodeHeight: 80,
        rankSep: 100,
        nodeSep: 80,
      };
  }
}

/**
 * Build a graph structure from edges
 */
function buildGraph(nodes: Node[], edges: Edge[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();
  
  // Initialize all nodes
  nodes.forEach(node => {
    graph.set(node.id, new Set());
  });
  
  // Add edges
  edges.forEach(edge => {
    const children = graph.get(edge.source);
    if (children) {
      children.add(edge.target);
    }
  });
  
  return graph;
}

/**
 * Find root nodes (nodes with no incoming edges)
 */
function findRoots(nodes: Node[], edges: Edge[]): string[] {
  const hasIncoming = new Set<string>();
  edges.forEach(edge => hasIncoming.add(edge.target));
  return nodes.filter(node => !hasIncoming.has(node.id)).map(node => node.id);
}

/**
 * Assign levels to nodes using BFS
 */
function assignLevels(nodes: Node[], edges: Edge[]): Map<string, number> {
  const graph = buildGraph(nodes, edges);
  const roots = findRoots(nodes, edges);
  const levels = new Map<string, number>();
  
  // BFS to assign levels
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
  
  // Handle orphaned nodes
  nodes.forEach(node => {
    if (!levels.has(node.id)) {
      levels.set(node.id, 0);
    }
  });
  
  return levels;
}

/**
 * Apply hierarchical layout
 */
export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  diagramId: string
): { nodes: Node[]; edges: Edge[] } {
  const config = getLayoutConfig(diagramId);
  const levels = assignLevels(nodes, edges);
  
  // Group nodes by level
  const nodesByLevel = new Map<number, Node[]>();
  nodes.forEach(node => {
    const level = levels.get(node.id) || 0;
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node);
  });
  
  // Calculate positions
  const layoutedNodes = nodes.map(node => {
    const level = levels.get(node.id) || 0;
    const nodesInLevel = nodesByLevel.get(level) || [];
    const indexInLevel = nodesInLevel.findIndex(n => n.id === node.id);
    
    let x: number, y: number;
    
    if (config.direction === 'TB') {
      // Top to bottom
      x = indexInLevel * (config.nodeWidth + config.nodeSep) + 100;
      y = level * (config.nodeHeight + config.rankSep) + 50;
    } else {
      // Left to right
      x = level * (config.nodeWidth + config.rankSep) + 50;
      y = indexInLevel * (config.nodeHeight + config.nodeSep) + 100;
    }
    
    return {
      ...node,
      position: { x, y },
    };
  });
  
  return { nodes: layoutedNodes, edges };
}
