"use client";

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

/**
 * Node type colors for Sharaf ul Quran diagrams
 * Based on the type field in sharafulquran.case-study.diagrams.json
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
  cache: {
    bg: 'rgba(34, 211, 238, 0.15)',
    border: '#22D3EE',
    text: '#67E8F9',
  },
};

const defaultColors = {
  bg: 'rgba(163, 163, 163, 0.1)',
  border: '#525252',
  text: '#D4D4D4',
};

function formatMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const obj = metadata as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof obj.tech === 'string') parts.push(obj.tech);
  if (typeof obj.purpose === 'string') parts.push(obj.purpose);
  if (typeof obj.responsibilities === 'string') parts.push(obj.responsibilities);
  if (typeof obj.hosting === 'string') parts.push(obj.hosting);
  if (typeof obj.portals === 'string') parts.push(obj.portals);
  return parts.length ? parts.join(' · ') : null;
}

export const SharafulQuranCustomNode = memo(({ data }: NodeProps) => {
  const nodeData = data as Record<string, unknown>;
  const nodeType = (nodeData.type as string) || 'default';
  const colors = nodeTypeColors[nodeType] || defaultColors;
  const metaLine = formatMetadata(nodeData.metadata);

  const isString = (value: unknown): value is string => typeof value === 'string';

  return (
    <div
      className="relative rounded-lg px-4 py-3 min-w-[140px] max-w-[220px] transition-all duration-200 hover:scale-[1.02] cursor-grab active:cursor-grabbing"
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
        <div
          className="font-semibold text-sm leading-tight whitespace-pre-line"
          style={{ color: colors.text }}
        >
          {isString(nodeData.label) ? nodeData.label : 'Node'}
        </div>
        {metaLine && (
          <div className="text-[10px] text-neutral-400 leading-tight truncate" title={metaLine}>
            {metaLine}
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

SharafulQuranCustomNode.displayName = 'SharafulQuranCustomNode';
