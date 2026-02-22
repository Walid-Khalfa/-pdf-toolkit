import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const configSchema = z.object({
  port: z.number().default(3001),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  corsOrigin: z.array(z.string()).default(['http://localhost:5173']),
  rateLimitWindowMs: z.number().default(900000),
  rateLimitMaxRequests: z.number().default(100),
  maxFileSizeMb: z.number().default(50),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

function parseCorsOrigins(): string[] {
  const origins = process.env.CORS_ORIGIN
  if (!origins) return ['http://localhost:5173']
  return origins.split(',').map(origin => origin.trim())
}

const rawConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: parseCorsOrigins(),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
}

const parsed = configSchema.safeParse(rawConfig)

if (!parsed.success) {
  console.error('Invalid configuration:', parsed.error.flatten())
  process.exit(1)
}

export const config = parsed.data

export const isDevelopment = config.nodeEnv === 'development'
export const isProduction = config.nodeEnv === 'production'
