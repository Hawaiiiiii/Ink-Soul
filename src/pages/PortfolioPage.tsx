import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'

export function PortfolioPage() {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: t('portfolio.all') },
    { id: 'blackwork', label: t('portfolio.blackwork') },
    { id: 'anime', label: t('portfolio.anime') },
    { id: 'microrealismo', label: t('portfolio.microrealismo') },
    { id: 'fineline', label: t('portfolio.fineline') }
  ]

  // Portfolio items with sample data
  const portfolioItems = [
    {
      id: 1,
      title: t('portfolio.featuredVelARestauradora'),
      category: 'blackwork',
      image: '/images/velo-restauradora.png',
      description: t('portfolio.veloFullDesc')
    },
    {
      id: 2,
      title: t('portfolio.featuredCrisantemo'),
      category: 'fineline',
      image: '/images/crisantemo-espalda.png',
      description: t('portfolio.crisantemoFullDesc')
    },
    {
      id: 3,
      title: t('portfolio.featuredPolaroid'),
      category: 'microrealismo',
      image: '/images/polaroid-cafe.png',
      description: t('portfolio.polaroidFullDesc')
    },
    {
      id: 4,
      title: t('portfolio.featuredPanteraI'),
      category: 'fineline',
      image: '/images/pantera-crepusculo-1.png',
      description: t('portfolio.panteraIFullDesc')
    },
    {
      id: 5,
      title: t('portfolio.featuredPanteraII'),
      category: 'fineline',
      image: '/images/pantera-crepusculo-2.png',
      description: t('portfolio.panteraIIFullDesc')
    },
    {
      id: 6,
      title: t('portfolio.featuredCrisantemo'),
      category: 'fineline',
      image: '/images/crisantemo-hombro.png',
      description: t('portfolio.crisantemoHombroDesc')
    },
    {
      id: 7,
      title: t('portfolio.featuredOjoInterior'),
      category: 'blackwork',
      image: '/images/ojo-interior-brazo.png',
      description: t('portfolio.ojoInteriorFullDesc')
    },
    {
      id: 8,
      title: t('portfolio.featuredGuardianDorado'),
      category: 'anime',
      image: '/images/guardian-dorado.png',
      description: t('portfolio.guardianDoradoDesc')
    },
    {
      id: 9,
      title: t('portfolio.featuredBatallaDragon'),
      category: 'anime',
      image: '/images/batalla-dragon.png',
      description: t('portfolio.batallaDragonDesc')
    },
    {
      id: 10,
      title: t('portfolio.featuredEspaldaYakuza'),
      category: 'anime',
      image: '/images/espalda-yakuza.png',
      description: t('portfolio.espaldaYakuzaDesc')
    },
    {
      id: 11,
      title: t('portfolio.featuredRunaRaido'),
      category: 'fineline',
      image: '/images/IMG_0121.png',
      description: t('portfolio.runaRaidoDesc')
    },
    {
      id: 12,
      title: t('portfolio.featuredRunaRaidoUniversal'),
      category: 'fineline',
      image: '/images/IMG_0122.png',
      description: t('portfolio.runaRaidoUniversalDesc')
    },
    {
      id: 13,
      title: t('portfolio.featuredEspadaVerdadDivina'),
      category: 'blackwork',
      image: '/images/IMG_0123.png',
      description: t('portfolio.espadaVerdadDivinaDesc')
    },
    {
      id: 14,
      title: t('portfolio.featuredPolaroidII'),
      category: 'microrealismo',
      image: '/images/F75B9DBB-8AAE-42FB-A4DE-D78E920538F9.png',
      description: t('portfolio.polaroidIIDesc')
    },
    {
      id: 15,
      title: t('portfolio.featuredGranadaNazari'),
      category: 'microrealismo',
      image: '/images/A596C9F7-5873-409E-8AE0-AC41BEF859D3.png',
      description: t('portfolio.granadaNazariDesc')
    }
  ]

  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('portfolio.title')}
        height="sm"
      />

      {/* Filters Section */}
      <section className="py-xl bg-background-elevated border-b border-border-subtle">
        <div className="max-w-container-xl mx-auto px-md">
          <div className="flex flex-wrap justify-center gap-md">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-lg py-sm font-body text-sm tracking-wider uppercase rounded-sm transition-all duration-standard ${
                  selectedCategory === category.id
                    ? 'bg-accent-gold text-background-primary shadow-glow-gold'
                    : 'bg-background-primary text-text-secondary border border-border-gold hover:border-accent-gold hover:text-accent-gold'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Gallery Section */}
      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-xl mx-auto px-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg md:gap-xl">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                className="group relative bg-background-elevated border border-border-gold rounded-md overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-standard cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-background-primary">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-standard"
                  />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-overlay-burgundy to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-standard flex items-end">
                  <div className="p-lg w-full">
                    <h3 className="font-display text-2xl text-accent-gold mb-sm">{item.title}</h3>
                    <span className="inline-block px-md py-xs bg-accent-burgundy text-text-primary text-sm rounded-full">
                      {categories.find(c => c.id === item.category)?.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 z-50 bg-background-primary/98 backdrop-blur-xl flex items-center justify-center p-md"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-md right-md w-12 h-12 rounded-full bg-accent-gold/10 border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-background-primary transition-all duration-standard flex items-center justify-center text-2xl"
          >
            ×
          </button>
          <div className="max-w-5xl w-full">
            <div className="border-2 border-accent-gold rounded-lg overflow-hidden shadow-modal">
              <img 
                src={filteredItems[selectedImage].image}
                alt={filteredItems[selectedImage].title}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="mt-lg text-center">
              <h3 className="font-display text-3xl text-accent-gold mb-sm">
                {filteredItems[selectedImage].title}
              </h3>
              <p className="font-body text-body text-text-secondary max-w-2xl mx-auto mb-lg">
                {filteredItems[selectedImage].description}
              </p>
              <Link 
                to={`/appointments?type=${filteredItems[selectedImage].category}`}
                className="inline-block px-lg py-md bg-accent-gold hover:bg-[#E6C96C] text-background-primary font-display text-lg rounded-sm transition-all duration-standard hover:shadow-glow-gold hover:-translate-y-0.5"
              >
                Agendar Cita - {categories.find(c => c.id === filteredItems[selectedImage].category)?.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
