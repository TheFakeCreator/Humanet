'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Upload,
  FolderPlus,
  FileText,
  Trash2,
  Edit3,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface FileManagerProps {
  ideaId: string;
  onFileCreate?: (fileName: string, content?: string, parentPath?: string) => Promise<void>;
  onFileUpload?: (file: File, parentPath?: string) => Promise<void>;
  onFileDelete?: (filePath: string) => Promise<void>;
  onFileRename?: (oldPath: string, newPath: string) => Promise<void>;
  onDirectoryCreate?: (dirName: string, parentPath?: string) => Promise<void>;
  isCreating?: boolean;
  isUploading?: boolean;
  isDeleting?: boolean;
}

type FileTemplate = {
  name: string;
  extension: string;
  description: string;
  content: string;
};

const FILE_TEMPLATES: FileTemplate[] = [
  {
    name: 'Markdown Document',
    extension: '.md',
    description: 'A markdown file for documentation',
    content: `# New Document

## Overview

Write your content here...

## Details

- Point 1
- Point 2
- Point 3
`,
  },
  {
    name: 'Text File',
    extension: '.txt',
    description: 'A simple text file',
    content: '',
  },
  {
    name: 'JSON Data',
    extension: '.json',
    description: 'A JSON data file',
    content: `{
  "name": "example",
  "version": "1.0.0",
  "description": "Example JSON file"
}`,
  },
  {
    name: 'README',
    extension: '.md',
    description: 'Project documentation',
    content: `# Project Name

## Description

Brief description of this part of the project.

## Usage

How to use or understand this component.

## Notes

Additional notes and considerations.
`,
  },
];

export const FileManager: React.FC<FileManagerProps> = ({
  ideaId,
  onFileCreate,
  onFileUpload,
  onFileDelete,
  onFileRename,
  onDirectoryCreate,
  isCreating = false,
  isUploading = false,
  isDeleting = false,
}) => {
  const [createFileOpen, setCreateFileOpen] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<FileTemplate | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileToDelete, setFileToDelete] = useState<string>('');

  const handleCreateFile = async () => {
    if (!fileName.trim()) return;

    try {
      const finalFileName = selectedTemplate ? fileName + selectedTemplate.extension : fileName;
      const finalContent = selectedTemplate?.content || fileContent;

      await onFileCreate?.(finalFileName, finalContent);

      // Reset form
      setFileName('');
      setFileContent('');
      setSelectedTemplate(null);
      setCreateFileOpen(false);
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadFile) return;

    try {
      await onFileUpload?.(uploadFile);
      setUploadFile(null);
      setUploadFileOpen(false);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      await onFileDelete?.(fileToDelete);
      setFileToDelete('');
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = FILE_TEMPLATES.find((t) => t.name === templateName);
    setSelectedTemplate(template || null);
    if (template) {
      setFileContent(template.content);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setCreateFileOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New File</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setUploadFileOpen(true)}
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload File</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onDirectoryCreate?.('New Folder')}
          className="flex items-center space-x-2"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Folder</span>
        </Button>
      </div>

      {/* Create File Dialog */}
      <Dialog open={createFileOpen} onOpenChange={setCreateFileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Create New File</span>
            </DialogTitle>
            <DialogDescription>Create a new file in the repository</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Template (optional)</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template or start blank" />
                </SelectTrigger>
                <SelectContent>
                  {FILE_TEMPLATES.map((template) => (
                    <SelectItem key={template.name} value={template.name}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fileName">File Name</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="fileName"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="flex-1"
                />
                {selectedTemplate && (
                  <Badge variant="secondary">{selectedTemplate.extension}</Badge>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="fileContent">Initial Content (optional)</Label>
              <Textarea
                id="fileContent"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                placeholder="Enter initial file content..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateFileOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFile} disabled={!fileName.trim() || isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Dialog */}
      <Dialog open={uploadFileOpen} onOpenChange={setUploadFileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload File</span>
            </DialogTitle>
            <DialogDescription>Upload a file to the repository</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fileUpload">Choose File</Label>
              <Input
                id="fileUpload"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {uploadFile && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">{uploadFile.name}</div>
                  <div className="text-gray-500">{(uploadFile.size / 1024).toFixed(1)} KB</div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadFileOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadFile} disabled={!uploadFile || isUploading}>
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Delete File</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{fileToDelete}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFile}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
