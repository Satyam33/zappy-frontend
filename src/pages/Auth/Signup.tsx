import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Zap } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { signupSchema } from '../../utils/validators'
import { useAuthController } from '../../controllers/auth.controller'

type SignupFormValues = {
  name: string
  email: string
  mobile: string
  orgName: string
  password: string
  confirmPassword: string
}

export default function Signup() {
  const authController = useAuthController()
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [otpId, setOtpId] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [secondsLeft, setSecondsLeft] = useState(30)
  const [signupValues, setSignupValues] = useState<SignupFormValues | null>(null)
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const otpRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (step !== 'otp' || secondsLeft <= 0) return
    const timer = window.setInterval(() => setSecondsLeft(s => s - 1), 1000)
    return () => window.clearInterval(timer)
  }, [step, secondsLeft])

  const otpCode = otpDigits.join('')
  const formattedTime = `00:${Math.max(secondsLeft, 0).toString().padStart(2, '0')}`
  const maskedMobile = signupValues?.mobile || ''

  const handleResendOtp = async () => {
    if (!signupValues) return
    const result = await authController.requestSignupOtp(signupValues.email, signupValues.mobile, 'resend')
    if (result.ok) {
      setOtpId(result.data.otpId)
      setOtpDigits(['', '', '', '', '', ''])
      setSecondsLeft(30)
      otpRefs.current[0]?.focus()
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = sanitized
    setOtpDigits(next)
    if (sanitized && index < next.length - 1) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-green-600 rounded-[10px] flex items-center justify-center"
            style={{ boxShadow: '0 0 18px rgba(26,173,82,0.3)' }}>
            <Zap size={19} className="text-white" />
          </div>
          <span className="font-[Syne,sans-serif] font-extrabold text-[20px] text-gray-900 tracking-tight">
            Zapp<span className="text-green-600">y</span>
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          <h1 className="font-[Syne,sans-serif] text-[22px] font-bold text-gray-900 mb-1">Get started free</h1>
          <p className="text-[13px] text-gray-500 mb-6">
            {step === 'details' ? 'Create your Zappy account in seconds' : 'Verify OTP to finish your signup'}
          </p>

          <Formik
            initialValues={{ name: '', email: '', mobile: '', orgName: '', password: '', confirmPassword: '' }}
            validationSchema={signupSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const result = await authController.requestSignupOtp(values.email, values.mobile, 'send')
              if (result.ok) {
                setOtpId(result.data.otpId)
                setSignupValues(values)
                setOtpDigits(['', '', '', '', '', ''])
                setSecondsLeft(30)
                setStep('otp')
              }
              setSubmitting(false)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {step === 'details' ? (
                  <>
                    {[
                      ['name',     'Your name',          'text',     'Rohan Verma'],
                      ['orgName',  'Business name',       'text',     'Your Store Name'],
                      ['email',    'Work email',          'email',    'rohan@store.com'],
                      ['mobile',   'Mobile (+country)',   'text',     '+919999999999'],
                    ].map(([name, label, type, placeholder]) => (
                      <div key={name}>
                        <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">{label}</label>
                        <Field name={name} type={type} placeholder={placeholder}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                        />
                        <ErrorMessage name={name} component="p" className="text-[11.5px] text-red-600 mt-1" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Password</label>
                      <div className="relative">
                        <Field
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="p" className="text-[11.5px] text-red-600 mt-1" />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-gray-500 mb-1.5">Confirm password</label>
                      <div className="relative">
                        <Field
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-[13.5px] text-gray-900 outline-none focus:border-green-500 focus:bg-white transition-colors placeholder:text-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="p" className="text-[11.5px] text-red-600 mt-1" />
                    </div>
                    <Button type="submit" loading={isSubmitting} className="w-full justify-center mt-2">
                      Create Account
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="text-[14px] text-gray-500">
                      OTP sent via WhatsApp to <span className="font-medium text-gray-700">{maskedMobile}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="text-[13px] text-green-600 hover:text-green-700 font-medium"
                    >
                      Update details
                    </button>
                    <div className="flex justify-center gap-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={`otp-${index}`}
                          ref={el => { otpRefs.current[index] = el }}
                          value={digit}
                          onChange={event => handleOtpChange(index, event.target.value)}
                          onKeyDown={event => handleOtpKeyDown(index, event)}
                          inputMode="numeric"
                          maxLength={1}
                          className="h-12 w-10 rounded-lg border border-gray-200 bg-gray-50 text-center text-[22px] text-gray-800 outline-none focus:border-green-500 focus:bg-white"
                        />
                      ))}
                    </div>
                    <p className="text-[28px] tracking-wider text-gray-400">{formattedTime}</p>
                    <button
                      type="button"
                      disabled={secondsLeft > 0}
                      onClick={handleResendOtp}
                      className={`text-[14px] ${secondsLeft > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-green-600 hover:text-green-700'}`}
                    >
                      Resend OTP
                    </button>
                    <Button
                      type="button"
                      loading={isSubmittingOtp}
                      disabled={otpCode.length !== 6 || !otpId || !signupValues}
                      className="w-full justify-center mt-2"
                      onClick={async () => {
                        if (!signupValues || !otpId) return
                        setIsSubmittingOtp(true)
                        await authController.completeSignup(signupValues, otpId, otpCode)
                        setIsSubmittingOtp(false)
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>

        <p className="text-center text-[13px] text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:text-green-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
