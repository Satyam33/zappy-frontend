interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export const Toggle = ({ checked, onChange, label, disabled }: ToggleProps) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-[22px] rounded-full border-none transition-colors flex-shrink-0
        ${checked ? 'bg-green-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`absolute w-4 h-4 bg-white rounded-full top-[3px] left-[3px]
        shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform
        ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
      />
    </button>
    {label && <span className="text-[13.5px] text-gray-700">{label}</span>}
  </label>
)
