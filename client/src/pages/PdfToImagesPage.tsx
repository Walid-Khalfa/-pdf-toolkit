import PdfToImagesTool from '@/components/tools/PdfToImagesTool'

export default function PdfToImagesPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] 
                    bg-gradient-to-b from-gray-50 to-white 
                    dark:from-gray-950 dark:to-gray-900
                    transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex w-16 h-16 rounded-2xl 
                          bg-gradient-to-br from-teal-50 to-teal-100 
                          dark:from-teal-950/50 dark:to-teal-900/30
                          items-center justify-center mb-5 
                          border border-teal-100 dark:border-teal-900/50
                          shadow-lg shadow-teal-500/5">
            <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            PDF to <span className="gradient-text">Images</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Convert PDF pages into high-quality images. Choose format, quality, and resolution based on your needs.
          </p>
        </div>

        {/* Tool Component */}
        <div className="animate-fade-in-up animation-delay-100">
          <PdfToImagesTool />
        </div>

        {/* Server-side notice */}
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900/50 animate-fade-in-up animation-delay-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium mb-1">Server-side processing</p>
              <p className="text-amber-700 dark:text-amber-400">This tool processes files on our server. Your files are processed securely and deleted immediately after.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}