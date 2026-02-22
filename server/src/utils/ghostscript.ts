import { exec } from 'child_process'
import { promisify } from 'util'
import type { CompressionQuality } from '@shared'

const execAsync = promisify(exec)

let ghostscriptAvailable: boolean | null = null

export async function isGhostscriptAvailable(): Promise<boolean> {
  if (ghostscriptAvailable !== null) {
    return ghostscriptAvailable
  }

  try {
    await execAsync('gs --version')
    ghostscriptAvailable = true
    return true
  } catch {
    ghostscriptAvailable = false
    return false
  }
}

const qualitySettings: Record<CompressionQuality, { pdfSettings: string; dpi: number }> = {
  low: { pdfSettings: '/screen', dpi: 72 },
  medium: { pdfSettings: '/ebook', dpi: 150 },
  high: { pdfSettings: '/printer', dpi: 300 },
}

export async function compressWithGhostscript(
  inputPath: string,
  outputPath: string,
  quality: CompressionQuality
): Promise<void> {
  const settings = qualitySettings[quality]

  const command = [
    'gs',
    '-sDEVICE=pdfwrite',
    `-dPDFSETTINGS=${settings.pdfSettings}`,
    `-dColorImageResolution=${settings.dpi}`,
    `-dGrayImageResolution=${settings.dpi}`,
    `-dMonoImageResolution=${settings.dpi}`,
    '-dNOPAUSE',
    '-dQUIET',
    '-dBATCH',
    `-sOutputFile="${outputPath}"`,
    `"${inputPath}"`,
  ].join(' ')

  try {
    await execAsync(command, { maxBuffer: 50 * 1024 * 1024 })
  } catch (error) {
    throw new Error(
      `Ghostscript compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
