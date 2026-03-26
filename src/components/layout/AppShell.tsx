import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BarChart3, LayoutDashboard, Megaphone, MessageSquare, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export const AppShell = () => (
  <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>
    <Sidebar />
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="mobile-topbar">
        <h1 className="font-[Syne,sans-serif] text-[16px] font-bold">Zappy</h1>
      </div>
      <Topbar />
      <main className="app-main-content flex-1 overflow-y-auto p-[22px]">
        <Outlet />
      </main>
    </div>
    <nav className="mobile-bottom-nav">
      {[
        { to: '/dashboard', icon: LayoutDashboard },
        { to: '/contacts', icon: Users },
        { to: '/campaigns', icon: Megaphone },
        { to: '/inbox', icon: MessageSquare },
        { to: '/analytics', icon: BarChart3 },
      ].map(({ to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={20} />
        </NavLink>
      ))}
    </nav>
  </div>
)
