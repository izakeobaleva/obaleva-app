import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

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
}

const AuthContext = createContext({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  async function initAuth() {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
    } catch (err) {
      console.error('Erro ao inicializar auth:', err)
    }
    setLoading(false)
  }

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email, tipo, telefone, cpf, foto_url')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Erro ao buscar perfil:', error.message)
        setProfile(null)
      } else if (data) {
        console.log('Perfil carregado:', data.tipo)
        setProfile(data)
      } else {
        console.warn('Perfil não encontrado para o usuário:', userId)
        setProfile(null)
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar perfil:', err)
      setProfile(null)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    
    // Após login bem-sucedido, o onAuthStateChange vai disparar
    // e carregar o profile automaticamente
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const signUpPassenger = async (data: { nome_completo: string; cpf: string; telefone: string; email: string; password: string }) => {
    const { nome_completo, cpf, telefone, email, password } = data
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo, tipo: 'passageiro' } }
    })
    if (authError) throw authError
    if (!authData.session) throw new Error('Verifique seu e-mail para confirmar o cadastro')
    if (!authData.user) throw new Error('Usuário não criado')

    const { error: insertUserError } = await supabase.from('usuarios').insert({
      id: authData.user.id,
      nome_completo,
      cpf,
      telefone,
      email,
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