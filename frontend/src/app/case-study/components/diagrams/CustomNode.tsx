"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

export const CustomNode = memo(({ data }: NodeProps) => {
  const nodeData = data as Record<string, unknown>;
  
  const isString = (value: unknown): value is string => typeof value === 'string';
  
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-neutral-600 border-2 border-neutral-400"
      />
      <div className="flex flex-col gap-1">
        <div className="font-semibold text-white text-sm leading-tight">
          {isString(nodeData.label) ? nodeData.label : 'Node'}
        </div>
        {isString(nodeData.tech) && (
          <div className="text-xs text-neutral-400">{nodeData.tech}</div>
        )}
        {isString(nodeData.port) && (
          <div className="text-xs text-neutral-500">Port: {nodeData.port}</div>
        )}
        {isString(nodeData.lines) && (
          <div className="text-xs text-neutral-500">{nodeData.lines}</div>
        )}
        {isString(nodeData.collections) && (
          <div className="text-xs text-neutral-500">{nodeData.collections} collections</div>
        )}
        {isString(nodeData.hitRate) && (
          <div className="text-xs text-emerald-400 font-medium">{nodeData.hitRate} hit rate</div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-neutral-600 border-2 border-neutral-400"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
