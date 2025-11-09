import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { AdminLayout } from './AdminLayout'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6A45D]"></div>
          <p className="mt-4 text-[#EAE6DA]">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <AdminLayout>{children}</AdminLayout>
}
