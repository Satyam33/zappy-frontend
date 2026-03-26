type FillColor = 'green' | 'blue' | 'amber' | 'red' | 'accent'

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color?: FillColor
  showPercent?: boolean
  showCount?: boolean
  warning?: boolean
}

export const ProgressBar = ({
  label, value, max, color = 'green', showPercent, showCount, warning,
}: ProgressBarProps) => {
  const pct = max ? Math.round((value / max) * 100) : 0
  const displayColor = warning && pct >= 80 ? 'red' : pct >= 80 ? 'amber' : color

  return (
    <div className="flex items-center gap-2.5 mb-[11px]">
      <span className="text-[12.5px] text-gray-500 w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`progress-fill fill-${displayColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-[12px] text-gray-500 w-9 text-right font-[Syne,sans-serif] font-semibold flex-shrink-0">
        {showPercent ? `${pct}%` : showCount ? value.toLocaleString() : `${pct}%`}
      </span>
    </div>
  )
}
