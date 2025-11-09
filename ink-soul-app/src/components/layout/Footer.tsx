import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import { Instagram, Mail, MessageCircle } from 'lucide-react'

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/portfolio', label: t('nav.portfolio') },
    { path: '/appointments', label: t('nav.appointments') },
    { path: '/shop', label: t('nav.shop') },
    { path: '/contact', label: t('nav.contact') },
  ]

  return (
    <footer className="bg-background-elevated border-t border-border-subtle">
      <div className="max-w-container-xl mx-auto px-md md:px-lg py-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-md">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-accent-gold/10 border border-border-gold flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-accent-gold">IS</span>
              </div>
              <div>
                <h3 className="font-display text-xl text-accent-gold">Ink & Soul</h3>
                <p className="text-sm text-text-tertiary italic">by Asunaah</p>
              </div>
            </div>
            <p className="text-text-tertiary text-sm text-center md:text-left">
              © {currentYear} Ink & Soul by Asunaah. {t('footer.rights')}.
            </p>
            <div className="footer-credits">
              <p className="text-xs">
                {t('footer.webDesign')}{' '}
                <a
                  href="https://www.linkedin.com/in/erikgaren?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-credit-link"
                >
                  Erik García Arenas
                </a>
              </p>

            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center space-y-md">
            <h4 className="font-display text-lg text-accent-gold">{t('footer.quickLinks')}</h4>
            <div className="flex flex-wrap justify-center gap-x-lg gap-y-sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-text-secondary hover:text-accent-gold transition-colors duration-fast text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end space-y-md">
            <h4 className="font-display text-lg text-accent-gold">{t('footer.connect')}</h4>
            <div className="flex space-x-md">
              <a
                href="https://instagram.com/artbyasuna"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-accent-gold/10 border border-border-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold hover:text-background-primary hover:shadow-glow-gold transition-all duration-standard"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/34605239673"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-accent-gold/10 border border-border-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold hover:text-background-primary hover:shadow-glow-gold transition-all duration-standard"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="mailto:inkandsoultatto@gmail.com"
                className="w-12 h-12 rounded-full bg-accent-gold/10 border border-border-gold flex items-center justify-center text-accent-gold hover:bg-accent-gold hover:text-background-primary hover:shadow-glow-gold transition-all duration-standard"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
            <div className="flex-1 flex items-start justify-end">
              <p className="footer-note text-right">
                <span dangerouslySetInnerHTML={{ __html: t('footer.aiNotice') }} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
