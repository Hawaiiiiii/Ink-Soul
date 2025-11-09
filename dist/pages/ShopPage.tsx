import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { ShopHeader } from '../components/ShopHeader'
import { Button } from '../components/common/Button'

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
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  const categories = [
    { id: 'all', label: t('shop.prints') + ' / ' + t('shop.merchandise') },
    { id: 'prints', label: t('shop.prints') },
    { id: 'merchandise', label: t('shop.merchandise') },
    { id: 'aftercare', label: t('shop.aftercare') }
  ]

  // Simplified product loading
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading products from /data/products.json...')
        const response = await fetch('/data/products.json')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Products loaded:', data.length, 'items')
        
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
          setLoadError(null)
        } else {
          throw new Error('Invalid data format: expected array with products')
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setLoadError(error instanceof Error ? error.message : 'Error loading products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  // Grid layout classes for different categories
  const getGridClasses = () => {
    if (selectedCategory === 'prints' || filteredProducts.length <= 3) {
      return 'shop-grid-centered grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
    }
    return 'shop-grid-responsive grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const handleBuyNow = async (product: Product) => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_name_en: product.name_en,
      price: product.price,
      product_image_url: product.image_url,
      stock: product.stock
    })
    
    // Mostrar feedback visual
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  // Debug info - removed

  if (loadError) {
    return (
      <div className="min-h-screen">
        <ShopHeader />
        <div className="py-4xl bg-background-primary">
          <div className="max-w-container-xl mx-auto px-md text-center">
            <h2 className="text-xl text-red-500 mb-md">Error al cargar productos</h2>
            <p className="text-text-secondary">{loadError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-md px-lg py-sm bg-accent-gold text-background-primary rounded-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Shop Header Section */}
      <ShopHeader />

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
              <p className="mt-md text-text-secondary">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-4xl">
              <p className="text-text-secondary text-xl">{t('common.comingSoon')}</p>
              <p className="text-text-tertiary mt-md">{t('common.preparingCollection')}</p>
            </div>
          ) : (
            <div className={getGridClasses()}>
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="group shop-card-harmonized"
                  >
                    <div className="aspect-square overflow-hidden bg-background-primary">
                      <img 
                        src={product.image_url} 
                        alt={language === 'es' ? product.name : product.name_en}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-standard"
                        onError={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f0f0'
                          e.currentTarget.style.display = 'flex'
                          e.currentTarget.style.alignItems = 'center'
                          e.currentTarget.style.justifyContent = 'center'
                          e.currentTarget.innerHTML = '<span style="color: #999;">Sin imagen</span>'
                        }}
                      />
                    </div>
                    <div className="p-lg">
                      {product.is_limited_edition && (
                        <span className="shop-product-tag">
                          {t('shop.limitedEdition')} {product.edition_number}
                        </span>
                      )}
                      <h3 className="shop-title-harmonized">
                        {language === 'es' ? product.name : product.name_en}
                      </h3>
                      <p className="font-body text-sm text-text-secondary mb-md line-clamp-2">
                        {language === 'es' ? product.description : product.description_en}
                      </p>
                      <p className="shop-price-harmonized">
                        €{product.price.toFixed(2)}
                      </p>
                      <Button 
                        variant="primary" 
                        className="w-full"
                        onClick={() => handleBuyNow(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 
                          ? t('shop.soldOut') 
                          : addedToCart === product.id 
                            ? t('shop.addedToCart') 
                            : t('shop.addToCart')}
                      </Button>
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