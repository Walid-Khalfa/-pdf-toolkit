import { describe, it, expect } from 'vitest'
import {
  compressSchema,
  protectSchema,
  unlockSchema,
  pdfToImagesSchema,
} from '../../middleware/validation.js'

describe('validation schemas', () => {
  describe('compressSchema', () => {
    it('accepts valid quality values', () => {
      expect(compressSchema.parse({ quality: 'low' })).toEqual({ quality: 'low' })
      expect(compressSchema.parse({ quality: 'medium' })).toEqual({ quality: 'medium' })
      expect(compressSchema.parse({ quality: 'high' })).toEqual({ quality: 'high' })
    })

    it('defaults to medium quality', () => {
      expect(compressSchema.parse({})).toEqual({ quality: 'medium' })
    })

    it('rejects invalid quality values', () => {
      expect(() => compressSchema.parse({ quality: 'invalid' })).toThrow()
    })
  })

  describe('protectSchema', () => {
    it('accepts valid password', () => {
      const result = protectSchema.parse({ userPassword: 'test1234' })
      expect(result.userPassword).toBe('test1234')
    })

    it('rejects short passwords', () => {
      expect(() => protectSchema.parse({ userPassword: 'abc' })).toThrow()
    })

    it('accepts optional fields', () => {
      const result = protectSchema.parse({
        userPassword: 'test1234',
        ownerPassword: 'owner1234',
        allowPrinting: 'true',
        allowCopying: 'false',
      })
      expect(result.userPassword).toBe('test1234')
    })
  })

  describe('unlockSchema', () => {
    it('accepts password', () => {
      expect(unlockSchema.parse({ password: 'test123' })).toEqual({ password: 'test123' })
    })

    it('accepts empty password', () => {
      expect(unlockSchema.parse({ password: '' })).toEqual({ password: '' })
    })

    it('accepts missing password', () => {
      expect(unlockSchema.parse({})).toEqual({ password: undefined })
    })
  })

  describe('pdfToImagesSchema', () => {
    it('uses default values', () => {
      const result = pdfToImagesSchema.parse({})
      expect(result).toEqual({ format: 'png', quality: 80, dpi: 150 })
    })

    it('accepts valid format', () => {
      expect(pdfToImagesSchema.parse({ format: 'jpg' })).toHaveProperty('format', 'jpg')
      expect(pdfToImagesSchema.parse({ format: 'png' })).toHaveProperty('format', 'png')
    })

    it('coerces string numbers', () => {
      const result = pdfToImagesSchema.parse({ quality: '90', dpi: '200' })
      expect(result.quality).toBe(90)
      expect(result.dpi).toBe(200)
    })

    it('rejects invalid dpi range', () => {
      expect(() => pdfToImagesSchema.parse({ dpi: 50 })).toThrow()
      expect(() => pdfToImagesSchema.parse({ dpi: 700 })).toThrow()
    })
  })
})
