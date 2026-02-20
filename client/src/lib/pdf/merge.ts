import { PDFDocument } from 'pdf-lib'
import { readFileAsArrayBuffer } from '@/lib/utils/fileUtils'

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create()

  for (const file of files) {
    const buffer = await readFileAsArrayBuffer(file)
    const doc = await PDFDocument.load(buffer)
    const pages = await merged.copyPages(doc, doc.getPageIndices())
    pages.forEach((page) => merged.addPage(page))
  }

  return merged.save()
}
