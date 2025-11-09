import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { Button } from '../components/common/Button'
import { supabase } from '../lib/supabase'

export function AppointmentsPage() {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    project_type: '',
    description: '',
    body_zone: '',
    preferred_date: '',
    preferred_time: ''
  })

  // Updated project types to match real tattoo styles
  const projectTypes = [
    { value: 'blackwork', label: t('appointments.projectTypes.blackwork') },
    { value: 'microrealismo', label: t('appointments.projectTypes.microrealismo') },
    { value: 'fineline', label: t('appointments.projectTypes.fineline') },
    { value: 'anime', label: t('appointments.projectTypes.anime') },
    { value: 'otros', label: t('appointments.projectTypes.otros') }
  ]

  // Auto-complete project type from portfolio URL parameters
  useEffect(() => {
    const typeFromUrl = searchParams.get('type')
    if (typeFromUrl && projectTypes.find(pt => pt.value === typeFromUrl)) {
      setFormData(prev => ({
        ...prev,
        project_type: typeFromUrl
      }))
    }
  }, [searchParams, projectTypes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Primero enviar la cita
      const { data: appointmentData, error: appointmentError } = await supabase.functions.invoke('submit-appointment', {
        body: formData
      })

      if (appointmentError) throw appointmentError

      if (appointmentData?.error) {
        throw new Error(appointmentData.error.message)
      }

      // Luego enviar notificación
      const notificationPayload = {
        name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        design: formData.project_type,
        size: 'Por especificar',
        placement: formData.body_zone,
        date: formData.preferred_date,
        time: formData.preferred_time,
        message: formData.description
      }

      const { error: notificationError } = await supabase.functions.invoke('appointment-notification', {
        body: notificationPayload
      })

      if (notificationError) {
        console.error('Error enviando notificación:', notificationError)
        // No fallar el proceso si falla la notificación
      }

      setSubmitStatus('success')
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        project_type: '',
        description: '',
        body_zone: '',
        preferred_date: '',
        preferred_time: ''
      })
    } catch (error) {
      console.error('Error submitting appointment:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('appointments.title')}
        subtitle={t('appointments.subtitle')}
        height="md"
      />

      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-lg mx-auto px-md">
          <div className="grid md:grid-cols-5 gap-xl">
            {/* Form Column */}
            <div className="md:col-span-3">
              <div className="bg-background-elevated border border-border-gold rounded-lg p-xl shadow-card">
                <form onSubmit={handleSubmit} className="space-y-lg">
                  {/* Name */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.name')} <span className="text-accent-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.email')} <span className="text-accent-gold">*</span>
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

                  {/* Phone */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.projectType')}
                    </label>
                    <select
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    >
                      <option value="">{t('appointments.select')}</option>
                      {projectTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.description')}
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard resize-none"
                    />
                  </div>

                  {/* Body Zone */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.bodyZone')}
                    </label>
                    <input
                      type="text"
                      name="body_zone"
                      value={formData.body_zone}
                      onChange={handleChange}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.preferredDate')}
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    />
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block font-body text-sm font-medium text-text-secondary mb-sm">
                      {t('appointments.preferredTime')}
                    </label>
                    <select
                      name="preferred_time"
                      value={formData.preferred_time}
                      onChange={handleChange}
                      className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/20 focus:outline-none transition-all duration-standard"
                    >
                      <option value="">{t('appointments.select')}</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                    </select>
                  </div>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-md bg-accent-gold/20 border border-accent-gold rounded-sm text-accent-gold">
                      {t('appointments.successMessage')}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-md bg-accent-burgundy/20 border border-accent-burgundy rounded-sm text-accent-burgundy-light">
                      {t('appointments.errorMessage')}
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
                    {isSubmitting ? t('appointments.submitting') : t('appointments.submit')}
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="md:col-span-2 space-y-lg">
              {/* Policies */}
              <div className="bg-background-elevated border border-border-gold rounded-lg p-lg shadow-card">
                <h3 className="font-display text-2xl text-accent-gold mb-lg">
                  {t('appointments.policies')}
                </h3>
                <div className="space-y-md">
                  <div>
                    <h4 className="font-body text-base font-semibold text-text-primary mb-sm">
                      {t('appointments.deposit')}
                    </h4>
                    <p className="font-body text-sm text-text-secondary">
                      {t('appointments.depositText')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-body text-base font-semibold text-text-primary mb-sm">
                      {t('appointments.cancellation')}
                    </h4>
                    <p className="font-body text-sm text-text-secondary">
                      {t('appointments.cancellationText')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-body text-base font-semibold text-text-primary mb-sm">
                      {t('appointments.preparation')}
                    </h4>
                    <p className="font-body text-sm text-text-secondary">
                      {t('appointments.preparationText')}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-body text-base font-semibold text-text-primary mb-sm">
                      {t('appointments.aftercare')}
                    </h4>
                    <p className="font-body text-sm text-text-secondary">
                      {t('appointments.aftercareText')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-background-elevated border border-border-gold rounded-lg p-lg shadow-card">
                <h3 className="font-display text-2xl text-accent-gold mb-lg">{t('appointments.directContact')}</h3>
                <div className="space-y-md">
                  <Button 
                    href="https://wa.me/34605239673" 
                    variant="secondary" 
                    className="w-full"
                  >
                    WhatsApp
                  </Button>
                  <Button 
                    href="mailto:inkandsoultatto@gmail.com" 
                    variant="secondary" 
                    className="w-full"
                  >
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
