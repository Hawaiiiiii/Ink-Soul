import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../contexts/CartContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { Button } from '../components/common/Button'
import { Trash2, Plus, Minus } from 'lucide-react'

// Cargar Stripe (se inicializará con la clave pública)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

interface CheckoutFormProps {
  clientSecret: string
  orderId: string
  onSuccess: () => void
}

function CheckoutForm({ clientSecret, orderId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
      })

      if (error) {
        setErrorMessage(error.message || t('checkout.errorProcessingPayment'))
        setIsProcessing(false)
      } else {
        onSuccess()
      }
    } catch (err) {
      setErrorMessage(t('checkout.unexpectedError'))
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-md bg-red-900/20 border border-red-500 rounded-md">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? t('checkout.processing') : t('checkout.payNow')}
      </Button>
    </form>
  )
}

export function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isLoadingPayment, setIsLoadingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customerEmail, setCustomerEmail] = useState('')
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'ES'
  })

  const total = getCartTotal()

  const handleCreatePaymentIntent = async () => {
    if (!customerEmail || !shippingAddress.name || !shippingAddress.address) {
      setError(t('checkout.completeFields'))
      return
    }

    setIsLoadingPayment(true)
    setError(null)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'eur',
            cartItems: cart.map(item => ({
              product_id: item.product_id,
              product_name: item.product_name,
              quantity: item.quantity,
              price: item.price,
              product_image_url: item.product_image_url
            })),
            customerEmail,
            shippingAddress,
            billingAddress: shippingAddress
          })
        }
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      setClientSecret(data.data.clientSecret)
      setOrderId(data.data.orderId)
    } catch (err) {
      console.error('Error creating payment intent:', err)
      setError(err instanceof Error ? err.message : t('checkout.errorCreatingPayment'))
    } finally {
      setIsLoadingPayment(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    navigate('/checkout/success')
  }

  if (cart.length === 0 && !clientSecret) {
    return (
      <div className="min-h-screen">
        <Hero title={t('cart.empty')} subtitle={t('cart.noProducts')} height="sm" />
        <div className="py-4xl bg-background-primary">
          <div className="max-w-container-md mx-auto px-md text-center">
            <p className="text-text-secondary mb-xl">{t('cart.addProducts')}</p>
            <Button variant="primary" onClick={() => navigate('/shop')}>
              {t('cart.goShop')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Hero title={t('checkout.title')} subtitle={t('checkout.subtitle')} height="sm" />

      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-xl mx-auto px-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2xl">
            {/* Left Column - Cart Items & Shipping */}
            <div className="space-y-xl">
              {/* Cart Items */}
              {!clientSecret && (
                <div className="bg-background-elevated border border-border-gold rounded-lg p-lg">
                  <h2 className="font-display text-2xl text-accent-gold mb-lg">
                    {t('checkout.orderSummary')}
                  </h2>
                  <div className="space-y-md">
                    {cart.map((item) => (
                      <div
                        key={item.product_id}
                        className="flex gap-md pb-md border-b border-border-subtle last:border-0"
                      >
                        <img
                          src={item.product_image_url}
                          alt={language === 'es' ? item.product_name : item.product_name_en}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-body text-text-primary font-semibold">
                            {language === 'es' ? item.product_name : item.product_name_en}
                          </h3>
                          <p className="text-text-secondary text-sm">€{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-sm mt-sm">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="p-1 hover:bg-background-primary rounded"
                            >
                              <Minus size={16} className="text-accent-gold" />
                            </button>
                            <span className="text-text-primary w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="p-1 hover:bg-background-primary rounded"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus size={16} className="text-accent-gold" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="p-2 hover:bg-red-900/20 rounded-md transition-colors"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                          <p className="font-display text-lg text-accent-gold font-bold">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-lg pt-lg border-t border-border-gold">
                    <div className="flex justify-between items-center">
                      <span className="font-display text-xl text-text-primary">{t('checkout.total')}:</span>
                      <span className="font-display text-3xl text-accent-gold font-bold">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Form */}
              {!clientSecret && (
                <div className="bg-background-elevated border border-border-gold rounded-lg p-lg">
                  <h2 className="font-display text-2xl text-accent-gold mb-lg">
                    {t('checkout.shippingInfo')}
                  </h2>
                  <div className="space-y-md">
                    <div>
                      <label className="block text-text-secondary text-sm mb-sm">{t('checkout.email')} *</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-sm">{t('checkout.fullName')} *</label>
                      <input
                        type="text"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-sm">{t('checkout.address')} *</label>
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-md">
                      <div>
                        <label className="block text-text-secondary text-sm mb-sm">{t('checkout.city')}</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-text-secondary text-sm mb-sm">{t('checkout.postalCode')}</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className="w-full px-md py-sm bg-background-primary border border-border-subtle rounded-sm text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-md bg-red-900/20 border border-red-500 rounded-md">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="w-full mt-lg"
                      onClick={handleCreatePaymentIntent}
                      disabled={isLoadingPayment}
                    >
                      {isLoadingPayment ? t('checkout.preparingPayment') : t('checkout.continueToPay')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Payment */}
            {clientSecret && (
              <div className="bg-background-elevated border border-border-gold rounded-lg p-lg">
                <h2 className="font-display text-2xl text-accent-gold mb-lg">
                  {t('checkout.paymentInfo')}
                </h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    orderId={orderId!}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
