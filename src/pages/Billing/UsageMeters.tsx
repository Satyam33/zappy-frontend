import { AlertTriangle } from 'lucide-react'

interface UsageItem {
  label: string
  current: number
  limit: number
}

export const UsageMeters = ({ usage }: { usage: UsageItem[] }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
    <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900 mb-4">Usage This Month</h3>
    {usage.map(item => {
      const pct = item.limit > 0 ? Math.round((item.current / item.limit) * 100) : 0
      const isWarning = pct >= 80
      return (
        <div key={item.label} className="mb-4 last:mb-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-medium text-gray-700">{item.label}</span>
            <span className={`text-[12.5px] font-semibold ${isWarning ? 'text-amber-600' : 'text-gray-600'}`}>
              {item.current.toLocaleString()} / {item.limit > 0 ? item.limit.toLocaleString() : '∞'}
            </span>
          </div>
          {item.limit > 0 && (
            <>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isWarning ? 'bg-amber-500' : 'bg-green-600'}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              {isWarning && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertTriangle size={12} className="text-amber-500" />
                  <p className="text-[11.5px] text-amber-600">{pct}% of limit used. Consider upgrading.</p>
                </div>
              )}
            </>
          )}
        </div>
      )
    })}
  </div>
)
