import { useEffect } from 'react'

export function useRemoveMiniMaxWatermark() {
  useEffect(() => {
    // Función para eliminar la marca de agua de MiniMax
    const removeWatermark = () => {
      // Seleccionar todos los posibles elementos de la marca de agua
      const watermarkSelectors = [
        '#minimax-floating-ball',
        '[id="minimax-floating-ball"]',
        '[class*="minimax-ball"]',
        '[class*="minimax-logo"]',
        '[data-minimax]',
        '.minimax-floating',
        '[class*="watermark"]',
        '[class*="Created by"]'
      ]

      watermarkSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          const el = element as HTMLElement
          el.style.display = 'none'
          el.style.visibility = 'hidden'
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          el.style.zIndex = '-999999'
          el.remove()
        })
      })

      // Buscar elementos que contengan el texto "MiniMax" o "Created by"
      const textNodes = document.querySelectorAll('*')
      textNodes.forEach(element => {
        const textContent = element.textContent || ''
        if (textContent.includes('MiniMax') || textContent.includes('Created by')) {
          const el = element as HTMLElement
          el.style.display = 'none'
          el.style.visibility = 'hidden'
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          el.style.zIndex = '-999999'
        }
      })
    }

    // Ejecutar inmediatamente
    removeWatermark()

    // Ejecutar después de que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeWatermark)
    }

    // Usar MutationObserver para detectar cambios en el DOM
    const observer = new MutationObserver(() => {
      removeWatermark()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    })

    // Ejecutar periódicamente para mayor seguridad
    const interval = setInterval(removeWatermark, 1000)

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', removeWatermark)
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])
}
