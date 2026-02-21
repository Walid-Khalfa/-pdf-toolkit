import express from 'express';
import type { Request, Response } from 'express';
import { compressPdf } from '../services/pdfService.js';
import { cleanupTempFiles } from '../utils/fileUtils.js';
import { upload } from '../middleware/upload.js';
import type { CompressionQuality } from '../types/index.js';

const router = express.Router();

router.post('/compress', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const quality = (req.body.quality as CompressionQuality) || 'medium';
    
    if (!['low', 'medium', 'high'].includes(quality)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quality. Must be low, medium, or high',
      });
    }

    const result = await compressPdf(req.file.buffer, { quality }, req.file.originalname);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  } catch (error) {
    console.error('Compress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compress PDF',
    });
  }
});

export default router;