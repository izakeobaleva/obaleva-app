import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const RegisterPassenger = () => {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signUpPassenger } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUpPassenger({ nome_completo: nome, cpf, telefone, email, password })
      toast.success('Cadastro realizado! Faça login.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro no cadastro')
    }
  }

  return (
    <div className="min-h-screen bg-roxo-principal flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-roxo-principal mb-4">Cadastro Passageiro</h1>
        <form onSubmit={handleSubmit}>
          <input placeholder="Nome completo" className="w-full p-3 border rounded mb-3" value={nome} onChange={e => setNome(e.target.value)} required />
          <input placeholder="CPF (apenas números)" className="w-full p-3 border rounded mb-3" value={cpf} onChange={e => setCpf(e.target.value)} required />
          <input placeholder="Telefone com DDD" className="w-full p-3 border rounded mb-3" value={telefone} onChange={e => setTelefone(e.target.value)} required />
          <input type="email" placeholder="E-mail" className="w-full p-3 border rounded mb-3" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" className="w-full p-3 border rounded mb-4" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn-amarelo w-full py-3 rounded-lg font-bold">Criar conta</button>
        </form>
      </div>
    </div>
  )
}