import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { LogOut, Bell, LayoutDashboard } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAdminAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/admin/notifications',
      label: 'Notificaciones',
      icon: Bell,
    },
  ]

  return (
      <div className="min-h-screen bg-[#0b0b0b]">
        {/* Header */}
        <header className="bg-[#1a1a1a] border-b border-[#333] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-playfair font-bold text-[#C6A45D]">
                  Ink & Soul
                </h1>
                <span className="ml-3 text-sm text-gray-400 hidden sm:inline">
                  Panel Administrativo
                </span>
              </div>

              {/* Usuario y logout */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-[#EAE6DA] font-medium">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A45D]/10 hover:bg-[#C6A45D]/20 text-[#C6A45D] rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-[#1a1a1a] border-r border-[#333] min-h-[calc(100vh-4rem)] hidden md:block">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#C6A45D] text-[#0b0b0b] font-semibold'
                        : 'text-[#EAE6DA] hover:bg-[#C6A45D]/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Mobile menu */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333] z-40">
            <nav className="flex justify-around p-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#C6A45D]'
                        : 'text-[#EAE6DA] hover:text-[#C6A45D]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
  )
}
