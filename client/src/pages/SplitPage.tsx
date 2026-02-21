import SplitTool from '@/components/tools/SplitTool'

export default function SplitPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] 
                    bg-gradient-to-b from-gray-50 to-white 
                    dark:from-gray-950 dark:to-gray-900
                    transition-colors duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in-up">
          <div className="inline-flex w-16 h-16 rounded-2xl 
                          bg-gradient-to-br from-orange-50 to-orange-100 
                          dark:from-orange-950/50 dark:to-orange-900/30
                          items-center justify-center mb-5 
                          border border-orange-100 dark:border-orange-900/50
                          shadow-lg shadow-orange-500/5">
            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Split <span className="gradient-text">PDF</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Split a PDF into individual pages or extract a specific page range.
          </p>
        </div>

        {/* Tool Component */}
        <div className="animate-fade-in-up animation-delay-100">
          <SplitTool />
        </div>
      </div>
    </div>
  )
}
