import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from './config.js'
import { logger } from './utils/logger.js'
import { securityHeaders, apiRateLimiter, uploadRateLimiter } from './middleware/security.js'
import { requestIdMiddleware, requestLoggerMiddleware } from './middleware/requestContext.js'
import compressRouter from './routes/compress.js'
import protectRouter from './routes/protect.js'
import unlockRouter from './routes/unlock.js'
import pdfToImagesRouter from './routes/pdfToImages.js'
import { errorHandler } from './middleware/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(requestIdMiddleware)
app.use(requestLoggerMiddleware)

app.use(securityHeaders)

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
)

app.use(express.json({ limit: `${config.maxFileSizeMb}mb` }))
app.use(express.urlencoded({ extended: true, limit: `${config.maxFileSizeMb}mb` }))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    phase: 2,
    version: '1.0.0',
    env: config.nodeEnv,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', apiRateLimiter)

app.use('/api', uploadRateLimiter, compressRouter)
app.use('/api', uploadRateLimiter, protectRouter)
app.use('/api', uploadRateLimiter, unlockRouter)
app.use('/api', uploadRateLimiter, pdfToImagesRouter)

if (config.nodeEnv === 'production') {
  const clientPath = join(__dirname, '../../client/dist')
  app.use(express.static(clientPath))

  app.get('*', (_req, res) => {
    res.sendFile(join(clientPath, 'index.html'))
  })
}

app.use(errorHandler)

app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`, {
    env: config.nodeEnv,
    corsOrigins: config.corsOrigin,
  })
})
