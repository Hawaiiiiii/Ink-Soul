import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { NazariteBorder } from '../components/common/NazariteBorder'

export function AboutPage() {
  const { t } = useLanguage()

  const processSteps = [
    { number: '01', title: t('about.step1') },
    { number: '02', title: t('about.step2') },
    { number: '03', title: t('about.step3') },
    { number: '04', title: t('about.step4') }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        height="md"
      />

      {/* Biography Section */}
      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-lg mx-auto px-md">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div className="order-2 md:order-1">
              <div className="bg-background-elevated border border-border-gold rounded-lg p-xl shadow-card space-y-lg text-center">
                <div className="font-body text-2xl md:text-3xl lg:text-4xl text-text-primary leading-loose whitespace-pre-line">
                  {t('about.bioMain')}
                </div>
                <div className="font-body text-lg md:text-xl lg:text-2xl text-text-secondary leading-loose whitespace-pre-line">
                  {t('about.bioSupporting')}
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="aspect-[4/5] rounded-lg overflow-hidden border-2 border-accent-gold shadow-glow-gold">
                  <img 
                    src="/images/5c566762-e26f-4a60-a3f8-67773a1c379e.jpeg" 
                    alt="Asunaah"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-gold/20 rounded-lg border border-border-gold -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Process Section */}
      <section className="section-spacing bg-background-elevated">
        <div className="max-w-container-lg mx-auto px-md">
          <h2 className="font-display text-h2 text-accent-gold text-center mb-3xl">
            {t('about.process')}
          </h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-gold via-accent-burgundy to-accent-indigo hidden md:block" />
            
            <div className="space-y-xl md:space-y-2xl">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-lg ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-background-primary border border-border-gold rounded-lg p-xl shadow-card hover:shadow-glow-gold transition-all duration-standard">
                      <h3 className="font-body text-xl text-accent-gold font-semibold mb-sm">
                        {step.title}
                      </h3>
                      <div className="font-body text-body text-text-secondary whitespace-pre-line">
                        {t(`about.step${index + 1}Desc`)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent-gold/10 border-2 border-accent-gold shadow-glow-gold z-10">
                    <span className="font-display text-2xl font-bold text-accent-gold">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nazarite Ornamental Border */}
      <NazariteBorder />

      {/* Personal Gallery Section */}
      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-lg mx-auto px-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Imagen eliminada por solicitud del usuario */}
            {/* Imagen eliminada por solicitud del usuario */}
            {/* Imagen eliminada por solicitud del usuario */}
          </div>
        </div>
      </section>
    </div>
  )
}
