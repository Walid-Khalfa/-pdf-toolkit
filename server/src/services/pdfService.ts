import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { fromPath } from 'pdf2pic'
import type { CompressOptions, ProtectOptions, UnlockOptions, PdfToImagesOptions } from '@shared'
import { createTempDir, generateOutputFilename } from '../utils/fileUtils.js'
import { compressWithGhostscript, isGhostscriptAvailable } from '../utils/ghostscript.js'
import { protectWithQpdf, unlockWithQpdf, isQpdfAvailable } from '../utils/qpdf.js'

async function compressWithPdfLib(buffer: Buffer): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer)
  return pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })
}

export async function compressPdf(
  buffer: Buffer,
  options: CompressOptions,
  originalName: string
): Promise<{
  buffer: Buffer
  originalSize: number
  compressedSize: number
  filename: string
  usedGhostscript: boolean
}> {
  const originalSize = buffer.length
  const tempDir = createTempDir()

  try {
    if (await isGhostscriptAvailable()) {
      const inputPath = path.join(tempDir, 'input.pdf')
      const outputPath = path.join(tempDir, 'output.pdf')

      fs.writeFileSync(inputPath, buffer)
      await compressWithGhostscript(inputPath, outputPath, options.quality)

      const compressedBuffer = fs.readFileSync(outputPath)
      const filename = generateOutputFilename(originalName, 'compressed', 'pdf')

      return {
        buffer: compressedBuffer,
        originalSize,
        compressedSize: compressedBuffer.length,
        filename,
        usedGhostscript: true,
      }
    }

    const pdfBytes = await compressWithPdfLib(buffer)
    const filename = generateOutputFilename(originalName, 'compressed', 'pdf')

    return {
      buffer: Buffer.from(pdfBytes),
      originalSize,
      compressedSize: pdfBytes.length,
      filename,
      usedGhostscript: false,
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

export async function protectPdf(
  buffer: Buffer,
  options: ProtectOptions,
  originalName: string
): Promise<{ buffer: Buffer; filename: string; originalName: string; usedQpdf: boolean }> {
  const tempDir = createTempDir()

  try {
    if (await isQpdfAvailable()) {
      const inputPath = path.join(tempDir, 'input.pdf')
      const outputPath = path.join(tempDir, 'output.pdf')

      fs.writeFileSync(inputPath, buffer)
      await protectWithQpdf(inputPath, outputPath, options)

      const protectedBuffer = fs.readFileSync(outputPath)
      const filename = generateOutputFilename(originalName, 'protected', 'pdf')

      return {
        buffer: protectedBuffer,
        filename,
        originalName,
        usedQpdf: true,
      }
    }

    const pdfDoc = await PDFDocument.load(buffer)
    const pdfBytes = await pdfDoc.save()
    const filename = generateOutputFilename(originalName, 'protected', 'pdf')

    console.warn('qpdf not available - PDF saved without actual encryption')

    return {
      buffer: Buffer.from(pdfBytes),
      filename,
      originalName,
      usedQpdf: false,
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

export async function unlockPdf(
  buffer: Buffer,
  options: UnlockOptions,
  originalName: string
): Promise<{ buffer: Buffer; filename: string; originalName: string; usedQpdf: boolean }> {
  const tempDir = createTempDir()

  try {
    if (await isQpdfAvailable()) {
      const inputPath = path.join(tempDir, 'input.pdf')
      const outputPath = path.join(tempDir, 'output.pdf')

      fs.writeFileSync(inputPath, buffer)
      await unlockWithQpdf(inputPath, outputPath, options.password)

      const unlockedBuffer = fs.readFileSync(outputPath)
      const filename = generateOutputFilename(originalName, 'unlocked', 'pdf')

      return {
        buffer: unlockedBuffer,
        filename,
        originalName,
        usedQpdf: true,
      }
    }

    const pdfDoc = await PDFDocument.load(buffer, {
      ignoreEncryption: true,
    })

    const pdfBytes = await pdfDoc.save()
    const filename = generateOutputFilename(originalName, 'unlocked', 'pdf')

    return {
      buffer: Buffer.from(pdfBytes),
      filename,
      originalName,
      usedQpdf: false,
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

interface PdfToImagesResult {
  zipPath: string
  pageCount: number
  filename: string
  tempDir: string
}

export async function pdfToImages(
  buffer: Buffer,
  options: PdfToImagesOptions,
  originalName: string
): Promise<PdfToImagesResult> {
  try {
    const tempDir = createTempDir()
    const tempPdfPath = path.join(tempDir, 'temp.pdf')
    fs.writeFileSync(tempPdfPath, buffer)

    const converterWithPath = fromPath(tempPdfPath, {
      density: options.dpi,
      format: options.format,
      width: undefined,
      height: undefined,
    })

    const pageCount = (converterWithPath as unknown as { totalPage: number }).totalPage

    const files: string[] = []
    for (let i = 1; i <= pageCount; i++) {
      const result = await (converterWithPath as (page: number) => Promise<{ path: string }>)(i)
      if (result.path) {
        files.push(result.path)
      }
    }

    const zipPath = path.join(tempDir, generateOutputFilename(originalName, 'images', 'zip'))
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    return new Promise<PdfToImagesResult>((resolve, reject) => {
      output.on('close', () => {
        resolve({
          zipPath,
          pageCount,
          filename: path.basename(zipPath),
          tempDir,
        })
      })

      archive.on('error', err => {
        reject(err)
      })

      archive.pipe(output)

      files.forEach(file => {
        const fileName = path.basename(file)
        archive.file(file, { name: `page-${fileName}` })
      })

      archive.finalize()
    })
  } catch {
    throw new Error('Failed to convert PDF to images')
  }
}
