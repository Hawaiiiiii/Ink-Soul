import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Hero } from '../components/common/Hero'
import { Button } from '../components/common/Button'
import { supabase, isDemoMode } from '../lib/supabase'
import { loadStripe } from '@stripe/stripe-js'

// IMPORTANTE: Reemplazar con tu Stripe Publishable Key real
// Para testing: pk_test_...
// Para producción: pk_live_...
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE')

interface Product {
  id: string
  name: string
  name_en: string
  description: string
  description_en: string
  price: number
  category: string
  image_url: string
  stock: number
  is_limited_edition: boolean
  edition_number: string | null
}

export function ShopPage() {
  const { t, language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: t('shop.prints') + ' / ' + t('shop.merchandise') },
    { id: 'prints', label: t('shop.prints') },
    { id: 'merchandise', label: t('shop.merchandise') },
    { id: 'aftercare', label: t('shop.aftercare') }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // In demo mode, load from local JSON
      if (isDemoMode) {
        const response = await fetch('/data/products.json')
        const data = await response.json()
        setProducts(data || [])
      } else {
        // Production mode: load from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to local JSON if Supabase fails
      try {
        const response = await fetch('/data/products.json')
        const data = await response.json()
        setProducts(data || [])
      } catch (fallbackError) {
        console.error('Error loading fallback products:', fallbackError)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const handleBuyNow = async (product: Product) => {
    // Check if in demo mode
    if (isDemoMode) {
      alert(
        `Modo Demo: La funcionalidad de pago requiere configuración de Supabase y Stripe.\n\n` +
        `Producto: ${language === 'es' ? product.name : product.name_en}\n` +
        `Precio: €${product.price.toFixed(2)}\n\n` +
        `Para activar pagos reales:\n` +
        `1. Configurar Supabase (ver GUIA_CONFIGURACION_PRODUCCION.md)\n` +
        `2. Configurar Stripe API keys\n` +
        `3. Actualizar src/lib/supabase.ts con credenciales reales\n\n` +
        `Contacta por WhatsApp: +34605239673`
      )
      return
    }

    setProcessingPayment(product.id)

    try {
      // Validate stock
      if (product.stock === 0) {
        alert(language === 'es' ? 'Producto agotado' : 'Product out of stock')
        return
      }

      // Create payment intent via Edge Function
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: product.price,
          currency: 'eur',
          cartItems: [{
            product_id: product.id,
            product_name: language === 'es' ? product.name : product.name_en,
            quantity: 1,
            price: product.price,
            product_image_url: product.image_url
          }],
          customerEmail: '' // Could be collected in a form
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data?.error) {
        throw new Error(data.error.message || 'Payment intent creation failed')
      }

      // Get Stripe instance
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe not loaded')
      }

      // Redirect to Stripe Checkout or use Elements
      // Option 1: Use Payment Intent with Stripe Elements (recommended for custom UI)
      const { clientSecret } = data.data
      
      // Here you would typically:
      // 1. Show a payment form with Stripe Elements
      // 2. Confirm the payment with stripe.confirmCardPayment(clientSecret, ...)
      // 3. Handle the result
      
      // For now, show success message with order ID
      alert(
        `Intención de pago creada exitosamente!\n\n` +
        `Order ID: ${data.data.orderId}\n` +
        `Amount: €${data.data.amount.toFixed(2)}\n\n` +
        `En producción, aquí se mostraría el formulario de pago de Stripe.\n\n` +
        `Para completar la integración:\n` +
        `1. Implementar Stripe Elements UI\n` +
        `2. Confirmar pago con stripe.confirmCardPayment()\n` +
        `3. Redirigir a página de confirmación`
      )

      console.log('Payment intent created:', data.data)

    } catch (error: any) {
      console.error('Error processing payment:', error)
      
      const errorMessage = language === 'es' 
        ? `Error al procesar el pago: ${error.message}\n\nPuedes contactarnos por WhatsApp: +34605239673`
        : `Payment processing error: ${error.message}\n\nYou can contact us via WhatsApp: +34605239673`
      
      alert(errorMessage)
    } finally {
      setProcessingPayment(null)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero 
        title={t('shop.title')}
        subtitle={t('shop.subtitle')}
        height="sm"
      />

      {/* Demo Mode Warning */}
      {isDemoMode && (
        <div className="bg-accent-burgundy border-t border-b border-accent-gold py-md">
          <div className="max-w-container-xl mx-auto px-md text-center">
            <p className="text-text-primary font-body text-sm">
              <strong>MODO DEMO:</strong> Los pagos requieren configuración de Supabase y Stripe. 
              Ver <code className="bg-background-primary px-sm py-xs rounded">GUIA_CONFIGURACION_PRODUCCION.md</code>
            </p>
          </div>
        </div>
      )}

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

      {/* Products Grid */}
      <section className="section-spacing bg-background-primary">
        <div className="max-w-container-xl mx-auto px-md">
          {isLoading ? (
            <div className="text-center py-4xl">
              <div className="inline-block w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
              <p className="mt-md text-text-secondary">
                {language === 'es' ? 'Cargando productos...' : 'Loading products...'}
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-4xl">
              <p className="text-text-secondary text-xl">
                {t('common.comingSoon')}
              </p>
              <p className="text-text-tertiary mt-md">
                {t('common.preparingCollection')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg md:gap-xl">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group bg-background-elevated border border-border-gold rounded-lg overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-standard"
                >
                  <div className="aspect-square overflow-hidden bg-background-primary">
                    <img 
                      src={product.image_url} 
                      alt={language === 'es' ? product.name : product.name_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-standard"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-lg">
                    {product.is_limited_edition && (
                      <span className="inline-block px-sm py-xs bg-accent-burgundy text-text-primary text-xs rounded-full mb-sm">
                        {t('shop.limitedEdition')} {product.edition_number}
                      </span>
                    )}
                    <h3 className="font-display text-xl text-accent-gold mb-sm">
                      {language === 'es' ? product.name : product.name_en}
                    </h3>
                    <p className="font-body text-sm text-text-secondary mb-md line-clamp-2">
                      {language === 'es' ? product.description : product.description_en}
                    </p>
                    <p className="font-display text-2xl text-text-primary font-bold mb-lg">
                      €{product.price.toFixed(2)}
                    </p>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0 || processingPayment === product.id}
                    >
                      {processingPayment === product.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          {language === 'es' ? 'Procesando...' : 'Processing...'}
                        </span>
                      ) : product.stock === 0 ? (
                        language === 'es' ? 'Agotado' : 'Out of stock'
                      ) : (
                        t('shop.buyNow')
                      )}
                    </Button>
                    {product.stock > 0 && product.stock <= 5 && (
                      <p className="text-xs text-accent-burgundy mt-sm text-center">
                        {language === 'es' 
                          ? `Solo quedan ${product.stock} unidades` 
                          : `Only ${product.stock} units left`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
