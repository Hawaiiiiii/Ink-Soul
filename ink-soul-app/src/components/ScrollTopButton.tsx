import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón cuando el scroll sea mayor a 400px
      setIsVisible(window.scrollY > 400)
    }

    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-10 right-10 z-50 w-12 h-12 bg-accent-gold hover:bg-accent-gold/80 text-background-dark rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group"
      style={{ backgroundColor: '#C6A45D' }}
      aria-label="Volver arriba"
    >
      <ArrowUp 
        size={20} 
        className="transition-transform duration-200 group-hover:scale-110" 
      />
    </button>
  )
}