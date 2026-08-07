import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  status?: number;
  errorCode?: string;
}

export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const errorCode = err.errorCode || 'internal_error';
  const message = err.message || 'An unexpected error occurred';

  res.status(status).json({
    error: errorCode,
    message,
    status,
  });
}

export class ValidationError extends Error implements ApiError {
  status = 400;
  errorCode = 'validation_error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends Error implements ApiError {
  status = 404;
  errorCode = 'not_found';

  constructor(message: string = 'Resource not found') {
    super(message);
  }
}

export class ForbiddenError extends Error implements ApiError {
  status = 403;
  errorCode = 'forbidden';

  constructor(message: string = 'Access denied') {
    super(message);
  }
}

export class RateLimitError extends Error implements ApiError {
  status = 429;
  errorCode = 'rate_limit_exceeded';

  constructor(message: string = 'Too many requests') {
    super(message);
  }
}
