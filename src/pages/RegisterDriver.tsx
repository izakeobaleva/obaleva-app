import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { UploadFile } from '../components/UploadFile'
import { uploadFile, uploadMultipleFiles } from '../lib/uploadHelpers'
import { toast } from 'sonner'

export default function RegisterDriver() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome_completo: '',
    cpf: '',
    data_nascimento: '',
    rg: '',
    telefone: '',
    email: '',
    password: '',
    comprovante_residencia_url: '',
    cnh_numero: '',
    cnh_categoria: '',
    cnh_validade: '',
    cnh_frente_url: '',
    cnh_verso_url: '',
    crlv_url: '',
    placa: '',
    modelo: '',
    ano: '',
    cor: '',
    categoria_veiculo: '' as 'carro' | 'moto' | '',
    fotos_veiculo: [] as string[],
    seguro_apolice_url: '',
    pix: '',
  })

  const updateForm = (data: Partial<typeof form>) => setForm({ ...form, ...data })

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = async () => {
    if (!form.nome_completo || !form.cpf || !form.email || !form.password) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nome_completo: form.nome_completo, tipo: 'motorista' } },
      })

      if (signUpError) throw signUpError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      const { error: insertUserError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: form.nome_completo,
        cpf: form.cpf,
        telefone: form.telefone,
        email: form.email,
        tipo: 'motorista',
      })
      if (insertUserError) throw insertUserError

      const { error: insertDriverError } = await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente',
        documentos_urls: {
          comprovante_residencia: form.comprovante_residencia_url,
          cnh: {
            numero: form.cnh_numero,
            categoria: form.cnh_categoria,
            validade: form.cnh_validade,
            frente: form.cnh_frente_url,
            verso: form.cnh_verso_url,
          },
          crlv: form.crlv_url,
          seguro: form.seguro_apolice_url,
        },
        dados_veiculo: {
          placa: form.placa,
          modelo: form.modelo,
          ano: form.ano,
          cor: form.cor,
          categoria: form.categoria_veiculo,
          fotos: form.fotos_veiculo,
        },
        conta_bancaria_pix: form.pix,
      })
      if (insertDriverError) throw insertDriverError

      toast.success('Cadastro enviado! Aguarde aprovação do administrador.')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Erro no cadastro')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadFotosVeiculo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    try {
      const urls = await uploadMultipleFiles('veiculos', files, `driver_${Date.now()}_`)
      updateForm({ fotos_veiculo: [...form.fotos_veiculo, ...urls] })
      toast.success(`${files.length} foto(s) enviada(s) com sucesso!`)
    } catch (err: any) {
      toast.error('Erro ao enviar fotos')
    }
  }

  const renderStepIndicator = () => (
    <div className="flex gap-2 mb-6">
      {[1, 2, 3, 4, 5].map(s => (
        <div key={s} className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-amarelo-oba' : 'bg-gray-200'}`} />
      ))}
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-roxo-principal">📋 Dados Pessoais</h2>
            <input type="text" placeholder="Nome completo" className="w-full p-3 border rounded-lg" value={form.nome_completo} onChange={e => updateForm({ nome_completo: e.target.value })} required />
            <input type="text" placeholder="CPF (apenas números)" className="w-full p-3 border rounded-lg" value={form.cpf} onChange={e => updateForm({ cpf: e.target.value })} required />
            <input type="date" className="w-full p-3 border rounded-lg" value={form.data_nascimento} onChange={e => updateForm({ data_nascimento: e.target.value })} required />
            <input type="text" placeholder="RG" className="w-full p-3 border rounded-lg" value={form.rg} onChange={e => updateForm({ rg: e.target.value })} required />
            <button onClick={nextStep} className="btn-amarelo w-full py-3 rounded-lg text-lg">Próximo →</button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-roxo-principal">📞 Contato e Senha</h2>
            <input type="tel" placeholder="Telefone (com DDD)" className="w-full p-3 border rounded-lg" value={form.telefone} onChange={e => updateForm({ telefone: e.target.value })} required />
            <input type="email" placeholder="E-mail" className="w-full p-3 border rounded-lg" value={form.email} onChange={e => updateForm({ email: e.target.value })} required />
            <input type="password" placeholder="Crie uma senha" className="w-full p-3 border rounded-lg" value={form.password} onChange={e => updateForm({ password: e.target.value })} required />
            <UploadFile label="📄 Comprovante de residência" onUpload={(url) => updateForm({ comprovante_residencia_url: url })} />
            <div className="flex gap-2">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-3 rounded-lg">← Voltar</button>
              <button onClick={nextStep} className="btn-amarelo flex-1 py-3 rounded-lg">Próximo →</button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-roxo-principal">🚗 Habilitação (CNH)</h2>
            <input type="text" placeholder="Número da CNH" className="w-full p-3 border rounded-lg" value={form.cnh_numero} onChange={e => updateForm({ cnh_numero: e.target.value })} required />
            <input type="text" placeholder="Categoria (ex: A, B, AB)" className="w-full p-3 border rounded-lg" value={form.cnh_categoria} onChange={e => updateForm({ cnh_categoria: e.target.value })} required />
            <input type="month" className="w-full p-3 border rounded-lg" value={form.cnh_validade} onChange={e => updateForm({ cnh_validade: e.target.value })} required />
            <UploadFile label="📸 Foto da CNH (frente)" onUpload={(url) => updateForm({ cnh_frente_url: url })} />
            <UploadFile label="📸 Foto da CNH (verso)" onUpload={(url) => updateForm({ cnh_verso_url: url })} />
            <div className="flex gap-2">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-3 rounded-lg">← Voltar</button>
              <button onClick={nextStep} className="btn-amarelo flex-1 py-3 rounded-lg">Próximo →</button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-roxo-principal">🚙 Dados do Veículo</h2>
            <input type="text" placeholder="Placa" className="w-full p-3 border rounded-lg uppercase" value={form.placa} onChange={e => updateForm({ placa: e.target.value })} required />
            <input type="text" placeholder="Modelo (ex: Fiat Uno)" className="w-full p-3 border rounded-lg" value={form.modelo} onChange={e => updateForm({ modelo: e.target.value })} required />
            <input type="text" placeholder="Ano" className="w-full p-3 border rounded-lg" value={form.ano} onChange={e => updateForm({ ano: e.target.value })} required />
            <input type="text" placeholder="Cor" className="w-full p-3 border rounded-lg" value={form.cor} onChange={e => updateForm({ cor: e.target.value })} required />
            <select className="w-full p-3 border rounded-lg" value={form.categoria_veiculo} onChange={e => updateForm({ categoria_veiculo: e.target.value as 'carro' | 'moto' })} required>
              <option value="">Categoria do veículo</option>
              <option value="carro">🚗 Carro</option>
              <option value="moto">🏍️ Moto</option>
            </select>
            <UploadFile label="📄 CRLV (foto)" onUpload={(url) => updateForm({ crlv_url: url })} />
            <div>
              <label className="block mb-1 font-medium">📸 Fotos do veículo (máx 5)</label>
              <input type="file" multiple accept="image/*" onChange={handleUploadFotosVeiculo} className="w-full p-3 border rounded-lg" />
              {form.fotos_veiculo.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.fotos_veiculo.map((url, i) => (
                    <img key={i} src={url} alt={`Foto ${i+1}`} className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-3 rounded-lg">← Voltar</button>
              <button onClick={nextStep} className="btn-amarelo flex-1 py-3 rounded-lg">Próximo →</button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-roxo-principal">💰 Seguro e Pagamento</h2>
            <UploadFile label="📄 Apólice de seguro (foto)" onUpload={(url) => updateForm({ seguro_apolice_url: url })} />
            <input type="text" placeholder="Chave PIX (CPF, e-mail ou telefone)" className="w-full p-3 border rounded-lg" value={form.pix} onChange={e => updateForm({ pix: e.target.value })} required />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">📝 Resumo do cadastro</h3>
              <p className="text-sm">Nome: {form.nome_completo}</p>
              <p className="text-sm">E-mail: {form.email}</p>
              <p className="text-sm">Veículo: {form.modelo} - {form.placa}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-3 rounded-lg">← Voltar</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-amarelo flex-1 py-3 rounded-lg text-lg">
                {loading ? 'Enviando...' : '✅ Finalizar Cadastro'}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-roxo-principal flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-roxo-principal text-center mb-6">Cadastro Motorista</h1>
        {renderStepIndicator()}
        <p className="text-sm text-gray-500 text-center mb-4">Etapa {step} de 5</p>
        {renderStep()}
      </div>
    </div>
  )
}