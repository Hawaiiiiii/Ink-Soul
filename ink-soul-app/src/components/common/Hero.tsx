interface HeroProps {
  title: string
  subtitle?: string
  height?: 'sm' | 'md' | 'lg'
  children?: React.ReactNode
  backgroundImage?: string
  showPattern?: boolean
}

export function Hero({ 
  title, 
  subtitle, 
  height = 'lg', 
  children, 
  backgroundImage,
  showPattern = true 
}: HeroProps) {
  const heightStyles = {
    sm: 'min-h-[300px]',
    md: 'min-h-[400px] md:min-h-[500px]',
    lg: 'min-h-[500px] md:min-h-[600px] lg:min-h-[700px]'
  }

  return (
    <section 
      className={`relative ${heightStyles[height]} flex items-center justify-center overflow-hidden`}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
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

      {/* Overlay if background image */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-overlay-burgundy to-overlay-indigo" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-md max-w-5xl">
        <h1 className="font-display text-4xl md:text-6xl lg:text-h1 font-bold text-accent-gold mb-md animate-fade-in">
          {title}
        </h1>
        {subtitle && (
          <p className="font-display text-xl md:text-2xl lg:text-3xl text-text-primary italic mb-xl animate-fade-in-delay">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-md mt-xl animate-fade-in-delay-2">
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
