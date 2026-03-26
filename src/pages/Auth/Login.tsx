import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { loginSchema } from '../../utils/validators'
import { useAuthController } from '../../controllers/auth.controller'

export default function Login() {
  const authController = useAuthController()
  const [showPwd, setShowPwd] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-9 h-9 bg-green-600 rounded-[10px] flex items-center justify-center"
            style={{ boxShadow: '0 0 18px rgba(26,173,82,0.3)' }}
          >
            <Zap size={19} className="text-white" />
          </div>
          <span className="font-[Syne,sans-serif] font-extrabold text-[20px] text-gray-900 tracking-tight">
            Zapp<span className="text-green-600">y</span>
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h1 className="font-[Syne,sans-serif] text-[22px] font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-[13px] text-gray-500 mb-6">Sign in to your Zappy account</p>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await authController.login(values.email, values.password)
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Email</label>
                  <Field name="email" type="email" placeholder="you@company.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                  />
                  <ErrorMessage name="email" component="p" className="text-[11.5px] text-red-600 mt-1" />
                </div>

                <div>
                  <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Password</label>
                  <div className="relative">
                    <Field name="password" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="p" className="text-[11.5px] text-red-600 mt-1" />
                </div>
                <div className="text-right -mt-2">
                  <Link to="/forgot-password" className="text-[12px] text-green-600 hover:text-green-700">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
                  Sign in
                </Button>
              </Form>
            )}
          </Formik>
        </div>

        <p className="text-center text-[13px] text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-600 font-medium hover:text-green-700">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
