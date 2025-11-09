/**
 * Supabase Client Initialization
 * 
 * Inicializa cliente de Supabase usando solo variables públicas
 * Todas las operaciones sensibles deben usar Edge Functions
 * 
 * @requires window.__CONFIG.SUPABASE_URL and window.__CONFIG.SUPABASE_ANON_KEY
 * @provides window.supabase for all Supabase operations
 */

(function() {
    'use strict';

    /**
     * Wait for configuration to be loaded
     */
    function waitForConfig() {
        return new Promise((resolve, reject) => {
            // If config is already loaded
            if (window.__CONFIG) {
                resolve();
                return;
            }

            // Wait for configLoaded event
            const configListener = (event) => {
                document.removeEventListener('configLoaded', configListener);
                resolve();
            };

            // Timeout after 10 seconds
            const timeout = setTimeout(() => {
                document.removeEventListener('configLoaded', configListener);
                reject(new Error('Configuration timeout after 10 seconds'));
            }, 10000);

            document.addEventListener('configLoaded', configListener);
        });
    }

    /**
     * Initialize Supabase client with error handling
     */
    async function initializeSupabase() {
        try {
            // Wait for environment configuration
            await waitForConfig();
            
            if (!window.isConfigured()) {
                throw new Error('Supabase configuration not available');
            }

            const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.requireConfig(['SUPABASE_URL', 'SUPABASE_ANON_KEY']);

            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                throw new Error('Missing Supabase URL or Anon Key');
            }

            console.log('🔧 Initializing Supabase client...');

            // Create Supabase client
            const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                },
                db: {
                    schema: 'public'
                },
                global: {
                    headers: {
                        'X-Client-Info': 'ink-soul-portfolio@1.0.0'
                    }
                }
            });

            // Test connection
            const { data, error } = await supabaseClient.from('products').select('count', { count: 'exact', head: true });
            
            if (error && error.code !== 'PGRST116') { // PGRST116 is "table doesn't exist" which is OK for testing
                throw new Error(`Supabase connection test failed: ${error.message}`);
            }

            // Store client globally
            window.supabase = supabaseClient;
            window.supabaseClient = supabase; // Backward compatibility

            console.log('✅ Supabase client initialized successfully');

            // Dispatch event for other scripts
            const event = new CustomEvent('supabaseReady', { 
                detail: { 
                    client: supabaseClient,
                    url: SUPABASE_URL 
                } 
            });
            document.dispatchEvent(event);

        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error.message);
            
            // Store error for other components to check
            window.supabaseError = error;
            
            // Still create a dummy client to prevent other scripts from breaking
            window.supabase = {
                auth: {
                    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
                    signOut: () => Promise.resolve({ error: null })
                },
                from: () => ({
                    select: () => ({
                        eq: () => ({
                            single: () => Promise.resolve({ data: null, error: window.supabaseError }),
                            then: (fn) => {
                                fn({ data: null, error: window.supabaseError });
                                return { catch: () => {} };
                            }
                        })
                    })
                }),
                functions: {
                    invoke: () => Promise.resolve({ data: null, error: window.supabaseError })
                }
            };

            // Dispatch error event
            const event = new CustomEvent('supabaseError', { detail: error });
            document.dispatchEvent(event);
        }
    }

    /**
     * Check if Supabase is available
     */
    window.isSupabaseReady = function() {
        return !!(window.supabase && !window.supabaseError);
    };

    /**
     * Helper to safely call Supabase operations
     */
    window.supabaseSafeCall = async function(operation, ...args) {
        if (!window.isSupabaseReady()) {
            throw new Error('Supabase is not available. Check configuration.');
        }

        try {
            return await window.supabase[operation](...args);
        } catch (error) {
            console.error(`Supabase operation failed (${operation}):`, error);
            throw error;
        }
    };

    /**
     * Helper to call Edge Functions
     */
    window.callEdgeFunction = async function(functionName, payload) {
        if (!window.isSupabaseReady()) {
            throw new Error('Supabase is not available for Edge Function calls');
        }

        console.log(`📡 Calling Edge Function: ${functionName}`, payload);

        try {
            const { data, error } = await window.supabase.functions.invoke(functionName, {
                body: payload
            });

            if (error) {
                throw new Error(`Edge Function error (${functionName}): ${error.message}`);
            }

            console.log(`✅ Edge Function response (${functionName}):`, data);
            return data;

        } catch (error) {
            console.error(`❌ Edge Function call failed (${functionName}):`, error);
            throw error;
        }
    };

    /**
     * Database helpers for public reads
     */
    window.supabasePublic = {
        /**
         * Get products with filters
         */
        async getProducts(filters = {}) {
            let query = window.supabase
                .from('products')
                .select('id, name, price_cents, image_url, sku, category, active, created_at')
                .eq('active', true);

            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    query = query.eq(key, value);
                }
            });

            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        },

        /**
         * Get single product by ID
         */
        async getProductById(id) {
            const { data, error } = await window.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .eq('active', true)
                .single();

            if (error) throw error;
            return data;
        },

        /**
         * Search products
         */
        async searchProducts(searchTerm) {
            const { data, error } = await window.supabase
                .from('products')
                .select('id, name, price_cents, image_url, category')
                .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
                .eq('active', true)
                .limit(20);

            if (error) throw error;
            return data || [];
        }
    };

    // Initialize immediately if script loads after config
    if (window.__CONFIG) {
        initializeSupabase();
    } else {
        // Wait for configLoaded event
        const initListener = (event) => {
            document.removeEventListener('configLoaded', initListener);
            initializeSupabase();
        };
        document.addEventListener('configLoaded', initListener);
    }

})();
