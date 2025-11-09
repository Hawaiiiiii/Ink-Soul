/**
 * UI Components Manager
 * 
 * Maneja componentes de UI reutilizables y funcionalidades generales
 * Navegación móvil, modales, tooltips, etc.
 * 
 * @provides window.uiManager
 */

(function() {
    'use strict';

    let uiManager = null;

    class UIManager {
        constructor() {
            this.mobileMenuOpen = false;
            this.initialized = false;
        }

        /**
         * Initialize UI components
         */
        init() {
            if (this.initialized) return;

            console.log('🎨 Initializing UI components...');

            this.initMobileNavigation();
            this.initSmoothScrolling();
            this.initTooltips();
            this.initModals();
            this.initLoadingStates();
            this.initFormEnhancements();
            this.initKeyboardNavigation();
            this.initAnimations();

            this.initialized = true;
            console.log('✅ UI components initialized');
        }

        /**
         * Initialize mobile navigation
         */
        initMobileNavigation() {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');

            if (!navToggle || !navMenu) return;

            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking on links
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.closeMobileMenu();
                }
            });

            // Close mobile menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768 && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }

        /**
         * Toggle mobile menu
         */
        toggleMobileMenu() {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');

            if (!navToggle || !navMenu) return;

            this.mobileMenuOpen = !this.mobileMenuOpen;

            navToggle.setAttribute('aria-expanded', this.mobileMenuOpen);
            navMenu.classList.toggle('active', this.mobileMenuOpen);

            // Prevent body scroll when menu is open
            document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
        }

        /**
         * Close mobile menu
         */
        closeMobileMenu() {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');

            if (!navToggle || !navMenu) return;

            this.mobileMenuOpen = false;

            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        /**
         * Initialize smooth scrolling
         */
        initSmoothScrolling() {
            // Handle anchor links
            document.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                    e.preventDefault();
                    const targetId = e.target.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        }

        /**
         * Initialize tooltips
         */
        initTooltips() {
            // Add tooltips to elements with data-tooltip attribute
            document.addEventListener('mouseenter', (e) => {
                const tooltip = e.target.getAttribute('data-tooltip');
                if (tooltip) {
                    this.showTooltip(e.target, tooltip);
                }
            });

            document.addEventListener('mouseleave', (e) => {
                const tooltip = e.target.getAttribute('data-tooltip');
                if (tooltip) {
                    this.hideTooltip();
                }
            });
        }

        /**
         * Show tooltip
         */
        showTooltip(element, text) {
            const tooltip = document.createElement('div');
            tooltip.className = 'ui-tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--color-primary);
                color: var(--color-background);
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transform: translateY(4px);
                transition: opacity 0.2s, transform 0.2s;
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

            // Show with animation
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            });

            this.currentTooltip = tooltip;
        }

        /**
         * Hide tooltip
         */
        hideTooltip() {
            if (this.currentTooltip) {
                this.currentTooltip.style.opacity = '0';
                this.currentTooltip.style.transform = 'translateY(4px)';
                setTimeout(() => {
                    if (this.currentTooltip) {
                        this.currentTooltip.remove();
                        this.currentTooltip = null;
                    }
                }, 200);
            }
        }

        /**
         * Initialize modals
         */
        initModals() {
            // Portfolio modal (for portfolio.html)
            const modal = document.getElementById('portfolio-modal');
            const modalOverlay = document.getElementById('modal-overlay');
            const modalClose = document.querySelector('.modal-close');

            if (modal && modalOverlay) {
                // Close modal events
                modalOverlay.addEventListener('click', () => this.closeModal(modal));
                if (modalClose) modalClose.addEventListener('click', () => this.closeModal(modal));
                
                // Escape key to close modal
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && modal.classList.contains('active')) {
                        this.closeModal(modal);
                    }
                });
            }
        }

        /**
         * Open modal
         */
        openModal(modal, content = {}) {
            if (!modal) return;

            // Set modal content
            const modalImage = modal.querySelector('#modal-image');
            const modalTitle = modal.querySelector('#modal-title');
            const modalDescription = modal.querySelector('#modal-description');
            const modalCategory = modal.querySelector('#modal-category');
            const modalDate = modal.querySelector('#modal-date');

            if (modalImage && content.image) modalImage.src = content.image;
            if (modalTitle && content.title) modalTitle.textContent = content.title;
            if (modalDescription && content.description) modalDescription.textContent = content.description;
            if (modalCategory && content.category) modalCategory.textContent = content.category;
            if (modalDate && content.date) modalDate.textContent = content.date;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            // Focus management
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }

            // Trap focus within modal
            this.trapFocus(modal);
        }

        /**
         * Close modal
         */
        closeModal(modal) {
            if (!modal) return;

            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        /**
         * Trap focus within modal
         */
        trapFocus(element) {
            const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleTabKey = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            element.addEventListener('keydown', handleTabKey);
        }

        /**
         * Initialize loading states
         */
        initLoadingStates() {
            // Add loading state to buttons when clicked
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn')) {
                    this.addLoadingState(e.target);
                }
            });
        }

        /**
         * Add loading state to element
         */
        addLoadingState(element) {
            if (element.disabled) return;

            const originalText = element.textContent;
            element.disabled = true;
            element.dataset.originalText = originalText;
            element.textContent = 'Procesando...';

            setTimeout(() => {
                if (element.dataset.originalText) {
                    element.textContent = element.dataset.originalText;
                    element.disabled = false;
                }
            }, 2000);
        }

        /**
         * Initialize form enhancements
         */
        initFormEnhancements() {
            // Auto-resize textareas
            document.addEventListener('input', (e) => {
                if (e.target.tagName === 'TEXTAREA') {
                    this.autoResizeTextarea(e.target);
                }
            });

            // Form validation feedback
            document.addEventListener('change', (e) => {
                if (e.target.matches('input, select, textarea')) {
                    this.validateField(e.target);
                }
            });
        }

        /**
         * Auto-resize textarea
         */
        autoResizeTextarea(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }

        /**
         * Validate form field
         */
        validateField(field) {
            const isValid = field.checkValidity();
            
            if (isValid) {
                field.style.borderColor = '#10b981';
            } else {
                field.style.borderColor = '#ef4444';
            }
        }

        /**
         * Initialize keyboard navigation
         */
        initKeyboardNavigation() {
            // Enhanced keyboard navigation for interactive elements
            document.addEventListener('keydown', (e) => {
                if (e.target.matches('button, [role="button"]')) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.target.click();
                    }
                }
            });
        }

        /**
         * Initialize animations
         */
        initAnimations() {
            // Intersection Observer for scroll animations
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                // Observe elements with animation classes
                document.querySelectorAll('.specialty-card, .technique, .value, .timeline-item, .faq-item').forEach(el => {
                    observer.observe(el);
                });
            }
        }

        /**
         * Show notification
         */
        showNotification(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;

            // Styles
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type] || colors.info};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            `;

            // Add animation styles
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto-remove
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }

        /**
         * Show confirmation dialog
         */
        showConfirmation(message, onConfirm, onCancel = null) {
            const overlay = document.createElement('div');
            overlay.className = 'confirmation-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                padding: 24px;
                border-radius: 8px;
                max-width: 400px;
                margin: 20px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            `;

            dialog.innerHTML = `
                <p style="margin-bottom: 20px; font-size: 16px;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-secondary" id="confirm-cancel">Cancelar</button>
                    <button class="btn btn-primary" id="confirm-ok">Confirmar</button>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Event handlers
            const confirmBtn = dialog.querySelector('#confirm-ok');
            const cancelBtn = dialog.querySelector('#confirm-cancel');

            const closeDialog = () => {
                document.body.removeChild(overlay);
            };

            confirmBtn.addEventListener('click', () => {
                if (onConfirm) onConfirm();
                closeDialog();
            });

            cancelBtn.addEventListener('click', () => {
                if (onCancel) onCancel();
                closeDialog();
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    if (onCancel) onCancel();
                    closeDialog();
                }
            });

            // Focus first button
            confirmBtn.focus();
        }
    }

    // Initialize UI manager
    function initUIManager() {
        uiManager = new UIManager();
        
        // Make available globally
        window.uiManager = uiManager;

        // Initialize
        uiManager.init();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUIManager);
    } else {
        initUIManager();
    }

})();
