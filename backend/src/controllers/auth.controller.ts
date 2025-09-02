import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import config from '../config/index.js';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await AuthService.signup(req.body);
      
      // Set HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        data: { user, token },
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await AuthService.login(req.body);
      
      // Set HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        data: { user, token },
        message: 'Login successful'
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated'
        });
        return;
      }

      const user = await AuthService.getUserById(req.user._id);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.params;
      const user = await AuthService.getUserByUsername(username);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}
