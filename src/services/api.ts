import axios from 'axios'
import { store } from '../store'
import { setTokens, logout } from '../store/slices/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zappy-backend-aqdo.onrender.com/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken
  const orgId = store.getState().auth.org?.id
  const requestUrl = String(config.url || '')
  const isAuthEndpoint = requestUrl.includes('/auth/')
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (orgId && !isAuthEndpoint) config.headers['x-org-id'] = orgId
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config
    const requestUrl = String(originalRequest?.url || '')
    const isAuthEndpoint = requestUrl.includes('/auth/login')
      || requestUrl.includes('/auth/signup')
      || requestUrl.includes('/auth/send-otp')
      || requestUrl.includes('/auth/verify-otp')
      || requestUrl.includes('/auth/forgot-password')
      || requestUrl.includes('/auth/reset-password')
      || requestUrl.includes('/auth/refresh')

    if (err.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      const refreshToken = store.getState().auth.refreshToken
      if (!refreshToken) {
        return Promise.reject(err)
      }

      err.config._retry = true
      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
        const tokenData = data.data ?? data
        store.dispatch(setTokens({ accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken }))
        localStorage.setItem('zappy_auth', JSON.stringify(store.getState().auth))
        err.config.headers.Authorization = `Bearer ${tokenData.accessToken}`
        return api(err.config)
      } catch {
        store.dispatch(logout())
        localStorage.removeItem('zappy_auth')
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(err)
  }
)

export default api
