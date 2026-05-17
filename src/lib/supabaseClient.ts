import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não encontradas!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'obaleva_auth',
  }
});

export const checkAndRestoreSession = async () => {
  const storedSession = localStorage.getItem('obaleva_auth');
  if (storedSession) {
    try {
      const parsed = JSON.parse(storedSession);
      if (parsed?.access_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token: parsed.access_token,
          refresh_token: parsed.refresh_token,
        });
        if (!error && data.session) return data.session;
      }
    } catch (err) {
      console.error('Erro ao restaurar sessão:', err);
    }
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};