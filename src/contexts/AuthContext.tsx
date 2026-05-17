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

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔍 Buscando perfil para:', userId);
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        return null;
      }
      
      console.log('✅ Perfil encontrado:', data ? data.nome_completo : 'null');
      return data;
    } catch (err) {
      console.error('❌ Erro ao buscar perfil:', err);
      return null;
    }
  };

  const refreshSession = async () => {
    console.log('🔄 refreshSession chamado');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const profileData = await fetchProfile(session.user.id);
      setProfile(profileData);
    } else {
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Sessão encontrada:', session.user.email);
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          console.log('ℹ️ Nenhuma sessão encontrada');
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('❌ Erro ao inicializar auth:', err);
      } finally {
        console.log('✅ AuthProvider - loading finalizado');
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('🔄 Auth state changed:', _event, session?.user?.email);
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('🔴 SignOut chamado');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('onboarding_data');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};