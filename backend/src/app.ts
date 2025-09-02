import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import config from './config/index.js';

export function createApp() {
  const app = express();
  
  app.set('trust proxy', true);
  
  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({ 
    origin: config.FRONTEND_URL, 
    credentials: true 
  }));
  
  // Logging
  app.use(morgan('dev'));
  
  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
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
