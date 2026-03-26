import {
  LayoutDashboard, Users, Megaphone, MessageSquare,
  FileText, BarChart3, CreditCard, Settings, Zap, Bell
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/contacts',   label: 'Contacts',   icon: Users },
  { to: '/campaigns',  label: 'Campaigns',  icon: Megaphone },
  { to: '/inbox',      label: 'Live Inbox', icon: MessageSquare, badge: true },
  { to: '/templates',  label: 'Templates',  icon: FileText },
  { to: '/analytics',  label: 'Analytics',  icon: BarChart3 },
]

const BOTTOM_NAV = [
  { to: '/billing',  label: 'Billing',  icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const Sidebar = () => {
  const location = useLocation()
  const unreadCount = useAppSelector(s => s.inbox.unreadCount)
  const org  = useAppSelector(s => s.auth.org)

  return (
    <aside
      id="sidebar"
      className="w-[228px] min-w-[228px] bg-white border-r border-gray-100 flex flex-col h-screen overflow-hidden"
      style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}
    >
      {/* Logo */}
      <div className="px-4.5 py-5 border-b border-gray-100 flex items-center gap-2.5">
        <div
          className="w-[34px] h-[34px] bg-green-600 rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ boxShadow: '0 0 14px rgba(26,173,82,0.25)' }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <span className="sidebar-logo-text font-[Syne,sans-serif] font-extrabold text-[17px] text-gray-900 tracking-tight">
          Zapp<span className="text-green-600">y</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        <p className="nav-section-label text-[10px] font-semibold text-gray-400 uppercase tracking-[1.4px] px-2.5 pb-1.5 pt-1">
          Menu
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => {
          const isActive = location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item-link flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg mb-px text-[13.5px]
                transition-all relative group
                ${isActive
                  ? 'bg-green-50/60 text-green-600 border border-green-200/60 nav-item-active'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="nav-label">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="ml-auto bg-green-600 text-black text-[10px] font-bold font-[Syne,sans-serif] px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          )
        })}

        <p className="nav-section-label text-[10px] font-semibold text-gray-400 uppercase tracking-[1.4px] px-2.5 pb-1.5 pt-4">
          Account
        </p>
        {BOTTOM_NAV.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to)
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item-link flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg mb-px text-[13.5px]
                transition-all relative
                ${isActive
                  ? 'bg-green-50/60 text-green-600 border border-green-200/60 nav-item-active'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="nav-label">{label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Workspace card */}
      <div className="mx-2.5 mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {org?.name?.[0] ?? 'Z'}
          </div>
          <div className="workspace-details min-w-0">
            <p className="text-[12.5px] font-semibold text-gray-900 truncate">{org?.name ?? 'Your Workspace'}</p>
            <p className="text-[11px] text-gray-400 capitalize">{org?.plan ?? 'starter'} plan</p>
          </div>
          <Bell size={14} className="text-gray-400 ml-auto flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
