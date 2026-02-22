import { describe, it, expect } from 'vitest'
import { mergePdfs } from '@/lib/pdf/merge'
import { PDFDocument } from 'pdf-lib'

describe('mergePdfs', () => {
  const createPdfBuffer = async (): Promise<File> => {
    const pdfDoc = await PDFDocument.create()
    pdfDoc.addPage([612, 792])
    const bytes = await pdfDoc.save()
    return new File([new Uint8Array(bytes).buffer], 'test.pdf', { type: 'application/pdf' })
  }

  it('merges multiple PDFs into one', async () => {
    const file1 = await createPdfBuffer()
    const file2 = await createPdfBuffer()

    const merged = await mergePdfs([file1, file2])

    expect(merged).toBeInstanceOf(Uint8Array)
    expect(merged.length).toBeGreaterThan(0)

    const mergedDoc = await PDFDocument.load(merged)
    expect(mergedDoc.getPageCount()).toBe(2)
  })

  it('handles single PDF', async () => {
    const file = await createPdfBuffer()
    const merged = await mergePdfs([file])

    const mergedDoc = await PDFDocument.load(merged)
    expect(mergedDoc.getPageCount()).toBe(1)
  })
})
