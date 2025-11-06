import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useToast } from '../../hooks/useToast'
import { supabase } from '../../lib/supabase'
import {
  Bell,
  Download,
  Filter,
  Search,
  Calendar,
  X,
  Mail,
  Calendar as CalendarIcon,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'

interface Notificacion {
  id: number
  tipo: 'consulta' | 'cita' | 'compra'
  asunto: string
  contenido: string
  fecha: string
  enviado_a: string[]
  datos_extra: any
  estado_envio?: 'enviado' | 'pendiente' | 'fallido'
  reenvio_count?: number
}

interface NotificacionResend extends Notificacion {
  selected?: boolean
}

const ITEMS_PER_PAGE = 10

export function NotificationsPage() {
  const [notificaciones, setNotificaciones] = useState<NotificacionResend[]>([])
  const [filteredNotificaciones, setFilteredNotificaciones] = useState<NotificacionResend[]>([])
  const [loading, setLoading] = useState(true)
  const [resending, setResending] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Filtros
  const [tipoFilter, setTipoFilter] = useState<string>('all')
  const [estadoFilter, setEstadoFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modal de detalles
  const [selectedNotificacion, setSelectedNotificacion] = useState<NotificacionResend | null>(null)
  
  // Bulk selection
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [bulkResending, setBulkResending] = useState(false)
  
  const { addToast } = useToast()

  // Cargar notificaciones
  useEffect(() => {
    fetchNotificaciones()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    applyFilters()
  }, [notificaciones, tipoFilter, estadoFilter, searchTerm, startDate, endDate])

  const fetchNotificaciones = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('notificaciones')
        .select('*')
        .order('fecha', { ascending: false })

      if (fetchError) throw fetchError

      setNotificaciones(data || [])
    } catch (err: any) {
      setError(err.message || 'Error al cargar notificaciones')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...notificaciones]

    // Filtro por tipo
    if (tipoFilter !== 'all') {
      filtered = filtered.filter((n) => n.tipo === tipoFilter)
    }

    // Filtro por estado de envío
    if (estadoFilter !== 'all') {
      filtered = filtered.filter((n) => n.estado_envio === estadoFilter)
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.asunto.toLowerCase().includes(search) ||
          n.contenido.toLowerCase().includes(search)
      )
    }

    // Filtro por rango de fechas
    if (startDate) {
      filtered = filtered.filter((n) => new Date(n.fecha) >= new Date(startDate))
    }
    if (endDate) {
      const endDateTime = new Date(endDate)
      endDateTime.setHours(23, 59, 59, 999)
      filtered = filtered.filter((n) => new Date(n.fecha) <= endDateTime)
    }

    setFilteredNotificaciones(filtered)
    setCurrentPage(1) // Reset a primera página
  }

  const resetFilters = () => {
    setTipoFilter('all')
    setEstadoFilter('all')
    setSearchTerm('')
    setStartDate('')
    setEndDate('')
  }

  const resendNotification = async (id: number) => {
    try {
      setResending(prev => [...prev, id])
      
      // Determinar la función correcta según el tipo
      const notificacion = notificaciones.find(n => n.id === id)
      if (!notificacion) return

      let functionName = ''
      switch (notificacion.tipo) {
        case 'consulta':
          functionName = 'contact-notification'
          break
        case 'cita':
          functionName = 'appointment-notification'
          break
        case 'compra':
          functionName = 'stripe-webhook'
          break
        default:
          functionName = 'send-notification'
      }

      // Reenviar la notificación
      const response = await fetch(`https://enitsirdzrsqtgjksctk.supabase.co/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaXRzaXJkenJzcXRnamtzY3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Mzg5ODksImV4cCI6MjA3NzUxNDk4OX0.YaEXS02Dhwi0JhTAjYKAIvNBI3xlANVwmRONaIGzlsQ`,
        },
        body: JSON.stringify({
          ...notificacion.datos_extra,
          resend: true,
          originalNotificationId: id
        })
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      // Actualizar el estado en la base de datos
      await supabase
        .from('notificaciones')
        .update({ 
          estado_envio: 'enviado',
          reenvio_count: (notificacion.reenvio_count || 0) + 1,
          fecha_reenvio: new Date().toISOString()
        })
        .eq('id', id)

      addToast({
        title: 'Éxito',
        message: 'Notificación reenviada correctamente',
        type: 'success'
      })

      // Recargar datos
      await fetchNotificaciones()
      
    } catch (err: any) {
      addToast({
        title: 'Error',
        message: err.message || 'Error al reenviar la notificación',
        type: 'error'
      })
    } finally {
      setResending(prev => prev.filter(nid => nid !== id))
    }
  }

  const bulkResend = async () => {
    if (selectedItems.size === 0) return

    try {
      setBulkResending(true)
      
      const promises = Array.from(selectedItems).map(id => resendNotification(id))
      await Promise.all(promises)
      
      setSelectedItems(new Set())
      addToast({
        title: 'Éxito',
        message: `Se reenviaron ${selectedItems.size} notificaciones`,
        type: 'success'
      })
      
    } catch (err: any) {
      addToast({
        title: 'Error',
        message: 'Error en el reenvío masivo',
        type: 'error'
      })
    } finally {
      setBulkResending(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Tipo', 'Asunto', 'Fecha', 'Estado', 'Reenvíos', 'Enviado a']
    const rows = filteredNotificaciones.map((n) => [
      n.id,
      n.tipo,
      `"${n.asunto.replace(/"/g, '""')}"`,
      new Date(n.fecha).toLocaleString('es-ES'),
      n.estado_envio || 'desconocido',
      n.reenvio_count || 0,
      `"${n.enviado_a.join(', ')}"`,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `notificaciones_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  // Paginación
  const totalPages = Math.ceil(filteredNotificaciones.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentNotificaciones = filteredNotificaciones.slice(startIndex, endIndex)

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'consulta':
        return <Mail className="w-5 h-5" />
      case 'cita':
        return <CalendarIcon className="w-5 h-5" />
      case 'compra':
        return <ShoppingCart className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
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

  const getEstadoIcon = (estado?: string) => {
    switch (estado) {
      case 'enviado':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'fallido':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getEstadoBadgeColor = (estado?: string) => {
    switch (estado) {
      case 'enviado':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'fallido':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'pendiente':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-[#C6A45D] animate-spin mx-auto mb-4" />
            <p className="text-[#EAE6DA]">Cargando notificaciones...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-[#EAE6DA] mb-2">
              Notificaciones
            </h1>
            <p className="text-gray-400">
              Total: {filteredNotificaciones.length} notificaciones
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.size > 0 && (
              <button
                onClick={bulkResend}
                disabled={bulkResending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkResending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Reenviar seleccionadas ({selectedItems.size})
              </button>
            )}
            <button
              onClick={exportToCSV}
              disabled={filteredNotificaciones.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C6A45D] hover:bg-[#b8984f] text-[#0b0b0b] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#C6A45D]" />
            <h2 className="text-lg font-semibold text-[#EAE6DA]">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-[#C6A45D] mb-2">
                Tipo
              </label>
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-3 py-2 text-[#EAE6DA] focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D]"
              >
                <option value="all">Todos</option>
                <option value="consulta">Consultas</option>
                <option value="cita">Citas</option>
                <option value="compra">Compras</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-[#C6A45D] mb-2">
                Estado
              </label>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-3 py-2 text-[#EAE6DA] focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D]"
              >
                <option value="all">Todos</option>
                <option value="enviado">Enviado</option>
                <option value="pendiente">Pendiente</option>
                <option value="fallido">Fallido</option>
              </select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-[#C6A45D] mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en asunto..."
                  className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg pl-10 pr-3 py-2 text-[#EAE6DA] placeholder-gray-500 focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D]"
                />
              </div>
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block text-sm font-medium text-[#C6A45D] mb-2">
                Desde
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg pl-10 pr-3 py-2 text-[#EAE6DA] focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D]"
                />
              </div>
            </div>

            {/* Fecha fin */}
            <div>
              <label className="block text-sm font-medium text-[#C6A45D] mb-2">
                Hasta
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg pl-10 pr-3 py-2 text-[#EAE6DA] focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D]"
                />
              </div>
            </div>
          </div>

          {/* Reset filtros */}
          {(tipoFilter !== 'all' || estadoFilter !== 'all' || searchTerm || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#C6A45D] hover:text-[#b8984f] transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Tabla de notificaciones */}
        {currentNotificaciones.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {filteredNotificaciones.length === 0 && notificaciones.length > 0
                ? 'No se encontraron notificaciones con los filtros aplicados'
                : 'No hay notificaciones aún'}
            </p>
          </div>
        ) : (
          <>
            {/* Select all */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={selectedItems.size === currentNotificaciones.length && currentNotificaciones.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    const newSelected = new Set(currentNotificaciones.map(n => n.id))
                    setSelectedItems(newSelected)
                  } else {
                    setSelectedItems(new Set())
                  }
                }}
                className="w-4 h-4 text-[#C6A45D] bg-[#0b0b0b] border-[#333] rounded focus:ring-[#C6A45D] focus:ring-2"
              />
              <span>Seleccionar todas ({currentNotificaciones.length})</span>
            </div>

            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0b0b0b] border-b border-[#333]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#C6A45D] uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#C6A45D] uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#C6A45D] uppercase tracking-wider">
                        Asunto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#C6A45D] uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#C6A45D] uppercase tracking-wider">
                        Enviado a
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#C6A45D] uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {currentNotificaciones.map((notificacion) => (
                      <tr
                        key={notificacion.id}
                        className="hover:bg-[#0b0b0b]/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(notificacion.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedItems)
                                if (e.target.checked) {
                                  newSelected.add(notificacion.id)
                                } else {
                                  newSelected.delete(notificacion.id)
                                }
                                setSelectedItems(newSelected)
                              }}
                              className="w-4 h-4 text-[#C6A45D] bg-[#0b0b0b] border-[#333] rounded focus:ring-[#C6A45D] focus:ring-2"
                            />
                            <div className="flex items-center gap-2">
                              {getEstadoIcon(notificacion.estado_envio)}
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoBadgeColor(
                                  notificacion.estado_envio
                                )}`}
                              >
                                {notificacion.estado_envio || 'desconocido'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="text-[#C6A45D]">
                              {getTipoIcon(notificacion.tipo)}
                            </div>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTipoBadgeColor(
                                notificacion.tipo
                              )}`}
                            >
                              {notificacion.tipo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#EAE6DA] font-medium line-clamp-2">
                            {notificacion.asunto}
                          </p>
                          {notificacion.reenvio_count > 0 && (
                            <p className="text-xs text-gray-500">
                              {notificacion.reenvio_count} reenvío(s)
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-gray-400">
                            {new Date(notificacion.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(notificacion.fecha).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-400">
                            {notificacion.enviado_a.length === 1 ? (
                              <p>{notificacion.enviado_a[0]}</p>
                            ) : (
                              <p>{notificacion.enviado_a.length} destinatarios</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedNotificacion(notificacion)}
                              className="text-[#C6A45D] hover:text-[#b8984f] text-sm font-medium transition-colors"
                            >
                              Ver detalles
                            </button>
                            <button
                              onClick={() => resendNotification(notificacion.id)}
                              disabled={resending.includes(notificacion.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                            >
                              {resending.includes(notificacion.id) ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Send className="w-3 h-3" />
                              )}
                              Reenviar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, filteredNotificaciones.length)} de{' '}
                  {filteredNotificaciones.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#EAE6DA] hover:bg-[#C6A45D]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-[#EAE6DA]">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-[#EAE6DA] hover:bg-[#C6A45D]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedNotificacion && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-[#C6A45D]/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-[#333]">
              <div className="flex items-center gap-3">
                <div className="text-[#C6A45D]">
                  {getTipoIcon(selectedNotificacion.tipo)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#EAE6DA]">
                    {selectedNotificacion.asunto}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(selectedNotificacion.fecha).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotificacion(null)}
                className="p-2 hover:bg-[#C6A45D]/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Info básica */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#C6A45D] font-medium min-w-[100px]">Tipo:</span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTipoBadgeColor(
                      selectedNotificacion.tipo
                    )}`}
                  >
                    {selectedNotificacion.tipo}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#C6A45D] font-medium min-w-[100px]">Estado:</span>
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(selectedNotificacion.estado_envio)}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoBadgeColor(
                        selectedNotificacion.estado_envio
                      )}`}
                    >
                      {selectedNotificacion.estado_envio || 'desconocido'}
                    </span>
                  </div>
                </div>
                {selectedNotificacion.reenvio_count > 0 && (
                  <div className="flex items-start gap-3">
                    <span className="text-[#C6A45D] font-medium min-w-[100px]">Reenvíos:</span>
                    <span className="text-[#EAE6DA]">{selectedNotificacion.reenvio_count}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-[#C6A45D] font-medium min-w-[100px]">Enviado a:</span>
                  <div className="flex-1">
                    {selectedNotificacion.enviado_a.map((email, i) => (
                      <p key={i} className="text-[#EAE6DA]">
                        {email}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contenido HTML */}
              <div>
                <h4 className="text-[#C6A45D] font-medium mb-3">Contenido:</h4>
                <div
                  className="bg-[#0b0b0b] border border-[#333] rounded-lg p-4 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedNotificacion.contenido }}
                />
              </div>

              {/* Datos extra */}
              {selectedNotificacion.datos_extra && Object.keys(selectedNotificacion.datos_extra).length > 0 && (
                <div>
                  <h4 className="text-[#C6A45D] font-medium mb-3">Datos adicionales:</h4>
                  <div className="bg-[#0b0b0b] border border-[#333] rounded-lg p-4">
                    <pre className="text-sm text-[#EAE6DA] overflow-x-auto">
                      {JSON.stringify(selectedNotificacion.datos_extra, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="p-6 border-t border-[#333] flex items-center justify-between">
              <button
                onClick={() => resendNotification(selectedNotificacion.id)}
                disabled={resending.includes(selectedNotificacion.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {resending.includes(selectedNotificacion.id) ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Reenviar
              </button>
              <button
                onClick={() => setSelectedNotificacion(null)}
                className="px-4 py-2 bg-[#C6A45D] hover:bg-[#b8984f] text-[#0b0b0b] font-semibold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
