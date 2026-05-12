import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export default function RegisterPassenger() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo: nome, tipo: 'passageiro' } }
    })
    if (error) {
      toast.error('Erro: ' + error.message)
    } else if (data.user) {
      await supabase.from('passageiros').insert({ id: data.user.id, nome, telefone })
      await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, telefone, email, tipo: 'passageiro' })
      toast.success('Cadastro realizado! Verifique seu e-mail para confirmar.')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-roxo-principal flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-roxo-principal text-center mb-6">Cadastro Passageiro</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input type="text" required className="w-full p-3 border rounded-lg" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input type="email" required className="w-full p-3 border rounded-lg" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input type="tel" required className="w-full p-3 border rounded-lg" value={telefone} onChange={e => setTelefone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input type="password" required className="w-full p-3 border rounded-lg" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-amarelo w-full py-3 rounded-lg text-lg">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="text-center mt-4">
          Já tem conta? <button onClick={() => navigate('/')} className="text-roxo-principal underline">Entrar</button>
        </p>
      </div>
    </div>
  )
}