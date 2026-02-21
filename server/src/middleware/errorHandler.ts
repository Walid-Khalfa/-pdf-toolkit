import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProcessingError';
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof ProcessingError) {
    return res.status(422).json({
      success: false,
      error: error.message,
    });
  }

  if (error.message.includes('Only PDF files are allowed')) {
    return res.status(400).json({
      success: false,
      error: 'Only PDF files are allowed',
    });
  }

  if (error.message.includes('File too large')) {
    return res.status(413).json({
      success: false,
      error: 'File exceeds the 50 MB limit',
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}