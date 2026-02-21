interface ProgressBarProps {
  label?: string
  showPercentage?: boolean
  percentage?: number
}

export default function ProgressBar({ 
  label = 'Processing…', 
  showPercentage = false,
  percentage 
}: ProgressBarProps) {
  const displayPercentage = percentage !== undefined ? percentage : undefined

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        {showPercentage && displayPercentage !== undefined && (
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {Math.round(displayPercentage)}%
          </p>
        )}
      </div>
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Shimmer effect for indeterminate */}
        {displayPercentage === undefined && (
          <div 
            className="absolute inset-0 w-1/2 
                       bg-gradient-to-r from-transparent via-white/40 to-transparent
                       animate-progress-slide"
          />
        )}
        
        {/* Progress fill */}
        <div 
          className="h-full rounded-full 
                     bg-gradient-to-r from-primary-500 via-red-500 to-orange-500
                     bg-[length:200%_auto] animate-gradient-shift
                     transition-all duration-500 ease-out"
          style={{ 
            width: displayPercentage !== undefined ? `${displayPercentage}%` : '100%',
          }}
        />
      </div>
    </div>
  )
}
