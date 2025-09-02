import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        username: string;
        email: string;
        karma: number;
      };
    }
  }
}

// General rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Increase attempts for successful authentications
  skipSuccessfulRequests: true
});

// Password reset rate limiting
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    error: {
      message: 'Too many password reset attempts, please try again later.',
      code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED'
    }
  }
});

// Create ideas rate limiting
export const createIdeaLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 idea creations per hour
  message: {
    success: false,
    error: {
      message: 'Too many ideas created, please try again later.',
      code: 'IDEA_CREATION_RATE_LIMIT_EXCEEDED'
    }
  },
  keyGenerator: (req: Request) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return req.user?._id || req.ip || 'unknown';
  }
});

// Comment creation rate limiting
export const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each user to 20 comments per 15 minutes
  message: {
    success: false,
    error: {
      message: 'Too many comments posted, please slow down.',
      code: 'COMMENT_RATE_LIMIT_EXCEEDED'
    }
  },
  keyGenerator: (req: Request) => {
    return req.user?._id || req.ip || 'unknown';
  }
});

// Upvote rate limiting to prevent spam
export const upvoteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each user to 30 upvotes per minute
  message: {
    success: false,
    error: {
      message: 'Too many upvotes, please slow down.',
      code: 'UPVOTE_RATE_LIMIT_EXCEEDED'
    }
  },
  keyGenerator: (req: Request) => {
    return req.user?._id || req.ip || 'unknown';
  }
});

// Slow down repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes at full speed
  delayMs: 100, // Add 100ms of delay per request after delayAfter
  maxDelayMs: 2000, // Maximum delay of 2 seconds
  skip: (req: Request) => {
    return req.path === '/health';
  }
});

// Advanced rate limiting for suspicious activity
export const suspiciousActivityLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1, // Only 1 request per hour for flagged IPs
  message: {
    success: false,
    error: {
      message: 'Your account has been temporarily restricted due to suspicious activity.',
      code: 'SUSPICIOUS_ACTIVITY_DETECTED'
    }
  },
  skip: (req: Request) => {
    // This would be used selectively based on security flags
    return !req.headers['x-suspicious-activity'];
  }
});

// Custom middleware to track failed attempts
interface FailedAttempt {
  count: number;
  lastAttempt: Date;
  blocked: boolean;
  blockUntil?: Date;
}

const failedAttempts = new Map<string, FailedAttempt>();

export const trackFailedAuthAttempts = (req: Request, res: Response, next: NextFunction) => {
  const identifier = req.ip || 'unknown';
  const now = new Date();
  
  // Clean up old entries (older than 24 hours)
  for (const [key, attempt] of failedAttempts.entries()) {
    if (now.getTime() - attempt.lastAttempt.getTime() > 24 * 60 * 60 * 1000) {
      failedAttempts.delete(key);
    }
  }
  
  const attempt = failedAttempts.get(identifier);
  
  if (attempt?.blocked && attempt.blockUntil && now < attempt.blockUntil) {
    return res.status(429).json({
      success: false,
      error: {
        message: 'Account temporarily blocked due to too many failed attempts.',
        code: 'ACCOUNT_BLOCKED',
        details: {
          blockUntil: attempt.blockUntil.toISOString()
        }
      }
    });
  }
  
  // Store original res.json to intercept responses
  const originalJson = res.json;
  res.json = function(data: any) {
    if (!data.success && (data.error?.code === 'INVALID_CREDENTIALS' || data.error?.code === 'UNAUTHORIZED')) {
      // Failed authentication attempt
      const currentAttempt = failedAttempts.get(identifier) || { count: 0, lastAttempt: now, blocked: false };
      currentAttempt.count += 1;
      currentAttempt.lastAttempt = now;
      
      // Block after 5 failed attempts
      if (currentAttempt.count >= 5) {
        currentAttempt.blocked = true;
        currentAttempt.blockUntil = new Date(now.getTime() + 30 * 60 * 1000); // Block for 30 minutes
      }
      
      failedAttempts.set(identifier, currentAttempt);
    } else if (data.success) {
      // Successful authentication, reset failed attempts
      failedAttempts.delete(identifier);
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

export default {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  createIdeaLimiter,
  commentLimiter,
  upvoteLimiter,
  speedLimiter,
  suspiciousActivityLimiter,
  trackFailedAuthAttempts
};
