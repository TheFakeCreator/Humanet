import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  ideaId: Types.ObjectId;
  authorId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  ideaId: {
    type: Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
CommentSchema.index({ ideaId: 1, createdAt: -1 });
CommentSchema.index({ authorId: 1 });

export const CommentModel = model<IComment>('Comment', CommentSchema);
