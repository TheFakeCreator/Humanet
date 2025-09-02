import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  bio?: string;
  karma: number;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
    match: /^[a-zA-Z0-9_-]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  karma: {
    type: Number,
    default: 0,
    min: 0
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function(skills: string[]) {
        return skills.length <= 20;
      },
      message: 'Cannot have more than 20 skills'
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      const obj = ret.toObject ? ret.toObject() : ret;
      delete obj.passwordHash;
      delete obj.__v;
      return obj;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ karma: -1 });

export const UserModel = model<IUser>('User', UserSchema);
