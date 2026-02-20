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
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validatePdfFile, formatFileSize } from '@/lib/utils/fileUtils'
import { mergePdfs } from '@/lib/pdf/merge'
import { downloadBytes } from '@/lib/utils/downloadUtils'
import FileDropZone from '@/components/ui/FileDropZone'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import type { UploadedFile, ToolStatus } from '@/types'

function SortableItem({ file, onRemove }: { file: UploadedFile; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 ${isDragging ? 'shadow-lg opacity-75 z-10' : 'shadow-sm'}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 rounded"
        aria-label="Drag to reorder"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <div className="w-8 h-10 bg-primary-50 rounded-md flex items-center justify-center flex-shrink-0 border border-primary-100">
        <svg className="w-4 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
        <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
        aria-label="Remove file"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function MergeTool() {
  const [status, setStatus] = useState<ToolStatus>('idle')
  const upload = useFileUpload({
    accept: ['application/pdf'],
    multiple: true,
    validate: validatePdfFile,
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

  const handleMerge = async () => {
    if (upload.files.length < 2) return
    setStatus('processing')
    try {
      const bytes = await mergePdfs(upload.files.map((f) => f.file))
      downloadBytes(bytes, 'merged.pdf')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    upload.clearFiles()
    setStatus('idle')
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        isDragging={upload.isDragging}
        onDragOver={upload.onDragOver}
        onDragLeave={upload.onDragLeave}
        onDrop={upload.onDrop}
        onInputChange={upload.onInputChange}
        onClick={upload.openPicker}
        inputRef={upload.inputRef}
        accept={upload.accept}
        multiple={true}
        label="Drop PDF files here or click to select"
        hint="You can add multiple PDFs and drag to reorder them"
        icon={
          <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />

      <ErrorBanner errors={upload.errors} />

      {upload.files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              {upload.files.length} file{upload.files.length > 1 ? 's' : ''} selected
              {upload.files.length > 1 && <span className="text-gray-400 ml-1">(drag to reorder)</span>}
            </p>
            <button onClick={upload.clearFiles} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              Clear all
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={upload.files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {upload.files.map((file) => (
                  <SortableItem key={file.id} file={file} onRemove={upload.removeFile} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {status === 'processing' && <ProgressBar label="Merging PDFs…" />}

      {status === 'done' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">PDF merged and downloaded successfully!</p>
        </div>
      )}

      {status === 'error' && (
        <ErrorBanner errors={['Failed to merge PDFs. Please check that all files are valid PDFs.']} />
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleMerge}
          disabled={upload.files.length < 2 || status === 'processing'}
          loading={status === 'processing'}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Merge PDFs
        </Button>
        {(upload.files.length > 0 || status !== 'idle') && (
          <Button variant="secondary" onClick={handleReset} size="lg">
            Start over
          </Button>
        )}
      </div>

      {upload.files.length < 2 && upload.files.length > 0 && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Add at least one more PDF to merge
        </p>
      )}
    </div>
  )
}
