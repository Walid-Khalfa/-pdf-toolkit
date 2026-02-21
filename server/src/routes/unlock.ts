import express from 'express';
import type { Request, Response } from 'express';
import { unlockPdf } from '../services/pdfService.js';
import type { UnlockOptions } from '../types/index.js';

const router = express.Router();

router.post('/unlock', async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required',
      });
    }

    const options: UnlockOptions = {
      password,
    };

    const result = await unlockPdf(file.buffer, options, file.originalname);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  } catch (error) {
    console.error('Unlock error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Invalid password') || errorMessage.includes('encrypted')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password or file is not encrypted',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to unlock PDF',
    });
  }
});

export default router;