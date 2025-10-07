'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Save, Eye, Code, FileText, Clock, Undo2, Download, AlertCircle } from 'lucide-react';

interface FileEditorProps {
  ideaId: string;
  filePath?: string;
  initialContent?: string;
  onSave?: (content: string) => Promise<void>;
  onClose?: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  lastSaved?: Date;
  hasUnsavedChanges?: boolean;
  readonly?: boolean;
}

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  // Simple markdown rendering - in production, you'd use a proper markdown library
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>');
  };

  return (
    <div
      className="prose prose-sm max-w-none p-4 bg-white rounded border"
      dangerouslySetInnerHTML={{
        __html: `<p class="mb-3">${renderMarkdown(content)}</p>`,
      }}
    />
  );
};

export const FileEditor: React.FC<FileEditorProps> = ({
  ideaId,
  filePath,
  initialContent = '',
  onSave,
  onClose,
  isLoading = false,
  isSaving = false,
  lastSaved,
  hasUnsavedChanges = false,
  readonly = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = async () => {
    if (onSave && !isSaving) {
      await onSave(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [content]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!filePath) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Select a file to edit</p>
        </CardContent>
      </Card>
    );
  }

  const fileName = filePath.split('/').pop() || 'Untitled';
  const isMarkdown = fileName.endsWith('.md');

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span className="truncate" title={filePath}>
              {fileName}
            </span>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved
              </Badge>
            )}
            {readonly && <Badge variant="secondary">Read-only</Badge>}
          </CardTitle>

          <div className="flex items-center space-x-2">
            {lastSaved && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  {lastSaved.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}

            {!readonly && (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                loading={isSaving}
                loadingText="Saving..."
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}

            {onClose && (
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>

        {isMarkdown && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>

      <CardContent className="h-full pb-6">
        {isMarkdown ? (
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="edit" className="h-full mt-0">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[400px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                placeholder={readonly ? 'This file is read-only' : 'Start typing...'}
                disabled={readonly}
                style={{
                  minHeight: '400px',
                  maxHeight: '800px',
                  overflow: 'auto',
                }}
              />
            </TabsContent>

            <TabsContent value="preview" className="h-full mt-0">
              <div className="min-h-[400px] max-h-[800px] overflow-auto border rounded-md">
                {content.trim() ? (
                  <MarkdownPreview content={content} />
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Eye className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                    <p>Nothing to preview</p>
                    <p className="text-sm mt-1">Write some content to see the preview</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[400px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
            placeholder={readonly ? 'This file is read-only' : 'Start typing...'}
            disabled={readonly}
            style={{
              minHeight: '400px',
              maxHeight: '800px',
              overflow: 'auto',
            }}
          />
        )}

        {!readonly && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{content.length} characters</span>
                <span>{content.split('\n').length} lines</span>
                <span>{content.split(/\s+/).filter((word) => word.length > 0).length} words</span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <kbd className="px-2 py-1 bg-white border rounded">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white border rounded">S</kbd>
                <span>to save</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
