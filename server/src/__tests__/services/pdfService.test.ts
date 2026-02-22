import { describe, it, expect, vi } from 'vitest'
import { compressPdf } from '../../services/pdfService.js'
import { PDFDocument } from 'pdf-lib'

vi.mock('../../utils/ghostscript.js', () => ({
  isGhostscriptAvailable: vi.fn(() => Promise.resolve(false)),
  compressWithGhostscript: vi.fn(),
}))

describe('pdfService', () => {
  const createPdfBuffer = async (): Promise<Buffer> => {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.addPage([612, 792])
    const bytes = await pdfDoc.save()
    return Buffer.from(bytes)
  }

  describe('compressPdf', () => {
    it('compresses a PDF and returns result', async () => {
      const buffer = await createPdfBuffer()
      const result = await compressPdf(buffer, { quality: 'medium' }, 'test.pdf')

      expect(result).toHaveProperty('buffer')
      expect(result).toHaveProperty('originalSize')
      expect(result).toHaveProperty('compressedSize')
      expect(result).toHaveProperty('filename')
      expect(result).toHaveProperty('usedGhostscript')
      expect(result.filename).toContain('compressed')
      expect(result.usedGhostscript).toBe(false)
    })

    it('reports original and compressed size', async () => {
      const buffer = await createPdfBuffer()
      const result = await compressPdf(buffer, { quality: 'medium' }, 'test.pdf')

      expect(result.originalSize).toBe(buffer.length)
      expect(result.compressedSize).toBeGreaterThan(0)
    })
  })
})
