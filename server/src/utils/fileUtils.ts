import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

export function createTempDir(): string {
  const tempDir = path.join(os.tmpdir(), 'pdf-toolkit', uuidv4());
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

export function cleanupTempFiles(dirPath: string): void {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
}

export function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function generateOutputFilename(originalName: string, suffix: string, ext: string): string {
  const baseName = path.basename(originalName, path.extname(originalName));
  return `${sanitizeFilename(baseName)}_${suffix}_${Date.now()}.${ext}`;
}
