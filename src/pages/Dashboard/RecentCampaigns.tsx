import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Table } from '../../components/ui/Table'
import type { Campaign } from '../../types/campaign.types'
import { formatDate } from '../../utils/formatters'

const statusBadge = (s: Campaign['status']) => {
  const map = {
    running:   { v: 'blue'  as const, dot: true,  label: 'Running' },
    completed: { v: 'green' as const, dot: false, label: 'Completed' },
    scheduled: { v: 'amber' as const, dot: false, label: 'Scheduled' },
    failed:    { v: 'red'   as const, dot: false, label: 'Failed' },
    draft:     { v: 'gray'  as const, dot: false, label: 'Draft' },
  }
  const m = map[s]
  return <Badge variant={m.v} dot={m.dot}>{m.label}</Badge>
}

export const RecentCampaigns = ({ campaigns }: { campaigns: Campaign[] }) => (
  <div className="bg-white border border-gray-100 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900">Recent Campaigns</h3>
      <Link to="/campaigns" className="text-[12px] text-green-600 hover:text-green-700 flex items-center gap-1 font-medium">
        View all <ArrowRight size={12} />
      </Link>
    </div>
    <Table
      columns={[
        { key: 'name',     header: 'Campaign',  render: r => <span className="td-primary">{r.name}</span> },
        { key: 'segment',  header: 'Segment',   render: r => r.segment },
        { key: 'status',   header: 'Status',    render: r => statusBadge(r.status) },
        { key: 'sent',     header: 'Sent',      render: r => r.stats.sent.toLocaleString() },
        { key: 'read',     header: 'Read %',    render: r => r.stats.sent ? `${Math.round((r.stats.read / r.stats.sent) * 100)}%` : '—' },
        { key: 'date',     header: 'Date',      render: r => formatDate(r.sentAt ?? r.createdAt) },
      ]}
      data={campaigns}
      emptyText="No campaigns yet"
    />
  </div>
)
