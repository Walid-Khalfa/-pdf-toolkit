import { PDFDocument, PageSizes } from 'pdf-lib'
import { readFileAsArrayBuffer } from '@/lib/utils/fileUtils'
import type { ImageToPdfOptions } from '@/types'

const PAGE_DIMENSIONS: Record<string, [number, number]> = {
  A4: PageSizes.A4,
  Letter: PageSizes.Letter,
  Legal: PageSizes.Legal,
}

export async function imagesToPdf(
  files: File[],
  options: ImageToPdfOptions,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const [w, h] = PAGE_DIMENSIONS[options.pageSize]
  const isLandscape = options.orientation === 'landscape'
  const pageW = isLandscape ? h : w
  const pageH = isLandscape ? w : h
  const margin = options.margin

  for (const file of files) {
    const buffer = await readFileAsArrayBuffer(file)
    const bytes = new Uint8Array(buffer)

    let image
    if (file.type === 'image/png') {
      image = await doc.embedPng(bytes)
    } else {
      image = await doc.embedJpg(bytes)
    }

    const page = doc.addPage([pageW, pageH])
    const availW = pageW - margin * 2
    const availH = pageH - margin * 2
    const scaled = image.scaleToFit(availW, availH)

    page.drawImage(image, {
      x: margin + (availW - scaled.width) / 2,
      y: margin + (availH - scaled.height) / 2,
      width: scaled.width,
      height: scaled.height,
    })
  }

  return doc.save()
}
