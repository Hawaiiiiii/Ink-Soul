/**
 * Shop Management System
 * 
 * Sistema de tienda que lista productos y llama a Edge Function create-checkout-session
 * Maneja carrito con localStorage y checkout vía Stripe
 * 
 * @requires window.supabasePublic and window.callEdgeFunction
 * @provides window.shopManager
 */

(function() {
    'use strict';

    let shopManager = null;

    class ShopManager {
        constructor() {
            this.products = [];
            this.cart = [];
            this.currentCategory = 'all';
            this.searchTerm = '';
            this.initialized = false;
        }

        /**
         * Initialize shop manager
         */
        async init() {
            if (this.initialized) return;

            console.log('🛍️ Initializing shop manager...');

            // Load cart from localStorage
            this.loadCart();

            // Bind UI events
            this.bindUIEvents();

            // Load products
            await this.loadProducts();

            // Initialize cart UI
            this.updateCartUI();

            this.initialized = true;

            console.log('✅ Shop manager initialized');
        }

        /**
         * Bind UI events
         */
        bindUIEvents() {
            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.setCategory(e.target.dataset.category);
                });
            });

            // Search input
            const searchInput = document.getElementById('shop-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.setSearchTerm(e.target.value);
                });
            }

            // Cart events
            const cartToggle = document.getElementById('cart-toggle');
            const cartClose = document.getElementById('cart-close');
            const cartOverlay = document.getElementById('cart-overlay');
            const checkoutBtn = document.getElementById('checkout-btn');

            if (cartToggle) cartToggle.addEventListener('click', () => this.toggleCart());
            if (cartClose) cartClose.addEventListener('click', () => this.closeCart());
            if (cartOverlay) cartOverlay.addEventListener('click', () => this.closeCart());
            if (checkoutBtn) checkoutBtn.addEventListener('click', () => this.checkout());

            // ESC key to close cart
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeCart();
                }
            });
        }

        /**
         * Load products from database
         */
        async loadProducts() {
            const productsContainer = document.getElementById('products-grid');
            if (!productsContainer) return;

            try {
                productsContainer.innerHTML = '<div class="loading-spinner"><p>Cargando productos...</p></div>';

                let products;
                
                if (window.supabasePublic) {
                    // Load from Supabase if available
                    const filters = this.currentCategory !== 'all' ? { category: this.currentCategory } : {};
                    products = await window.supabasePublic.getProducts(filters);
                } else {
                    // Fallback to mock data
                    products = this.getMockProducts();
                }

                // Filter by search term
                if (this.searchTerm) {
                    products = products.filter(product => 
                        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                        product.description?.toLowerCase().includes(this.searchTerm.toLowerCase())
                    );
                }

                this.products = products;
                this.renderProducts();

            } catch (error) {
                console.error('❌ Failed to load products:', error);
                productsContainer.innerHTML = `
                    <div class="error-message">
                        <p>Error al cargar los productos. Por favor intenta nuevamente.</p>
                    </div>
                `;
            }
        }

        /**
         * Get mock products for testing
         */
        getMockProducts() {
            return [
                {
                    id: '1',
                    name: 'Símbolo Sagrado Minimalista',
                    description: 'Diseño devocional contemporáneo para honrar la espiritualidad',
                    price_cents: 2500,
                    category: 'devotional',
                    image_url: 'assets/img/gallery/mock-product-1.jpg',
                    active: true,
                    sku: 'DEV-001'
                },
                {
                    id: '2',
                    name: 'Flor de Loto en Línea Fina',
                    description: 'Elegancia y pureza en técnica fineline',
                    price_cents: 1800,
                    category: 'floral',
                    image_url: 'assets/img/gallery/mock-product-2.jpg',
                    active: true,
                    sku: 'FLR-002'
                },
                {
                    id: '3',
                    name: 'Mandala Simplificado',
                    description: 'Geometría sagrada adaptada al arte contemporáneo',
                    price_cents: 3200,
                    category: 'symbolic',
                    image_url: 'assets/img/gallery/mock-product-3.jpg',
                    active: true,
                    sku: 'SYM-003'
                },
                {
                    id: '4',
                    name: 'Símbolos Celtas Modernos',
                    description: 'Tradición celta con interpretación minimalista',
                    price_cents: 2100,
                    category: 'symbolic',
                    image_url: 'assets/img/gallery/mock-product-4.jpg',
                    active: true,
                    sku: 'SYM-004'
                },
                {
                    id: '5',
                    name: 'Geometría Devocional',
                    description: 'Patrones geométricos con significado espiritual',
                    price_cents: 2800,
                    category: 'devotional',
                    image_url: 'assets/img/gallery/mock-product-5.jpg',
                    active: true,
                    sku: 'DEV-005'
                },
                {
                    id: '6',
                    name: 'Rama Sakura Abstracta',
                    description: 'Belleza japonesa en líneas simples',
                    price_cents: 2200,
                    category: 'floral',
                    image_url: 'assets/img/gallery/mock-product-6.jpg',
                    active: true,
                    sku: 'FLR-006'
                }
            ];
        }

        /**
         * Render products grid
         */
        renderProducts() {
            const container = document.getElementById('products-grid');
            if (!container) return;

            if (this.products.length === 0) {
                container.innerHTML = `
                    <div class="no-products">
                        <p>No se encontraron productos${this.searchTerm ? ` para "${this.searchTerm}"` : ''}.</p>
                    </div>
                `;
                return;
            }

            const productsHTML = this.products.map(product => this.renderProductCard(product)).join('');
            
            container.innerHTML = `
                <div class="products-grid">
                    ${productsHTML}
                </div>
            `;
        }

        /**
         * Render individual product card
         */
        renderProductCard(product) {
            const price = (product.price_cents / 100).toFixed(2);
            
            return `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <div class="product-image-placeholder">
                            <p>${product.name}</p>
                        </div>
                        <div class="product-overlay">
                            <button class="btn btn-primary" onclick="window.shopManager.addToCart('${product.id}')">
                                Agregar al Carrito - $${price}
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description || 'Arte digital exclusivo'}</p>
                        <div class="product-meta">
                            <span class="product-price">$${price}</span>
                            <span class="product-category">${this.getCategoryLabel(product.category)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        /**
         * Get category label
         */
        getCategoryLabel(category) {
            const labels = {
                'devotional': 'Devocional',
                'minimalist': 'Minimalista',
                'floral': 'Floral',
                'symbolic': 'Simbólico'
            };
            return labels[category] || category;
        }

        /**
         * Set category filter
         */
        setCategory(category) {
            this.currentCategory = category;
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === category) {
                    btn.classList.add('active');
                }
            });

            this.loadProducts();
        }

        /**
         * Set search term
         */
        setSearchTerm(term) {
            this.searchTerm = term;
            this.loadProducts();
        }

        /**
         * Add product to cart
         */
        addToCart(productId) {
            const product = this.products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price_cents: product.price_cents,
                    quantity: 1,
                    sku: product.sku
                });
            }

            this.saveCart();
            this.updateCartUI();
            this.showCartNotification(`Agregado: ${product.name}`);
        }

        /**
         * Remove product from cart
         */
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
            this.updateCartUI();
        }

        /**
         * Update product quantity in cart
         */
        updateQuantity(productId, quantity) {
            const item = this.cart.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(1, quantity);
                this.saveCart();
                this.updateCartUI();
            }
        }

        /**
         * Get cart total
         */
        getCartTotal() {
            return this.cart.reduce((total, item) => total + (item.price_cents * item.quantity), 0);
        }

        /**
         * Update cart UI
         */
        updateCartUI() {
            // Update cart count
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }

            // Update cart total
            const cartTotal = document.getElementById('cart-total');
            if (cartTotal) {
                cartTotal.textContent = (this.getCartTotal() / 100).toFixed(2);
            }

            // Update checkout button
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.disabled = this.cart.length === 0;
            }

            // Update cart items list
            this.renderCartItems();
        }

        /**
         * Render cart items
         */
        renderCartItems() {
            const cartItemsContainer = document.getElementById('cart-items');
            if (!cartItemsContainer) return;

            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
                return;
            }

            const itemsHTML = this.cart.map(item => this.renderCartItem(item)).join('');
            
            cartItemsContainer.innerHTML = itemsHTML;
        }

        /**
         * Render individual cart item
         */
        renderCartItem(item) {
            const price = (item.price_cents / 100).toFixed(2);
            const total = ((item.price_cents * item.quantity) / 100).toFixed(2);

            return `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">$${price} c/u</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button onclick="window.shopManager.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="quantity-btn" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="window.shopManager.updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="quantity-btn">+</button>
                        </div>
                        <div class="cart-item-total">$${total}</div>
                        <button onclick="window.shopManager.removeFromCart('${item.id}')" 
                            class="remove-btn" aria-label="Eliminar del carrito">×</button>
                    </div>
                </div>
            `;
        }

        /**
         * Toggle cart sidebar
         */
        toggleCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            const cartOverlay = document.getElementById('cart-overlay');
            
            if (cartSidebar.classList.contains('active')) {
                this.closeCart();
            } else {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        /**
         * Close cart
         */
        closeCart() {
            const cartSidebar = document.getElementById('cart-sidebar');
            const cartOverlay = document.getElementById('cart-overlay');
            
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        /**
         * Checkout process
         */
        async checkout() {
            if (this.cart.length === 0) return;

            try {
                console.log('💳 Starting checkout process...');

                // Prepare cart data for Stripe
                const cartItems = this.cart.map(item => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            description: `SKU: ${item.sku}`,
                        },
                        unit_amount: item.price_cents,
                    },
                    quantity: item.quantity,
                }));

                // Call Edge Function to create Stripe checkout session
                const result = await window.callEdgeFunction('create-checkout-session', {
                    cart: cartItems,
                    success_url: `${window.getConfig('SITE_URL')}/shop-success.html?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${window.getConfig('SITE_URL')}/shop.html`
                });

                if (result.success && result.url) {
                    console.log('✅ Redirecting to Stripe checkout...');
                    window.location.href = result.url;
                } else {
                    throw new Error(result.message || 'Error al crear sesión de pago');
                }

            } catch (error) {
                console.error('❌ Checkout failed:', error);
                alert(`Error al procesar el pago: ${error.message}`);
            }
        }

        /**
         * Show cart notification
         */
        showCartNotification(message) {
            // Create temporary notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
            `;

            // Add animation styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        /**
         * Save cart to localStorage
         */
        saveCart() {
            localStorage.setItem('ink-soul-cart', JSON.stringify(this.cart));
        }

        /**
         * Load cart from localStorage
         */
        loadCart() {
            try {
                const savedCart = localStorage.getItem('ink-soul-cart');
                if (savedCart) {
                    this.cart = JSON.parse(savedCart);
                }
            } catch (error) {
                console.error('❌ Failed to load cart:', error);
                this.cart = [];
            }
        }

        /**
         * Clear cart
         */
        clearCart() {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
        }
    }

    // Initialize shop manager
    function initShopManager() {
        shopManager = new ShopManager();
        
        // Make available globally
        window.shopManager = shopManager;

        // Initialize
        shopManager.init();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initShopManager);
    } else {
        initShopManager();
    }

})();
