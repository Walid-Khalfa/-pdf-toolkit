import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

const variants = {
  primary: `
    bg-primary-600 text-white 
    hover:bg-primary-700 
    shadow-sm hover:shadow-md
    dark:bg-primary-600 dark:hover:bg-primary-500
    focus:ring-primary-500
  `,
  secondary: `
    bg-white dark:bg-gray-800 
    text-gray-700 dark:text-gray-200 
    border border-gray-300 dark:border-gray-600 
    hover:bg-gray-50 dark:hover:bg-gray-700 
    shadow-sm hover:shadow-md
    focus:ring-gray-400
  `,
  ghost: `
    text-gray-500 dark:text-gray-400 
    hover:text-gray-700 dark:hover:text-gray-200 
    hover:bg-gray-100 dark:hover:bg-gray-800
    focus:ring-gray-400
  `,
  danger: `
    bg-red-50 dark:bg-red-950/50 
    text-red-600 dark:text-red-400 
    border border-red-200 dark:border-red-800 
    hover:bg-red-100 dark:hover:bg-red-950/70
    focus:ring-red-500
  `,
  gradient: `
    relative overflow-hidden
    bg-gradient-to-r from-primary-600 via-red-500 to-orange-500
    text-white 
    shadow-md hover:shadow-lg
    bg-[length:200%_auto] hover:bg-[position:right_center]
    focus:ring-primary-500
  `,
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center 
        font-medium rounded-lg 
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        dark:focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
}
