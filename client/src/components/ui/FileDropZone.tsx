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
      className={`
        drop-zone relative rounded-2xl p-12
        flex flex-col items-center gap-4 cursor-pointer
        transition-all duration-300 ease-out
        ${isDragging 
          ? 'drop-zone-dragging' 
          : 'drop-zone-idle'
        }
      `}
    >
      {/* Animated gradient border when dragging */}
      {isDragging && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-[-3px]"
            style={{
              background: 'conic-gradient(from 0deg, #ff6b6b, #ff8e53, #feca57, #ff6b6b)',
              animation: 'spin 2s linear infinite',
            }}
          />
          <div className="absolute inset-[3px] bg-primary-50 dark:bg-primary-950/30 rounded-xl" />
        </div>
      )}

      {/* Icon container */}
      <div className={`
        drop-zone-icon relative z-10
        w-16 h-16 rounded-2xl 
        flex items-center justify-center 
        transition-all duration-300
        ${isDragging 
          ? 'bg-primary-100 dark:bg-primary-900/50 scale-110' 
          : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
        }
      `}>
        {/* Pulse ring when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl bg-primary-500/20 animate-ping" />
        )}
        
        <div className={`relative z-10 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
          {icon}
        </div>
      </div>

      {/* Text content */}
      <div className="text-center relative z-10">
        <p className={`font-semibold transition-colors duration-200 
                       ${isDragging 
                         ? 'text-primary-700 dark:text-primary-300' 
                         : 'text-gray-800 dark:text-gray-200'
                       }`}>
          {isDragging ? 'Drop files here!' : label}
        </p>
        {hint && !isDragging && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
        )}
        {isDragging && (
          <p className="text-sm text-primary-600 dark:text-primary-400 mt-1 animate-pulse">
            Release to upload
          </p>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={onInputChange}
      />

      {/* Decorative elements */}
      {!isDragging && (
        <>
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 
                          border-gray-200 dark:border-gray-700 rounded-tl-lg opacity-50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 
                          border-gray-200 dark:border-gray-700 rounded-tr-lg opacity-50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 
                          border-gray-200 dark:border-gray-700 rounded-bl-lg opacity-50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 
                          border-gray-200 dark:border-gray-700 rounded-br-lg opacity-50" />
        </>
      )}
    </div>
  )
}
