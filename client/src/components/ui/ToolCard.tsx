import { Link } from 'react-router-dom'
import { useState, useRef, type MouseEvent } from 'react'

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
  delay?: number
  badge?: string
}

export default function ToolCard({ title, description, href, icon, color, delay = 0, badge }: ToolCardProps) {
  const [transform, setTransform] = useState('')
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`)
  }

  const handleMouseLeave = () => {
    setTransform('')
  }

  return (
    <Link
      ref={cardRef}
      to={href}
      className="tool-card group"
      style={{ 
        transform,
        animationDelay: `${delay}ms` 
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-orange-500/5 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent 
                      group-hover:border-primary-500/20 dark:group-hover:border-primary-500/10
                      transition-colors duration-300" />

      {/* Icon container */}
      <div className={`tool-card-icon ${color} relative overflow-hidden`}>
        {/* Icon glow effect */}
        <div className="absolute inset-0 bg-white/50 dark:bg-white/10 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 rounded-2xl" />
        
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-2xl 
                        opacity-0 group-hover:opacity-100
                        ring-2 ring-current/20
                        scale-0 group-hover:scale-100
                        transition-all duration-500" />
        
        <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {/* Title with badge */}
      <div className="flex items-center gap-2 relative z-10">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
          {title}
        </h3>
        {badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                         bg-primary-100 dark:bg-primary-900/50 
                         text-primary-700 dark:text-primary-300
                         border border-primary-200 dark:border-primary-800
                         animate-bounce-subtle">
            {badge}
          </span>
        )}
      </div>
      
      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-3 flex items-center text-primary-500 dark:text-primary-400
                      opacity-0 group-hover:opacity-100 
                      translate-x-[-8px] group-hover:translate-x-0
                      transition-all duration-300">
        <span className="text-xs font-medium">Open tool</span>
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  )
}
