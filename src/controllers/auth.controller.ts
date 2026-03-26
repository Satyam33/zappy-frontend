import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService, getApiErrorMessage } from '../services/auth.service'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'

type SignupValues = {
  name: string
  email: string
  mobile: string
  orgName: string
  password: string
}

type Result<T> = { ok: true; data: T } | { ok: false }

export const useAuthController = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const persistLoginSession = (data: {
    user: { id: string; email: string; name: string | null; role: 'admin' | 'agent' }
    organization: { id: string; name: string }
    accessToken: string
    refreshToken: string
  }) => {
    const normalizedUser = {
      ...data.user,
      name: data.user.name ?? '',
    }
    const normalizedOrg = {
      ...data.organization,
      plan: 'starter' as const,
    }

    dispatch(setCredentials({
      user: normalizedUser,
      org: normalizedOrg,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }))

    localStorage.setItem('zappy_auth', JSON.stringify({
      user: normalizedUser,
      org: normalizedOrg,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isAuthenticated: true,
    }))
  }

  const login = async (email: string, password: string): Promise<Result<{ message?: string }>> => {
    try {
      const data = await authService.login(email, password)
      toast.success(data.message || 'Signed in successfully')
      persistLoginSession(data)
      navigate('/dashboard')
      return { ok: true, data: { message: data.message } }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Login failed'))
      return { ok: false }
    }
  }

  const requestSignupOtp = async (
    email: string,
    mobile: string,
    mode: 'send' | 'resend' = 'send'
  ): Promise<Result<{ otpId: string; message?: string }>> => {
    try {
      const data = await authService.requestSignupOtp(email, mobile)
      toast.success(data.message || (mode === 'resend' ? 'OTP resent successfully' : 'OTP sent successfully'))
      return { ok: true, data: { otpId: data.otpId, message: data.message } }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, mode === 'resend' ? 'OTP resend failed' : 'OTP request failed'))
      return { ok: false }
    }
  }

  const completeSignup = async (
    values: SignupValues,
    otpId: string,
    otpCode: string
  ): Promise<Result<{ message?: string }>> => {
    try {
      await authService.verifySignupOtp(otpId, values.mobile, otpCode)
      const signupData = await authService.signup({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        organizationName: values.orgName,
        otpId,
      })
      const loginData = await authService.login(values.email, values.password)
      persistLoginSession(loginData)
      toast.success(signupData.message || loginData.message || 'Account created successfully')
      navigate('/dashboard')
      return { ok: true, data: { message: signupData.message || loginData.message } }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Signup failed'))
      return { ok: false }
    }
  }

  const forgotPassword = async (email: string): Promise<Result<{ message?: string }>> => {
    try {
      const data = await authService.forgotPassword(email)
      toast.success(data.message || 'Reset link sent if account exists')
      return { ok: true, data: { message: data.message } }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Failed to send reset link'))
      return { ok: false }
    }
  }

  const resetPassword = async (token: string, password: string): Promise<Result<{ message?: string }>> => {
    try {
      const data = await authService.resetPassword(token, password)
      toast.success(data.message || 'Password reset successful. Please login.')
      return { ok: true, data: { message: data.message } }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Failed to reset password'))
      return { ok: false }
    }
  }

  return {
    login,
    requestSignupOtp,
    completeSignup,
    forgotPassword,
    resetPassword,
  }
}
