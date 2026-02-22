import { describe, it, expect } from 'vitest'
import { splitPdfByRanges, splitPdfIntoPages, getPdfPageCount } from '@/lib/pdf/split'
import { PDFDocument } from 'pdf-lib'

describe('splitPdf', () => {
  const createMultiPagePdf = async (pageCount: number): Promise<File> => {
    const pdfDoc = await PDFDocument.create()
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.addPage([612, 792])
    }
    const bytes = await pdfDoc.save()
    return new File([new Uint8Array(bytes).buffer], 'test.pdf', { type: 'application/pdf' })
  }

  describe('getPdfPageCount', () => {
    it('returns correct page count', async () => {
      const file = await createMultiPagePdf(5)
      const count = await getPdfPageCount(file)
      expect(count).toBe(5)
    })

    it('returns 1 for single page PDF', async () => {
      const file = await createMultiPagePdf(1)
      const count = await getPdfPageCount(file)
      expect(count).toBe(1)
    })
  })

  describe('splitPdfByRanges', () => {
    it('splits PDF by specified range', async () => {
      const file = await createMultiPagePdf(5)
      const results = await splitPdfByRanges(file, [{ from: 1, to: 2 }])

      expect(results).toHaveLength(1)
      expect(results[0].name).toContain('split')

      const doc = await PDFDocument.load(results[0].bytes)
      expect(doc.getPageCount()).toBe(2)
    })

    it('splits PDF into multiple parts', async () => {
      const file = await createMultiPagePdf(6)
      const results = await splitPdfByRanges(file, [
        { from: 1, to: 2 },
        { from: 3, to: 4 },
        { from: 5, to: 6 },
      ])

      expect(results).toHaveLength(3)
      expect(results[0].name).toContain('part-1')
      expect(results[1].name).toContain('part-2')
      expect(results[2].name).toContain('part-3')
    })
  })

  describe('splitPdfIntoPages', () => {
    it('splits PDF into individual pages', async () => {
      const file = await createMultiPagePdf(3)
      const results = await splitPdfIntoPages(file)

      expect(results).toHaveLength(3)
      expect(results[0].name).toContain('page-1')
      expect(results[1].name).toContain('page-2')
      expect(results[2].name).toContain('page-3')

      for (const result of results) {
        const doc = await PDFDocument.load(result.bytes)
        expect(doc.getPageCount()).toBe(1)
      }
    })
  })
})
