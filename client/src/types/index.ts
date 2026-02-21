export interface UploadedFile {
  id: string
  file: File
  name: string
  size: number
  preview?: string
}

export interface SplitRange {
  from: number
  to: number
}

export type PageSize = 'A4' | 'Letter' | 'Legal'
export type Orientation = 'portrait' | 'landscape'

export interface ImageToPdfOptions {
  pageSize: PageSize
  orientation: Orientation
  margin: number
}

export type ToolStatus = 'idle' | 'processing' | 'done' | 'error'

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

export interface CompressResult {
  bytes: Uint8Array
  filename: string
  originalSize: number
  compressedSize: number
}
