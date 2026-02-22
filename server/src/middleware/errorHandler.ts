import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'
import { config } from '../config.js'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class ProcessingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProcessingError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
  const statusCode = getStatusCode(error)
  const message = getErrorMessage(error)

  logger.error(`${req.method} ${req.path}`, {
    error: error.name,
    message: error.message,
    statusCode,
  })

  if (error.message.includes('Only PDF files are allowed')) {
    return res.status(400).json({
      success: false,
      error: 'Only PDF files are allowed',
    })
  }

  if (error.message.includes('File too large')) {
    return res.status(413).json({
      success: false,
      error: `File exceeds the ${config.maxFileSizeMb} MB limit`,
    })
  }

  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  })
}

function getStatusCode(error: Error): number {
  if (error instanceof ValidationError) return 400
  if (error instanceof ProcessingError) return 422
  if (error instanceof NotFoundError) return 404
  if (error.message.includes('Invalid password')) return 401
  return 500
}

function getErrorMessage(error: Error): string {
  if (error instanceof ValidationError) return error.message
  if (error instanceof ProcessingError) return error.message
  if (error instanceof NotFoundError) return error.message
  if (error.message.includes('Invalid password')) return 'Invalid password'
  if (config.nodeEnv === 'production') return 'Internal server error'
  return error.message
}
