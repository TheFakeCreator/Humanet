import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index.js';
import { AppError } from './error.middleware.js';
import config from '../config/index.js';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    email: string;
    karma: number;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in cookies first (HttpOnly)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // Fallback to Authorization header
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    
    // Get user from database
    const user = await UserModel.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Attach user to request
    req.user = {
      _id: (user._id as any).toString(),
      username: user.username,
      email: user.email,
      karma: user.karma,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET) as any;
      const user = await UserModel.findById(decoded.userId).select('-passwordHash');
      
      if (user) {
        req.user = {
          _id: (user._id as any).toString(),
          username: user.username,
          email: user.email,
          karma: user.karma,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};
