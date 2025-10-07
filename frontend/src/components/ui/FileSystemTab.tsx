'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, FolderOpen, Settings, RefreshCw, AlertCircle } from 'lucide-react';

import { FileExplorer } from '@/components/ui/FileExplorer';
import { FileEditor } from '@/components/ui/FileEditor';
import { FileManager } from '@/components/ui/FileManager';
import { VersionHistoryDialog } from '@/components/ui/VersionHistoryDialog';

import {
  useFileList,
  useFileTree,
  useFileContent,
  useCreateFile,
  useUpdateFile,
  useUploadFile,
  useDeleteFile,
  useRenameFile,
  useCreateDirectory,
  type FileItem,
} from '@/hooks/useFiles';

interface FileSystemTabProps {
  ideaId: string;
}

export const FileSystemTab: React.FC<FileSystemTabProps> = ({ ideaId }) => {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [versionHistoryFile, setVersionHistoryFile] = useState<string>('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();

  // React Query hooks - Use tree endpoint for complete file structure
  const {
    data: files = [],
    isLoading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useFileTree(ideaId);

  console.log('🔧 FileSystemTab - tree files:', files);
  console.log('🔧 FileSystemTab - filesLoading:', filesLoading);
  console.log('🔧 FileSystemTab - filesError:', filesError);
  console.log('🔧 FileSystemTab - selectedFile:', selectedFile);

  const { data: fileContent, isLoading: contentLoading } = useFileContent(ideaId, selectedFile);

  console.log('🔧 FileSystemTab - fileContent:', fileContent);
  console.log('🔧 FileSystemTab - contentLoading:', contentLoading);

  const createFileMutation = useCreateFile(ideaId);
  const updateFileMutation = useUpdateFile(ideaId);
  const uploadFileMutation = useUploadFile(ideaId);
  const deleteFileMutation = useDeleteFile(ideaId);
  const renameFileMutation = useRenameFile(ideaId);
  const createDirectoryMutation = useCreateDirectory(ideaId);

  // Early error handling
  if (filesError) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-700 mb-4">Failed to load repository files</p>
          <Button onClick={() => refetchFiles()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Ensure files is always an array (files now contains tree structure)
  const safeFiles = Array.isArray(files) ? files : [];

  // Event handlers
  const handleFileSelect = (filePath: string) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to switch files?'
      );
      if (!confirmLeave) return;
    }

    setSelectedFile(filePath);
    setHasUnsavedChanges(false);
  };

  const handleFileEdit = (filePath: string) => {
    setSelectedFile(filePath);
    setHasUnsavedChanges(false);
  };

  const handleFileDelete = async (filePath: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${filePath}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      await deleteFileMutation.mutateAsync(filePath);
      if (selectedFile === filePath) {
        setSelectedFile('');
        setHasUnsavedChanges(false);
      }
    }
  };

  const handleVersionHistory = (filePath: string) => {
    setVersionHistoryFile(filePath);
    setVersionHistoryOpen(true);
  };

  const handleFileSave = async (content: string) => {
    if (!selectedFile) return;

    await updateFileMutation.mutateAsync({
      filePath: selectedFile,
      content,
    });

    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const handleFileCreate = async (fileName: string, content?: string, parentPath?: string) => {
    await createFileMutation.mutateAsync({
      fileName,
      content,
      parentPath,
    });
  };

  const handleFileUpload = async (file: File, parentPath?: string) => {
    await uploadFileMutation.mutateAsync({
      file,
      parentPath,
    });
  };

  const handleDirectoryCreate = async (dirName: string, parentPath?: string) => {
    await createDirectoryMutation.mutateAsync({
      dirName,
      parentPath,
    });
  };

  return (
    <div className="space-y-6">
      {/* Repository Statistics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <span>Repository</span>
          </h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {safeFiles.length} files
            </Badge>
            {selectedFile && (
              <Badge variant="secondary" className="text-sm">
                <FileText className="h-3 w-3 mr-1" />
                {selectedFile.split('/').pop()}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetchFiles()}
            disabled={filesLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${filesLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Explorer */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <FileManager
              ideaId={ideaId}
              onFileCreate={handleFileCreate}
              onFileUpload={handleFileUpload}
              onDirectoryCreate={handleDirectoryCreate}
              isCreating={createFileMutation.isPending}
              isUploading={uploadFileMutation.isPending}
            />

            <FileExplorer
              ideaId={ideaId}
              files={safeFiles}
              onFileSelect={handleFileSelect}
              onFileEdit={handleFileEdit}
              onFileDelete={handleFileDelete}
              onVersionHistory={handleVersionHistory}
              isLoading={filesLoading}
              selectedFile={selectedFile}
            />
          </div>
        </div>

        {/* File Editor */}
        <div className="lg:col-span-2">
          <FileEditor
            ideaId={ideaId}
            filePath={selectedFile}
            initialContent={fileContent?.content || ''}
            onSave={handleFileSave}
            onClose={() => setSelectedFile('')}
            isLoading={contentLoading}
            isSaving={updateFileMutation.isPending}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
      </div>

      {/* Version History Dialog */}
      <VersionHistoryDialog
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        ideaId={ideaId}
        filePath={versionHistoryFile}
      />
    </div>
  );
};
