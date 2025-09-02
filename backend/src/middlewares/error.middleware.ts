import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  // MongoDB duplicate key error
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const message = `${field} already exists`;
    res.status(400).json({
      success: false,
      error: message,
      message: message,
      statusCode: 400,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map((error: any) => error.message);
    const message = messages.join('. ');
    res.status(400).json({
      success: false,
      error: message,
      message: message,
      statusCode: 400,
    });
    return;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    res.status(400).json({
      success: false,
      error: message,
      message: message,
      statusCode: 400,
    });
    return;
  }

  // Default error
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong',
    statusCode: 500,
  });
};
