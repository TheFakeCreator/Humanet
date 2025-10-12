import { Schema, model, Document, Types } from 'mongoose';

export interface IAdoptionRequest extends Document {
  ideaId: Types.ObjectId;
  requesterId: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'expired';

  // Request details
  message: string; // Why they want to adopt
  qualifications: string; // Their relevant skills/experience
  proposedChanges: string; // What they plan to do with the idea
  timeline: string; // Expected timeline for development

  // Timestamps
  requestedAt: Date;
  respondedAt?: Date;
  expiresAt: Date; // Auto-expire after 30 days

  // Response from original creator
  response?: {
    approved: boolean;
    message?: string;
    respondedBy: Types.ObjectId;
    respondedAt: Date;
  };

  // For democratic voting scenarios
  votingData?: {
    isVotingCandidate: boolean;
    votesReceived: number;
    supportingReasons: string[];
  };

  createdAt: Date;
  updatedAt: Date;

  // Methods
  isExpired(): boolean;
  canWithdraw(userId: Types.ObjectId): boolean;
  approve(responderId: Types.ObjectId, message?: string): Promise<IAdoptionRequest>;
  reject(responderId: Types.ObjectId, message?: string): Promise<IAdoptionRequest>;
}

const AdoptionRequestSchema = new Schema<IAdoptionRequest>(
  {
    ideaId: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      required: true,
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'withdrawn', 'expired'],
      default: 'pending',
    },

    // Request details
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    qualifications: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    proposedChanges: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    timeline: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    // Timestamps
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      },
    },

    // Response from original creator
    response: {
      approved: {
        type: Boolean,
      },
      message: {
        type: String,
        maxlength: 500,
      },
      respondedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: {
        type: Date,
      },
    },

    // For democratic voting scenarios
    votingData: {
      isVotingCandidate: {
        type: Boolean,
        default: false,
      },
      votesReceived: {
        type: Number,
        default: 0,
      },
      supportingReasons: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc: any, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
AdoptionRequestSchema.index({ ideaId: 1, status: 1 });
AdoptionRequestSchema.index({ requesterId: 1, status: 1 });
AdoptionRequestSchema.index({ status: 1, expiresAt: 1 });
AdoptionRequestSchema.index({ requestedAt: -1 });

// Compound indexes
AdoptionRequestSchema.index({ ideaId: 1, requesterId: 1 }, { unique: true }); // Prevent duplicate requests
AdoptionRequestSchema.index({ status: 1, expiresAt: 1, requestedAt: -1 });

// Methods
AdoptionRequestSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

AdoptionRequestSchema.methods.canWithdraw = function (userId: Types.ObjectId) {
  return this.requesterId.equals(userId) && this.status === 'pending';
};

AdoptionRequestSchema.methods.approve = function (responderId: Types.ObjectId, message?: string) {
  this.status = 'approved';
  this.respondedAt = new Date();
  this.response = {
    approved: true,
    message: message || '',
    respondedBy: responderId,
    respondedAt: new Date(),
  };
  return this.save();
};

AdoptionRequestSchema.methods.reject = function (responderId: Types.ObjectId, message?: string) {
  this.status = 'rejected';
  this.respondedAt = new Date();
  this.response = {
    approved: false,
    message: message || '',
    respondedBy: responderId,
    respondedAt: new Date(),
  };
  return this.save();
};

// Pre-save middleware to handle expiration
AdoptionRequestSchema.pre<IAdoptionRequest>('save', function (next) {
  if (this.status === 'pending' && this.isExpired()) {
    this.status = 'expired';
  }
  next();
});

export const AdoptionRequestModel = model<IAdoptionRequest>(
  'AdoptionRequest',
  AdoptionRequestSchema
);
