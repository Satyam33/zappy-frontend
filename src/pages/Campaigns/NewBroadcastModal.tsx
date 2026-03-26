import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Toggle } from '../../components/ui/Toggle'
import { newCampaignSchema } from '../../utils/validators'
import { mockTemplates } from '../../utils/mockData'
import { SEGMENTS } from '../../utils/constants'
import toast from 'react-hot-toast'
import type { Campaign } from '../../types/campaign.types'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (campaign: Campaign) => void
}

const approvedTemplates = mockTemplates.filter(t => t.status === 'approved')

export const NewBroadcastModal = ({ open, onClose, onAdd }: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    title="New Broadcast"
    subtitle="Create a WhatsApp broadcast campaign."
  >
    <Formik
      initialValues={{ name: '', templateId: '', segment: '', scheduleNow: true, scheduledAt: '' }}
      validationSchema={newCampaignSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          const tpl = approvedTemplates.find(t => t.id === values.templateId)
          const newCampaign: Campaign = {
            id: Date.now().toString(),
            name: values.name,
            segment: values.segment,
            templateId: values.templateId,
            templateName: tpl?.name,
            status: values.scheduleNow ? 'running' : 'scheduled',
            scheduledAt: values.scheduleNow ? undefined : values.scheduledAt,
            sentAt: values.scheduleNow ? new Date().toISOString() : undefined,
            stats: { sent: 0, delivered: 0, read: 0, replied: 0, failed: 0 },
            createdAt: new Date().toISOString(),
          }
          onAdd(newCampaign)
          toast.success('Campaign created!')
          resetForm()
          setSubmitting(false)
          onClose()
        }, 800)
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Campaign name *</label>
            <Field name="name" placeholder="e.g. Holi Sale 2026"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            <ErrorMessage name="name" component="p" className="text-[11.5px] text-red-600 mt-1" />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Template *</label>
            <Field as="select" name="templateId"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select a template</option>
              {approvedTemplates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </Field>
            <ErrorMessage name="templateId" component="p" className="text-[11.5px] text-red-600 mt-1" />
            <p className="text-[11.5px] text-gray-400 mt-1">Only Meta-approved templates are shown</p>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Target segment *</label>
            <Field as="select" name="segment"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="">Select segment</option>
              {SEGMENTS.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Field>
            <ErrorMessage name="segment" component="p" className="text-[11.5px] text-red-600 mt-1" />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-2">Schedule</label>
            <Toggle
              checked={values.scheduleNow}
              onChange={v => setFieldValue('scheduleNow', v)}
              label={values.scheduleNow ? 'Send now' : 'Schedule later'}
            />
            {!values.scheduleNow && (
              <div className="mt-3">
                <Field name="scheduledAt" type="datetime-local"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors"
                />
                <ErrorMessage name="scheduledAt" component="p" className="text-[11.5px] text-red-600 mt-1" />
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <p className="text-[11.5px] text-amber-700">
              Only opted-in contacts will receive this broadcast. Sending to opted-out contacts is blocked.
            </p>
          </div>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-gray-100 mt-5">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>
              {values.scheduleNow ? 'Send Now' : 'Schedule Broadcast'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  </Modal>
)
