import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import config from './config/index.js';

// Import security middleware
import {
  corsOptions,
  helmetConfig,
  sanitizeInput,
  requestSizeLimit,
  securityHeaders,
  inputValidation,
  securityLogging,
  validateApiKey,
  rateLimitHeaders
} from './middlewares/security.middleware.js';

// Import rate limiting middleware
import {
  generalLimiter,
  speedLimiter,
  trackFailedAuthAttempts
} from './middlewares/rate-limit.middleware.js';

export function createApp() {
  const app = express();
  
  app.set('trust proxy', true);
  
  // Security logging (should be first)
  app.use(securityLogging);
  
  // Security headers
  app.use(securityHeaders);
  
  // Helmet security middleware with custom config
  app.use(helmetConfig);
  
  // CORS with enhanced configuration
  app.use(cors(corsOptions));
  
  // Rate limiting
  app.use(generalLimiter);
  app.use(speedLimiter);
  app.use(rateLimitHeaders);
  
  // Request size limiting
  app.use(requestSizeLimit);
  
  // Input sanitization and validation
  app.use(sanitizeInput);
  app.use(inputValidation);
  
  // API key validation (future-proofing)
  app.use(validateApiKey);
  
  // Track failed auth attempts
  app.use('/api/auth', trackFailedAuthAttempts);
  
  // Logging
  app.use(morgan('combined', {
    skip: (req, res) => req.path === '/health'
  }));
  
  // Body parsing with security considerations
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      // Store raw body for webhook verification if needed
      (req as any).rawBody = buf;
    }
  }));
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb',
    parameterLimit: 100 // Limit number of parameters
  }));
  app.use(cookieParser());
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // API routes
  app.use('/api', routes);
  
  // Error handling
  app.use(errorHandler);
  
  return app;
}
