import { Badge } from '../../components/ui/Badge'
import type { Campaign } from '../../types/campaign.types'
import { formatDate, formatDateTime } from '../../utils/formatters'

const statusConfig = {
  running:   { v: 'blue'  as const, dot: true,  label: 'Running' },
  completed: { v: 'green' as const, dot: false, label: 'Completed' },
  scheduled: { v: 'amber' as const, dot: false, label: 'Scheduled' },
  failed:    { v: 'red'   as const, dot: false, label: 'Failed' },
  draft:     { v: 'gray'  as const, dot: false, label: 'Draft' },
}

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const sc = statusConfig[campaign.status]
  const pct = (n: number) => campaign.stats.sent
    ? `${Math.round((n / campaign.stats.sent) * 100)}%` : '—'

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all hover:border-gray-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900 truncate">{campaign.name}</h3>
          <p className="text-[12px] text-gray-400 mt-0.5">{campaign.segment} · {campaign.templateName}</p>
        </div>
        <Badge variant={sc.v} dot={sc.dot} className="ml-2 flex-shrink-0">{sc.label}</Badge>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
        {[
          { label: 'Sent',     value: campaign.stats.sent.toLocaleString() },
          { label: 'Read %',   value: pct(campaign.stats.read) },
          { label: 'Reply %',  value: pct(campaign.stats.replied) },
          { label: 'Failed',   value: campaign.stats.failed.toLocaleString() },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="font-[Syne,sans-serif] text-[15px] font-bold text-gray-900">{stat.value}</p>
            <p className="text-[10.5px] text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="text-[11.5px] text-gray-400 mt-3">
        {campaign.scheduledAt
          ? `Scheduled: ${formatDateTime(campaign.scheduledAt)}`
          : campaign.sentAt
            ? `Sent: ${formatDate(campaign.sentAt)}`
            : `Created: ${formatDate(campaign.createdAt)}`}
      </p>
    </div>
  )
}
