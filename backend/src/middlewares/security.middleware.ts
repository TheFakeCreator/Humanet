import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { Request, Response, NextFunction } from 'express';
import config from '../config/index.js';

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      config.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://humanet.vercel.app',
      'https://www.humanet.com',
      ...(config.CORS_ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [])
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (config.NODE_ENV === 'development') {
        console.warn(`⚠️  CORS origin not allowed: ${origin}`);
        callback(null, true); // Allow in development
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
};

// Security headers configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

// Request sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Remove any keys that start with '$' or contain '.'
  mongoSanitize()(req, res, next);
};

// Request size limiting
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: {
        message: 'Request entity too large',
        code: 'PAYLOAD_TOO_LARGE',
        details: {
          maxSize: '10MB',
          receivedSize: `${Math.round(contentLength / 1024 / 1024)}MB`
        }
      }
    });
  }
  
  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Add API-specific headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  next();
};

// Input validation middleware for common attacks
export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  const params = JSON.stringify(req.params);
  
  // Check for common attack patterns
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:\s*text\/html/gi,
    /%3Cscript/gi,
    /%3C%2Fscript%3E/gi,
    /\$where/gi,
    /\$regex/gi,
    /\$ne/gi,
    /\$in/gi,
    /\$nin/gi,
    /\$or/gi,
    /\$and/gi,
    /\$nor/gi,
    /\$not/gi,
    /\$exists/gi,
    /\$type/gi,
    /\$mod/gi,
    /\$size/gi,
    /\$elemMatch/gi,
    /\$all/gi
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(body) || pattern.test(query) || pattern.test(params)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid input detected',
          code: 'INVALID_INPUT',
          details: {
            reason: 'Potentially malicious content detected'
          }
        }
      });
    }
  }
  
  next();
};

// Request logging for security monitoring
export const securityLogging = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log suspicious activity
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Check for suspicious user agents
  const suspiciousAgents = [
    'sqlmap',
    'nikto',
    'nessus',
    'openvas',
    'nmap',
    'masscan',
    'zap',
    'burp',
    'acunetix',
    'w3af'
  ];
  
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    console.warn(`🚨 Suspicious user agent detected: ${userAgent} from IP: ${ip}`);
    res.setHeader('x-suspicious-activity', 'true');
  }
  
  // Log the request
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      ip,
      userAgent,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString()
    };
    
    // Log errors and slow requests
    if (res.statusCode >= 400 || duration > 5000) {
      console.warn('⚠️  Security event:', logData);
    }
  });
  
  next();
};

// API key validation (for future API versioning)
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  // Skip for now, but structure is in place for future API key requirements
  const apiKey = req.get('X-API-Key');
  
  // For now, just log if an API key is provided
  if (apiKey) {
    console.log('API key provided:', apiKey.substring(0, 8) + '...');
  }
  
  next();
};

// Rate limit headers
export const rateLimitHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Add rate limit headers for client awareness
  res.setHeader('X-RateLimit-Policy', 'General: 100/15min, Auth: 5/15min, Ideas: 10/hour');
  
  next();
};

export default {
  corsOptions,
  helmetConfig,
  sanitizeInput,
  requestSizeLimit,
  securityHeaders,
  inputValidation,
  securityLogging,
  validateApiKey,
  rateLimitHeaders
};
