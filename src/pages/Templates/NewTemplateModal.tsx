import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { newTemplateSchema } from '@/utils/validators'
import { TEMPLATE_CATEGORIES, LANGUAGES } from '@/utils/constants'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (payload: {
    name: string
    category: string
    language: string
    templateType: string
    body: string
    sampleValues: Record<string, string>
    interactiveMode: 'none' | 'cta' | 'quick_replies' | 'all'
    interactiveActions: Array<{ type: string; title: string; value?: string }>
    submitAs: 'draft' | 'pending'
  }) => Promise<boolean>
}

const TEMPLATE_TYPES = ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT', 'LOCATION', 'CAROUSEL', 'LIMITED_TIME_OFFER'] as const
const INTERACTIVE_MODES = [
  { value: 'none', label: 'None' },
  { value: 'cta', label: 'Call to Actions' },
  { value: 'quick_replies', label: 'Quick Replies' },
  { value: 'all', label: 'All' },
] as const

export const NewTemplateModal = ({ open, onClose, onAdd }: Props) => {
  const [submitAs, setSubmitAs] = useState<'draft' | 'pending'>('pending')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Template"
      subtitle="Create custom template with variables and interactive actions."
      width="w-[860px]"
    >
      <Formik
        initialValues={{
          name: '',
          category: '',
          language: 'en',
          templateType: 'TEXT',
          body: '',
          interactiveMode: 'none' as 'none' | 'cta' | 'quick_replies' | 'all',
          ctaType: 'URL' as 'URL' | 'PHONE',
          ctaTitle: '',
          ctaValue: '',
          quickReply1: '',
          quickReply2: '',
          quickReply3: '',
          allQuickReplies: '',
          allUrl: '',
          allPhone: '',
          allCopyCode: '',
        }}
        validationSchema={newTemplateSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          const variableMatches = [...values.body.matchAll(/\{\{(\d+)\}\}/g)].map((m) => m[1])
          const uniqueVariables = Array.from(new Set(variableMatches)).sort((a, b) => Number(a) - Number(b))
          const sampleValues: Record<string, string> = {}
          uniqueVariables.forEach((v) => {
            sampleValues[v] = (values as Record<string, string>)[`sample_${v}`] || ''
          })

          const interactiveActions: Array<{ type: string; title: string; value?: string }> = []
          if (values.interactiveMode === 'cta') {
            interactiveActions.push({ type: values.ctaType, title: values.ctaTitle, value: values.ctaValue })
          } else if (values.interactiveMode === 'quick_replies') {
            ;[values.quickReply1, values.quickReply2, values.quickReply3].filter(Boolean).forEach((text) => {
              interactiveActions.push({ type: 'QUICK_REPLY', title: text })
            })
          } else if (values.interactiveMode === 'all') {
            ;(values.allQuickReplies || '').split(',').map((v) => v.trim()).filter(Boolean).forEach((text) => {
              interactiveActions.push({ type: 'QUICK_REPLY', title: text })
            })
            if (values.allUrl) interactiveActions.push({ type: 'URL', title: 'Open URL', value: values.allUrl })
            if (values.allPhone) interactiveActions.push({ type: 'PHONE', title: 'Call', value: values.allPhone })
            if (values.allCopyCode) interactiveActions.push({ type: 'COPY_CODE', title: 'Copy Code', value: values.allCopyCode })
          }

          const created = await onAdd({
            name: values.name,
            category: values.category,
            language: values.language,
            templateType: values.templateType,
            body: values.body,
            sampleValues,
            interactiveMode: values.interactiveMode,
            interactiveActions,
            submitAs,
          })

          if (created) {
            resetForm()
            onClose()
          }
          setSubmitting(false)
        }}
      >
        {({ isSubmitting, values }) => {
          const variableKeys = Array.from(
            new Set([...values.body.matchAll(/\{\{(\d+)\}\}/g)].map((m) => m[1]))
          ).sort((a, b) => Number(a) - Number(b))
          return (
            <Form className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">
              Template name *
            </label>
            <Field name="name" placeholder="e.g. holi_sale_offer"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 font-mono outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            <ErrorMessage name="name" component="p" className="text-[11.5px] text-red-600 mt-1" />
            <p className="text-[11.5px] text-gray-400 mt-1">Only lowercase letters, numbers and underscores</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Category *</label>
              <Field as="select" name="category"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer capitalize"
              >
                <option value="">Select category</option>
                {TEMPLATE_CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </Field>
              <ErrorMessage name="category" component="p" className="text-[11.5px] text-red-600 mt-1" />
            </div>
            <div>
              <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Language *</label>
              <Field as="select" name="language"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </Field>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Template Type *</label>
            <Field as="select" name="templateType"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer"
            >
              {TEMPLATE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12.5px] font-medium text-gray-500">Message body *</label>
              <span className="text-[11px] text-gray-400">{values.body.length}/1024</span>
            </div>
            <Field
              as="textarea"
              name="body"
              rows={5}
              placeholder="Hi {{1}}, your order has been confirmed!"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none resize-y min-h-[100px] leading-relaxed focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            <ErrorMessage name="body" component="p" className="text-[11.5px] text-red-600 mt-1" />
            <p className="text-[11.5px] text-gray-400 mt-1">Use {`{{1}}`}, {`{{2}}`} for variables</p>
          </div>

          {variableKeys.length > 0 && (
            <div className="space-y-2">
              <p className="text-[12.5px] font-medium text-gray-500">Sample values for variables</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {variableKeys.map((key) => (
                  <div key={key}>
                    <label className="block text-[11.5px] text-gray-500 mb-1">{`{{${key}}}`}</label>
                    <Field
                      name={`sample_${key}`}
                      placeholder={`Sample for {{${key}}}`}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 border-t border-gray-100 pt-3">
            <p className="text-[12.5px] font-medium text-gray-500">Interactive Actions</p>
            <div className="flex flex-wrap gap-4">
              {INTERACTIVE_MODES.map((mode) => (
                <label key={mode.value} className="flex items-center gap-1.5 text-[13px] text-gray-700">
                  <Field type="radio" name="interactiveMode" value={mode.value} />
                  {mode.label}
                </label>
              ))}
            </div>

            {values.interactiveMode === 'cta' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Field as="select" name="ctaType" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]">
                  <option value="URL">URL</option>
                  <option value="PHONE">Phone Number</option>
                </Field>
                <Field name="ctaTitle" placeholder="Button title" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                <Field name="ctaValue" placeholder="Button value" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
              </div>
            )}

            {values.interactiveMode === 'quick_replies' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Field name="quickReply1" placeholder="Quick reply 1" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                <Field name="quickReply2" placeholder="Quick reply 2" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                <Field name="quickReply3" placeholder="Quick reply 3" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
              </div>
            )}

            {values.interactiveMode === 'all' && (
              <div className="space-y-2">
                <Field name="allQuickReplies" placeholder="Quick replies (comma separated)" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Field name="allUrl" placeholder="URL" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                  <Field name="allPhone" placeholder="Phone Number" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                  <Field name="allCopyCode" placeholder="Copy Code value" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[12.5px]" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-gray-100 mt-5">
            <Button
              variant="ghost"
              type="submit"
              loading={isSubmitting}
              onClick={() => setSubmitAs('draft')}
            >
              Save Draft
            </Button>
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} onClick={() => setSubmitAs('pending')}>
              Submit for Approval
            </Button>
          </div>
        </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}
