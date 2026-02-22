import express from 'express'
import type { Request, Response } from 'express'
import { unlockPdf } from '../services/pdfService.js'
import { upload } from '../middleware/upload.js'
import { validateBody, unlockSchema } from '../middleware/validation.js'
import type { UnlockOptions } from '@shared'

const router = express.Router()

router.post(
  '/unlock',
  upload.single('file'),
  validateBody(unlockSchema),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        })
      }

      const { password } = req.body
      const options: UnlockOptions = { password: password || '' }

      const result = await unlockPdf(req.file.buffer, options, req.file.originalname)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)

      if (!result.usedQpdf) {
        res.setHeader('X-Unlock-Warning', 'qpdf not available - using basic decryption')
      }

      res.send(result.buffer)
    } catch (error) {
      console.error('Unlock error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (errorMessage.includes('Invalid password') || errorMessage.includes('encrypted')) {
        return res.status(401).json({
          success: false,
          error: 'Invalid password or file cannot be decrypted',
        })
      }

      res.status(500).json({
        success: false,
        error: 'Failed to unlock PDF',
      })
    }
  }
)

export default router
