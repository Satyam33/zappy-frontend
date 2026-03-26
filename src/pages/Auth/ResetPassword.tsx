import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import * as Yup from 'yup'
import { Button } from '../../components/ui/Button'
import { useAuthController } from '../../controllers/auth.controller'

const resetSchema = Yup.object({
  token: Yup.string().required('Reset token is required'),
  password: Yup.string().required('Password is required').min(6, 'Min 6 characters'),
})

export default function ResetPassword() {
  const authController = useAuthController()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-green-600 rounded-[10px] flex items-center justify-center">
            <Zap size={19} className="text-white" />
          </div>
          <span className="font-[Syne,sans-serif] font-extrabold text-[20px] text-gray-900 tracking-tight">
            Zapp<span className="text-green-600">y</span>
          </span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h1 className="font-[Syne,sans-serif] text-[22px] font-bold text-gray-900 mb-1">Reset password</h1>
          <p className="text-[13px] text-gray-500 mb-6">Use the token from your reset email</p>
          <Formik
            initialValues={{ token: '', password: '' }}
            validationSchema={resetSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const result = await authController.resetPassword(values.token, values.password)
              if (result.ok) {
                resetForm()
              }
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Reset token</label>
                  <Field
                    name="token"
                    type="text"
                    placeholder="Paste reset token"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                  />
                  <ErrorMessage name="token" component="p" className="text-[11.5px] text-red-600 mt-1" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">New password</label>
                  <Field
                    name="password"
                    type="password"
                    placeholder="New strong password"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                  />
                  <ErrorMessage name="password" component="p" className="text-[11.5px] text-red-600 mt-1" />
                </div>
                <Button type="submit" loading={isSubmitting} className="w-full justify-center">
                  Reset password
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <p className="text-center text-[13px] text-gray-500 mt-5">
          Back to{' '}
          <Link to="/login" className="text-green-600 font-medium hover:text-green-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
