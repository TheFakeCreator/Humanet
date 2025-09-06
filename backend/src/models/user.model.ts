import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  karma: number;
  skills: string[];
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
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
  firstName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
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
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    sparse: true
  },
  emailVerificationExpires: {
    type: Date,
    sparse: true
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

// Additional indexes (email and username already have unique indexes from schema)
UserSchema.index({ karma: -1 });

export const UserModel = model<IUser>('User', UserSchema);
