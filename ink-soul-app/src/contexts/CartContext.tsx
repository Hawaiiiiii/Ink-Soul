import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  product_id: string
  product_name: string
  product_name_en: string
  price: number
  quantity: number
  product_image_url: string
  stock: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Cargar carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('ink-soul-cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('ink-soul-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(i => i.product_id === item.product_id)
      
      if (existingItem) {
        // Si el producto ya existe, aumentar cantidad (respetando stock)
        return currentCart.map(i =>
          i.product_id === item.product_id
            ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
            : i
        )
      } else {
        // Si es nuevo, agregarlo con cantidad 1
        return [...currentCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.product_id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(currentCart =>
      currentCart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}
