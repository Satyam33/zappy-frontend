import { ArrowUpDown, Plus, RefreshCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { TemplateCard } from '@/pages/Templates/TemplateCard'
import { NewTemplateModal } from '@/pages/Templates/NewTemplateModal'
import { TEMPLATE_DATE_FILTER_OPTIONS, TEMPLATE_PAGE_SIZE_OPTIONS, TEMPLATE_SOURCE_TABS, useTemplatesPageController } from '@/controllers/templates.controller'
import type { Template } from '@/types/template.types'
import { formatDateTime } from '@/utils/formatters'

export default function Templates() {
  const {
    templates,
    customStatus,
    sourceTab,
    search,
    dateFilter,
    customStartDate,
    customEndDate,
    sortOrder,
    selectedIds,
    page,
    pageSize,
    totalPages,
    loading,
    modalOpen,
    previewTemplate,
    setCustomStatus,
    setSourceTab,
    setSearch,
    setDateFilter,
    setCustomStartDate,
    setCustomEndDate,
    setSortOrder,
    setSelectedIds,
    setPage,
    setPageSize,
    setModalOpen,
    setPreviewTemplate,
    createTemplate,
    syncStatus,
  } = useTemplatesPageController()

  const renderPreviewBody = (template: Template) => {
    const values = template.sample_values || {}
    return template.body.replace(/\{\{(\d+)\}\}/g, (_, key: string) => values[key] || `{{${key}}}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full lg:flex-1 lg:max-w-xs transition-colors focus-within:border-green-500">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search templates..."
            className="bg-transparent border-none outline-none text-[13.5px] text-gray-900 placeholder:text-gray-400 flex-1"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {TEMPLATE_SOURCE_TABS.map((tab) => (
            <Chip key={tab.key} active={sourceTab === tab.key} onClick={() => setSourceTab(tab.key)}>
              {tab.label}
            </Chip>
          ))}
        </div>
        {sourceTab === 'custom' ? (
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <select
              value={customStatus}
              onChange={(event) => setCustomStatus(event.target.value as 'all' | 'draft' | 'pending' | 'approved' | 'action_required')}
              className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-[12.5px] text-gray-700 outline-none focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="action_required">Action Required</option>
            </select>
            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value as '7d' | '15d' | '30d' | '90d' | 'custom' | 'all')}
              className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-[12.5px] text-gray-700 outline-none focus:border-green-500"
            >
              {TEMPLATE_DATE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            {dateFilter === 'custom' ? (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(event) => setCustomStartDate(event.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-[12.5px] text-gray-700 outline-none focus:border-green-500"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(event) => setCustomEndDate(event.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-[12.5px] text-gray-700 outline-none focus:border-green-500"
                />
              </>
            ) : null}
          </div>
        ) : <div className="flex-1" />}
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={<RefreshCcw size={14} />} onClick={() => void syncStatus()}>
            Sync Status
          </Button>
          <Button icon={<Plus size={14} />} onClick={() => setModalOpen(true)}>
            New Template
          </Button>
        </div>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={<span>📄</span>}
          title="No templates"
          subtitle={sourceTab === 'predefined' ? 'No predefined templates matched this filter.' : 'Create your first custom WhatsApp template.'}
          action={{ label: 'New Template', onClick: () => setModalOpen(true), icon: <Plus size={13} /> }}
        />
      ) : sourceTab === 'predefined' ? (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
      ) : (
        <Table
          columns={[
            {
              key: 'name',
              header: 'Template Name',
              render: (t) => <span className="td-primary">{t.name}</span>
            },
            {
              key: 'category',
              header: 'Category',
              render: (t) => <span className="text-[12.5px] text-gray-700 capitalize">{t.category}</span>
            },
            {
              key: 'language',
              header: 'Language',
              render: (t) => <span className="text-[12.5px] text-gray-700 uppercase">{t.language}</span>
            },
            {
              key: 'status',
              header: 'Status',
              render: (t) => {
                const cfg: Record<string, { variant: 'green' | 'amber' | 'gray' | 'red'; label: string }> = {
                  approved: { variant: 'green', label: 'Approved' },
                  pending: { variant: 'amber', label: 'Pending' },
                  draft: { variant: 'gray', label: 'Draft' },
                  action_required: { variant: 'red', label: 'Action Required' },
                }
                const item = cfg[t.status] || cfg.draft
                return <Badge variant={item.variant}>{item.label}</Badge>
              }
            },
            {
              key: 'created_at',
              header: (
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                  title="Sort by created date"
                >
                  Created At
                  <ArrowUpDown size={13} />
                </button>
              ),
              render: (t) => <span className="text-[12.5px] text-gray-700">{formatDateTime(t.created_at)}</span>
            },
          ]}
          data={templates}
          loading={loading}
          selectable
          selectedIds={selectedIds}
          onSelectAll={(checked) => setSelectedIds(checked ? templates.map((t) => t.id) : [])}
          onSelectRow={(id, checked) =>
            setSelectedIds((prev) => checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id))
          }
          emptyText="No custom templates found. Try a different filter."
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        pageSizeOptions={TEMPLATE_PAGE_SIZE_OPTIONS}
        loading={loading}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <NewTemplateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={createTemplate}
      />

      <Modal
        open={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        title={previewTemplate?.name || 'Template Preview'}
        subtitle="WhatsApp style preview"
        width="w-[480px]"
        fullWidthOnMobile={false}
        centerOnMobile
      >
        {previewTemplate && (
          <div className="space-y-3">
            <div className="bg-[#e9f7ee] rounded-xl p-3 border border-green-100">
              <p className="text-[13px] text-gray-800 whitespace-pre-wrap">{renderPreviewBody(previewTemplate)}</p>
            </div>
            {previewTemplate.interactive_actions?.length ? (
              <div className="flex flex-wrap gap-2">
                {previewTemplate.interactive_actions.map((action, idx) => (
                  <span key={`${action.type}-${idx}`} className="px-2.5 py-1 rounded-lg text-[11.5px] bg-gray-100 text-gray-700">
                    {action.type}: {action.title}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  )
}
