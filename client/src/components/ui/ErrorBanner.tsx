import { useEffect, useState } from 'react'

interface ErrorBannerProps {
  errors: string[]
  onDismiss?: () => void
}

export default function ErrorBanner({ errors, onDismiss }: ErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (errors.length > 0) {
      setIsVisible(true)
    }
  }, [errors])

  if (!errors.length || !isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <div className="error-banner animate-shake" role="alert">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="font-medium">{err}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 
                   p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 
                   transition-colors"
        aria-label="Dismiss error"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
