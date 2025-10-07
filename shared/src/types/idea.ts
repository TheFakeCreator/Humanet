export interface IdeaDTO {
  _id?: string;
  title: string;
  description: string;
  tags?: string[];
  domain?: string[];
  authorId: string;
  author?: {
    _id: string;
    username: string;
    karma: number;
  };
  parentId?: string | null;
  parent?: {
    _id: string;
    title: string;
    author: {
      username: string;
    };
  };
  upvotes?: number;
  upvoters?: string[];
  hasUpvoted?: boolean; // Whether current user has upvoted
  forkCount?: number;
  children?: IdeaDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIdeaDTO {
  title: string;
  description: string;
  tags?: string[];
  domain?: string[];
  parentId?: string | null;
  autoCreateRepository?: boolean;
  repositoryTemplate?: 'basic' | 'research' | 'technical';
}

export interface UpdateIdeaDTO {
  title?: string;
  description?: string;
  tags?: string[];
  domain?: string[];
}

export interface IdeaSearchParams {
  search?: string;
  domain?: string[];
  tags?: string[];
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'upvotes' | 'forkCount';
  sortOrder?: 'asc' | 'desc';
}

export interface IdeaTreeNode {
  _id: string;
  title: string;
  description: string;
  author: {
    _id: string;
    username: string;
  };
  upvotes: number;
  forkCount: number;
  createdAt: string;
  children: IdeaTreeNode[];
}
