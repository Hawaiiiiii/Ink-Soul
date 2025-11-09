import { useEffect } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { useToast, getToastStyles } from '../../hooks/useToast'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: {
    id: string
    title: string
    message?: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    action?: {
      label: string
      onClick: () => void
    }
  }
  onClose: () => void
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { type, title, message, action } = toast

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#C6A45D]" />
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.duration, onClose])

  return (
    <div className={`${getToastStyles(type)} p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#EAE6DA] mb-1">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-gray-300">
              {message}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm text-[#C6A45D] hover:text-[#b8984f] font-medium transition-colors"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
