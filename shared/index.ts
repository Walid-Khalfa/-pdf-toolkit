export type CompressionQuality = 'low' | 'medium' | 'high'

export interface CompressOptions {
  quality: CompressionQuality
}

export interface ProtectOptions {
  userPassword: string
  ownerPassword?: string
  allowPrinting?: boolean
  allowCopying?: boolean
  allowModifying?: boolean
}

export interface UnlockOptions {
  password: string
}

export type ImageFormat = 'jpg' | 'png'

export interface PdfToImagesOptions {
  format: ImageFormat
  quality: number
  dpi: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
