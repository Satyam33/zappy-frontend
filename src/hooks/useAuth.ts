import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout as logoutAction } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'

export const useAuth = () => {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const user      = useAppSelector(s => s.auth.user)
  const org       = useAppSelector(s => s.auth.org)
  const refreshToken = useAppSelector(s => s.auth.refreshToken)
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated)

  const logout = async () => {
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch {
        // Ignore logout API failures and clear local session anyway.
      }
    }
    dispatch(logoutAction())
    localStorage.removeItem('zappy_auth')
    navigate('/login')
  }

  return { user, org, isAuthenticated, logout }
}
