import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { CampaignAudience, CampaignTemplateMeta, CampaignsMeta } from '@/types/campaign.types'

interface Props {
  open: boolean
  onClose: () => void
  creating?: boolean
  meta: CampaignsMeta | null
  templates: CampaignTemplateMeta[]
  onPreviewAudience: (audience: CampaignAudience) => Promise<{ selectedAudience: number; finalAudience: number; message?: string }>
  onAdd: (payload: {
    name: string
    templateId: string
    audience: CampaignAudience
    parameterMapping: Record<string, string>
    scheduleNow: boolean
    scheduledAt?: string
  }) => Promise<boolean>
}

/** Internal select value; API receives the typed static string instead */
const STATIC_VALUE_SENTINEL = '__static__'

export const NewBroadcastModal = ({ open, onClose, creating, meta, templates, onPreviewAudience, onAdd }: Props) => {
  const [name, setName] = useState('')
  const [templateSearch, setTemplateSearch] = useState('')
  const [templateId, setTemplateId] = useState('')
  const [segmentKey, setSegmentKey] = useState('all')
  const [scheduleNow, setScheduleNow] = useState(true)
  const [scheduledAt, setScheduledAt] = useState('')
  const [selectedAudience, setSelectedAudience] = useState(0)
  const [finalAudience, setFinalAudience] = useState(0)
  const [parameterMapping, setParameterMapping] = useState<Record<string, string>>({})
  /** Same text for every contact when parameter mode is custom/static */
  const [parameterStaticValues, setParameterStaticValues] = useState<Record<string, string>>({})

  const filteredTemplates = useMemo(
    () => templates.filter((t) => t.name.toLowerCase().includes(templateSearch.toLowerCase())),
    [templates, templateSearch]
  )
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === templateId) || null,
    [templates, templateId]
  )

  const audience = useMemo<CampaignAudience>(() => {
    if (segmentKey.startsWith('tag:')) return { mode: 'tag', tag: segmentKey.slice(4) }
    return { mode: 'all' }
  }, [segmentKey])

  useEffect(() => {
    if (!open) return
    void onPreviewAudience(audience).then((data) => {
      setSelectedAudience(data.selectedAudience)
      setFinalAudience(data.finalAudience)
    })
  }, [open, audience, onPreviewAudience])

  const buildParameterMappingForApi = (): Record<string, string> => {
    if (!selectedTemplate?.variables?.length) return {}
    const out: Record<string, string> = {}
    for (const v of selectedTemplate.variables) {
      const key = String(v)
      const sel = parameterMapping[key] || ''
      if (sel === STATIC_VALUE_SENTINEL) {
        out[key] = (parameterStaticValues[key] ?? '').trim()
      } else {
        out[key] = sel
      }
    }
    return out
  }

  const handleSubmit = async () => {
    if (!name.trim() || !templateId) return
    if (!scheduleNow && !scheduledAt) return
    const ok = await onAdd({
      name: name.trim(),
      templateId,
      audience,
      parameterMapping: buildParameterMappingForApi(),
      scheduleNow,
      scheduledAt: scheduleNow ? undefined : scheduledAt
    })
    if (!ok) return
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Campaign"
      subtitle="Create and send broadcast using approved templates"
      width="w-[980px]"
      fullWidthOnMobile={false}
      centerOnMobile
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 rounded-xl bg-[#edf5f1] border border-[#dfebe4] p-3">
          <div>
            <p className="text-[11px] text-gray-500">Quality Rating</p>
            <p className="text-[13px] font-semibold text-green-700">{meta?.qualityRating || 'UNKNOWN'}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Template Messaging Tier</p>
            <p className="text-[13px] font-semibold text-gray-800">{meta?.messagingTier || 'TIER_1'}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Remaining Quota</p>
            <p className="text-[18px] font-semibold text-gray-800">{meta?.remainingQuota ?? 0}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Selected Audience</p>
            <p className="text-[18px] font-semibold text-gray-800">{selectedAudience}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Final Audience</p>
            <p className="text-[18px] font-semibold text-gray-800">{finalAudience}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-4">
          <div className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Campaign name"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors"
            />

            <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <input
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search template..."
                className="bg-transparent border-none outline-none text-[13px] flex-1"
              />
              <Search size={14} className="text-gray-400" />
            </div>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-green-500"
            >
              <option value="">Select template</option>
              {filteredTemplates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>

            <select
              value={segmentKey}
              onChange={(e) => setSegmentKey(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-green-500"
            >
              {(meta?.segments || [{ key: 'all', label: 'All' }]).map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>

            <div>
              <p className="text-[12px] text-gray-600 mb-2">Parameters</p>
              {!selectedTemplate?.variables.length ? (
                <p className="text-[12px] text-gray-400">No variables found in selected template body.</p>
              ) : (
                <div className="space-y-2">
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable} className="grid grid-cols-[44px_1fr] gap-2 items-start">
                      <div className="text-[13px] text-gray-700 pt-2">{variable}</div>
                      <div className="space-y-1.5">
                        <select
                          value={parameterMapping[variable] || ''}
                          onChange={(e) => {
                            const val = e.target.value
                            setParameterMapping((prev) => ({ ...prev, [variable]: val }))
                            if (val !== STATIC_VALUE_SENTINEL) {
                              setParameterStaticValues((prev) => {
                                const next = { ...prev }
                                delete next[variable]
                                return next
                              })
                            }
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-green-500"
                        >
                          <option value="">Type or select an attribute</option>
                          {(meta?.dynamicAttributes || []).map((attr) => (
                            <option key={attr.key} value={attr.key}>{attr.label}</option>
                          ))}
                          <option value={STATIC_VALUE_SENTINEL}>Custom value (same for all)</option>
                        </select>
                        {parameterMapping[variable] === STATIC_VALUE_SENTINEL && (
                          <input
                            type="text"
                            value={parameterStaticValues[variable] ?? ''}
                            onChange={(e) =>
                              setParameterStaticValues((prev) => ({ ...prev, [variable]: e.target.value }))
                            }
                            placeholder="Static text for every recipient"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-900 outline-none focus:border-green-500 placeholder:text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <p className="text-[11px] text-gray-500 mb-2">Template Preview</p>
            <div className="rounded-lg border border-[#e8d9bf] bg-[#f7efe1] p-3 min-h-[240px]">
              <p className="text-[12.5px] text-gray-800 whitespace-pre-wrap">
                {selectedTemplate
                  ? selectedTemplate.body.replace(/\{\{(\d+)\}\}/g, (_, key: string) => {
                    const source = parameterMapping[key]
                    if (!source) return `{{${key}}}`
                    if (source === STATIC_VALUE_SENTINEL) {
                      const t = (parameterStaticValues[key] ?? '').trim()
                      return t || '(custom text)'
                    }
                    if (source === 'contact.name') return '{$Name}'
                    if (source === 'contact.phone') return '{$MobileNumber}'
                    return source
                  })
                  : 'Select a template to preview'}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input id="scheduleNow" type="checkbox" checked={scheduleNow} onChange={(e) => setScheduleNow(e.target.checked)} />
              <label htmlFor="scheduleNow" className="text-[12px] text-gray-700">Send now</label>
            </div>
            {!scheduleNow && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-2 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[13px]"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => void handleSubmit()} loading={Boolean(creating)}>
            {scheduleNow ? 'Send Broadcast' : 'Schedule Campaign'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
