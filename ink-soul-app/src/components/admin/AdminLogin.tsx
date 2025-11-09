import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import { Lock, Mail, AlertCircle } from 'lucide-react'

export function AdminLogin() {
  const navigate = useNavigate()
  const { signIn, loading, error } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('Por favor completa todos los campos')
      return
    }

    try {
      await signIn(email, password)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setLocalError(err.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-playfair font-bold text-[#C6A45D] mb-2">
            Ink & Soul
          </h1>
          <p className="text-[#EAE6DA] text-sm uppercase tracking-[2px]">
            Panel Administrativo
          </p>
        </div>

        {/* Formulario de login */}
        <div className="bg-[#1a1a1a] border border-[#C6A45D]/30 rounded-lg p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C6A45D]/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-[#C6A45D]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#EAE6DA] mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-gray-400">
              Accede al panel de notificaciones
            </p>
          </div>

          {/* Mensajes de error */}
          {(localError || error) && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">
                {localError || error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#C6A45D] mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@inkandsoul.com"
                  required
                  disabled={loading}
                  className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg pl-11 pr-4 py-3 text-[#EAE6DA] placeholder-gray-500 focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#C6A45D] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg pl-11 pr-4 py-3 text-[#EAE6DA] placeholder-gray-500 focus:outline-none focus:border-[#C6A45D] focus:ring-1 focus:ring-[#C6A45D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C6A45D] hover:bg-[#b8984f] text-[#0b0b0b] font-semibold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Acceso restringido solo para administradores
          </p>
        </div>
      </div>
    </div>
  )
}
