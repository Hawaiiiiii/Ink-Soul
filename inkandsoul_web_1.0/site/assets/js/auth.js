/**
 * Authentication Manager
 * 
 * Maneja autenticación con Supabase usando magic link/email
 * Solo operaciones básicas desde cliente, todo sensible va por Edge Functions
 * 
 * @requires window.supabase client
 * @provides window.authManager
 */

(function() {
    'use strict';

    let authManager = null;

    class AuthManager {
        constructor() {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.listeners = [];
            this.initialized = false;
        }

        /**
         * Initialize authentication manager
         */
        async init() {
            if (this.initialized) return;

            try {
                console.log('🔐 Initializing authentication manager...');

                // Wait for Supabase
                if (!window.isSupabaseReady()) {
                    console.log('⏳ Waiting for Supabase to be ready...');
                    await new Promise((resolve) => {
                        const checkReady = () => {
                            if (window.isSupabaseReady()) {
                                document.removeEventListener('supabaseReady', checkReady);
                                resolve();
                            }
                        };
                        document.addEventListener('supabaseReady', checkReady);
                        setTimeout(resolve, 5000); // Timeout after 5s
                    });
                }

                if (!window.isSupabaseReady()) {
                    console.warn('⚠️  Supabase not available, auth will be disabled');
                    this.initialized = true;
                    return;
                }

                // Get current session
                const { data: { session } } = await window.supabase.auth.getSession();
                this.currentUser = session?.user || null;
                this.isAuthenticated = !!this.currentUser;

                // Listen for auth changes
                window.supabase.auth.onAuthStateChange((event, session) => {
                    console.log('🔄 Auth state changed:', event, session?.user?.email);
                    
                    this.currentUser = session?.user || null;
                    this.isAuthenticated = !!this.currentUser;
                    this.notifyListeners();
                });

                this.initialized = true;
                console.log('✅ Authentication manager initialized');

                // Notify listeners of current state
                this.notifyListeners();

            } catch (error) {
                console.error('❌ Failed to initialize authentication:', error);
                this.initialized = true; // Still mark as initialized to prevent errors
            }
        }

        /**
         * Check if user is authenticated
         */
        isUserAuthenticated() {
            return this.isAuthenticated;
        }

        /**
         * Get current user
         */
        getCurrentUser() {
            return this.currentUser;
        }

        /**
         * Get current user email
         */
        getCurrentUserEmail() {
            return this.currentUser?.email || null;
        }

        /**
         * Sign in with magic link (email)
         */
        async signInWithEmail(email) {
            try {
                if (!email || !this.isValidEmail(email)) {
                    throw new Error('Email inválido');
                }

                console.log('📧 Sending magic link to:', email);

                const { data, error } = await window.supabase.auth.signInWithOtp({
                    email: email,
                    options: {
                        emailRedirectTo: `${window.getConfig('SITE_URL')}/?auth=success`
                    }
                });

                if (error) throw error;

                console.log('✅ Magic link sent successfully');
                return { success: true, message: 'Revisa tu email para el enlace de acceso' };

            } catch (error) {
                console.error('❌ Sign in failed:', error);
                return { 
                    success: false, 
                    message: error.message || 'Error al enviar el enlace de acceso' 
                };
            }
        }

        /**
         * Sign out
         */
        async signOut() {
            try {
                console.log('🚪 Signing out...');
                
                const { error } = await window.supabase.auth.signOut();
                
                if (error) throw error;

                this.currentUser = null;
                this.isAuthenticated = false;
                this.notifyListeners();

                console.log('✅ Signed out successfully');
                return { success: true };

            } catch (error) {
                console.error('❌ Sign out failed:', error);
                return { 
                    success: false, 
                    message: error.message || 'Error al cerrar sesión' 
                };
            }
        }

        /**
         * Sign in with password (if enabled)
         */
        async signInWithPassword(email, password) {
            try {
                console.log('🔑 Signing in with password for:', email);

                const { data, error } = await window.supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                console.log('✅ Signed in successfully');
                return { success: true };

            } catch (error) {
                console.error('❌ Password sign in failed:', error);
                return { 
                    success: false, 
                    message: error.message || 'Error al iniciar sesión' 
                };
            }
        }

        /**
         * Sign up with email and password
         */
        async signUp(email, password, metadata = {}) {
            try {
                console.log('📝 Signing up:', email);

                const { data, error } = await window.supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.getConfig('SITE_URL')}/?auth=success`,
                        data: metadata
                    }
                });

                if (error) throw error;

                console.log('✅ Sign up successful');
                return { 
                    success: true, 
                    message: 'Revisa tu email para confirmar tu cuenta' 
                };

            } catch (error) {
                console.error('❌ Sign up failed:', error);
                return { 
                    success: false, 
                    message: error.message || 'Error al crear la cuenta' 
                };
            }
        }

        /**
         * Reset password
         */
        async resetPassword(email) {
            try {
                console.log('🔄 Sending password reset to:', email);

                const { data, error } = await window.supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.getConfig('SITE_URL')}/?auth=reset`
                });

                if (error) throw error;

                console.log('✅ Password reset sent');
                return { 
                    success: true, 
                    message: 'Revisa tu email para restablecer tu contraseña' 
                };

            } catch (error) {
                console.error('❌ Password reset failed:', error);
                return { 
                    success: false, 
                    message: error.message || 'Error al enviar el restablecimiento' 
                };
            }
        }

        /**
         * Update user profile
         */
        async updateProfile(updates) {
            try {
                if (!this.isAuthenticated()) {
                    throw new Error('Usuario no autenticado');
                }

                const { data, error } = await window.supabase.auth.updateUser({
                    data: updates
                });

                if (error) throw error;

                console.log('✅ Profile updated');
                return { success: true };

            } catch (error) {
                console.error('❌ Profile update failed:', error);
                return { 
                    success: false, 
                    message: error.message || 'Error al actualizar el perfil' 
                };
            }
        }

        /**
         * Add auth state listener
         */
        addListener(callback) {
            this.listeners.push(callback);
        }

        /**
         * Remove auth state listener
         */
        removeListener(callback) {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }

        /**
         * Notify all listeners
         */
        notifyListeners() {
            const state = {
                isAuthenticated: this.isAuthenticated,
                user: this.currentUser
            };

            this.listeners.forEach(callback => {
                try {
                    callback(state);
                } catch (error) {
                    console.error('Auth listener error:', error);
                }
            });
        }

        /**
         * Validate email format
         */
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        /**
         * Show auth UI element
         */
        showAuthUI(container) {
            if (!container) return;

            if (this.isAuthenticated()) {
                container.innerHTML = `
                    <div class="authenticated-user">
                        <p>Bienvenida, <strong>${this.getCurrentUserEmail()}</strong></p>
                        <button onclick="window.authManager.signOut()" class="btn btn-secondary">
                            Cerrar Sesión
                        </button>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <div class="auth-form">
                        <form id="auth-form" onsubmit="return window.authManager.handleAuthForm(event)">
                            <div class="form-group">
                                <label for="auth-email">Tu email para acceso:</label>
                                <input type="email" id="auth-email" name="email" required 
                                    placeholder="tu@email.com">
                                <small class="help-text">Te enviaremos un enlace seguro</small>
                            </div>
                            <button type="submit" class="btn btn-primary">Enviar Enlace de Acceso</button>
                        </form>
                        <div id="auth-message"></div>
                    </div>
                `;
            }
        }

        /**
         * Handle auth form submission
         */
        async handleAuthForm(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const email = formData.get('email');
            const messageContainer = document.getElementById('auth-message');

            if (!email) {
                this.showAuthMessage(messageContainer, 'Por favor ingresa tu email', 'error');
                return false;
            }

            this.showAuthMessage(messageContainer, 'Enviando enlace de acceso...', 'loading');

            const result = await this.signInWithEmail(email);

            if (result.success) {
                this.showAuthMessage(messageContainer, result.message, 'success');
            } else {
                this.showAuthMessage(messageContainer, result.message, 'error');
            }

            return false;
        }

        /**
         * Show auth message
         */
        showAuthMessage(container, message, type) {
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                loading: '#d4af37'
            };

            container.innerHTML = `
                <p style="color: ${colors[type] || '#666'}; margin-top: 1rem;">
                    ${message}
                </p>
            `;
        }
    }

    // Initialize auth manager
    function initAuthManager() {
        authManager = new AuthManager();
        
        // Make available globally
        window.authManager = authManager;

        // Initialize when Supabase is ready
        authManager.init();

        // Also initialize on supabaseReady event
        document.addEventListener('supabaseReady', () => {
            authManager.init();
        });
    }

    // Initialize immediately if needed scripts are available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuthManager);
    } else {
        initAuthManager();
    }

})();
