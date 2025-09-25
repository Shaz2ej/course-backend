import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pnupcskyrxivtjhwmvax.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudXBjc2t5cnhpdnRqaHdtdmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNzAxNDIsImV4cCI6MjA3MTk0NjE0Mn0.Q0Qp4CFCXWTSdFqbqR1nouEEF2_jydgPfhXRoygKFx0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

