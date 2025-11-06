import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { Button } from '../components/common/Button'
import { Disc, Target, PenLine } from 'lucide-react'
import { HomeFlashBanner } from '../components/flash/HomeFlashBanner'

export function HomePage() {
  const { t, language } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Dinámico: título de especialidades según idioma
  const specialtiesTitle = language === 'es' ? t('home.specialtiesTitle') : t('home.specialtiesTitle')

  const featuredWorks = [
    {
      title: t('portfolio.featuredVelARestauradora'),
      category: t('portfolio.veloCategory'),
      image: '/images/velo-restauradora.png'
    },
    {
      title: t('portfolio.featuredCrisantemo'),
      category: t('portfolio.crisantomoCategory'),
      image: '/images/crisantemo-espalda.png'
    },
    {
      title: t('portfolio.featuredPolaroid'),
      category: t('portfolio.polaroidCategory'),
      image: '/images/polaroid-cafe.png'
    }
  ]

  const specialties = [
    {
      icon: <Disc size={48} className="text-accent-gold" fill="currentColor" />,
      title: t('home.blackworkTitle'),
      description: t('home.blackworkDesc'),
      tooltip: t('home.blackworkTooltip')
    },
    {
      icon: <Target size={48} className="text-accent-gold" />,
      title: t('home.microrealismoTitle'),
      description: t('home.microrealismoDesc'),
      tooltip: t('home.microrealismoTooltip')
    },
    {
      icon: <PenLine size={48} className="text-accent-gold" />,
      title: t('home.finelineTitle'),
      description: t('home.finelineDesc'),
      tooltip: t('home.finelineTooltip')
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('home.title')}
        subtitle={t('home.subtitle')}
        height="lg"
      >
        <Button to="/portfolio" variant="primary" size="lg">
          {t('home.viewPortfolio')}
        </Button>
        <Button to="/appointments" variant="secondary" size="lg">
          {t('home.bookNow')}
        </Button>
      </Hero>

      {/* Flash Tattoo Banner - Solo se muestra si hay eventos activos */}
      <HomeFlashBanner />

      {/* Manifesto Section */}
      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-lg mx-auto px-md">
          <div className="grid md:grid-cols-5 gap-xl items-center">
            <div className="md:col-span-3">
              <p className="font-body text-body-large md:text-3xl text-text-primary leading-relaxed">
                {t('home.manifesto')}
              </p>
            </div>
            <div className="md:col-span-2 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-accent-gold/10 border-2 border-border-gold flex items-center justify-center">
                <span className="font-display text-6xl font-bold text-accent-gold">IS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="section-spacing bg-background-elevated">
        <div className="max-w-container-xl mx-auto px-md">
          <h2 className="font-display text-h2 text-accent-gold text-center mb-3xl">
            {t('home.featuredWorks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg md:gap-xl">
            {featuredWorks.map((work, index) => (
              <div 
                key={index}
                className="group bg-background-elevated border border-border-gold rounded-lg overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-standard cursor-pointer"
              >
                <div className="aspect-[3/2] overflow-hidden bg-background-primary">
                  <img 
                    src={work.image} 
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-standard"
                  />
                </div>
                <div className="p-lg">
                  <h3 className="font-display text-h3 text-accent-gold mb-sm">{work.title}</h3>
                  <span className="inline-block px-md py-xs bg-accent-burgundy/30 text-text-primary text-sm rounded-full">
                    {work.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-lg mx-auto px-md">
          <h2 className="font-display text-h2 text-accent-gold text-center mb-3xl">
            {specialtiesTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {specialties.map((specialty, index) => (
              <div 
                key={index}
                className="relative flex flex-col items-center text-center space-y-md p-xl bg-background-elevated border border-border-gold rounded-lg hover:shadow-glow-gold transition-all duration-standard"
              >
                {/* Icon with tooltip */}
                <div 
                  className="relative w-20 h-20 flex items-center justify-center rounded-full bg-accent-gold/10 transition-all duration-standard"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {specialty.icon}
                  
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-64 px-md py-sm bg-black/85 text-accent-gold text-xs font-serif rounded-lg shadow-lg z-10 animate-fade-in">
                      {specialty.tooltip}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black/85"></div>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-display text-xl text-accent-gold font-medium">
                  {specialty.title}
                </h3>

                {/* Description */}
                <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line text-center">
                  {specialty.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-4xl bg-gradient-to-b from-background-elevated to-overlay-indigo">
        <div className="max-w-container-lg mx-auto px-md text-center">
          <h2 className="font-display text-h2 text-accent-gold mb-xl">
            {t('home.startJourney')}
          </h2>
          <Button to="/appointments" variant="primary" size="lg">
            {t('home.bookConsultation')}
          </Button>
        </div>
      </section>
    </div>
  )
}
