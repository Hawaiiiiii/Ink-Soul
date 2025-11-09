import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Menu, X, Globe } from 'lucide-react'
import { CartIcon } from '../common/CartIcon'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Gestión completa del menú móvil
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Bloquear scroll y resetear posición
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden'
      document.body.classList.add('menu-open')
    } else {
      document.body.style.overflow = 'auto'
      document.body.classList.remove('menu-open')
    }
    
    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto'
      document.body.classList.remove('menu-open')
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/portfolio', label: t('nav.portfolio') },
    { path: '/appointments', label: t('nav.appointments') },
    { path: '/flash', label: t('nav.flash') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/contact', label: t('nav.contact') },
  ]

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-standard ${
        isScrolled 
          ? 'bg-background-primary/95 backdrop-blur-xl shadow-lg border-b border-border-subtle' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-container-xl mx-auto px-md md:px-lg">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full bg-accent-gold/10 border border-border-gold flex items-center justify-center transition-all duration-standard group-hover:shadow-glow-gold">
              <span className="font-display text-2xl font-bold text-accent-gold">IS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-display text-sm tracking-wider uppercase transition-all duration-fast relative group ${
                  location.pathname === link.path
                    ? 'text-accent-gold'
                    : 'text-text-secondary hover:text-accent-gold'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-[-4px] left-0 h-[2px] bg-accent-gold transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-sm">
            {/* Cart Icon */}
            <CartIcon />
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-sm text-text-secondary hover:text-accent-gold transition-all duration-fast"
              aria-label="Toggle language"
            >
              <Globe size={18} />
              <span className="text-sm font-body uppercase">{language}</span>
            </button>

            {/* CTA Button - Desktop */}
            <Link
              to="/appointments"
              className="hidden md:block px-lg py-3 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold hover:scale-105 transform transition-all duration-standard"
            >
              {t('nav.bookAppointment')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-accent-gold"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Corrección completa */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay con gestión completa del viewport */}
          <div className="mobile-menu md:hidden fixed top-0 left-0 w-screen h-screen bg-background-primary/98 backdrop-blur-xl z-[9999] overflow-y-auto" 
               style={{
                 height: '100vh',
                 width: '100vw',
                 backgroundColor: 'rgba(10, 10, 10, 0.98)',
                 zIndex: 9999,
                 transform: 'translateY(0)',
                 transition: 'opacity 0.3s ease'
               }}>
            
            {/* Botón de cierre con z-index máximo */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="menu-close fixed top-5 right-5 p-2 text-accent-gold hover:text-accent-gold-light transition-colors duration-fast"
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 10000
              }}
              aria-label={t('common.closeMenu')}
            >
              <X size={24} />
            </button>
            
            {/* Contenido del menú centrado */}
            <div className="flex flex-col items-center justify-center h-full space-y-lg px-md pt-20">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-display text-2xl tracking-wider uppercase transition-all duration-fast ${
                    location.pathname === link.path
                      ? 'text-accent-gold'
                      : 'text-text-secondary hover:text-accent-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/appointments"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-xl px-xl py-4 bg-accent-gold text-background-primary font-body text-base font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold"
              >
                {t('nav.bookAppointment')}
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
