import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/shared/EmptyState'
import { CampaignCard } from '@/pages/Campaigns/CampaignCard'
import { NewBroadcastModal } from '@/pages/Campaigns/NewBroadcastModal'
import { useCampaignsPageController } from '@/controllers/campaigns.controller'

export default function Campaigns() {
  const {
    campaigns,
    meta,
    loading,
    metaLoading,
    modalOpen,
    setModalOpen,
    approvedTemplates,
    previewAudience,
    createCampaign
  } = useCampaignsPageController()
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] text-gray-400">
          <strong className="text-gray-700">{campaigns.length}</strong> campaign{campaigns.length !== 1 ? 's' : ''}
        </p>
        <Button icon={<Plus size={14} />} onClick={() => setModalOpen(true)}>
          New Broadcast
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon={<span>📣</span>}
          title="No campaigns yet"
          subtitle="Create your first broadcast campaign to reach your customers on WhatsApp."
          action={{ label: 'New Broadcast', onClick: () => setModalOpen(true), icon: <Plus size={13} /> }}
        />
      ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
          {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      )}

      <NewBroadcastModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        creating={loading || metaLoading}
        meta={meta}
        templates={approvedTemplates}
        onPreviewAudience={previewAudience}
        onAdd={createCampaign}
      />
    </div>
  )
}
