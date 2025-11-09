/**
 * Booking System
 * 
 * Sistema de reservas que llama a Edge Function appointments-create
 * Valida disponibilidad y maneja conflictos de horario
 * 
 * @requires window.authManager and window.callEdgeFunction
 * @provides window.bookingManager
 */

(function() {
    'use strict';

    let bookingManager = null;

    class BookingManager {
        constructor() {
            this.currentStep = 1;
            this.formData = {};
            this.isSubmitting = false;
            this.initialized = false;
        }

        /**
         * Initialize booking manager
         */
        init() {
            if (this.initialized) return;

            console.log('📅 Initializing booking manager...');

            const form = document.getElementById('booking-form');
            if (!form) {
                console.log('📅 Booking form not found');
                this.initialized = true;
                return;
            }

            this.bindFormEvents();
            this.loadBookingPage();
            this.updateStepIndicator();
            this.initialized = true;

            console.log('✅ Booking manager initialized');
        }

        /**
         * Load booking page specific functionality
         */
        loadBookingPage() {
            // Set up auth status display
            this.updateAuthStatus();

            // Check URL parameters for pre-filling
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');
            if (category) {
                const categorySelect = document.getElementById('tattoo-category');
                if (categorySelect) {
                    categorySelect.value = category;
                }
            }
        }

        /**
         * Update authentication status
         */
        updateAuthStatus() {
            const authContainer = document.getElementById('auth-container');
            if (authContainer && window.authManager) {
                const isAuthenticated = window.authManager.isUserAuthenticated();
                
                if (isAuthenticated) {
                    authContainer.innerHTML = `
                        <div class="auth-success">
                            <p>✅ Sesión activa para <strong>${window.authManager.getCurrentUserEmail()}</strong></p>
                        </div>
                    `;
                } else {
                    authContainer.innerHTML = `
                        <div class="auth-required">
                            <p>🔐 Necesitas iniciar sesión para reservar una cita</p>
                        </div>
                    `;
                }
            }
        }

        /**
         * Bind form events
         */
        bindFormEvents() {
            const form = document.getElementById('booking-form');
            if (!form) return;

            // Navigation buttons
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');

            if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
            if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
            if (submitBtn) submitBtn.addEventListener('click', (e) => this.submitBooking(e));

            // Form validation on step change
            form.addEventListener('change', (e) => this.validateCurrentStep());

            // Real-time form data collection
            form.addEventListener('input', (e) => this.collectFormData());
        }

        /**
         * Move to next step
         */
        nextStep() {
            if (!this.validateCurrentStep()) {
                this.showMessage('Por favor completa todos los campos requeridos', 'error');
                return;
            }

            if (this.currentStep < 4) {
                this.currentStep++;
                this.updateStepIndicator();
                this.collectFormData();
                
                // Auto-advance on last step to show confirmation
                if (this.currentStep === 4) {
                    this.updateConfirmationSummary();
                }
            }
        }

        /**
         * Move to previous step
         */
        previousStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.updateStepIndicator();
            }
        }

        /**
         * Update step indicator
         */
        updateStepIndicator() {
            // Hide all steps
            document.querySelectorAll('.form-step').forEach(step => {
                step.style.display = 'none';
            });

            // Show current step
            const currentStep = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            if (currentStep) {
                currentStep.style.display = 'block';
            }

            // Update step indicator
            document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
                if (index + 1 <= this.currentStep) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });

            // Update navigation buttons
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');

            if (prevBtn) {
                prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
            }

            if (nextBtn) {
                nextBtn.style.display = this.currentStep < 4 ? 'inline-flex' : 'none';
            }

            if (submitBtn) {
                submitBtn.style.display = this.currentStep === 4 ? 'inline-flex' : 'none';
            }
        }

        /**
         * Validate current step
         */
        validateCurrentStep() {
            const currentStep = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            if (!currentStep) return true;

            const requiredFields = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '';
                }
            });

            // Additional validation for email
            const emailField = currentStep.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#ef4444';
                }
            }

            return isValid;
        }

        /**
         * Collect form data from current step
         */
        collectFormData() {
            const currentStep = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            if (!currentStep) return;

            const formData = new FormData(document.getElementById('booking-form'));
            const stepData = {};

            // Collect all form fields
            for (let [key, value] of formData.entries()) {
                if (key.includes('[]')) {
                    // Handle checkboxes with same name
                    const cleanKey = key.replace('[]', '');
                    if (!stepData[cleanKey]) stepData[cleanKey] = [];
                    stepData[cleanKey].push(value);
                } else {
                    stepData[key] = value;
                }
            }

            this.formData = { ...this.formData, ...stepData };
        }

        /**
         * Update confirmation summary
         */
        updateConfirmationSummary() {
            const summaryContainer = document.getElementById('booking-summary');
            if (!summaryContainer) return;

            const summary = this.formatBookingSummary(this.formData);
            summaryContainer.innerHTML = summary;
        }

        /**
         * Format booking summary
         */
        formatBookingSummary(data) {
            return `
                <div class="booking-summary">
                    <h4>Información Personal</h4>
                    <p><strong>Nombre:</strong> ${data.clientName || 'No especificado'}</p>
                    <p><strong>Email:</strong> ${data.clientEmail || 'No especificado'}</p>
                    <p><strong>Teléfono:</strong> ${data.clientPhone || 'No especificado'}</p>
                    
                    <h4>Detalles del Tatuaje</h4>
                    <p><strong>Categoría:</strong> ${this.getCategoryLabel(data.tattooCategory)}</p>
                    <p><strong>Tamaño:</strong> ${this.getSizeLabel(data.tattooSize)}</p>
                    <p><strong>Ubicación:</strong> ${this.getPlacementLabel(data.bodyPlacement)}</p>
                    <p><strong>Presupuesto:</strong> ${data.budgetRange || 'No especificado'}</p>
                    
                    <h4>Disponibilidad</h4>
                    <p><strong>Tipo de sesión:</strong> ${this.getSessionLabel(data.sessionPreference)}</p>
                    <p><strong>Timeline:</strong> ${this.getTimelineLabel(data.idealTimeline)}</p>
                    
                    <h4>Descripción</h4>
                    <p>${data.designDescription || 'No especificado'}</p>
                </div>
            `;
        }

        /**
         * Get category label
         */
        getCategoryLabel(category) {
            const labels = {
                'fineline': 'Fineline',
                'devotional': 'Devocional',
                'coverup': 'Cover-up',
                'minimalist': 'Minimalista'
            };
            return labels[category] || category || 'No especificado';
        }

        /**
         * Get size label
         */
        getSizeLabel(size) {
            const labels = {
                'small': 'Pequeño (menos de 5cm)',
                'medium': 'Mediano (5-10cm)',
                'large': 'Grande (10-20cm)',
                'xlarge': 'Muy grande (más de 20cm)'
            };
            return labels[size] || size || 'No especificado';
        }

        /**
         * Get placement label
         */
        getPlacementLabel(placement) {
            const labels = {
                'wrist': 'Muñeca',
                'forearm': 'Antebrazo',
                'upper-arm': 'Brazo superior',
                'shoulder': 'Hombro',
                'back': 'Espalda',
                'chest': 'Pecho',
                'ribs': 'Costillas',
                'ankle': 'Tobillo',
                'foot': 'Pie',
                'neck': 'Cuello',
                'behind-ear': 'Detrás de la oreja',
                'other': 'Otro'
            };
            return labels[placement] || placement || 'No especificado';
        }

        /**
         * Get session label
         */
        getSessionLabel(session) {
            const labels = {
                'consultation': 'Solo consulta (diseño)',
                'consultation-session': 'Consulta + sesión (todo en una)',
                'session-only': 'Solo sesión (ya tengo diseño aprobado)'
            };
            return labels[session] || session || 'No especificado';
        }

        /**
         * Get timeline label
         */
        getTimelineLabel(timeline) {
            const labels = {
                'asap': 'Lo antes posible',
                '2-weeks': 'En las próximas 2 semanas',
                '1-month': 'En el próximo mes',
                '2-3-months': 'En 2-3 meses',
                'flexible': 'Soy flexible con las fechas'
            };
            return labels[timeline] || timeline || 'No especificado';
        }

        /**
         * Submit booking
         */
        async submitBooking(event) {
            event.preventDefault();

            if (!window.authManager || !window.authManager.isUserAuthenticated()) {
                this.showMessage('Debes iniciar sesión para reservar una cita', 'error');
                return false;
            }

            if (this.isSubmitting) {
                return false;
            }

            this.isSubmitting = true;
            this.showMessage('Procesando tu reserva...', 'loading');

            try {
                // Collect final form data
                this.collectFormData();
                
                // Add current user info
                const currentUser = window.authManager.getCurrentUser();
                if (currentUser) {
                    this.formData.userId = currentUser.id;
                    this.formData.userEmail = currentUser.email;
                }

                // Prepare payload for Edge Function
                const payload = {
                    starts_at: this.formData.preferredDate || '2025-12-01T10:00:00Z', // Placeholder
                    ends_at: this.formData.preferredDate || '2025-12-01T14:00:00Z', // Placeholder
                    notes: JSON.stringify(this.formData),
                    client_email: this.formData.clientEmail || currentUser.email,
                    tattoo_category: this.formData.tattooCategory,
                    body_placement: this.formData.bodyPlacement,
                    session_type: this.formData.sessionPreference
                };

                console.log('📅 Submitting booking:', payload);

                // Call Edge Function
                const result = await window.callEdgeFunction('appointments-create', payload);

                if (result.success) {
                    this.showMessage(
                        `✅ ¡Reserva exitosa! Tu cita ha sido registrada. Te contactaremos pronto en ${payload.client_email}`,
                        'success'
                    );
                    
                    // Reset form after successful submission
                    setTimeout(() => {
                        document.getElementById('booking-form').reset();
                        this.currentStep = 1;
                        this.updateStepIndicator();
                        this.formData = {};
                    }, 3000);

                } else {
                    throw new Error(result.message || 'Error al procesar la reserva');
                }

            } catch (error) {
                console.error('❌ Booking submission failed:', error);
                
                let errorMessage = 'Error al procesar la reserva';
                
                if (error.message.includes('conflict')) {
                    errorMessage = 'El horario solicitado no está disponible. Por favor selecciona otra fecha/hora.';
                } else if (error.message.includes('validation')) {
                    errorMessage = 'Por favor verifica que todos los campos estén correctos.';
                } else if (error.message) {
                    errorMessage = error.message;
                }

                this.showMessage(errorMessage, 'error');
            } finally {
                this.isSubmitting = false;
            }

            return false;
        }

        /**
         * Show message to user
         */
        showMessage(message, type = 'info') {
            const messageContainer = document.getElementById('message-container');
            if (!messageContainer) return;

            const colors = {
                success: '#10b981',
                error: '#ef4444',
                loading: '#d4af37',
                info: '#3b82f6'
            };

            messageContainer.innerHTML = `
                <div class="booking-message" style="
                    background: ${colors[type] || colors.info};
                    color: white;
                    padding: 1rem;
                    border-radius: 6px;
                    margin: 1rem 0;
                    text-align: center;
                ">
                    ${message}
                </div>
            `;

            // Auto-hide after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    messageContainer.innerHTML = '';
                }, 5000);
            }
        }
    }

    // Initialize booking manager
    function initBookingManager() {
        bookingManager = new BookingManager();
        
        // Make available globally
        window.bookingManager = bookingManager;

        // Initialize on page load
        bookingManager.init();

        // Listen for auth changes to update UI
        if (window.authManager) {
            window.authManager.addListener(() => {
                bookingManager.updateAuthStatus();
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBookingManager);
    } else {
        initBookingManager();
    }

})();
