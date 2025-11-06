import { useLanguage } from '../contexts/LanguageContext'

interface ShopHeaderProps {
  showPattern?: boolean
}

export function ShopHeader({ showPattern = true }: ShopHeaderProps) {
  const { t } = useLanguage()
  
  // Process title to add hover effect to "Ink & Soul"
  const processTitle = (title: string) => {
    if (title.includes('Ink & Soul')) {
      const parts = title.split('Ink & Soul')
      return (
        <>
          {parts[0]}
          <span className="brand-highlight">Ink & Soul</span>
          {parts[1]}
        </>
      )
    }
    return title
  }

  return (
    <section className="relative min-h-[300px] flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      {showPattern && (
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sacred-geometry" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#C1A261" strokeWidth="1" />
                <circle cx="50" cy="10" r="40" fill="none" stroke="#C1A261" strokeWidth="1" />
                <circle cx="50" cy="90" r="40" fill="none" stroke="#C1A261" strokeWidth="1" />
                <circle cx="15" cy="50" r="40" fill="none" stroke="#C1A261" strokeWidth="1" />
                <circle cx="85" cy="50" r="40" fill="none" stroke="#C1A261" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sacred-geometry)" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-md max-w-5xl">
        <h1 className="shop-title font-display text-center mb-3" style={{
          fontSize: 'clamp(2.8rem, 6vw, 4rem)',
          fontWeight: 600,
          color: '#d4af37',
          letterSpacing: '0.01em',
          lineHeight: 1.1,
          marginBottom: '12px'
        }}>
          {processTitle(t('shop.title'))}
        </h1>
        <p className="shop-subtitle font-display text-center mt-2 animate-fade-in" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
          fontStyle: 'italic',
          color: '#b9b9b9',
          letterSpacing: '0.02em',
          marginTop: '8px',
          opacity: 0,
          animation: 'fadeIn 0.6s ease 0.3s forwards'
        }}>
          {t('shop.subtitle')}
        </p>
      </div>
    </section>
  )
}