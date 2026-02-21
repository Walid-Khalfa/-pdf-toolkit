import ImagesToPdfTool from '@/components/tools/ImagesToPdfTool'

export default function ImagesToPdfPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] 
                    bg-gradient-to-b from-gray-50 to-white 
                    dark:from-gray-950 dark:to-gray-900
                    transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex w-16 h-16 rounded-2xl 
                          bg-gradient-to-br from-blue-50 to-blue-100 
                          dark:from-blue-950/50 dark:to-blue-900/30
                          items-center justify-center mb-5 
                          border border-blue-100 dark:border-blue-900/50
                          shadow-lg shadow-blue-500/5">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Images to <span className="gradient-text">PDF</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Convert JPG, PNG, and WebP images into a single PDF. Drag to reorder.
          </p>
        </div>

        {/* Tool Component */}
        <div className="animate-fade-in-up animation-delay-100">
          <ImagesToPdfTool />
        </div>
      </div>
    </div>
  )
}
