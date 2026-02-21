import express from 'express';
import type { Request, Response } from 'express';
import { protectPdf } from '../services/pdfService.js';
import type { ProtectOptions } from '../types/index.js';

const router = express.Router();

router.post('/protect', async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const { userPassword, ownerPassword, allowPrinting, allowCopying, allowModifying } = req.body;

    if (!userPassword) {
      return res.status(400).json({
        success: false,
        error: 'User password is required',
      });
    }

    const options: ProtectOptions = {
      userPassword,
      ownerPassword: ownerPassword || undefined,
      allowPrinting: allowPrinting === 'true',
      allowCopying: allowCopying === 'true',
      allowModifying: allowModifying === 'true',
    };

    const result = await protectPdf(file.buffer, options, file.originalname);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.buffer);
  } catch (error) {
    console.error('Protect error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to protect PDF',
    });
  }
});

export default router;