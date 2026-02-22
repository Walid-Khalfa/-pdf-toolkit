import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config, isProduction } from '../config.js'

export const securityHeaders = helmet({
  contentSecurityPolicy: isProduction
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
})

export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many file uploads, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
