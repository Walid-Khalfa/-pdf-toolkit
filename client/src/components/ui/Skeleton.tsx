interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'shimmer' | 'none'
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }

  const animationClasses = {
    pulse: 'animate-pulse bg-gray-200 dark:bg-gray-700',
    shimmer: 'skeleton-shimmer',
    none: 'bg-gray-200 dark:bg-gray-700',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Skeleton variant="rounded" width={64} height={64} />
        <Skeleton variant="text" width="60%" height={20} />
        <Skeleton variant="text" width="80%" height={14} />
        <Skeleton variant="text" width="70%" height={14} />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
          height={14}
        />
      ))}
    </div>
  )
}

export function SkeletonButton({ className = '' }: { className?: string }) {
  return (
    <Skeleton
      variant="rounded"
      width={120}
      height={40}
      className={className}
    />
  )
}
