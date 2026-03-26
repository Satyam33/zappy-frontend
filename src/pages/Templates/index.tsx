import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Chip } from '../../components/ui/Chip'
import { EmptyState } from '../../components/shared/EmptyState'
import { TemplateCard } from './TemplateCard'
import { NewTemplateModal } from './NewTemplateModal'
import { mockTemplates } from '../../utils/mockData'
import type { Template, TemplateCategory } from '../../types/template.types'

type FilterType = 'all' | TemplateCategory

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all',            label: 'All' },
  { key: 'marketing',      label: 'Marketing' },
  { key: 'utility',        label: 'Utility' },
  { key: 'authentication', label: 'Authentication' },
]

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates)
  const [filter, setFilter] = useState<FilterType>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTemplate, setEditTemplate] = useState<Template | undefined>()

  const filtered = filter === 'all' ? templates : templates.filter(t => t.category === filter)

  const handleAdd = (t: Template) => {
    setTemplates(prev => {
      const existing = prev.findIndex(x => x.id === t.id)
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = t
        return next
      }
      return [t, ...prev]
    })
    setEditTemplate(undefined)
  }

  const handleDuplicate = (t: Template) => {
    const dup: Template = { ...t, id: Date.now().toString(), name: `${t.name}_copy`, status: 'pending', createdAt: new Date().toISOString() }
    setTemplates(prev => [dup, ...prev])
  }

  const handleResubmit = (id: string) => {
    const t = templates.find(x => x.id === id)
    if (t) { setEditTemplate(t); setModalOpen(true) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          {FILTERS.map(f => (
            <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</Chip>
          ))}
        </div>
        <Button icon={<Plus size={14} />} onClick={() => { setEditTemplate(undefined); setModalOpen(true) }}>
          New Template
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<span>📄</span>}
          title="No templates"
          subtitle="Create your first WhatsApp message template."
          action={{ label: 'New Template', onClick: () => setModalOpen(true), icon: <Plus size={13} /> }}
        />
      ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {filtered.map(t => (
            <TemplateCard key={t.id} template={t} onDuplicate={handleDuplicate} onResubmit={handleResubmit} />
          ))}
        </div>
      )}

      <NewTemplateModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTemplate(undefined) }}
        onAdd={handleAdd}
        initial={editTemplate}
      />
    </div>
  )
}
