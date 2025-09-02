export interface CommentDTO {
  _id?: string;
  ideaId: string;
  authorId: string;
  author?: {
    _id: string;
    username: string;
    karma: number;
  };
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCommentDTO {
  ideaId: string;
  text: string;
}

export interface UpdateCommentDTO {
  text: string;
}
