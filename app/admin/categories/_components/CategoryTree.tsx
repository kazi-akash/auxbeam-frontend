'use client';

import { useState } from 'react';
import { ChevronRight, FolderOpen, Folder, Plus } from 'lucide-react';
import type { Category } from '@/lib/types/catalog';

interface Props {
  tree: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onAddSub: (parent: Category) => void;
}

interface NodeProps {
  category: Category;
  depth: number;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  onAddSub: (parent: Category) => void;
}

function TreeNode({ category, depth, selectedId, onSelect, onAddSub }: NodeProps) {
  const hasChildren = (category.children?.length ?? 0) > 0;
  const [expanded, setExpanded] = useState(true);
  const isSelected = selectedId === category.id;

  return (
    <li>
      <div
        className={`group flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
          isSelected
            ? 'bg-amber-50 text-amber-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => onSelect(isSelected ? null : category.id)}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Icon */}
        {expanded && hasChildren
          ? <FolderOpen className="w-4 h-4 shrink-0 text-amber-400" />
          : <Folder className="w-4 h-4 shrink-0 text-gray-400" />
        }

        {/* Name */}
        <span className="flex-1 truncate">{category.name}</span>

        {/* Status dot */}
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${category.is_active ? 'bg-emerald-400' : 'bg-gray-300'}`} />

        {/* Add subcategory button */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddSub(category); }}
          title="Add subcategory"
          className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-amber-600 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <ul>
          {category.children!.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddSub={onAddSub}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryTree({ tree, selectedId, onSelect, onAddSub }: Props) {
  if (!tree.length) {
    return (
      <p className="px-4 py-6 text-xs text-gray-400 text-center">No categories yet.</p>
    );
  }

  return (
    <ul className="space-y-0.5 py-2">
      {tree.map((cat) => (
        <TreeNode
          key={cat.id}
          category={cat}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          onAddSub={onAddSub}
        />
      ))}
    </ul>
  );
}
