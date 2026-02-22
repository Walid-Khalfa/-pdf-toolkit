import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  createTempDir,
  cleanupTempFiles,
  formatFileSize,
  sanitizeFilename,
  generateOutputFilename,
} from '../../utils/fileUtils.js'
import fs from 'fs'
import path from 'path'

describe('fileUtils', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 B')
      expect(formatFileSize(0)).toBe('0 B')
    })

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
      expect(formatFileSize(2048)).toBe('2.0 KB')
    })

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })
  })

  describe('sanitizeFilename', () => {
    it('keeps alphanumeric characters', () => {
      expect(sanitizeFilename('test-file_123')).toBe('test-file_123')
    })

    it('replaces special characters', () => {
      expect(sanitizeFilename('test file')).toBe('test_file')
      expect(sanitizeFilename('test@file#name')).toBe('test_file_name')
    })
  })

  describe('generateOutputFilename', () => {
    it('generates filename with suffix and extension', () => {
      const result = generateOutputFilename('document.pdf', 'compressed', 'pdf')
      expect(result).toContain('document')
      expect(result).toContain('compressed')
      expect(result).toMatch(/\.pdf$/)
    })

    it('includes timestamp', () => {
      const before = Date.now()
      const result = generateOutputFilename('doc.pdf', 'test', 'pdf')
      const after = Date.now()

      const match = result.match(/_(\d+)\.pdf$/)
      expect(match).not.toBeNull()

      const timestamp = parseInt(match![1], 10)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe('createTempDir and cleanupTempFiles', () => {
    let tempDir: string

    beforeEach(() => {
      tempDir = createTempDir()
    })

    afterEach(() => {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    })

    it('creates a temporary directory', () => {
      expect(fs.existsSync(tempDir)).toBe(true)
      expect(tempDir).toContain('pdf-toolkit')
    })

    it('cleanupTempFiles removes the directory', () => {
      const testFile = path.join(tempDir, 'test.txt')
      fs.writeFileSync(testFile, 'test')

      cleanupTempFiles(tempDir)

      expect(fs.existsSync(tempDir)).toBe(false)
    })

    it('cleanupTempFiles handles non-existent directory gracefully', () => {
      expect(() => cleanupTempFiles('/non/existent/path')).not.toThrow()
    })
  })
})
