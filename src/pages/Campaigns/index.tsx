import { BarChart3, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { NewBroadcastModal } from '@/pages/Campaigns/NewBroadcastModal'
import { useCampaignsPageController } from '@/controllers/campaigns.controller'
import { formatDateTime } from '@/utils/formatters'
import { useMemo, useState } from 'react'
import type { Campaign } from '@/types/campaign.types'

const statusConfig = {
  running: { v: 'blue' as const, label: 'Running' },
  completed: { v: 'green' as const, label: 'Completed' },
  scheduled: { v: 'amber' as const, label: 'Scheduled' },
  failed: { v: 'red' as const, label: 'Failed' },
  draft: { v: 'gray' as const, label: 'Draft' },
}

const CAMPAIGN_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export default function Campaigns() {
  const {
    campaigns,
    search,
    page,
    pageSize,
    total,
    totalPages,
    meta,
    loading,
    metaLoading,
    modalOpen,
    setModalOpen,
    approvedTemplates,
    previewAudience,
    createCampaign,
    setSearch,
    setPage,
    setPageSize
  } = useCampaignsPageController()

  const [analyticsTarget, setAnalyticsTarget] = useState<Campaign | null>(null)
  const analyticsRows = useMemo(() => {
    if (!analyticsTarget) return []
    const sent = analyticsTarget.stats?.sent || 0
    const delivered = analyticsTarget.stats?.delivered || 0
    const read = analyticsTarget.stats?.read || 0
    const replied = analyticsTarget.stats?.replied || 0
    const failed = analyticsTarget.stats?.failed || 0
    const pct = (value: number) => sent ? `${Math.round((value / sent) * 100)}%` : '0%'
    return [
      { label: 'Sent', value: sent.toLocaleString(), rate: '100%' },
      { label: 'Delivered', value: delivered.toLocaleString(), rate: pct(delivered) },
      { label: 'Read', value: read.toLocaleString(), rate: pct(read) },
      { label: 'Replied', value: replied.toLocaleString(), rate: pct(replied) },
      { label: 'Failed', value: failed.toLocaleString(), rate: pct(failed) },
    ]
  }, [analyticsTarget])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] text-gray-400">
          <strong className="text-gray-700">{total}</strong> campaign{total !== 1 ? 's' : ''}
        </p>
        <Button icon={<Plus size={14} />} onClick={() => setModalOpen(true)}>
          New Broadcast
        </Button>
      </div>

      <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full lg:max-w-sm">
        <Search size={14} className="text-gray-400 shrink-0" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by campaign or template..."
          className="bg-transparent border-none outline-none text-[13.5px] text-gray-900 placeholder:text-gray-400 flex-1"
        />
      </div>

      {!loading && campaigns.length === 0 ? (
        <EmptyState
          icon={<span>📣</span>}
          title="No campaigns yet"
          subtitle="Create your first broadcast campaign to reach your customers on WhatsApp."
          action={{ label: 'New Broadcast', onClick: () => setModalOpen(true), icon: <Plus size={13} /> }}
        />
      ) : (
        <Table
          columns={[
            {
              key: 'campaign',
              header: 'Campaign',
              render: (c) => (
                <div>
                  <p className="text-[13.5px] font-semibold text-gray-900">{c.name}</p>
                  <p className="text-[12px] text-gray-500">{c.templateName}</p>
                </div>
              ),
            },
            {
              key: 'createdAt',
              header: 'Created At',
              render: (c) => <span className="text-[12.5px] text-gray-700">{formatDateTime(c.createdAt)}</span>,
            },
            {
              key: 'status',
              header: 'Status',
              render: (c) => {
                const sc = statusConfig[c.status]
                return <Badge variant={sc.v}>{sc.label}</Badge>
              },
            },
            {
              key: 'audience',
              header: 'Audience',
              render: (c) => (
                <span className="text-[12.5px] text-gray-700">
                  {(c.finalAudience ?? c.selectedAudience ?? c.stats.sent ?? 0).toLocaleString()}
                </span>
              ),
            },
            {
              key: 'delivery',
              header: 'Delivery Status',
              render: (c) => (
                <div className="text-[12px] text-gray-600">
                  <p>Sent: {c.stats.sent}</p>
                  <p>Failed: {c.stats.failed}</p>
                </div>
              ),
            },
            {
              key: 'analytics',
              header: 'Analytics',
              width: '90px',
              render: (c) => (
                <button
                  onClick={(event) => {
                    event.stopPropagation()
                    setAnalyticsTarget(c)
                  }}
                  className="w-8 h-8 rounded-md border border-gray-200 bg-white text-gray-600 hover:text-violet-700 hover:border-violet-200 hover:bg-violet-50 transition-colors flex items-center justify-center"
                  title="View analytics"
                >
                  <BarChart3 size={15} />
                </button>
              ),
            },
          ]}
          data={campaigns}
          loading={loading}
          emptyText="No campaigns found. Try a different search."
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={CAMPAIGN_PAGE_SIZE_OPTIONS}
        loading={loading}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <NewBroadcastModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        creating={loading || metaLoading}
        meta={meta}
        templates={approvedTemplates}
        onPreviewAudience={previewAudience}
        onAdd={createCampaign}
      />

      <Modal
        open={Boolean(analyticsTarget)}
        onClose={() => setAnalyticsTarget(null)}
        title={analyticsTarget ? `${analyticsTarget.name} Analytics` : 'Campaign Analytics'}
        subtitle="Campaign-wise performance snapshot"
        width="w-[560px]"
        fullWidthOnMobile={false}
        centerOnMobile
      >
        {analyticsTarget ? (
          <div className="space-y-2">
            {analyticsRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 bg-gray-50">
                <p className="text-[13px] text-gray-700">{row.label}</p>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-gray-900">{row.value}</p>
                  <p className="text-[11px] text-gray-500">{row.rate}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
