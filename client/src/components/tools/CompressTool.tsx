import { useState } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validatePdfFile, formatFileSize } from '@/lib/utils/fileUtils'
import { uploadFile } from '@/lib/api/client'
import { downloadBytes } from '@/lib/utils/downloadUtils'
import FileDropZone from '@/components/ui/FileDropZone'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import type { ToolStatus, CompressionQuality } from '@/types'

export default function CompressTool() {
  const [status, setStatus] = useState<ToolStatus>('idle')
  const [quality, setQuality] = useState<CompressionQuality>('medium')
  const [progress, setProgress] = useState(0)

  const upload = useFileUpload({
    accept: ['application/pdf'],
    multiple: false,
    validate: validatePdfFile,
  })

  const handleCompress = async () => {
    const file = upload.files[0]?.file
    if (!file) return

    setStatus('processing')
    setProgress(0)
    try {
      const blob = await uploadFile<Blob>({
        endpoint: '/compress',
        file,
        additionalData: { quality },
        onProgress: percent => {
          setProgress(percent)
        },
      })

      const arrayBuffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)

      const compressedFileName = file.name.replace('.pdf', '_compressed.pdf')
      downloadBytes(bytes, compressedFileName)

      setStatus('done')
    } catch (error) {
      console.error('Compress error:', error)
      setStatus('error')
    }
  }

  const handleReset = () => {
    upload.clearFiles()
    setStatus('idle')
    setProgress(0)
  }

  const file = upload.files[0]
  const originalSize = file?.size || 0

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropZone
          isDragging={upload.isDragging}
          onDragOver={upload.onDragOver}
          onDragLeave={upload.onDragLeave}
          onDrop={upload.onDrop}
          onInputChange={upload.onInputChange}
          onClick={upload.openPicker}
          inputRef={upload.inputRef}
          accept={upload.accept}
          multiple={false}
          label="Drop a PDF file here or click to select"
          hint="Select a single PDF to compress"
          icon={
            <svg
              className="w-8 h-8 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          }
        />
      ) : (
        <div className="file-item animate-fade-in p-4">
          <div
            className="w-10 h-12 bg-gradient-to-br from-purple-50 to-purple-100 
                          dark:from-purple-950/50 dark:to-purple-900/30
                          rounded-lg flex items-center justify-center flex-shrink-0 
                          border border-purple-100 dark:border-purple-900/50"
          >
            <svg
              className="w-5 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatFileSize(originalSize)}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                       p-1 rounded 
                       hover:bg-red-50 dark:hover:bg-red-950/30
                       transition-colors"
            aria-label="Remove file"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <ErrorBanner errors={upload.errors} />

      {file && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Compression quality
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as CompressionQuality[]).map(q => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`option-button ${quality === q ? 'option-button-active' : 'option-button-inactive'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${
                                      quality === q
                                        ? 'border-purple-500 bg-purple-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                    >
                      {quality === q && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <p
                      className={`font-medium text-sm 
                                  ${
                                    quality === q
                                      ? 'text-purple-700 dark:text-purple-300'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                    >
                      {q.charAt(0).toUpperCase() + q.slice(1)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-left pl-7">
                    {q === 'low' && 'Smallest size'}
                    {q === 'medium' && 'Balanced'}
                    {q === 'high' && 'Best quality'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {status === 'processing' && (
        <ProgressBar
          label={progress > 0 ? `Compressing... ${progress}%` : 'Compressing...'}
          showPercentage={true}
          percentage={progress}
        />
      )}

      {status === 'done' && (
        <div className="success-banner">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            PDF compressed and downloaded successfully!
          </p>
        </div>
      )}

      {status === 'error' && (
        <ErrorBanner
          errors={['Failed to compress PDF. Please check that the file is a valid PDF.']}
        />
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleCompress}
          disabled={!file || status === 'processing'}
          loading={status === 'processing'}
          size="lg"
          className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          }
        >
          Compress PDF
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
