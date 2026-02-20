export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024

export function validatePdfFile(file: File): string | null {
  if (file.type !== 'application/pdf') return 'Only PDF files are accepted.'
  if (file.size > MAX_FILE_SIZE_BYTES) return 'File exceeds the 50 MB limit.'
  return null
}

export function validateImageFile(file: File): string | null {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    return 'Only JPG, PNG, and WebP images are accepted.'
  if (file.size > MAX_FILE_SIZE_BYTES) return 'File exceeds the 50 MB limit.'
  return null
}
