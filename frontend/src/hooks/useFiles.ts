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
  tree: (ideaId: string) => [...fileKeys.idea(ideaId), 'tree'] as const,
};

// Hook to get file list for an idea
export const useFileList = (ideaId: string) => {
  return useQuery({
    queryKey: fileKeys.list(ideaId),
    queryFn: async (): Promise<FileItem[]> => {
      console.log('🔧 Fetching files for idea:', ideaId);
      const response = await api.get(`/ideas/${ideaId}/files`);
      console.log('🔧 API response:', response.data);
      console.log('🔧 Files data:', response.data.data);

      // Extract the files array from the nested structure
      const filesData = response.data.data;
      if (filesData && Array.isArray(filesData.files)) {
        console.log('🔧 Extracted files array:', filesData.files);
        return filesData.files;
      }

      // Fallback: if data is already an array
      if (Array.isArray(filesData)) {
        return filesData;
      }

      console.warn('🔧 Unexpected API response structure:', filesData);
      return [];
    },
    enabled: !!ideaId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Hook to get recursive file tree
export const useFileTree = (ideaId: string) => {
  return useQuery({
    queryKey: fileKeys.tree(ideaId),
    queryFn: async (): Promise<FileItem[]> => {
      console.log('🔧 Fetching file tree for idea:', ideaId);
      const response = await api.get(`/ideas/${ideaId}/files/tree`);
      console.log('🔧 Tree API response:', response.data);
      console.log('🔧 Tree data:', response.data.data);

      // Extract the tree array from the response
      const treeData = response.data.data;
      if (treeData && Array.isArray(treeData.tree)) {
        console.log('🔧 Extracted tree array:', treeData.tree);
        return treeData.tree;
      }

      console.warn('🔧 Unexpected tree API response structure:', treeData);
      return [];
    },
    enabled: !!ideaId,
    staleTime: 60 * 1000, // 1 minute (trees change less frequently)
  });
};

// Hook to get file content
export const useFileContent = (ideaId: string, filePath: string | null) => {
  return useQuery<FileContent>({
    queryKey: ['file-content', ideaId, filePath],
    queryFn: () =>
      api
        .get(`/ideas/${ideaId}/file?path=${encodeURIComponent(filePath || '')}`)
        .then((res) => res.data.data),
    enabled: !!ideaId && !!filePath,
  });
};

// Hook to get file versions
export const useFileVersions = (ideaId: string, filePath?: string) => {
  return useQuery({
    queryKey: fileKeys.versions(ideaId, filePath || ''),
    queryFn: async (): Promise<FileVersion[]> => {
      if (!filePath) throw new Error('File path is required');
      const response = await api.get(`/ideas/${ideaId}/files/versions`, {
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
      const response = await api.post(`/ideas/${ideaId}/files`, {
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
      const response = await api.put(`/ideas/${ideaId}/files/content`, {
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

      const response = await api.post(`/ideas/${ideaId}/files/upload`, formData, {
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
      const response = await api.delete(`/ideas/${ideaId}/files`, {
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
      const response = await api.post(`/ideas/${ideaId}/files/restore`, {
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
      const response = await api.post(`/ideas/${ideaId}/files/directory`, {
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
