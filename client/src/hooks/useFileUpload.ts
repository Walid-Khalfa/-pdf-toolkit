import { useState, useCallback, useRef } from 'react'
import type { UploadedFile } from '@/types'
import { generateId } from '@/lib/utils/fileUtils'

interface UseFileUploadOptions {
  accept: string[]
  multiple?: boolean
  validate: (file: File) => string | null
}

export function useFileUpload({ accept, multiple = true, validate }: UseFileUploadOptions) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const arr = Array.from(incoming)
      const newErrors: string[] = []
      const valid: UploadedFile[] = []

      arr.forEach((file) => {
        const err = validate(file)
        if (err) {
          newErrors.push(`${file.name}: ${err}`)
        } else {
          valid.push({ id: generateId(), file, name: file.name, size: file.size })
        }
      })

      setErrors(newErrors)
      setFiles((prev) => (multiple ? [...prev, ...valid] : valid.slice(0, 1)))
    },
    [multiple, validate],
  )

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setErrors([])
  }, [])

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files)
      e.target.value = ''
    },
    [addFiles],
  )

  return {
    files,
    setFiles,
    isDragging,
    errors,
    inputRef,
    addFiles,
    removeFile,
    clearFiles,
    openPicker,
    onDragOver,
    onDragLeave,
    onDrop,
    onInputChange,
    accept: accept.join(','),
  }
}
