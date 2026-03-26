import { Loader2 } from 'lucide-react'
import React from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'accent'
type Size    = 'xs' | 'sm' | 'md'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-green-600 text-white font-semibold border-transparent hover:bg-green-700 hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(26,173,82,0.25)]',
  ghost:   'bg-transparent text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300',
  danger:  'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100',
  accent:  'bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100',
}

const sizeClasses: Record<Size, string> = {
  md: 'px-4 py-2 text-[13px]',
  sm: 'px-3 py-1.5 text-[12px]',
  xs: 'px-2.5 py-1 text-[11.5px]',
}

export const Button = ({
  variant = 'primary', size = 'md', loading, icon, children, disabled, className = '', ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`inline-flex items-center gap-1.5 rounded-lg font-medium border transition-all cursor-pointer
      ${variantClasses[variant]} ${sizeClasses[size]}
      ${(disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      ${className}`}
  >
    {loading ? <Loader2 size={14} className="animate-spin" /> : icon && <span className="w-3.5 h-3.5 flex-shrink-0">{icon}</span>}
    {children}
  </button>
)
