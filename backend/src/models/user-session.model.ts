import { Schema, model, Document, Types } from 'mongoose';

export interface IUserSession extends Document {
  userId: Types.ObjectId;
  sessionToken: string;
  refreshToken?: string;
  
  // Device and location info
  deviceInfo: {
    userAgent?: string;
    device?: string;
    os?: string;
    browser?: string;
  };
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  
  // Session status
  isActive: boolean;
  lastActivity: Date;
  expiresAt: Date;
  
  // Security
  loginMethod: 'password' | 'oauth_google' | 'oauth_github' | 'oauth_twitter';
  isTrusted: boolean; // Marked as trusted device
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionToken: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String,
    sparse: true
  },
  deviceInfo: {
    userAgent: String,
    device: String,
    os: String,
    browser: String
  },
  ipAddress: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v);
      },
      message: 'Invalid IP address format'
    }
  },
  location: {
    country: String,
    city: String,
    timezone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  loginMethod: {
    type: String,
    enum: ['password', 'oauth_google', 'oauth_github', 'oauth_twitter'],
    default: 'password'
  },
  isTrusted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      delete ret.sessionToken;
      delete ret.refreshToken;
      return ret;
    }
  }
});

// Indexes
UserSessionSchema.index({ userId: 1, isActive: 1 });
UserSessionSchema.index({ sessionToken: 1 });
UserSessionSchema.index({ refreshToken: 1 }, { sparse: true });
UserSessionSchema.index({ lastActivity: -1 });
UserSessionSchema.index({ expiresAt: 1 });

// Auto-delete expired sessions
UserSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
UserSessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

UserSessionSchema.methods.revoke = function() {
  this.isActive = false;
  return this.save();
};

export const UserSessionModel = model<IUserSession>('UserSession', UserSessionSchema);