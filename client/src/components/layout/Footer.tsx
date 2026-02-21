export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 
                       border-t border-gray-200/50 dark:border-gray-800/50 
                       mt-auto
                       transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} PDF Toolkit. Free online PDF tools.</p>
          <p className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-medium">Most tools are client-side</span>
            <span className="text-gray-400 dark:text-gray-500">— your files stay private</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
