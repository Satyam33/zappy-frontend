import { Plus, RefreshCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/shared/EmptyState'
import { Pagination } from '@/components/shared/Pagination'
import { Modal } from '@/components/ui/Modal'
import { TemplateCard } from '@/pages/Templates/TemplateCard'
import { NewTemplateModal } from '@/pages/Templates/NewTemplateModal'
import { TEMPLATE_PAGE_SIZE_OPTIONS, TEMPLATE_SOURCE_TABS, TEMPLATE_STATUS_TABS, useTemplatesPageController } from '@/controllers/templates.controller'
import type { Template } from '@/types/template.types'

export default function Templates() {
  const {
    templates,
    statusTab,
    sourceTab,
    search,
    page,
    pageSize,
    totalPages,
    loading,
    modalOpen,
    previewTemplate,
    setStatusTab,
    setSourceTab,
    setSearch,
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
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          {TEMPLATE_STATUS_TABS.map((tab) => (
            <Chip key={tab.key} active={statusTab === tab.key} onClick={() => setStatusTab(tab.key)}>
              {tab.label}
            </Chip>
          ))}
        </div>
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
      ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
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
