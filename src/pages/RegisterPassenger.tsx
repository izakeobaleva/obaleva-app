import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Car } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 w-full max-w-md p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/login')} className="text-[#A0A0B0] hover:text-white mr-3">
            <ArrowLeft size={20} />
          </button>
          <Car className="text-[#F4D03F] w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">Cadastro Passageiro</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            placeholder="Nome completo" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
          />
          <input 
            placeholder="CPF" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={cpf} 
            onChange={e => setCpf(e.target.value)} 
            required 
          />
          <input 
            placeholder="Telefone" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={telefone} 
            onChange={e => setTelefone(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-amarelo w-full py-3 rounded-2xl">Cadastrar</button>
        </form>
      </div>
    </div>
  )
}