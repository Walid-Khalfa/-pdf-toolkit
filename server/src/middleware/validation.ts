import { z } from 'zod'
import type { Request, Response, NextFunction } from 'express'
import { ValidationError } from './errorHandler.js'

export const compressSchema = z.object({
  quality: z.enum(['low', 'medium', 'high']).default('medium'),
})

export const protectSchema = z.object({
  userPassword: z.string().min(4, 'Password must be at least 4 characters').max(128),
  ownerPassword: z.string().max(128).optional(),
  allowPrinting: z.union([z.boolean(), z.literal('true'), z.literal('false')]).optional(),
  allowCopying: z.union([z.boolean(), z.literal('true'), z.literal('false')]).optional(),
  allowModifying: z.union([z.boolean(), z.literal('true'), z.literal('false')]).optional(),
})

export const unlockSchema = z.object({
  password: z.string().max(128).optional(),
})

export const pdfToImagesSchema = z.object({
  format: z.enum(['jpg', 'png']).default('png'),
  quality: z.coerce.number().int().min(1).max(100).default(80),
  dpi: z.coerce.number().int().min(72).max(600).default(150),
})

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      return next(new ValidationError(errors.join(', ')))
    }

    req.body = result.data
    next()
  }
}
