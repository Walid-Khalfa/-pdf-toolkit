import { useState } from 'react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { validatePdfFile } from '@/lib/utils/fileUtils'
import { splitPdfByRanges, splitPdfIntoPages, getPdfPageCount } from '@/lib/pdf/split'
import { downloadBytes, downloadMultiple } from '@/lib/utils/downloadUtils'
import FileDropZone from '@/components/ui/FileDropZone'
import ErrorBanner from '@/components/ui/ErrorBanner'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import type { ToolStatus } from '@/types'

type SplitMode = 'all' | 'range'

export default function SplitTool() {
  const [status, setStatus] = useState<ToolStatus>('idle')
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [mode, setMode] = useState<SplitMode>('all')
  const [fromPage, setFromPage] = useState('1')
  const [toPage, setToPage] = useState('1')
  const [rangeError, setRangeError] = useState('')

  const upload = useFileUpload({
    accept: ['application/pdf'],
    multiple: false,
    validate: validatePdfFile,
  })

  const handleFileAdded = async (file: File) => {
    try {
      const count = await getPdfPageCount(file)
      setPageCount(count)
      setToPage(String(count))
    } catch {
      setPageCount(null)
    }
  }

  const originalOnDrop = upload.onDrop
  const originalOnInputChange = upload.onInputChange

  const wrappedOnDrop = async (e: React.DragEvent) => {
    originalOnDrop(e)
    const file = e.dataTransfer.files[0]
    if (file) await handleFileAdded(file)
  }

  const wrappedOnInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    originalOnInputChange(e)
    const file = e.target.files?.[0]
    if (file) await handleFileAdded(file)
  }

  const validateRange = () => {
    const f = parseInt(fromPage, 10)
    const t = parseInt(toPage, 10)
    if (isNaN(f) || isNaN(t)) return 'Please enter valid page numbers.'
    if (f < 1 || t < 1) return 'Page numbers must be at least 1.'
    if (pageCount && (f > pageCount || t > pageCount)) return `Page numbers cannot exceed ${pageCount}.`
    if (f > t) return '"From" must be less than or equal to "To".'
    return ''
  }

  const handleSplit = async () => {
    const file = upload.files[0]?.file
    if (!file) return

    if (mode === 'range') {
      const err = validateRange()
      if (err) { setRangeError(err); return }
      setRangeError('')
    }

    setStatus('processing')
    try {
      if (mode === 'all') {
        const results = await splitPdfIntoPages(file)
        if (results.length === 1) {
          downloadBytes(results[0].bytes, results[0].name)
        } else {
          downloadMultiple(results)
        }
      } else {
        const f = parseInt(fromPage, 10)
        const t = parseInt(toPage, 10)
        const results = await splitPdfByRanges(file, [{ from: f, to: t }])
        downloadBytes(results[0].bytes, results[0].name)
      }
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    upload.clearFiles()
    setStatus('idle')
    setPageCount(null)
    setFromPage('1')
    setToPage('1')
    setRangeError('')
    setMode('all')
  }

  const file = upload.files[0]

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropZone
          isDragging={upload.isDragging}
          onDragOver={upload.onDragOver}
          onDragLeave={upload.onDragLeave}
          onDrop={wrappedOnDrop}
          onInputChange={wrappedOnInputChange}
          onClick={upload.openPicker}
          inputRef={upload.inputRef}
          accept={upload.accept}
          multiple={false}
          label="Drop a PDF file here or click to select"
          hint="Select a single PDF to split"
          icon={
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      ) : (
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="w-10 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-primary-100">
            <svg className="w-5 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{file.name}</p>
            {pageCount !== null && (
              <p className="text-sm text-gray-500">{pageCount} page{pageCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
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
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Split mode</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('all')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'all' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <p className={`font-medium text-sm ${mode === 'all' ? 'text-primary-700' : 'text-gray-700'}`}>
                  Split into individual pages
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Each page becomes a separate PDF</p>
              </button>
              <button
                onClick={() => setMode('range')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${mode === 'range' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <p className={`font-medium text-sm ${mode === 'range' ? 'text-primary-700' : 'text-gray-700'}`}>
                  Extract page range
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Extract a specific range of pages</p>
              </button>
            </div>
          </div>

          {mode === 'range' && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">
                Page range {pageCount && <span className="text-gray-400 font-normal">(1 – {pageCount})</span>}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From page</label>
                  <input
                    type="number"
                    min={1}
                    max={pageCount ?? undefined}
                    value={fromPage}
                    onChange={(e) => setFromPage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <span className="text-gray-400 mt-5">—</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To page</label>
                  <input
                    type="number"
                    min={1}
                    max={pageCount ?? undefined}
                    value={toPage}
                    onChange={(e) => setToPage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              {rangeError && <p className="text-xs text-red-600">{rangeError}</p>}
            </div>
          )}
        </div>
      )}

      {status === 'processing' && <ProgressBar label="Splitting PDF…" />}

      {status === 'done' && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700 font-medium">PDF split and downloaded successfully!</p>
        </div>
      )}

      {status === 'error' && (
        <ErrorBanner errors={['Failed to split PDF. Please check that the file is a valid PDF.']} />
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSplit}
          disabled={!file || status === 'processing'}
          loading={status === 'processing'}
          size="lg"
          className="flex-1 sm:flex-none"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          Split PDF
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
