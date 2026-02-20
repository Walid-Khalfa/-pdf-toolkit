import { PDFDocument } from 'pdf-lib'
import { readFileAsArrayBuffer } from '@/lib/utils/fileUtils'

export interface SplitResult {
  bytes: Uint8Array
  name: string
}

export async function splitPdfByRanges(
  file: File,
  ranges: { from: number; to: number }[],
): Promise<SplitResult[]> {
  const buffer = await readFileAsArrayBuffer(file)
  const source = await PDFDocument.load(buffer)
  const results: SplitResult[] = []

  for (let i = 0; i < ranges.length; i++) {
    const { from, to } = ranges[i]
    const doc = await PDFDocument.create()
    const indices = Array.from({ length: to - from + 1 }, (_, k) => from - 1 + k)
    const pages = await doc.copyPages(source, indices)
    pages.forEach((page) => doc.addPage(page))
    const bytes = await doc.save()
    const label = ranges.length === 1 ? 'split' : `part-${i + 1}`
    results.push({ bytes, name: `${file.name.replace('.pdf', '')}-${label}.pdf` })
  }

  return results
}

export async function splitPdfIntoPages(file: File): Promise<SplitResult[]> {
  const buffer = await readFileAsArrayBuffer(file)
  const source = await PDFDocument.load(buffer)
  const total = source.getPageCount()
  const results: SplitResult[] = []

  for (let i = 0; i < total; i++) {
    const doc = await PDFDocument.create()
    const [page] = await doc.copyPages(source, [i])
    doc.addPage(page)
    const bytes = await doc.save()
    results.push({ bytes, name: `${file.name.replace('.pdf', '')}-page-${i + 1}.pdf` })
  }

  return results
}

export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await readFileAsArrayBuffer(file)
  const doc = await PDFDocument.load(buffer)
  return doc.getPageCount()
}
