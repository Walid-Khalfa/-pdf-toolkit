import { config } from '../config.js'

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

const logLevels: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const currentLevel = logLevels[config.logLevel]

function formatTimestamp(): string {
  return new Date().toISOString()
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (logLevels[level] > currentLevel) return

  const timestamp = formatTimestamp()
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''

  const output = `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`

  if (level === 'error') {
    console.error(output)
  } else if (level === 'warn') {
    console.warn(output)
  } else {
    console.log(output)
  }
}

export const logger = {
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),

  request: (method: string, path: string, statusCode: number, durationMs: number) => {
    log('info', `${method} ${path}`, { statusCode, durationMs: `${durationMs}ms` })
  },
}
