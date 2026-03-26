import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import * as Yup from 'yup'
import { Button } from '../../components/ui/Button'
import { useAuthController } from '../../controllers/auth.controller'

const forgotSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
})

export default function ForgotPassword() {
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
          <h1 className="font-[Syne,sans-serif] text-[22px] font-bold text-gray-900 mb-1">Forgot password</h1>
          <p className="text-[13px] text-gray-500 mb-6">We will email password reset instructions</p>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await authController.forgotPassword(values.email)
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Email</label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                  />
                  <ErrorMessage name="email" component="p" className="text-[11.5px] text-red-600 mt-1" />
                </div>
                <Button type="submit" loading={isSubmitting} className="w-full justify-center">
                  Send reset link
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
