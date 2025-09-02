import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, type IUser } from '../models/index.js';
import { AppError } from '../middlewares/error.middleware.js';
import { SignupInput, LoginInput } from '../validation/auth.schema.js';
import config from '../config/index.js';
import type { UserDTO } from '@humanet/shared';

export class AuthService {
  static async signup(data: SignupInput): Promise<{ user: UserDTO; token: string }> {
    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email: data.email }, { username: data.username }]
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new AppError('Email already registered', 400);
      }
      if (existingUser.username === data.username) {
        throw new AppError('Username already taken', 400);
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      passwordHash,
      bio: data.bio,
      skills: data.skills || [],
      karma: 0
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userDTO: UserDTO = {
      _id: (user._id as any).toString(),
      username: user.username,
      email: user.email,
      bio: user.bio,
      karma: user.karma,
      skills: user.skills,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };

    return { user: userDTO, token };
  }

  static async login(data: LoginInput): Promise<{ user: UserDTO; token: string }> {
    // Find user by email
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    const userDTO: UserDTO = {
      _id: (user._id as any).toString(),
      username: user.username,
      email: user.email,
      bio: user.bio,
      karma: user.karma,
      skills: user.skills,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };

    return { user: userDTO, token };
  }

  static async getUserById(userId: string): Promise<UserDTO> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      _id: (user._id as any).toString(),
      username: user.username,
      email: user.email,
      bio: user.bio,
      karma: user.karma,
      skills: user.skills,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }

  static async getUserByUsername(username: string): Promise<UserDTO> {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      _id: (user._id as any).toString(),
      username: user.username,
      email: user.email,
      bio: user.bio,
      karma: user.karma,
      skills: user.skills,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
}
