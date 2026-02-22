import express from 'express'
import type { Request, Response } from 'express'
import { protectPdf } from '../services/pdfService.js'
import { upload } from '../middleware/upload.js'
import { validateBody, protectSchema } from '../middleware/validation.js'
import type { ProtectOptions } from '@shared'

const router = express.Router()

router.post(
  '/protect',
  upload.single('file'),
  validateBody(protectSchema),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        })
      }

      const { userPassword, ownerPassword, allowPrinting, allowCopying, allowModifying } = req.body

      const options: ProtectOptions = {
        userPassword,
        ownerPassword: ownerPassword || undefined,
        allowPrinting: allowPrinting === true || allowPrinting === 'true',
        allowCopying: allowCopying === true || allowCopying === 'true',
        allowModifying: allowModifying === true || allowModifying === 'true',
      }

      const result = await protectPdf(req.file.buffer, options, req.file.originalname)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)

      if (!result.usedQpdf) {
        res.setHeader('X-Protection-Warning', 'qpdf not available - PDF not actually encrypted')
      }

      res.send(result.buffer)
    } catch (error) {
      console.error('Protect error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to protect PDF',
      })
    }
  }
)

export default router
