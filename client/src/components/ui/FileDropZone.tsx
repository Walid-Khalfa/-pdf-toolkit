import type { RefObject } from 'react'

interface FileDropZoneProps {
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick: () => void
  inputRef: RefObject<HTMLInputElement | null>
  accept: string
  multiple?: boolean
  label: string
  hint?: string
  icon: React.ReactNode
}

export default function FileDropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onInputChange,
  onClick,
  inputRef,
  accept,
  multiple = true,
  label,
  hint,
  icon,
}: FileDropZoneProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-primary-500 bg-primary-50 scale-[1.01]'
          : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
      }`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-primary-100' : 'bg-white shadow-sm border border-gray-200'}`}>
        {icon}
      </div>
      <div className="text-center">
        <p className="font-semibold text-gray-800">{label}</p>
        {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={onInputChange}
      />
    </div>
  )
}
