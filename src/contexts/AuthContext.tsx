import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface UserProfile {
  id: string;
  nome_completo: string | null;
  email: string | null;
  telefone: string | null;
  tipo: 'passageiro' | 'motorista' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUpPassenger: (data: {
    nome_completo: string;
    cpf: string;
    telefone: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  async function initAuth() {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      await fetchProfile(currentUser.id);
    }
    setLoading(false);
  }

  async function fetchProfile(userId: string) {
    // ✅ Usar maybeSingle() para evitar erro quando o perfil não existe
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao carregar perfil:', error.message);
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data as UserProfile);
    } else {
      console.warn('Perfil não encontrado para o usuário:', userId);
      setProfile(null);
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const signUpPassenger = async (data: {
    nome_completo: string;
    cpf: string;
    telefone: string;
    email: string;
    password: string;
  }) => {
    const { nome_completo, cpf, telefone, email, password } = data;

    // 1. Criar usuário no Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo, tipo: 'passageiro' } },
    });
    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('Erro ao criar usuário');

    // 2. Inserir na tabela usuarios
    const { error: insertUserError } = await supabase.from('usuarios').insert({
      id: authData.user.id,
      nome_completo,
      cpf,
      telefone,
      email,
      tipo: 'passageiro',
    });
    if (insertUserError) throw insertUserError;

    // 3. Inserir na tabela passageiros (opcional, se você usa essa tabela)
    const { error: insertPassError } = await supabase.from('passageiros').insert({
      id: authData.user.id,
    });
    if (insertPassError) console.warn('Erro ao inserir em passageiros:', insertPassError);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, signUpPassenger }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);