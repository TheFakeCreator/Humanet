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
  
  // Profile enhancements
  avatar?: string; // URL to profile picture
  location?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  
  // Activity tracking
  lastActive: Date;
  isOnline: boolean;
  
  // Statistics
  totalIdeas: number;
  totalComments: number;
  totalUpvotesGiven: number;
  totalUpvotesReceived: number;
  
  // Preferences
  emailNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  
  // Account status
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
  
  // Verification levels
  isVerified: boolean; // Platform verified (blue checkmark)
  verificationBadges: string[]; // ['expert', 'contributor', 'mentor']
  
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
  },
  
  // Profile enhancements
  avatar: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Avatar must be a valid image URL'
    }
  },
  location: {
    type: String,
    maxlength: 100,
    trim: true
  },
  website: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+$/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/.test(v);
      },
      message: 'GitHub URL must be valid'
    }
  },
  linkedinUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+$/.test(v);
      },
      message: 'LinkedIn URL must be valid'
    }
  },
  twitterUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Twitter/X URL must be valid'
    }
  },
  
  // Activity tracking
  lastActive: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  totalIdeas: {
    type: Number,
    default: 0,
    min: 0
  },
  totalComments: {
    type: Number,
    default: 0,
    min: 0
  },
  totalUpvotesGiven: {
    type: Number,
    default: 0,
    min: 0
  },
  totalUpvotesReceived: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Preferences
  emailNotifications: {
    type: Boolean,
    default: true
  },
  profileVisibility: {
    type: String,
    enum: ['public', 'private', 'friends'],
    default: 'public'
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    maxlength: 500
  },
  banExpiresAt: {
    type: Date
  },
  
  // Verification levels
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationBadges: {
    type: [String],
    default: [],
    validate: {
      validator: function(badges: string[]) {
        const validBadges = ['expert', 'contributor', 'mentor', 'early-adopter', 'top-creator'];
        return badges.every(badge => validBadges.includes(badge));
      },
      message: 'Invalid verification badge'
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

// Additional indexes (email and username already have unique indexes from schema)
UserSchema.index({ karma: -1 });
UserSchema.index({ lastActive: -1 });
UserSchema.index({ isOnline: 1 });
UserSchema.index({ totalIdeas: -1 });
UserSchema.index({ location: 1 });
UserSchema.index({ skills: 1 });
UserSchema.index({ verificationBadges: 1 });
UserSchema.index({ isActive: 1, isBanned: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

// Method to check if user is currently online (active within last 5 minutes)
UserSchema.methods.isCurrentlyOnline = function() {
  return this.isOnline && (Date.now() - this.lastActive.getTime()) < 5 * 60 * 1000;
};

// Method to update activity
UserSchema.methods.updateActivity = function() {
  this.lastActive = new Date();
  this.isOnline = true;
  return this.save();
};

export const UserModel = model<IUser>('User', UserSchema);
