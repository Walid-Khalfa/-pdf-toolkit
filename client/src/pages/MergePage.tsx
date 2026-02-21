import MergeTool from '@/components/tools/MergeTool'

export default function MergePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] 
                    bg-gradient-to-b from-gray-50 to-white 
                    dark:from-gray-950 dark:to-gray-900
                    transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex w-16 h-16 rounded-2xl 
                          bg-gradient-to-br from-red-50 to-red-100 
                          dark:from-red-950/50 dark:to-red-900/30
                          items-center justify-center mb-5 
                          border border-red-100 dark:border-red-900/50
                          shadow-lg shadow-red-500/5">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Merge <span className="gradient-text">PDFs</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Combine multiple PDF files into one document. Drag to reorder before merging.
          </p>
        </div>

        {/* Tool Component */}
        <div className="animate-fade-in-up animation-delay-100">
          <MergeTool />
        </div>
      </div>
    </div>
  )
}
