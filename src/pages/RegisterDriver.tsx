import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export const RegisterDriver = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<any>({})
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const finalSubmit = async () => {
    const { nome_completo, cpf, telefone, email, password, placa, modelo, ano, cor, pix } = form
    const { data: auth, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo, tipo: 'motorista' } }
    })
    if (error) return toast.error(error.message)
    const userId = auth.user?.id
    if (!userId) return toast.error('Erro ao criar usuário')
    await supabase.from('usuarios').insert({ id: userId, nome_completo, cpf, telefone, email, tipo: 'motorista' })
    await supabase.from('motoristas').insert({
      id: userId,
      status: 'pendente',
      dados_veiculo: { placa, modelo, ano, cor },
      conta_bancaria_pix: pix
    })
    toast.success('Cadastro enviado para aprovação!')
    navigate('/login')
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl max-w-lg w-full">
          <h2 className="text-2xl font-bold text-roxo-principal">Dados Pessoais</h2>
          <input name="nome_completo" placeholder="Nome completo" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="cpf" placeholder="CPF (apenas números)" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="telefone" placeholder="Telefone" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="email" placeholder="E-mail" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Senha" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <button onClick={nextStep} className="btn-amarelo w-full mt-4 py-2 rounded">Próximo</button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl max-w-lg w-full">
          <h2 className="text-2xl font-bold text-roxo-principal">Dados do Veículo e PIX</h2>
          <input name="placa" placeholder="Placa" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="modelo" placeholder="Modelo" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="ano" placeholder="Ano" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="cor" placeholder="Cor" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <input name="pix" placeholder="Chave PIX" className="w-full p-2 border rounded my-1" onChange={handleChange} required />
          <div className="flex gap-2 mt-4">
            <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded">Voltar</button>
            <button onClick={finalSubmit} className="btn-amarelo flex-1 py-2 rounded">Enviar cadastro</button>
          </div>
        </div>
      </div>
    )
  }

  return null
}