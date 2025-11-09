/**
 * Main Application Controller
 * 
 * Script principal que coordina toda la aplicación
 * Inicializa componentes y maneja funcionalidades generales del sitio
 * 
 * @requires env.js, supabase.client.js, auth.js, ui.components.js
 * @provides window.app
 */

(function() {
    'use strict';

    let app = null;

    class MainApp {
        constructor() {
            this.initialized = false;
            this.components = {};
            this.currentPage = this.getCurrentPage();
            this.isOnline = navigator.onLine;
        }

        /**
         * Initialize the application
         */
        async init() {
            if (this.initialized) return;

            console.log('🚀 Initializing Ink & Soul application...');

            try {
                // Wait for essential scripts to load
                await this.waitForScripts();

                // Set up error handling
                this.setupErrorHandling();

                // Initialize page-specific functionality
                await this.initPageSpecific();

                // Set up global event listeners
                this.setupGlobalListeners();

                // Check configuration status
                this.checkConfiguration();

                this.initialized = true;
                console.log('✅ Application initialized successfully');

                // Dispatch ready event
                const event = new CustomEvent('appReady', { 
                    detail: { 
                        currentPage: this.currentPage,
                        isConfigured: window.isConfigured(),
                        online: this.isOnline 
                    } 
                });
                document.dispatchEvent(event);

            } catch (error) {
                console.error('❌ Application initialization failed:', error);
                this.showInitializationError();
            }
        }

        /**
         * Wait for essential scripts to load
         */
        async waitForScripts() {
            const essentialScripts = ['env.js', 'supabase.client.js', 'auth.js', 'ui.components.js'];
            const missingScripts = [];

            essentialScripts.forEach(scriptName => {
                const script = document.querySelector(`script[src*="${scriptName}"]`);
                if (!script) {
                    missingScripts.push(scriptName);
                }
            });

            if (missingScripts.length > 0) {
                console.warn('⚠️  Missing essential scripts:', missingScripts);
            }

            // Wait for config to be loaded
            await new Promise((resolve) => {
                if (window.__CONFIG) {
                    resolve();
                } else {
                    const configListener = () => {
                        document.removeEventListener('configLoaded', configListener);
                        resolve();
                    };
                    document.addEventListener('configLoaded', configListener);
                    
                    // Timeout after 10 seconds
                    setTimeout(resolve, 10000);
                }
            });
        }

        /**
         * Set up global error handling
         */
        setupErrorHandling() {
            // Unhandled errors
            window.addEventListener('error', (event) => {
                console.error('🚨 Global error:', event.error);
                this.handleError(event.error, 'global');
            });

            // Unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                console.error('🚨 Unhandled promise rejection:', event.reason);
                this.handleError(event.reason, 'promise');
            });

            // Network errors
            window.addEventListener('online', () => {
                this.isOnline = true;
                console.log('🌐 Back online');
                this.showNotification('Conexión restaurada', 'success');
            });

            window.addEventListener('offline', () => {
                this.isOnline = false;
                console.log('📴 Gone offline');
                this.showNotification('Sin conexión a internet', 'warning');
            });
        }

        /**
         * Initialize page-specific functionality
         */
        async initPageSpecific() {
            console.log(`📄 Initializing page: ${this.currentPage}`);

            switch (this.currentPage) {
                case 'portfolio':
                    await this.initPortfolioPage();
                    break;
                case 'booking':
                    await this.initBookingPage();
                    break;
                case 'shop':
                    await this.initShopPage();
                    break;
                case 'contact':
                    await this.initContactPage();
                    break;
                case '404':
                    await this.init404Page();
                    break;
                default:
                    await this.initGenericPage();
            }

            // Initialize auth UI if auth manager is available
            if (window.authManager) {
                const authContainer = document.getElementById('auth-container');
                if (authContainer) {
                    window.authManager.showAuthUI(authContainer);
                }
            }
        }

        /**
         * Initialize portfolio page
         */
        async initPortfolioPage() {
            try {
                // Load portfolio script if available
                const portfolioScript = document.querySelector('script[src*="portfolio.js"]');
                if (portfolioScript) {
                    console.log('📱 Portfolio page script found');
                } else {
                    console.log('📱 Portfolio page basic initialization');
                }

                // Setup portfolio functionality
                this.setupPortfolioFilters();
                this.setupPortfolioSearch();

            } catch (error) {
                console.error('❌ Portfolio page initialization failed:', error);
            }
        }

        /**
         * Initialize booking page
         */
        async initBookingPage() {
            if (window.bookingManager) {
                console.log('📅 Booking manager available');
            } else {
                console.log('📅 Booking page basic initialization');
            }
        }

        /**
         * Initialize shop page
         */
        async initShopPage() {
            if (window.shopManager) {
                console.log('🛍️ Shop manager available');
            } else {
                console.log('🛍️ Shop page basic initialization');
            }
        }

        /**
         * Initialize contact page
         */
        async initContactPage() {
            try {
                const contactForm = document.getElementById('contact-form');
                if (contactForm) {
                    contactForm.addEventListener('submit', this.handleContactForm.bind(this));
                }
            } catch (error) {
                console.error('❌ Contact page initialization failed:', error);
            }
        }

        /**
         * Initialize 404 page
         */
        async init404Page() {
            // Track 404 for analytics
            console.log('🚫 404 page loaded');
            
            if (window.gtag) {
                gtag('event', 'page_not_found', {
                    page_location: window.location.href,
                    page_referrer: document.referrer
                });
            }
        }

        /**
         * Initialize generic page
         */
        async initGenericPage() {
            console.log('📄 Generic page initialization');
        }

        /**
         * Set up global event listeners
         */
        setupGlobalListeners() {
            // Scroll to top on page load for SPA-like behavior
            window.addEventListener('load', () => {
                window.scrollTo(0, 0);
            });

            // Handle visibility change (page focus/blur)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    console.log('👁️ Page hidden');
                } else {
                    console.log('👁️ Page visible');
                    // Refresh data if needed
                    this.refreshPageData();
                }
            });

            // Handle beforeunload for form data preservation
            window.addEventListener('beforeunload', (e) => {
                // Check if there are unsaved form changes
                const forms = document.querySelectorAll('form');
                let hasUnsavedChanges = false;

                forms.forEach(form => {
                    if (this.hasUnsavedChanges(form)) {
                        hasUnsavedChanges = true;
                    }
                });

                if (hasUnsavedChanges) {
                    e.preventDefault();
                    e.returnValue = '¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.';
                }
            });
        }

        /**
         * Setup portfolio filters
         */
        setupPortfolioFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Update active state
                    filterButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');

                    // Filter portfolio items
                    const category = e.target.dataset.filter;
                    this.filterPortfolioItems(category);
                });
            });
        }

        /**
         * Setup portfolio search
         */
        setupPortfolioSearch() {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    this.searchPortfolioItems(searchTerm);
                });
            }
        }

        /**
         * Filter portfolio items
         */
        filterPortfolioItems(category) {
            const items = document.querySelectorAll('.portfolio-item');
            items.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    item.classList.remove('filtered-out');
                } else {
                    item.style.display = 'none';
                    item.classList.add('filtered-out');
                }
            });
        }

        /**
         * Search portfolio items
         */
        searchPortfolioItems(searchTerm) {
            const items = document.querySelectorAll('.portfolio-item');
            items.forEach(item => {
                const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
                const description = item.querySelector('p')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(searchTerm) || description.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        /**
         * Handle contact form submission
         */
        handleContactForm(event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                this.showNotification('Por favor completa todos los campos requeridos', 'error');
                return false;
            }

            // Here you would typically send the data to a server or service
            console.log('📧 Contact form submission:', data);
            
            // For now, just show success message
            this.showNotification('Mensaje enviado exitosamente. Te responderé pronto.', 'success');
            event.target.reset();

            return false;
        }

        /**
         * Check configuration status and show warnings if needed
         */
        checkConfiguration() {
            if (!window.isConfigured()) {
                console.warn('⚠️  Application not fully configured');
                this.showConfigurationWarning();
            } else {
                console.log('✅ Application configured');
            }
        }

        /**
         * Show configuration warning
         */
        showConfigurationWarning() {
            const warning = document.createElement('div');
            warning.className = 'config-warning';
            warning.innerHTML = `
                <p>⚠️ La aplicación no está completamente configurada. Algunas funcionalidades pueden estar limitadas.</p>
                <p>Para habilitar todas las funcionalidades, configura las variables de entorno.</p>
                <button onclick="this.parentElement.remove()" class="btn btn-sm">Entendido</button>
            `;
            warning.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: #f59e0b;
                color: white;
                padding: 16px;
                border-radius: 8px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;

            document.body.appendChild(warning);

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.remove();
                }
            }, 10000);
        }

        /**
         * Refresh page data
         */
        refreshPageData() {
            // Reload dynamic content if needed
            if (window.shopManager) {
                // Could reload products
                console.log('🔄 Refreshing shop data...');
            }
        }

        /**
         * Check if form has unsaved changes
         */
        hasUnsavedChanges(form) {
            // Simple check for form changes
            const inputs = form.querySelectorAll('input, textarea, select');
            return Array.from(inputs).some(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    return input.checked !== input.defaultChecked;
                } else {
                    return input.value !== input.defaultValue;
                }
            });
        }

        /**
         * Handle errors
         */
        handleError(error, context = 'unknown') {
            console.error(`❌ Error in ${context}:`, error);

            // Show user-friendly error message for critical errors
            if (context === 'global' || context === 'promise') {
                if (error.message?.includes('fetch') || error.message?.includes('network')) {
                    this.showNotification('Error de conexión. Por favor intenta nuevamente.', 'error');
                } else {
                    this.showNotification('Ha ocurrido un error inesperado. Por favor recarga la página.', 'error');
                }
            }
        }

        /**
         * Show notification
         */
        showNotification(message, type = 'info', duration = 5000) {
            if (window.uiManager) {
                window.uiManager.showNotification(message, type, duration);
            } else {
                // Fallback notification
                console.log(`${type.toUpperCase()}: ${message}`);
            }
        }

        /**
         * Show initialization error
         */
        showInitializationError() {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <h2>Error de Inicialización</h2>
                <p>La aplicación no pudo iniciarse correctamente. Por favor recarga la página.</p>
                <button onclick="window.location.reload()" class="btn btn-primary">Recargar Página</button>
            `;
            errorDiv.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: #1a1a1a;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
                text-align: center;
            `;

            document.body.appendChild(errorDiv);
        }

        /**
         * Get current page name
         */
        getCurrentPage() {
            const path = window.location.pathname;
            const page = path.split('/').pop().split('.')[0];
            return page || 'index';
        }

        /**
         * Get app status
         */
        getStatus() {
            return {
                initialized: this.initialized,
                currentPage: this.currentPage,
                online: this.isOnline,
                configured: window.isConfigured ? window.isConfigured() : false
            };
        }
    }

    // Initialize main app
    function initMainApp() {
        app = new MainApp();
        
        // Make available globally
        window.app = app;

        // Initialize when DOM is ready
        app.init();
    }

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMainApp);
    } else {
        initMainApp();
    }

    // Also expose init function for manual re-initialization
    window.reinitializeApp = function() {
        if (app) {
            app.init();
        }
    };

})();
