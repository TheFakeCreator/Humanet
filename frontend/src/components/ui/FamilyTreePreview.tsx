import React from 'react';
import Link from 'next/link';
import { useIdeaTree } from '@/hooks/useIdeas';
import type { IdeaTreeNode } from '@humanet/shared';

interface FamilyTreePreviewProps {
  ideaId: string;
  maxDepth?: number;
  compact?: boolean;
}

interface TreeNodeProps {
  node: IdeaTreeNode;
  depth: number;
  maxDepth: number;
  compact: boolean;
}

function TreeNode({ node, depth, maxDepth, compact }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const showChildren = depth < maxDepth && hasChildren;

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className={`${compact ? 'p-3' : 'p-4'} bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow`}>
        <Link 
          href={`/ideas/${node._id}`}
          className="block group"
        >
          <h4 className={`font-medium text-gray-900 group-hover:text-primary-600 transition-colors ${
            compact ? 'text-sm' : 'text-base'
          }`}>
            {node.title}
          </h4>
          {!compact && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {node.description}
            </p>
          )}
          <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
            <span>by {node.author?.username}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>{node.upvotes}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{node.forkCount}</span>
            </span>
          </div>
        </Link>
      </div>

      {showChildren && (
        <div className="mt-4 space-y-3">
          {node.children!.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              compact={compact}
            />
          ))}
        </div>
      )}

      {hasChildren && depth >= maxDepth && (
        <div className="mt-3 ml-6">
          <Link
            href={`/ideas/${node._id}/tree`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View {node.children!.length} more fork{node.children!.length !== 1 ? 's' : ''} →
          </Link>
        </div>
      )}
    </div>
  );
}

export function FamilyTreePreview({ ideaId, maxDepth = 2, compact = false }: FamilyTreePreviewProps) {
  const { data: tree, isLoading, error } = useIdeaTree(ideaId, maxDepth + 1);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load family tree</p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No family tree data available</p>
      </div>
    );
  }

  const hasAnyForks = tree.children && tree.children.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Family Tree
        </h3>
        {hasAnyForks && (
          <Link
            href={`/ideas/${ideaId}/tree`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Full Tree →
          </Link>
        )}
      </div>

      {!hasAnyForks ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">This idea hasn't been forked yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to build upon it!</p>
        </div>
      ) : (
        <TreeNode
          node={tree}
          depth={0}
          maxDepth={maxDepth}
          compact={compact}
        />
      )}
    </div>
  );
}
