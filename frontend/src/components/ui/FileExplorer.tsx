'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Folder,
  FolderOpen,
  Image,
  File,
  Plus,
  Edit3,
  Trash2,
  Download,
  History,
} from 'lucide-react';

interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
  mimeType?: string;
  lastModified?: string; // Changed from Date to string
}

interface FileExplorerProps {
  ideaId: string;
  files: FileTreeNode[];
  onFileSelect?: (filePath: string) => void;
  onFileEdit?: (filePath: string) => void;
  onFileDelete?: (filePath: string) => void;
  onFileCreate?: (parentPath: string) => void;
  onVersionHistory?: (filePath: string) => void;
  isLoading?: boolean;
  selectedFile?: string;
}

const getFileIcon = (file: FileTreeNode) => {
  if (file.type === 'directory') {
    return <Folder className="h-4 w-4 text-blue-500" />;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'md':
    case 'txt':
      return <FileText className="h-4 w-4 text-green-600" />;
    case 'json':
      return <File className="h-4 w-4 text-yellow-600" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <Image className="h-4 w-4 text-purple-600" />;
    default:
      return <File className="h-4 w-4 text-gray-600" />;
  }
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';

  const sizes = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;

  while (size >= 1024 && i < sizes.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${sizes[i]}`;
};

const FileTreeItem: React.FC<{
  file: FileTreeNode;
  level: number;
  onSelect: (path: string) => void;
  onEdit: (path: string) => void;
  onDelete: (path: string) => void;
  onVersionHistory: (path: string) => void;
  selectedFile?: string;
}> = ({ file, level, onSelect, onEdit, onDelete, onVersionHistory, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const isSelected = selectedFile === file.path;

  const handleToggle = () => {
    if (file.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(file.path);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 cursor-pointer rounded-md group ${
          isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={handleToggle}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {file.type === 'directory' ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
            )
          ) : (
            getFileIcon(file)
          )}
          <span className="text-sm font-medium truncate" title={file.name}>
            {file.name}
          </span>
          {file.type === 'file' && (
            <span className="text-xs text-gray-500 ml-auto flex-shrink-0">
              {formatFileSize(file.size)}
            </span>
          )}
        </div>

        {file.type === 'file' && (
          <div className="hidden group-hover:flex items-center space-x-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(file.path);
              }}
              title="Edit file"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onVersionHistory(file.path);
              }}
              title="Version history"
            >
              <History className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.path);
              }}
              title="Delete file"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {file.type === 'directory' && isExpanded && file.children && (
        <div>
          {file.children.map((child) => (
            <FileTreeItem
              key={child.path}
              file={child}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onVersionHistory={onVersionHistory}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({
  ideaId,
  files,
  onFileSelect = () => {},
  onFileEdit = () => {},
  onFileDelete = () => {},
  onFileCreate = () => {},
  onVersionHistory = () => {},
  isLoading = false,
  selectedFile,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="h-5 w-5" />
            <span>Repository Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2 py-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!files || files.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Repository Files</span>
            </div>
            <Button size="sm" onClick={() => onFileCreate('')} className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              New File
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Folder className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No files in this repository yet</p>
            <p className="text-xs mt-1">Create your first file to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Separate required files from other files for better organization
  const requiredFiles = files.filter(
    (f) =>
      f.path.endsWith('.humanet/idea.md') ||
      f.path.endsWith('.humanet/scope.md') ||
      f.path.endsWith('.humanet/problem.md') ||
      f.path.endsWith('.humanet/search.md')
  );

  const otherFiles = files.filter(
    (f) =>
      !f.path.endsWith('.humanet/idea.md') &&
      !f.path.endsWith('.humanet/scope.md') &&
      !f.path.endsWith('.humanet/problem.md') &&
      !f.path.endsWith('.humanet/search.md')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Folder className="h-5 w-5" />
            <span>Repository Files</span>
            <Badge variant="secondary" className="text-xs">
              {files.length} files
            </Badge>
          </div>
          <Button size="sm" onClick={() => onFileCreate('')} className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            New File
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Required Files Section */}
        {requiredFiles.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-sm font-medium text-gray-700">Core Documents</h4>
              <Badge variant="outline" className="text-xs">
                Required
              </Badge>
            </div>
            <div className="space-y-1">
              {requiredFiles.map((file) => (
                <FileTreeItem
                  key={file.path}
                  file={file}
                  level={0}
                  onSelect={onFileSelect}
                  onEdit={onFileEdit}
                  onDelete={onFileDelete}
                  onVersionHistory={onVersionHistory}
                  selectedFile={selectedFile}
                />
              ))}
            </div>
            {otherFiles.length > 0 && <Separator className="my-4" />}
          </div>
        )}

        {/* Other Files Section */}
        {otherFiles.length > 0 && (
          <div>
            {requiredFiles.length > 0 && (
              <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Files</h4>
            )}
            <div className="space-y-1">
              {otherFiles.map((file) => (
                <FileTreeItem
                  key={file.path}
                  file={file}
                  level={0}
                  onSelect={onFileSelect}
                  onEdit={onFileEdit}
                  onDelete={onFileDelete}
                  onVersionHistory={onVersionHistory}
                  selectedFile={selectedFile}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
