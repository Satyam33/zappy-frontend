import { Search, ChevronDown, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import { useAuth } from '../../hooks/useAuth'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/contacts':   'Contacts',
  '/campaigns':  'Campaigns',
  '/inbox':      'Live Inbox',
  '/templates':  'Templates',
  '/analytics':  'Analytics',
  '/billing':    'Billing',
  '/settings':   'Settings',
}

export const Topbar = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const user = useAppSelector(s => s.auth.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const title = Object.entries(PAGE_TITLES).find(([k]) => location.pathname.startsWith(k))?.[1] ?? ''

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
  }

  return (
    <header
      id="topbar"
      className="h-14 border-b border-gray-100 flex items-center px-4 lg:px-5 gap-3.5 sticky top-0 z-[9]"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
    >
      <h1 className="font-[Syne,sans-serif] font-bold text-[17px] text-gray-900 flex-1 tracking-[-0.2px]">
        {title}
      </h1>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56 transition-colors focus-within:border-green-500 focus-within:bg-white">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-[13.5px] text-gray-900 placeholder:text-gray-400 flex-1 w-0"
        />
      </div>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0] ?? 'U'}
          </div>
          <span className="hidden lg:inline text-[13px] font-medium text-gray-700">{user?.name ?? 'User'}</span>
          <ChevronDown size={13} className="text-gray-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-50 py-1.5 overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-[13px] font-semibold text-gray-900">{user?.name}</p>
              <p className="text-[11.5px] text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
