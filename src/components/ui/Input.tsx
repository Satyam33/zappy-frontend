import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = '', ...props }, ref) => (
    <div className="mb-0">
      {label && <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px]
            font-[DM_Sans,sans-serif] text-gray-900 outline-none transition-colors
            placeholder:text-gray-400
            hover:border-gray-300
            focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,173,82,0.12)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100
            read-only:opacity-65 read-only:cursor-default
            ${error ? 'border-red-400 bg-red-50/30 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]' : ''}
            ${icon ? 'pl-9' : ''}
            ${className}`}
        />
      </div>
      {error && <p className="text-[11.5px] text-red-600 mt-1.5 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-[11.5px] text-gray-400 mt-1.5">{hint}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: number
  maxChars?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, charCount, maxChars, className = '', ...props }, ref) => (
    <div className="mb-0">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[12.5px] font-medium text-gray-500">{label}</label>
          {maxChars !== undefined && <span className="text-[11px] text-gray-400">{charCount ?? 0}/{maxChars}</span>}
        </div>
      )}
      <textarea
        ref={ref}
        {...props}
        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px]
          font-[DM_Sans,sans-serif] text-gray-900 outline-none transition-colors resize-y min-h-[90px] leading-relaxed
          placeholder:text-gray-400
          hover:border-gray-300
          focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,173,82,0.12)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400 bg-red-50/30' : ''}
          ${className}`}
      />
      {error && <p className="text-[11.5px] text-red-600 mt-1.5">{error}</p>}
      {hint && !error && <p className="text-[11.5px] text-gray-400 mt-1.5">{hint}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = ({ label, error, hint, options, placeholder, className = '', ...props }: SelectProps) => (
  <div className="mb-0">
    {label && <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">{label}</label>}
    <select
      {...props}
      className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px]
        font-[DM_Sans,sans-serif] text-gray-900 outline-none transition-colors cursor-pointer
        hover:border-gray-300
        focus:border-green-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,173,82,0.12)]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-red-400' : ''}
        ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-[11.5px] text-red-600 mt-1.5">{error}</p>}
    {hint && !error && <p className="text-[11.5px] text-gray-400 mt-1.5">{hint}</p>}
  </div>
)
