<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Session, User } from '@supabase/supabase-js'

interface Profile {
  id: string
  nome_completo: string
  email: string
  tipo: 'passageiro' | 'motorista' | 'admin'
  telefone?: string
  cpf?: string
  foto_url?: string
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUpPassenger: (data: any) => Promise<void>
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])
=======
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
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if (currentUser) await fetchProfile(currentUser.id);
    setLoading(false);
  }
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('usuarios')
<<<<<<< HEAD
      .select('id, nome_completo, email, tipo, telefone, cpf, foto_url')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar perfil:', error.message)
      setProfile(null)
    } else if (data) {
      setProfile(data)
    } else {
      console.warn('Perfil não encontrado para o usuário:', userId)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signUpPassenger = async (data: any) => {
    const { nome_completo, cpf, telefone, email, password } = data
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo, tipo: 'passageiro' } }
    })
    if (authError) throw authError
    if (!authData.session) throw new Error('Verifique seu e-mail para confirmar o cadastro')
    if (!authData.user) throw new Error('Usuário não criado')
=======
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao carregar perfil:', error.message);
      setProfile(null);
      return;
    }
    setProfile(data as UserProfile | null);
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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo, tipo: 'passageiro' } },
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error('Erro ao criar usuário');
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780

    const { error: insertUserError } = await supabase.from('usuarios').insert({
      id: authData.user.id,
      nome_completo,
      cpf,
      telefone,
      email,
<<<<<<< HEAD
      tipo: 'passageiro'
    })
    if (insertUserError) throw insertUserError

    const { error: insertPassError } = await supabase.from('passageiros').insert({
      id: authData.user.id
    })
    if (insertPassError) console.warn(insertPassError)
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signOut, signUpPassenger }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
=======
      tipo: 'passageiro',
    });
    if (insertUserError) throw insertUserError;

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
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
