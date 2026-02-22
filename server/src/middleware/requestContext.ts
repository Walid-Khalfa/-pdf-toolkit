import { randomUUID } from 'crypto'
import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger.js'

export interface RequestWithId extends Request {
  requestId: string
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID()
  ;(req as RequestWithId).requestId = requestId
  res.setHeader('X-Request-Id', requestId)
  next()
}

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.request(req.method, req.path, res.statusCode, duration)
  })

  next()
}
