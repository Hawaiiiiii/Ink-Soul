import { createClient } from '@supabase/supabase-js'

// Real Supabase configuration
const supabaseUrl = "https://enitsirdzrsqtgjksctk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaXRzaXJkenJzcXRnamtzY3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5Mzg5ODksImV4cCI6MjA3NzUxNDk4OX0.YaEXS02Dhwi0JhTAjYKAIvNBI3xlANVwmRONaIGzlsQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Production mode flag
export const isDemoMode = false
