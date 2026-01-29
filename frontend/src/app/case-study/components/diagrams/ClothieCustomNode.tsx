"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

/**
 * Node type colors for Clothie E-commerce diagrams
 * Based on the type field in clothie.case-study.diagrams.json
 */
const nodeTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  frontend: {
    bg: 'rgba(96, 165, 250, 0.15)',
    border: '#60A5FA',
    text: '#93C5FD',
  },
  backend: {
    bg: 'rgba(52, 211, 153, 0.15)',
    border: '#34D399',
    text: '#6EE7B7',
  },
  service: {
    bg: 'rgba(251, 191, 36, 0.15)',
    border: '#FBBF24',
    text: '#FCD34D',
  },
  db: {
    bg: 'rgba(167, 139, 250, 0.15)',
    border: '#A78BFA',
    text: '#C4B5FD',
  },
  external: {
    bg: 'rgba(248, 113, 113, 0.15)',
    border: '#F87171',
    text: '#FCA5A5',
  },
};

const defaultColors = {
  bg: 'rgba(163, 163, 163, 0.1)',
  border: '#525252',
  text: '#D4D4D4',
};

export const ClothieCustomNode = memo(({ data }: NodeProps) => {
  const nodeData = data as Record<string, unknown>;
  const nodeType = (nodeData.type as string) || 'default';
  const colors = nodeTypeColors[nodeType] || defaultColors;
  
  const isString = (value: unknown): value is string => typeof value === 'string';
  const isArray = (value: unknown): value is string[] => Array.isArray(value);
  
  return (
    <div 
      className="relative rounded-lg px-4 py-3 min-w-[160px] max-w-[220px] transition-all duration-200 hover:scale-[1.02] cursor-grab active:cursor-grabbing"
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: `0 0 20px ${colors.border}20`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5! h-2.5! border-2!"
        style={{
          background: colors.border,
          borderColor: colors.bg,
        }}
      />
      
      <div className="flex flex-col gap-1.5">
        {/* Main Label */}
        <div 
          className="font-semibold text-sm leading-tight whitespace-pre-line"
          style={{ color: colors.text }}
        >
          {isString(nodeData.label) ? nodeData.label : 'Node'}
        </div>
        
        {/* Technology */}
        {isString(nodeData.technology) && (
          <div className="text-xs text-neutral-400 leading-tight">
            {nodeData.technology}
          </div>
        )}
        
        {/* Port */}
        {isString(nodeData.port) && (
          <div className="text-[10px] text-neutral-500 font-mono">
            Port: {nodeData.port}
          </div>
        )}
        
        {/* Logic/Query */}
        {isString(nodeData.logic) && (
          <div className="text-[10px] text-neutral-500 font-mono truncate" title={nodeData.logic}>
            {nodeData.logic}
          </div>
        )}
        
        {isString(nodeData.query) && (
          <div className="text-[10px] text-neutral-500 font-mono truncate" title={nodeData.query}>
            {nodeData.query}
          </div>
        )}
        
        {/* Action */}
        {isString(nodeData.action) && (
          <div className="text-[10px] text-blue-400 font-mono truncate" title={nodeData.action}>
            {nodeData.action}
          </div>
        )}
        
        {/* Operation */}
        {isString(nodeData.operation) && (
          <div className="text-[10px] text-emerald-400 font-mono truncate" title={nodeData.operation}>
            {nodeData.operation}
          </div>
        )}
        
        {/* Formula */}
        {isString(nodeData.formula) && (
          <div className="text-[10px] text-amber-400 font-mono truncate" title={nodeData.formula}>
            {nodeData.formula}
          </div>
        )}
        
        {/* Collections (for DB nodes) */}
        {isArray(nodeData.collections) && (
          <div className="text-[10px] text-purple-400">
            {(nodeData.collections as string[]).length} collections
          </div>
        )}
        
        {/* Status indicator */}
        {isString(nodeData.status) && nodeData.status === 'disabled' && (
          <div className="text-[10px] text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
            Inactive
          </div>
        )}
        
        {/* Component */}
        {isString(nodeData.component) && (
          <div className="text-[10px] text-cyan-400 font-mono">
            {nodeData.component}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5! h-2.5! border-2!"
        style={{
          background: colors.border,
          borderColor: colors.bg,
        }}
      />
    </div>
  );
});

ClothieCustomNode.displayName = 'ClothieCustomNode';
