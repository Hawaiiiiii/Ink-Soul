/**
 * Environment Variables Manager
 * 
 * Carga configuración desde archivo local o variables globales
 * SIN exponer secretos en el código
 * 
 * @requires window.__ENV object or /config/.env.json file
 * @provides window.__CONFIG with safe public variables
 */

(function() {
    'use strict';

    /**
     * Load environment configuration
     * Priority: 1. window.__ENV 2. /config/.env.json 3. empty config
     */
    async function loadEnvironmentConfig() {
        console.log('🔧 Loading environment configuration...');
        
        try {
            // First, use existing window.__ENV if available
            if (window.__ENV && typeof window.__ENV === 'object') {
                console.log('✅ Using window.__ENV configuration');
                return window.__ENV;
            }

            // Try to load from local config file
            try {
                const response = await fetch('/config/.env.json');
                if (response.ok) {
                    const config = await response.json();
                    console.log('✅ Loaded configuration from /config/.env.json');
                    return config;
                }
            } catch (fetchError) {
                console.log('⚠️  No local config file found (this is normal for GitHub Pages)');
            }

            // Fallback to empty config
            console.log('⚠️  Using fallback configuration (limited functionality)');
            return {
                SUPABASE_URL: '<<SUPABASE_URL>>',
                SUPABASE_ANON_KEY: '<<SUPABASE_ANON_KEY>>',
                SITE_URL: window.location.origin,
                STRIPE_PUBLISHABLE_KEY: '<<STRIPE_PUBLISHABLE_KEY>>'
            };

        } catch (error) {
            console.error('❌ Error loading configuration:', error);
            return {
                SUPABASE_URL: '<<SUPABASE_URL>>',
                SUPABASE_ANON_KEY: '<<SUPABASE_ANON_KEY>>',
                SITE_URL: window.location.origin
            };
        }
    }

    /**
     * Validate required environment variables
     */
    function validateConfig(config) {
        const required = ['SUPABASE_URL', 'SITE_URL'];
        const missing = required.filter(key => !config[key] || config[key].includes('<<'));

        if (missing.length > 0) {
            console.warn('⚠️  Missing required configuration:', missing);
            console.info('💡 To enable full functionality, create /config/.env.json with your variables');
            return false;
        }

        return true;
    }

    /**
     * Set public configuration
     */
    function setPublicConfig(config) {
        window.__CONFIG = {
            SUPABASE_URL: config.SUPABASE_URL,
            SUPABASE_ANON_KEY: config.SUPABASE_ANON_KEY,
            SITE_URL: config.SITE_URL,
            STRIPE_PUBLISHABLE_KEY: config.STRIPE_PUBLISHABLE_KEY,
            isConfigured: validateConfig(config)
        };

        // Make specific variables available for backward compatibility
        window.SUPABASE_URL = window.__CONFIG.SUPABASE_URL;
        window.SUPABASE_ANON_KEY = window.__CONFIG.SUPABASE_ANON_KEY;
        window.SITE_URL = window.__CONFIG.SITE_URL;

        console.log('🔧 Public configuration set:', {
            SUPABASE_URL: window.__CONFIG.SUPABASE_URL ? '✅ Configured' : '❌ Missing',
            SUPABASE_ANON_KEY: window.__CONFIG.SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
            SITE_URL: window.__CONFIG.SITE_URL ? '✅ Configured' : '❌ Missing'
        });
    }

    /**
     * Helper functions for components to check configuration
     */
    window.isConfigured = function() {
        return window.__CONFIG && window.__CONFIG.isConfigured;
    };

    window.getConfig = function(key) {
        return window.__CONFIG ? window.__CONFIG[key] : undefined;
    };

    window.requireConfig = function(keys) {
        if (!window.isConfigured()) {
            throw new Error('Configuration not loaded. Please set up /config/.env.json or inject window.__ENV.');
        }

        if (typeof keys === 'string') {
            keys = [keys];
        }

        const missing = keys.filter(key => !window.getConfig(key));
        if (missing.length > 0) {
            throw new Error(`Missing required configuration: ${missing.join(', ')}`);
        }

        return keys.map(key => window.getConfig(key));
    };

    // Initialize configuration
    loadEnvironmentConfig().then(config => {
        setPublicConfig(config);
        
        // Dispatch event for other scripts that might depend on configuration
        const event = new CustomEvent('configLoaded', { detail: window.__CONFIG });
        document.dispatchEvent(event);
    });

    // Expose load function for manual reloading if needed
    window.reloadConfiguration = async function() {
        console.log('🔄 Reloading configuration...');
        const config = await loadEnvironmentConfig();
        setPublicConfig(config);
        
        const event = new CustomEvent('configReloaded', { detail: window.__CONFIG });
        document.dispatchEvent(event);
    };

})();
