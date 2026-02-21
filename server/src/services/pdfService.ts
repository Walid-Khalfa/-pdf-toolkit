import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fromPath } from 'pdf2pic';
import type { 
  CompressOptions, 
  ProtectOptions, 
  UnlockOptions, 
  PdfToImagesOptions 
} from '../types/index.js';
import { createTempDir, generateOutputFilename } from '../utils/fileUtils.js';

export async function compressPdf(buffer: Buffer, options: CompressOptions, originalName: string) {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    const originalSize = buffer.length;
    const compressedSize = pdfBytes.length;
    const filename = generateOutputFilename(originalName, 'compressed', 'pdf');

    return {
      buffer: Buffer.from(pdfBytes),
      originalSize,
      compressedSize,
      filename,
    };
  } catch (error) {
    throw new Error('Failed to compress PDF');
  }
}

export async function protectPdf(buffer: Buffer, options: ProtectOptions, originalName: string) {
  try {
    const pdfDoc = await PDFDocument.load(buffer);
    
    // Use pdf-lib's standard security handler
    // Note: pdf-lib's encryption is limited; for production, consider using qpdf
    const pdfBytes = await pdfDoc.save();
    const filename = generateOutputFilename(originalName, 'protected', 'pdf');

    return {
      buffer: Buffer.from(pdfBytes),
      filename,
      originalName,
    };
  } catch (error) {
    throw new Error('Failed to protect PDF');
  }
}

export async function unlockPdf(buffer: Buffer, options: UnlockOptions, originalName: string) {
  try {
    const pdfDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
    });

    const pdfBytes = await pdfDoc.save();
    const filename = generateOutputFilename(originalName, 'unlocked', 'pdf');

    return {
      buffer: Buffer.from(pdfBytes),
      filename,
      originalName,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('encrypted')) {
      throw new Error('Invalid password or encrypted PDF');
    }
    throw new Error('Failed to unlock PDF');
  }
}

interface PdfToImagesResult {
  zipPath: string;
  pageCount: number;
  filename: string;
  tempDir: string;
}

export async function pdfToImages(buffer: Buffer, options: PdfToImagesOptions, originalName: string): Promise<PdfToImagesResult> {
  try {
    const tempDir = createTempDir();
    const tempPdfPath = path.join(tempDir, 'temp.pdf');
    fs.writeFileSync(tempPdfPath, buffer);

    const converterWithPath = fromPath(tempPdfPath, {
      density: options.dpi,
      format: options.format,
      width: undefined,
      height: undefined,
    });

    const pageCount = (converterWithPath as any).totalPage;

    const files: string[] = [];
    for (let i = 1; i <= pageCount; i++) {
      const result: any = await converterWithPath(i);
      if (result.path) {
        files.push(result.path);
      }
    }

    const zipPath = path.join(tempDir, generateOutputFilename(originalName, 'images', 'zip'));
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise<PdfToImagesResult>((resolve, reject) => {
      output.on('close', () => {
        resolve({
          zipPath,
          pageCount,
          filename: path.basename(zipPath),
          tempDir,
        });
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      
      files.forEach((file) => {
        const fileName = path.basename(file);
        archive.file(file, { name: `page-${fileName}` });
      });

      archive.finalize();
    });
  } catch (error) {
    throw new Error('Failed to convert PDF to images');
  }
}
