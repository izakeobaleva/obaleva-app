import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { ArrowLeft, Car, Truck } from 'lucide-react'

export const RegisterDriver = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const updateForm = (field: string, value: any) => setForm({ ...form, [field]: value })

  const finalSubmit = async () => {
    setLoading(true)
    try {
      const { nome_completo, cpf, telefone, email, password, placa, modelo, ano, cor, pix } = form
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo, tipo: 'motorista' } } 
      })
      if (error) throw error
      if (!auth.user) throw new Error('Erro ao criar usuário')
      
      await supabase.from('usuarios').insert({ 
        id: auth.user.id, nome_completo, cpf, telefone, email, tipo: 'motorista' 
      })
      await supabase.from('motoristas').insert({ 
        id: auth.user.id, 
        status: 'pendente', 
        dados_veiculo: { placa, modelo, ano, cor }, 
        conta_bancaria_pix: pix 
      })
      
      toast.success('Cadastro enviado! Aguarde aprovação.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro no cadastro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 w-full max-w-md p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/login')} className="text-[#A0A0B0] hover:text-white mr-3">
            <ArrowLeft size={20} />
          </button>
          <Truck className="text-[#F4D03F] w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">
            {step === 1 ? 'Motorista - Etapa 1' : 'Motorista - Etapa 2'}
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-[#F4D03F]' : 'bg-gray-600'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-[#F4D03F]' : 'bg-gray-600'}`}></div>
        </div>
        
        {step === 1 ? (
          <div className="space-y-3">
            <input 
              placeholder="Nome completo" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('nome_completo', e.target.value)} 
            />
            <input 
              placeholder="CPF" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('cpf', e.target.value)} 
            />
            <input 
              placeholder="Telefone" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('telefone', e.target.value)} 
            />
            <input 
              placeholder="E-mail" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('email', e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('password', e.target.value)} 
            />
            <button onClick={() => setStep(2)} className="btn-amarelo w-full py-3 rounded-2xl mt-3">
              Próximo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input 
              placeholder="Placa" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('placa', e.target.value)} 
            />
            <input 
              placeholder="Modelo" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('modelo', e.target.value)} 
            />
            <input 
              placeholder="Ano" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('ano', e.target.value)} 
            />
            <input 
              placeholder="Cor" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('cor', e.target.value)} 
            />
            <input 
              placeholder="Chave PIX" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('pix', e.target.value)} 
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="bg-gray-600 text-white px-4 py-3 rounded-2xl hover:bg-gray-500 transition flex-1">
                Voltar
              </button>
              <button onClick={finalSubmit} disabled={loading} className="btn-amarelo flex-1 py-3 rounded-2xl">
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}