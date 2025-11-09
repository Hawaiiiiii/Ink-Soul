import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Bell, Mail, Calendar, ShoppingCart, TrendingUp, Clock } from 'lucide-react'

interface Stats {
  total: number
  consultas: number
  citas: number
  compras: number
  ultimas24h: number
}

interface NotificacionReciente {
  id: number
  tipo: string
  asunto: string
  fecha: string
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    consultas: 0,
    citas: 0,
    compras: 0,
    ultimas24h: 0,
  })
  const [recientes, setRecientes] = useState<NotificacionReciente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Obtener todas las notificaciones
      const { data: allNotifications, error } = await supabase
        .from('notificaciones')
        .select('id, tipo, asunto, fecha')
        .order('fecha', { ascending: false })

      if (error) throw error

      if (!allNotifications) {
        setStats({
          total: 0,
          consultas: 0,
          citas: 0,
          compras: 0,
          ultimas24h: 0,
        })
        return
      }

      // Calcular estadísticas
      const now = new Date()
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const newStats = {
        total: allNotifications.length,
        consultas: allNotifications.filter((n) => n.tipo === 'consulta').length,
        citas: allNotifications.filter((n) => n.tipo === 'cita').length,
        compras: allNotifications.filter((n) => n.tipo === 'compra').length,
        ultimas24h: allNotifications.filter(
          (n) => new Date(n.fecha) >= twentyFourHoursAgo
        ).length,
      }

      setStats(newStats)
      setRecientes(allNotifications.slice(0, 5))
    } catch (err) {
      console.error('Error al cargar estadísticas:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total Notificaciones',
      value: stats.total,
      icon: Bell,
      color: 'from-[#C6A45D] to-[#b8984f]',
      textColor: 'text-[#C6A45D]',
    },
    {
      label: 'Consultas',
      value: stats.consultas,
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
    },
    {
      label: 'Citas',
      value: stats.citas,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-400',
    },
    {
      label: 'Compras',
      value: stats.compras,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-400',
    },
  ]

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'consulta':
        return <Mail className="w-4 h-4" />
      case 'cita':
        return <Calendar className="w-4 h-4" />
      case 'compra':
        return <ShoppingCart className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'consulta':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'cita':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      case 'compra':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C6A45D]"></div>
            <p className="mt-4 text-[#EAE6DA]">Cargando estadísticas...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-playfair font-bold text-[#EAE6DA] mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Resumen de notificaciones y actividad reciente
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#C6A45D]/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-[#EAE6DA] mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Última actividad */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#C6A45D]" />
            <h2 className="text-xl font-semibold text-[#EAE6DA]">
              Últimas 24 horas
            </h2>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#C6A45D]">
              {stats.ultimas24h}
            </span>
            <span className="text-gray-400">notificaciones</span>
          </div>
        </div>

        {/* Notificaciones recientes */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#C6A45D]" />
            <h2 className="text-xl font-semibold text-[#EAE6DA]">
              Actividad Reciente
            </h2>
          </div>

          {recientes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No hay notificaciones recientes
            </p>
          ) : (
            <div className="space-y-3">
              {recientes.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-4 p-4 bg-[#0b0b0b] rounded-lg hover:bg-[#0b0b0b]/70 transition-colors"
                >
                  <div className="text-[#C6A45D] mt-1">
                    {getTipoIcon(notif.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#EAE6DA] font-medium mb-1 truncate">
                      {notif.asunto}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notif.fecha).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTipoBadgeColor(
                      notif.tipo
                    )} flex-shrink-0`}
                  >
                    {notif.tipo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
