import { describe, it, expect } from 'vitest'
import {
  formatFileSize,
  generateId,
  validatePdfFile,
  validateImageFile,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/utils/fileUtils'

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B')
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  it('formats megabytes correctly', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
  })
})

describe('generateId', () => {
  it('generates a string id', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('validatePdfFile', () => {
  const createFile = (type: string, size: number): File => {
    return new File(['x'.repeat(size)], 'test.pdf', { type })
  }

  it('returns null for valid PDF files', () => {
    const file = createFile('application/pdf', 1000)
    expect(validatePdfFile(file)).toBeNull()
  })

  it('returns error for non-PDF files', () => {
    const file = createFile('image/png', 1000)
    expect(validatePdfFile(file)).toBe('Only PDF files are accepted.')
  })

  it('returns error for files exceeding size limit', () => {
    const file = createFile('application/pdf', MAX_FILE_SIZE_BYTES + 1)
    expect(validatePdfFile(file)).toBe('File exceeds the 50 MB limit.')
  })
})

describe('validateImageFile', () => {
  const createFile = (type: string, size: number, name = 'test.png'): File => {
    return new File(['x'.repeat(size)], name, { type })
  }

  it('returns null for valid JPEG files', () => {
    const file = createFile('image/jpeg', 1000)
    expect(validateImageFile(file)).toBeNull()
  })

  it('returns null for valid PNG files', () => {
    const file = createFile('image/png', 1000)
    expect(validateImageFile(file)).toBeNull()
  })

  it('returns null for valid WebP files', () => {
    const file = createFile('image/webp', 1000)
    expect(validateImageFile(file)).toBeNull()
  })

  it('returns error for non-image files', () => {
    const file = createFile('application/pdf', 1000)
    expect(validateImageFile(file)).toBe('Only JPG, PNG, and WebP images are accepted.')
  })

  it('returns error for files exceeding size limit', () => {
    const file = createFile('image/png', MAX_FILE_SIZE_BYTES + 1)
    expect(validateImageFile(file)).toBe('File exceeds the 50 MB limit.')
  })
})
