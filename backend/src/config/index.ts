import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  MONGO_URL: z.string().min(1, 'MONGO_URL is required').or(
    z.string().min(1, 'MONGODB_URI is required')
  ),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL').or(
    z.string().url('CORS_ORIGIN must be a valid URL')
  ),
  
  // Security configuration
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  AUTH_RATE_LIMIT_MAX: z.string().transform(Number).default('5'),
  ENABLE_RATE_LIMITING: z.string().transform((val) => val === 'true').default('true'),
  ENABLE_SECURITY_HEADERS: z.string().transform((val) => val === 'true').default('true'),
  ENABLE_CORS: z.string().transform((val) => val === 'true').default('true'),
  TRUST_PROXY: z.string().transform((val) => val === 'true').default('true'),
  
  // CORS allowed origins (comma-separated)
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  
  // Security monitoring
  LOG_SECURITY_EVENTS: z.string().transform((val) => val === 'true').default('true'),
  BLOCK_SUSPICIOUS_IPS: z.string().transform((val) => val === 'true').default('false'),
});

// Parse environment variables with fallbacks
const rawEnv = {
  ...process.env,
  MONGO_URL: process.env.MONGO_URL || process.env.MONGODB_URI,
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.CORS_ORIGIN,
};

export const config = envSchema.parse(rawEnv);

export default config;
