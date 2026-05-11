import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Erro: ' + error.message)
    } else {
      toast.success('Login realizado!')
      // redirecionamento baseado no tipo de usuário será feito via trigger do Supabase
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-roxo-principal flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-roxo-principal text-center mb-6">OBALEVA</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input type="email" required className="w-full p-3 border rounded-lg" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input type="password" required className="w-full p-3 border rounded-lg" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-amarelo w-full py-3 rounded-lg text-lg">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-4 text-center space-y-2">
          <button onClick={() => navigate('/register/passenger')} className="text-roxo-principal underline block w-full">Cadastrar como Passageiro</button>
          <button onClick={() => navigate('/register/driver')} className="text-roxo-principal underline block w-full">Cadastrar como Motorista</button>
        </div>
      </div>
    </div>
  )
}