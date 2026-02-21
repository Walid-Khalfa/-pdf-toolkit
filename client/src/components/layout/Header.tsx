import { Link, useLocation } from 'react-router-dom'
import DarkModeToggle from '@/components/ui/DarkModeToggle'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-50 
                       bg-white/80 dark:bg-gray-900/80 
                       backdrop-blur-lg
                       border-b border-gray-200/50 dark:border-gray-800/50
                       shadow-sm
                       transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 
                            rounded-lg flex items-center justify-center 
                            shadow-sm group-hover:shadow-md 
                            group-hover:scale-105 
                            transition-all duration-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              PDF <span className="gradient-text">Toolkit</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {!isHome && (
              <Link
                to="/"
                className="text-sm text-gray-500 dark:text-gray-400 
                           hover:text-primary-600 dark:hover:text-primary-400 
                           flex items-center gap-1 
                           transition-all duration-200
                           hover:gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                All Tools
              </Link>
            )}
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
