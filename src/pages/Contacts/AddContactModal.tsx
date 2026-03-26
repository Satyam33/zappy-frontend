import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { addContactSchema } from '../../utils/validators'
import toast from 'react-hot-toast'

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (contact: { name: string; phone: string; tags: string[] }) => void
}

const TAG_OPTIONS = ['VIP', 'New Customer', 'Repeat', 'Inactive']

export const AddContactModal = ({ open, onClose, onAdd }: Props) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Add Contact"
    subtitle="Add a new opted-in contact to your list."
  >
    <Formik
      initialValues={{ name: '', phone: '', tags: [] as string[] }}
      validationSchema={addContactSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          onAdd(values)
          toast.success('Contact added successfully')
          resetForm()
          setSubmitting(false)
          onClose()
        }, 600)
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Full name *</label>
            <Field name="name" placeholder="e.g. Priya Sharma"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            <ErrorMessage name="name" component="p" className="text-[11.5px] text-red-600 mt-1" />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Phone number *</label>
            <Field name="phone" placeholder="+91 98765 43210"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
            />
            <ErrorMessage name="phone" component="p" className="text-[11.5px] text-red-600 mt-1" />
            <p className="text-[11.5px] text-gray-400 mt-1">E.164 format, e.g. +919876543210</p>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map(tag => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => {
                    const tags = values.tags.includes(tag)
                      ? values.tags.filter(t => t !== tag)
                      : [...values.tags, tag]
                    setFieldValue('tags', tags)
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer
                    ${values.tags.includes(tag) ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 justify-end pt-4 border-t border-gray-100 mt-5">
            <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Add Contact</Button>
          </div>
        </Form>
      )}
    </Formik>
  </Modal>
)
