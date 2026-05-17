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
    storageKey: 'obaleva_auth_token',
  }
});

// Função para verificar e restaurar sessão
export const checkAndRestoreSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Tentar restaurar do localStorage
    const storedSession = localStorage.getItem('obaleva_auth_token');
    if (storedSession) {
      try {
        const { data } = await supabase.auth.setSession(JSON.parse(storedSession));
        return data.session;
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
      }
    }
  }
  
  return session;
};