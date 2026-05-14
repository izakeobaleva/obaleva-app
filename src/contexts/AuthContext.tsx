import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

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
  signUpPassenger: (data: { nome_completo: string; cpf: string; telefone: string; email: string; password: string }) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAuth()
  }, [])

  async function initAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user)
      }
    } catch (err) {
      console.error('Erro ao inicializar auth:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(' Auth event:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id, session.user)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string, user?: User) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email, tipo, telefone, cpf, foto_url')
        .eq('id', userId)
        .maybeSingle()

      if (data) {
        setProfile(data)
        return
      }

      // Fallback: usar user_metadata
      const metaTipo = user?.user_metadata?.tipo
      const metaNome = user?.user_metadata?.nome_completo || user?.email?.split('@')[0] || 'Usuário'
      
      if (metaTipo && ['passageiro', 'motorista', 'admin'].includes(metaTipo)) {
        setProfile({
          id: userId,
          nome_completo: metaNome,
          email: user?.email || '',
          tipo: metaTipo,
        })
        return
      }

      setProfile(null)
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Erro ao sair:', err)
    }
    setUser(null)
    setProfile(null)
  }

  const signUpPassenger = async (data: { nome_completo: string; cpf: string; telefone: string; email: string; password: string }) => {
    const { nome_completo, cpf, telefone, email, password } = data

    // 1. Criar usuário no auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo, tipo: 'passageiro' } }
    })
    if (authError) throw authError
    if (!authData.user) throw new Error('Erro ao criar usuário')

    const userId = authData.user.id

    // 2. Inserir na tabela usuarios (com tratamento de conflito)
    const { error: userError } = await supabase.from('usuarios').upsert({
      id: userId,
      nome_completo,
      cpf,
      telefone,
      email,
      tipo: 'passageiro',
    }, { onConflict: 'id', ignoreDuplicates: false })
    
    if (userError && !userError.message.includes('duplicate key')) {
      throw userError
    }

    // 3. Inserir na tabela passageiros (com tratamento de conflito)
    const { error: passError } = await supabase.from('passageiros').upsert(
      { id: userId },
      { onConflict: 'id', ignoreDuplicates: false }
    )
    if (passError && !passError.message.includes('duplicate key')) {
      console.warn('Erro ao inserir passageiro:', passError)
    }

    // 4. Se não criou sessão automática, fazer login manual
    if (!authData.session) {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) throw loginError
      if (!loginData.session) throw new Error('Erro ao criar sessão. Verifique "Confirm email" no Supabase.')
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signOut, signUpPassenger, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)