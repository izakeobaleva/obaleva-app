import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

<<<<<<< HEAD
=======
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
export const supabase = createClient(supabaseUrl, supabaseAnonKey)