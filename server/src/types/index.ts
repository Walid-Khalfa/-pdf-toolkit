export type CompressionQuality = 'low' | 'medium' | 'high';

export interface CompressOptions {
  quality: CompressionQuality;
}

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
  allowPrinting?: boolean;
  allowCopying?: boolean;
  allowModifying?: boolean;
}

export interface UnlockOptions {
  password: string;
}

export type ImageFormat = 'jpg' | 'png';

export interface PdfToImagesOptions {
  format: ImageFormat;
  quality: number;
  dpi: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CompressResponse {
  originalSize: number;
  compressedSize: number;
  filename: string;
}

export interface PdfToImagesResponse {
  pageCount: number;
  filename: string;
  originalName: string;
}

export interface ProtectResponse {
  filename: string;
  originalName: string;
}

export interface UnlockResponse {
  filename: string;
  originalName: string;
}
