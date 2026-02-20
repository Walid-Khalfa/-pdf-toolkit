import ImagesToPdfTool from '@/components/tools/ImagesToPdfTool'

export default function ImagesToPdfPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-50 items-center justify-center mb-4 border border-blue-100">
          <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Images to PDF</h1>
        <p className="text-gray-500">Convert JPG, PNG, and WebP images into a single PDF. Drag to reorder.</p>
      </div>
      <ImagesToPdfTool />
    </div>
  )
}
