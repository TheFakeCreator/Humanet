import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Types for file operations
export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileItem[];
  mimeType?: string;
  lastModified?: string;
}

export interface FileContent {
  path: string;
  content: string;
  mimeType: string;
  size: number;
  lastModified: string;
}

export interface FileVersion {
  version: number;
  timestamp: string;
  size: number;
  path: string;
}

// Query keys
const fileKeys = {
  all: ['files'] as const,
  idea: (ideaId: string) => [...fileKeys.all, 'idea', ideaId] as const,
  list: (ideaId: string) => [...fileKeys.idea(ideaId), 'list'] as const,
  content: (ideaId: string, filePath: string) =>
    [...fileKeys.idea(ideaId), 'content', filePath] as const,
  versions: (ideaId: string, filePath: string) =>
    [...fileKeys.idea(ideaId), 'versions', filePath] as const,
};

// Hook to get file list for an idea
export const useFileList = (ideaId: string) => {
  return useQuery({
    queryKey: fileKeys.list(ideaId),
    queryFn: async (): Promise<FileItem[]> => {
      const response = await api.get(`/api/ideas/${ideaId}/files`);
      return response.data.data;
    },
    enabled: !!ideaId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Hook to get file content
export const useFileContent = (ideaId: string, filePath?: string) => {
  return useQuery({
    queryKey: fileKeys.content(ideaId, filePath || ''),
    queryFn: async (): Promise<FileContent> => {
      if (!filePath) throw new Error('File path is required');
      const response = await api.get(`/api/ideas/${ideaId}/files/content`, {
        params: { path: filePath },
      });
      return response.data.data;
    },
    enabled: !!ideaId && !!filePath,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Hook to get file versions
export const useFileVersions = (ideaId: string, filePath?: string) => {
  return useQuery({
    queryKey: fileKeys.versions(ideaId, filePath || ''),
    queryFn: async (): Promise<FileVersion[]> => {
      if (!filePath) throw new Error('File path is required');
      const response = await api.get(`/api/ideas/${ideaId}/files/versions`, {
        params: { path: filePath },
      });
      return response.data.data;
    },
    enabled: !!ideaId && !!filePath,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Hook to create a new file
export const useCreateFile = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      fileName,
      content = '',
      parentPath = '',
    }: {
      fileName: string;
      content?: string;
      parentPath?: string;
    }) => {
      const response = await api.post(`/api/ideas/${ideaId}/files`, {
        fileName,
        content,
        parentPath,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list(ideaId) });
      toast({
        title: 'File created',
        description: `Successfully created ${data.fileName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create file',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Hook to update file content
export const useUpdateFile = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ filePath, content }: { filePath: string; content: string }) => {
      const response = await api.put(`/api/ideas/${ideaId}/files/content`, {
        path: filePath,
        content,
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.content(ideaId, variables.filePath) });
      queryClient.invalidateQueries({ queryKey: fileKeys.list(ideaId) });
      toast({
        title: 'File saved',
        description: 'Your changes have been saved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to save file',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Hook to upload a file
export const useUploadFile = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, parentPath = '' }: { file: File; parentPath?: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('parentPath', parentPath);

      const response = await api.post(`/api/ideas/${ideaId}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list(ideaId) });
      toast({
        title: 'File uploaded',
        description: `Successfully uploaded ${data.fileName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to upload file',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Hook to delete a file
export const useDeleteFile = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (filePath: string) => {
      const response = await api.delete(`/api/ideas/${ideaId}/files`, {
        data: { path: filePath },
      });
      return response.data;
    },
    onSuccess: (data, filePath) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list(ideaId) });
      queryClient.removeQueries({ queryKey: fileKeys.content(ideaId, filePath) });
      queryClient.removeQueries({ queryKey: fileKeys.versions(ideaId, filePath) });
      toast({
        title: 'File deleted',
        description: 'File has been removed from the repository',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete file',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Hook to rename a file
export const useRenameFile = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ oldPath, newPath }: { oldPath: string; newPath: string }) => {
      const response = await api.patch(`/api/ideas/${ideaId}/files/rename`, {
        oldPath,
        newPath,
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list(ideaId) });
      queryClient.removeQueries({ queryKey: fileKeys.content(ideaId, variables.oldPath) });
      queryClient.removeQueries({ queryKey: fileKeys.versions(ideaId, variables.oldPath) });
      toast({
        title: 'File renamed',
        description: `Renamed to ${variables.newPath}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to rename file',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Hook to restore a file version
export const useRestoreFileVersion = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ filePath, version }: { filePath: string; version: number }) => {
      const response = await api.post(`/api/ideas/${ideaId}/files/restore`, {
        path: filePath,
        version,
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.content(ideaId, variables.filePath) });
      queryClient.invalidateQueries({ queryKey: fileKeys.versions(ideaId, variables.filePath) });
      toast({
        title: 'Version restored',
        description: `Restored file to version ${variables.version}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to restore version',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};

// Hook to create a directory
export const useCreateDirectory = (ideaId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ dirName, parentPath = '' }: { dirName: string; parentPath?: string }) => {
      const response = await api.post(`/api/ideas/${ideaId}/files/directory`, {
        dirName,
        parentPath,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.list(ideaId) });
      toast({
        title: 'Directory created',
        description: `Successfully created directory ${data.dirName}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create directory',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
};
