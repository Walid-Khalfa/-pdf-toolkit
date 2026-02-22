export type {
  CompressionQuality,
  CompressOptions,
  ProtectOptions,
  UnlockOptions,
  ImageFormat,
  PdfToImagesOptions,
  ApiResponse,
} from '@shared'

export interface CompressResponse {
  originalSize: number
  compressedSize: number
  filename: string
}

export interface PdfToImagesResponse {
  pageCount: number
  filename: string
  originalName: string
}

export interface ProtectResponse {
  filename: string
  originalName: string
}

export interface UnlockResponse {
  filename: string
  originalName: string
}
