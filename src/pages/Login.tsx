import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
    } catch {
      toast.error('E‑mail ou senha inválidos')
    }
  }

  return (
    <div className="min-h-screen bg-roxo-principal flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-roxo-principal mb-4 text-center">OBALEVA</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 border rounded-lg mb-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 border rounded-lg mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-amarelo w-full py-3 rounded-lg font-bold">Entrar</button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/register" className="text-roxo-principal font-semibold">Cadastrar como passageiro</Link>
          {' | '}
          <Link to="/register-driver" className="text-roxo-principal font-semibold">Quero ser motorista</Link>
        </div>
      </div>
    </div>
  )
}