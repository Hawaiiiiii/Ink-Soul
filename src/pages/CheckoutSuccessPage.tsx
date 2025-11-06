import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { Button } from '../components/common/Button'
import { CheckCircle } from 'lucide-react'

export function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    // Limpiar carrito al cargar la página de éxito
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen">
      <Hero title="Pago Exitoso" subtitle="Tu orden ha sido procesada" height="sm" />

      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-md mx-auto px-md text-center">
          <div className="bg-background-elevated border border-border-gold rounded-lg p-4xl">
            <div className="flex justify-center mb-lg">
              <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-400" />
              </div>
            </div>

            <h2 className="font-display text-3xl text-accent-gold mb-md">
              {t('checkout.thankYouPurchase')}
            </h2>

            <p className="text-text-secondary mb-xl">
              {t('checkout.orderProcessed')}
            </p>

            <div className="bg-background-primary border border-border-subtle rounded-lg p-lg mb-xl">
              <h3 className="font-display text-xl text-text-primary mb-md">
                {t('checkout.nextSteps')}
              </h3>
              <ul className="text-text-secondary text-left space-y-sm">
                <li className="flex items-start gap-sm">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>{t('checkout.confirmationEmail')}</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>{t('checkout.orderPreparation')}</span>
                </li>
                <li className="flex items-start gap-sm">
                  <span className="text-accent-gold mt-1">•</span>
                  <span>{t('checkout.trackingNumber')}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-md justify-center">
              <Button variant="primary" onClick={() => navigate('/shop')}>
                {t('checkout.continueShopping')}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
