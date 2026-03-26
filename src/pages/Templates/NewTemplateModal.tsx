import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { newTemplateSchema } from '../../utils/validators'
import { TEMPLATE_CATEGORIES, LANGUAGES } from '../../utils/constants'
import type { Template } from '../../types/template.types'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (t: Template) => void
  initial?: Partial<Template>
}

export const NewTemplateModal = ({ open, onClose, onAdd, initial }: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    title={initial ? 'Edit & Resubmit Template' : 'New Template'}
    subtitle="Templates must be approved by Meta before use."
  >
    <Formik
      initialValues={{
        name:     initial?.name ?? '',
        category: initial?.category ?? '',
        language: initial?.language ?? 'en',
        body:     initial?.body ?? '',
      }}
      validationSchema={newTemplateSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          const newTpl: Template = {
            id: initial?.id ?? Date.now().toString(),
            name: values.name,
            category: values.category as Template['category'],
            language: values.language,
            body: values.body,
            status: 'pending',
            createdAt: new Date().toISOString(),
          }
          onAdd(newTpl)
          toast.success('Template submitted for approval')
          resetForm()
          setSubmitting(false)
          onClose()
        }, 700)
      }}
    >
      {({ isSubmitting, values }) => (
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

          <div className="flex gap-2.5 justify-end pt-4 border-t border-gray-100 mt-5">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Submit for Approval</Button>
          </div>
        </Form>
      )}
    </Formik>
  </Modal>
)
