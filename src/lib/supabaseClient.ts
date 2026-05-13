import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔑 Supabase Config:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : '❌ MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : '❌ MISSING'
})

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)