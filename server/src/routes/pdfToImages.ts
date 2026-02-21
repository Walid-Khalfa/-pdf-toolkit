import express from 'express';
import type { Request, Response } from 'express';
import { pdfToImages } from '../services/pdfService.js';
import { cleanupTempFiles } from '../utils/fileUtils.js';
import type { ImageFormat } from '../types/index.js';

const router = express.Router();

router.post('/pdf-to-images', async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const format = (req.body.format as ImageFormat) || 'png';
    const quality = parseInt(req.body.quality as string, 10) || 80;
    const dpi = parseInt(req.body.dpi as string, 10) || 150;

    if (!['jpg', 'png'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format. Must be jpg or png',
      });
    }

    const result = await pdfToImages(
      file.buffer,
      { format, quality, dpi },
      file.originalname
    ) as { zipPath: string; pageCount: number; filename: string; tempDir: string };

    res.download(result.zipPath, result.filename, (err) => {
      cleanupTempFiles(result.tempDir);
      if (err) {
        console.error('Download error:', err);
      }
    });
  } catch (error) {
    console.error('PDF to images error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to convert PDF to images',
    });
  }
});

export default router;