import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validateImageFile } from '@/lib/utils/fileUtils'
import { imagesToPdf } from '@/lib/pdf/imagesToPdf'
import { downloadBytes } from '@/lib/utils/downloadUtils'
import FileDropZone from '@/components/ui/FileDropZone'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import type { UploadedFile, ToolStatus, PageSize, Orientation, ImageToPdfOptions } from '@/types'

function SortableImageItem({
  file,
  onRemove,
}: {
  file: UploadedFile & { preview?: string }
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl overflow-hidden border-2 
                  bg-white dark:bg-gray-800
                  transition-all duration-200
                  ${isDragging 
                    ? 'border-primary-400 dark:border-primary-500 shadow-xl opacity-75 scale-[1.02]' 
                    : 'border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
                  }
                  animate-fade-in`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
        aria-label="Drag to reorder"
      />
      {file.preview ? (
        <img src={file.preview} alt={file.name} className="w-full h-28 object-cover" />
      ) : (
        <div className="w-full h-28 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="p-1.5 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{file.name}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(file.id) }}
        className="absolute top-2 right-2 z-20 w-6 h-6 
                   bg-white dark:bg-gray-800 
                   rounded-full shadow-md 
                   flex items-center justify-center 
                   text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                   hover:scale-110
                   transition-all"
        aria-label="Remove image"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ImagesToPdfTool() {
  const [status, setStatus] = useState<ToolStatus>('idle')
  const [options, setOptions] = useState<ImageToPdfOptions>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
  })

  const upload = useFileUpload({
    accept: ['image/jpeg', 'image/png', 'image/webp'],
    multiple: true,
    validate: validateImageFile,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        upload.setFiles((prev) => {
          const oldIdx = prev.findIndex((f) => f.id === active.id)
          const newIdx = prev.findIndex((f) => f.id === over.id)
          return arrayMove(prev, oldIdx, newIdx)
        })
      }
    },
    [upload],
  )

  const wrappedOnDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      upload.onDrop(e)
      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          upload.setFiles((prev) =>
            prev.map((f) => (f.name === file.name && !f.preview ? { ...f, preview: url } : f)),
          )
        }
      })
    },
    [upload],
  )

  const wrappedOnInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      upload.onInputChange(e)
      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          setTimeout(() => {
            upload.setFiles((prev) =>
              prev.map((f) => (f.name === file.name && !f.preview ? { ...f, preview: url } : f)),
            )
          }, 50)
        }
      })
    },
    [upload],
  )

  const handleConvert = async () => {
    if (!upload.files.length) return
    setStatus('processing')
    try {
      const bytes = await imagesToPdf(upload.files.map((f) => f.file), options)
      downloadBytes(bytes, 'images.pdf')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    upload.files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
    upload.clearFiles()
    setStatus('idle')
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        isDragging={upload.isDragging}
        onDragOver={upload.onDragOver}
        onDragLeave={upload.onDragLeave}
        onDrop={wrappedOnDrop}
        onInputChange={wrappedOnInputChange}
        onClick={upload.openPicker}
        inputRef={upload.inputRef}
        accept={upload.accept}
        multiple={true}
        label="Drop images here or click to select"
        hint="Supports JPG, PNG, and WebP — drag to reorder"
        icon={
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />

      <ErrorBanner errors={upload.errors} />

      {upload.files.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {upload.files.length} image{upload.files.length > 1 ? 's' : ''} selected
            </p>
            <button 
              onClick={handleReset} 
              className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                         transition-colors font-medium"
            >
              Clear all
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={upload.files.map((f) => f.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {upload.files.map((file) => (
                  <SortableImageItem key={file.id} file={file} onRemove={upload.removeFile} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="options-panel">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF Options</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Page size</label>
                <select
                  value={options.pageSize}
                  onChange={(e) => setOptions((o) => ({ ...o, pageSize: e.target.value as PageSize }))}
                  className="select"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Orientation</label>
                <select
                  value={options.orientation}
                  onChange={(e) => setOptions((o) => ({ ...o, orientation: e.target.value as Orientation }))}
                  className="select"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Margin (pt)</label>
                <select
                  value={options.margin}
                  onChange={(e) => setOptions((o) => ({ ...o, margin: Number(e.target.value) }))}
                  className="select"
                >
                  <option value={0}>None</option>
                  <option value={10}>Small (10pt)</option>
                  <option value={20}>Medium (20pt)</option>
                  <option value={40}>Large (40pt)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'processing' && <ProgressBar label="Converting images to PDF…" />}

      {status === 'done' && (
        <div className="success-banner">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">PDF created and downloaded successfully!</p>
        </div>
      )}

      {status === 'error' && (
        <ErrorBanner errors={['Failed to convert images. Please check that all files are valid images.']} />
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleConvert}
          disabled={upload.files.length === 0 || status === 'processing'}
          loading={status === 'processing'}
          size="lg"
          className="flex-1 sm:flex-none"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        >
          Convert to PDF
        </Button>
        {(upload.files.length > 0 || status !== 'idle') && (
          <Button variant="secondary" onClick={handleReset} size="lg">
            Start over
          </Button>
        )}
      </div>
    </div>
  )
}
