import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const INACTIVITY_LIMIT = 7 * 24 * 60 * 60 * 1000; // 7 dias

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
    }
  };

  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
    }
  };

  useEffect(() => {
    // Atualizar timestamp da última atividade
    const updateActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('click', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('mousemove', updateActivity);
    
    // Verificar inatividade a cada minuto
    const interval = setInterval(() => {
      if (user && (Date.now() - lastActivity) > INACTIVITY_LIMIT) {
        signOut();
      }
    }, 60000);
    
    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
      clearInterval(interval);
    };
  }, [user, lastActivity]);

  useEffect(() => {
    // Timeout de segurança: se o auth demorar mais que 3s, força o fim do loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⏱️ Timeout: forçando fim do loading');
        setLoading(false);
      }
    }, 3000);

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Erro ao inicializar auth:', err);
      } finally {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
        clearTimeout(timeout);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('obaleva_last_tab');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};