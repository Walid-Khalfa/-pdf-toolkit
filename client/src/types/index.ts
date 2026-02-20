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
