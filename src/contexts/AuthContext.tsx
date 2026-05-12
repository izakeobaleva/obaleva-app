import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface UserProfile {
  id: string
  nome_completo: string | null
  email: string | null
  telefone: string | null
  tipo: 'passageiro' | 'motorista' | 'admin'
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initAuth()
    
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        fetchProfile(currentUser.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  async function initAuth() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const currentUser = session?.user ?? null
    setUser(currentUser)

    if (currentUser) {
      await fetchProfile(currentUser.id)
    }
    setLoading(false)
  }

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Erro ao carregar perfil:', error.message)
      return
    }

    if (data) {
      setProfile(data as UserProfile)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)