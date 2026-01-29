"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

/**
 * Node type colors for WhatsApp Funnel diagrams
 * Based on the type field in whatsappfunnel.case-study.diagrams.json
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
  cache: {
    bg: 'rgba(249, 115, 22, 0.15)',
    border: '#F97316',
    text: '#FDBA74',
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

export const WhatsAppFunnelCustomNode = memo(({ data }: NodeProps) => {
  const nodeData = data as Record<string, unknown>;
  const nodeType = (nodeData.type as string) || 'default';
  const colors = nodeTypeColors[nodeType] || defaultColors;
  
  const isString = (value: unknown): value is string => typeof value === 'string';
  
  return (
    <div 
      className="relative rounded-lg px-4 py-3 min-w-[150px] max-w-[200px] transition-all duration-200 hover:scale-[1.02] cursor-grab active:cursor-grabbing"
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
      
      <div className="flex flex-col gap-1">
        {/* Main Label */}
        <div 
          className="font-semibold text-sm leading-tight"
          style={{ color: colors.text }}
        >
          {isString(nodeData.label) ? nodeData.label : 'Node'}
        </div>
        
        {/* Technology */}
        {isString(nodeData.tech) && (
          <div className="text-[10px] text-neutral-400 leading-tight">
            {nodeData.tech}
          </div>
        )}
        
        {/* Port */}
        {isString(nodeData.port) && (
          <div className="text-[10px] text-neutral-500 font-mono">
            Port: {nodeData.port}
          </div>
        )}
        
        {/* Features */}
        {isString(nodeData.features) && (
          <div className="text-[10px] text-neutral-500 truncate" title={nodeData.features}>
            {nodeData.features}
          </div>
        )}
        
        {/* Endpoint */}
        {isString(nodeData.endpoint) && (
          <div className="text-[10px] text-cyan-400 font-mono truncate" title={nodeData.endpoint}>
            {nodeData.endpoint}
          </div>
        )}
        
        {/* Method */}
        {isString(nodeData.method) && (
          <div className="text-[10px] text-emerald-400 font-mono">
            {nodeData.method}
          </div>
        )}
        
        {/* Collection */}
        {isString(nodeData.collection) && (
          <div className="text-[10px] text-purple-400">
            {nodeData.collection}
          </div>
        )}
        
        {/* Collections count */}
        {isString(nodeData.collections) && (
          <div className="text-[10px] text-purple-400">
            {nodeData.collections}
          </div>
        )}
        
        {/* Stores */}
        {isString(nodeData.stores) && (
          <div className="text-[10px] text-orange-400 truncate" title={nodeData.stores}>
            {nodeData.stores}
          </div>
        )}
        
        {/* Interval */}
        {isString(nodeData.interval) && (
          <div className="text-[10px] text-amber-400 font-mono">
            {nodeData.interval}
          </div>
        )}
        
        {/* Events */}
        {isString(nodeData.events) && (
          <div className="text-[10px] text-blue-400 truncate" title={nodeData.events}>
            {nodeData.events}
          </div>
        )}
        
        {/* Algorithm */}
        {isString(nodeData.algorithm) && (
          <div className="text-[10px] text-yellow-400 font-mono">
            {nodeData.algorithm}
          </div>
        )}
        
        {/* Example */}
        {isString(nodeData.example) && (
          <div className="text-[10px] text-neutral-500 font-mono truncate" title={nodeData.example}>
            {nodeData.example}
          </div>
        )}
        
        {/* Rule */}
        {isString(nodeData.rule) && (
          <div className="text-[10px] text-red-400 truncate" title={nodeData.rule}>
            {nodeData.rule}
          </div>
        )}
        
        {/* Via */}
        {isString(nodeData.via) && (
          <div className="text-[10px] text-neutral-500">
            via {nodeData.via}
          </div>
        )}
        
        {/* API */}
        {isString(nodeData.api) && (
          <div className="text-[10px] text-red-400">
            {nodeData.api}
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

WhatsAppFunnelCustomNode.displayName = 'WhatsAppFunnelCustomNode';
