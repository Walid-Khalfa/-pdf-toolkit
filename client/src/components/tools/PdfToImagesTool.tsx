import { useState } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validatePdfFile } from '@/lib/utils/fileUtils'
import { uploadFile } from '@/lib/api/client'
import { downloadBytes } from '@/lib/utils/downloadUtils'
import FileDropZone from '@/components/ui/FileDropZone'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import type { ToolStatus, ImageFormat } from '@/types'

export default function PdfToImagesTool() {
  const [status, setStatus] = useState<ToolStatus>('idle')
  const [format, setFormat] = useState<ImageFormat>('png')
  const [quality, setQuality] = useState(80)
  const [dpi, setDpi] = useState(150)
  const [progress, setProgress] = useState(0)

  const upload = useFileUpload({
    accept: ['application/pdf'],
    multiple: false,
    validate: validatePdfFile,
  })

  const handleConvert = async () => {
    const file = upload.files[0]?.file
    if (!file) return

    setStatus('processing')
    setProgress(0)
    try {
      const blob = await uploadFile<Blob>({
        endpoint: '/pdf-to-images',
        file,
        additionalData: {
          format,
          quality,
          dpi,
        },
        onProgress: (percent) => {
          setProgress(percent)
        },
      })

      const arrayBuffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      
      const zipFileName = file.name.replace('.pdf', `_images.zip`)
      downloadBytes(bytes, zipFileName)
      
      setStatus('done')
    } catch (error) {
      console.error('PDF to images error:', error)
      setStatus('error')
    }
  }

  const handleReset = () => {
    upload.clearFiles()
    setStatus('idle')
    setProgress(0)
  }

  const file = upload.files[0]

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
          hint="Select a single PDF to convert to images"
          icon={
            <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <div className="file-item animate-fade-in p-4">
          <div className="w-10 h-12 bg-gradient-to-br from-teal-50 to-teal-100 
                          dark:from-teal-950/50 dark:to-teal-900/30
                          rounded-lg flex items-center justify-center flex-shrink-0 
                          border border-teal-100 dark:border-teal-900/50">
            <svg className="w-5 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 
                       p-1 rounded 
                       hover:bg-red-50 dark:hover:bg-red-950/30
                       transition-colors"
            aria-label="Remove file"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <ErrorBanner errors={upload.errors} />

      {file && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Output format</p>
            <div className="grid grid-cols-2 gap-3">
              {(['png', 'jpg'] as ImageFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`option-button ${format === f ? 'option-button-active' : 'option-button-inactive'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${format === f 
                                      ? 'border-teal-500 bg-teal-500' 
                                      : 'border-gray-300 dark:border-gray-600'}`}>
                      {format === f && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <p className={`font-medium text-sm 
                                  ${format === f 
                                    ? 'text-teal-700 dark:text-teal-300' 
                                    : 'text-gray-700 dark:text-gray-300'}`}>
                      {f.toUpperCase()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-left pl-7">
                    {f === 'png' ? 'Best for graphics' : 'Smaller file size'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="options-panel">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                  Quality <span className="text-gray-400 dark:text-gray-500 font-normal">({quality}%)</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Low (smaller)</span>
                  <span>High (better)</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                  Resolution (DPI) <span className="text-gray-400 dark:text-gray-500 font-normal">({dpi} DPI)</span>
                </label>
                <select
                  value={dpi}
                  onChange={(e) => setDpi(parseInt(e.target.value, 10))}
                  className="select"
                >
                  <option value={72}>72 DPI (Web)</option>
                  <option value={150}>150 DPI (Standard)</option>
                  <option value={300}>300 DPI (Print)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Higher DPI = better quality but larger files
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'processing' && (
        <ProgressBar 
          label={progress > 0 ? `Converting to images... ${progress}%` : 'Converting to images...'} 
          showPercentage={true}
          percentage={progress}
        />
      )}

      {status === 'done' && (
        <div className="success-banner">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">PDF converted to images and downloaded!</p>
        </div>
      )}

      {status === 'error' && (
        <ErrorBanner errors={['Failed to convert PDF to images. Please check that the file is a valid PDF.']} />
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleConvert}
          disabled={!file || status === 'processing'}
          loading={status === 'processing'}
          size="lg"
          className="flex-1 sm:flex-none bg-teal-600 hover:bg-teal-700"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        >
          Convert to Images
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