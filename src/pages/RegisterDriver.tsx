import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { UploadFile } from '../components/UploadFile'
import { uploadMultipleFiles } from '../lib/uploadHelpers'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Truck, ArrowLeft, ArrowRight, Check, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'

export default function RegisterDriver() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
        <motion.div
          key={s}
          animate={{ scale: step >= s ? 1 : 0.9 }}
          className={`flex-1 h-2 rounded-full ${step >= s ? 'bg-[#F4D03F]' : 'bg-white/20'}`}
        />
      ))}
    </div>
  )

  const inputClass = "w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <h2 className="text-xl font-bold text-white">📋 Dados Pessoais</h2>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Nome completo" className={inputClass} value={form.nome_completo} onChange={e => updateForm({ nome_completo: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="CPF (apenas números)" className={inputClass} value={form.cpf} onChange={e => updateForm({ cpf: e.target.value })} required />
            </div>
            <input type="date" className="w-full bg-[#1A1528] text-white border border-white/10 rounded-2xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] [color-scheme:dark] text-sm leading-none" value={form.data_nascimento} onChange={e => updateForm({ data_nascimento: e.target.value })} required />
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="RG" className={inputClass} value={form.rg} onChange={e => updateForm({ rg: e.target.value })} required />
            </div>
            <button onClick={nextStep} className="btn-premium w-full flex items-center justify-center gap-2 py-1.5 leading-none">
              Próximo <ArrowRight size={20} />
            </button>
          </motion.div>
        )

      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <h2 className="text-xl font-bold text-white">📞 Contato e Senha</h2>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <Phone size={14} className="text-[#F4D03F] shrink-0" />
              <input type="tel" placeholder="Telefone (com DDD)" className={inputClass} value={form.telefone} onChange={e => updateForm({ telefone: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <Mail size={14} className="text-[#F4D03F] shrink-0" />
              <input type="email" placeholder="E-mail" className={inputClass} value={form.email} onChange={e => updateForm({ email: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <Lock size={14} className="text-[#F4D03F] shrink-0" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Crie uma senha" className={inputClass} value={form.password} onChange={e => updateForm({ password: e.target.value })} required />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <UploadFile label="📄 Comprovante de residência" onUpload={(url) => updateForm({ comprovante_residencia_url: url })} />
            <div className="flex gap-2">
              <button onClick={prevStep} className="btn-outline-dark flex items-center justify-center gap-2 flex-1 py-1.5 leading-none"><ArrowLeft size={20} /> Voltar</button>
              <button onClick={nextStep} className="btn-premium flex items-center justify-center gap-2 flex-1 py-1.5 leading-none">Próximo <ArrowRight size={20} /></button>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <h2 className="text-xl font-bold text-white">🚗 Habilitação (CNH)</h2>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Número da CNH" className={inputClass} value={form.cnh_numero} onChange={e => updateForm({ cnh_numero: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Categoria (ex: A, B, AB)" className={inputClass} value={form.cnh_categoria} onChange={e => updateForm({ cnh_categoria: e.target.value })} required />
            </div>
            <input type="month" className="w-full bg-[#1A1528] text-white border border-white/10 rounded-2xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] [color-scheme:dark] text-sm leading-none" value={form.cnh_validade} onChange={e => updateForm({ cnh_validade: e.target.value })} required />
            <UploadFile label="📸 Foto da CNH (frente)" onUpload={(url) => updateForm({ cnh_frente_url: url })} />
            <UploadFile label="📸 Foto da CNH (verso)" onUpload={(url) => updateForm({ cnh_verso_url: url })} />
            <div className="flex gap-2">
              <button onClick={prevStep} className="btn-outline-dark flex items-center justify-center gap-2 flex-1 py-1.5 leading-none"><ArrowLeft size={20} /> Voltar</button>
              <button onClick={nextStep} className="btn-premium flex items-center justify-center gap-2 flex-1 py-1.5 leading-none">Próximo <ArrowRight size={20} /></button>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <h2 className="text-xl font-bold text-white">🚙 Dados do Veículo</h2>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Placa" className={`${inputClass} uppercase`} value={form.placa} onChange={e => updateForm({ placa: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Modelo (ex: Fiat Uno)" className={inputClass} value={form.modelo} onChange={e => updateForm({ modelo: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Ano" className={inputClass} value={form.ano} onChange={e => updateForm({ ano: e.target.value })} required />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Cor" className={inputClass} value={form.cor} onChange={e => updateForm({ cor: e.target.value })} required />
            </div>
            <select className="w-full bg-[#1A1528] text-white border border-white/10 rounded-2xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] text-sm leading-none" value={form.categoria_veiculo} onChange={e => updateForm({ categoria_veiculo: e.target.value as 'carro' | 'moto' })} required>
              <option value="" className="text-gray-800">Categoria do veículo</option>
              <option value="carro" className="text-gray-800">🚗 Carro</option>
              <option value="moto" className="text-gray-800">🏍️ Moto</option>
            </select>
            <UploadFile label="📄 CRLV (foto)" onUpload={(url) => updateForm({ crlv_url: url })} />
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">📸 Fotos do veículo (máx 5)</label>
              <input type="file" multiple accept="image/*" onChange={handleUploadFotosVeiculo} className="w-full bg-[#1A1528] text-white border border-white/10 rounded-2xl px-3 py-1.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-2xl file:border-0 file:bg-[#F4D03F] file:text-[#1E1E2F] file:font-bold file:text-xs leading-none" />
              {form.fotos_veiculo.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.fotos_veiculo.map((url, i) => (
                    <img key={i} src={url} alt={`Foto ${i+1}`} className="w-16 h-16 object-cover rounded-2xl border border-white/10" />
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={prevStep} className="btn-outline-dark flex items-center justify-center gap-2 flex-1 py-1.5 leading-none"><ArrowLeft size={20} /> Voltar</button>
              <button onClick={nextStep} className="btn-premium flex items-center justify-center gap-2 flex-1 py-1.5 leading-none">Próximo <ArrowRight size={20} /></button>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <h2 className="text-xl font-bold text-white">💰 Seguro e Pagamento</h2>
            <UploadFile label="📄 Apólice de seguro (foto)" onUpload={(url) => updateForm({ seguro_apolice_url: url })} />
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Chave PIX (CPF, e-mail ou telefone)" className={inputClass} value={form.pix} onChange={e => updateForm({ pix: e.target.value })} required />
            </div>
            <div className="card-dark p-5 space-y-1">
              <h3 className="font-bold text-white mb-2">📝 Resumo do cadastro</h3>
              <p className="text-sm text-[#A0A0B0]">Nome: {form.nome_completo}</p>
              <p className="text-sm text-[#A0A0B0]">E-mail: {form.email}</p>
              <p className="text-sm text-[#A0A0B0]">Veículo: {form.modelo} - {form.placa}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={prevStep} className="btn-outline-dark flex items-center justify-center gap-2 flex-1 py-1.5 leading-none"><ArrowLeft size={20} /> Voltar</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-premium flex items-center justify-center gap-2 flex-1 py-1.5 leading-none disabled:opacity-50">
                {loading ? 'Enviando...' : <><Check size={20} /> Finalizar</>}
              </button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="card-dark p-8">
          <div className="text-center mb-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4D03F]/20 backdrop-blur mb-3"
            >
              <Truck className="w-8 h-8 text-[#F4D03F]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Cadastro Motorista</h2>
            <p className="text-[#A0A0B0] text-sm">Etapa {step} de 5</p>
          </div>

          {renderStepIndicator()}
          {renderStep()}

          <p className="text-center text-[#A0A0B0] text-sm mt-4">
            Já tem conta?{' '}
            <button onClick={() => navigate('/')} className="text-[#F4D03F] font-semibold hover:underline">
              Faça login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}