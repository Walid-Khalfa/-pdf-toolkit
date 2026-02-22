import type { Response } from 'express'

interface SuccessResponse<T> {
  success: true
  data: T
  requestId?: string
}

interface ErrorResponse {
  success: false
  error: string
  code?: string
  requestId?: string
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  }

  if (res.locals.requestId) {
    response.requestId = res.locals.requestId
  }

  res.status(statusCode).json(response)
}

export function sendError(res: Response, error: string, statusCode = 500, code?: string): void {
  const response: ErrorResponse = {
    success: false,
    error,
  }

  if (code) {
    response.code = code
  }

  if (res.locals.requestId) {
    response.requestId = res.locals.requestId
  }

  res.status(statusCode).json(response)
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const
