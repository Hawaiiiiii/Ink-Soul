import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { Button } from '../components/common/Button'
import { supabase } from '../lib/supabase'
import { MapPin, Mail, Phone, Clock, Instagram, MessageCircle } from 'lucide-react'

export function ContactPage() {
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Llamar al sistema de notificaciones
      const { data, error } = await supabase.functions.invoke('contact-notification', {
        body: formData
      })

      if (error) throw error

      if (data?.error) {
        throw new Error(data.error.message)
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
        height="sm"
      />

      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-lg mx-auto px-md">
          <div className="grid md:grid-cols-2 gap-xl">
            {/* Form Column */}
            <div>
              <div className="bg-background-elevated border border-border-gold rounded-lg p-xl shadow-card">
                <h3 className="font-display text-2xl text-accent-gold mb-lg">
                  {t('contact.sendMessage')}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-lg">
                  {/* Name */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('contact.name')} <span className="text-accent-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('contact.email')} <span className="text-accent-gold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('contact.subject')}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('contact.message')} <span className="text-accent-gold">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard resize-none"
                    />
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-md bg-accent-gold/20 border border-accent-gold rounded-sm text-accent-gold">
                      {t('common.successMessage')}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-md bg-accent-burgundy/20 border border-accent-burgundy rounded-sm text-accent-burgundy-light">
                      Error al enviar el mensaje. Por favor, intenta de nuevo o contacta directamente por WhatsApp.
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : t('contact.send')}
                  </Button>
                </form>
              </div>
            </div>

            {/* Info Column */}
            <div className="space-y-lg">
              {/* Contact Information */}
              <div className="bg-background-elevated border border-border-gold rounded-lg p-xl shadow-card">
                <h3 className="font-display text-2xl text-accent-gold mb-lg">
                  {t('contact.info')}
                </h3>
                
                <div className="space-y-lg">
                  <div className="flex items-start space-x-md">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-accent-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="font-body text-base font-semibold text-text-primary mb-xs">Email</h4>
                      <a 
                        href="mailto:inkandsoultatto@gmail.com" 
                        className="text-text-secondary hover:text-accent-gold transition-colors"
                      >
                        inkandsoultatto@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-md">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-accent-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="font-body text-base font-semibold text-text-primary mb-xs">{t('contact.phone')}</h4>
                      <a 
                        href="tel:+34605239673" 
                        className="text-text-secondary hover:text-accent-gold transition-colors"
                      >
                        +34 605 239 673
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-md">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-accent-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="font-body text-base font-semibold text-text-primary mb-xs">{t('contact.location')}</h4>
                      <p className="text-text-secondary">
                        {t('common.granadaSpain')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-md">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="text-accent-gold" size={20} />
                    </div>
                    <div>
                      <h4 className="font-body text-base font-semibold text-text-primary mb-xs">
                        {t('contact.hours')}
                      </h4>
                      <p className="text-text-secondary">
                        {language === 'es' ? (
                          <>
                            Lun - Vie: 10:00 - 19:00<br />
                            Sáb: 11:00 - 15:00<br />
                            Dom: Cerrado
                          </>
                        ) : (
                          <>
                            Mon - Fri: 10:00 - 19:00<br />
                            Sat: 11:00 - 15:00<br />
                            Sun: Closed
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-background-elevated border border-border-gold rounded-lg p-xl shadow-card">
                <h3 className="font-display text-2xl text-accent-gold mb-lg">
                  {t('contact.socialMedia')}
                </h3>
                
                <div className="grid grid-cols-2 gap-md">
                  <a
                    href="https://instagram.com/artbyasuna"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-sm p-md bg-background-primary border border-border-gold rounded-sm hover:border-accent-gold hover:bg-accent-gold/10 hover:shadow-glow-gold transition-all duration-standard"
                  >
                    <Instagram className="text-accent-gold" size={20} />
                    <span className="font-body text-sm text-text-primary">@artbyasuna</span>
                  </a>
                  
                  <a
                    href="https://wa.me/34605239673"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-sm p-md bg-background-primary border border-border-gold rounded-sm hover:border-accent-gold hover:bg-accent-gold/10 hover:shadow-glow-gold transition-all duration-standard"
                  >
                    <MessageCircle className="text-accent-gold" size={20} />
                    <span className="font-body text-sm text-text-primary">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Enhanced Dark Theme */}
      <section className="bg-background-elevated border-t border-border-subtle py-xl">
        <div className="max-w-container-lg mx-auto px-md">
          <div className="text-center mb-lg">
            <h3 className="font-display text-2xl text-accent-gold mb-md">
              {t('contact.visitStudio')}
            </h3>
            <p className="text-text-secondary">
              {t('footer.visitUs')}
            </p>
          </div>
          
          <div className="map-container-enhanced">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3179.562345678901!2d-3.5983617!3d37.1773364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fce65e8a8a2b%3A0x7b7b7b7b7b7b7b7b!2sCalle%20Jose%20Recuerda%2C%20Granada!5e0!3m2!1ses!2ses!4v1234567890123!5m2!1sen!2ses"
              width="100%"
              height="420"
              style={{ 
                border: 0,
                borderRadius: '12px',
                filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ink & Soul Tattoo Studio Location - Calle Jose Recuerda, Granada"
            ></iframe>
            
            {/* Custom Marker Overlay */}
            <div className="map-marker-overlay">
              <img 
                src="/assets/icons/pin-gold-IS.png" 
                alt="Ink & Soul Location" 
                className="w-8 h-8"
              />
              <div className="marker-tooltip">
                <span className="text-sm font-medium text-text-primary">Ink & Soul</span>
                <p className="text-xs text-text-secondary">Calle Jose Recuerda, Granada</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
