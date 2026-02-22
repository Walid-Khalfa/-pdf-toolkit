import express from 'express'
import type { Request, Response } from 'express'
import { pdfToImages } from '../services/pdfService.js'
import { cleanupTempFiles } from '../utils/fileUtils.js'
import { upload } from '../middleware/upload.js'
import { validateBody, pdfToImagesSchema } from '../middleware/validation.js'
import type { PdfToImagesOptions } from '@shared'

const router = express.Router()

router.post(
  '/pdf-to-images',
  upload.single('file'),
  validateBody(pdfToImagesSchema),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        })
      }

      const { format, quality, dpi } = req.body

      const options: PdfToImagesOptions = { format, quality, dpi }

      const result = (await pdfToImages(req.file.buffer, options, req.file.originalname)) as {
        zipPath: string
        pageCount: number
        filename: string
        tempDir: string
      }

      res.download(result.zipPath, result.filename, err => {
        cleanupTempFiles(result.tempDir)
        if (err) {
          console.error('Download error:', err)
        }
      })
    } catch (error) {
      console.error('PDF to images error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to convert PDF to images',
      })
    }
  }
)

export default router
