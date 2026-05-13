import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { 
  User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, 
  ArrowRight, Check, Home, FileText, Car, MapPin, 
  Shield, AlertTriangle
} from 'lucide-react'
import { DocumentUpload } from '../components/DocumentUpload'
import { DriverContract } from '../components/DriverContract'

type Etapa = 1 | 2 | 3 | 4

export function RegisterDriver() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState<Etapa>(1)

  // Dados pessoais (etapa 1)
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Endereço (etapa 2)
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  // Documentos (etapa 3)
  const [frenteCnh, setFrenteCnh] = useState<string | null>(null)
  const [versoCnh, setVersoCnh] = useState<string | null>(null)
  const [selfieCnh, setSelfieCnh] = useState<string | null>(null)
  const [crlv, setCrlv] = useState<string | null>(null)
  const [certidaoAntecedentes, setCertidaoAntecedentes] = useState<string | null>(null)

  // Dados do veículo
  const [modeloVeiculo, setModeloVeiculo] = useState('')
  const [placaVeiculo, setPlacaVeiculo] = useState('')
  const [anoVeiculo, setAnoVeiculo] = useState('')
  const [corVeiculo, setCorVeiculo] = useState('')

  // Contrato (etapa 4)
  const [contratoAceito, setContratoAceito] = useState(false)

  const [loading, setLoading] = useState(false)

  const validarEtapa1 = () => {
    if (!nome || !cpf || !dataNascimento || !email || !telefone || !password) {
      toast.error('Preencha todos os campos obrigatórios')
      return false
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return false
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido')
      return false
    }
    return true
  }

  const validarEtapa2 = () => {
    if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      toast.error('Preencha todos os campos de endereço')
      return false
    }
    return true
  }

  const validarEtapa3 = () => {
    if (!frenteCnh || !versoCnh || !selfieCnh) {
      toast.error('Envie a foto da CNH (frente e verso) e a selfie com a CNH')
      return false
    }
    if (!crlv) {
      toast.error('Envie o CRLV do veículo')
      return false
    }
    if (!modeloVeiculo || !placaVeiculo || !anoVeiculo || !corVeiculo) {
      toast.error('Preencha todos os dados do veículo')
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contratoAceito) {
      toast.error('Você precisa aceitar o contrato para se cadastrar')
      return
    }

    setLoading(true)
    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            nome_completo: nome, 
            tipo: 'motorista',
            cpf: cpf.replace(/\D/g, '')
          }
        }
      })
      
      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      // 2. Inserir na tabela usuarios
      const { error: insertUserError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        telefone,
        tipo: 'motorista'
      })
      if (insertUserError) throw insertUserError

      // 3. Inserir na tabela motoristas com dados completos
      const { error: insertMotoristaError } = await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente',
        dados_veiculo: {
          modelo: modeloVeiculo,
          placa: placaVeiculo.toUpperCase(),
          ano: anoVeiculo,
          cor: corVeiculo
        },
        documentos: {
          cnh_frente: frenteCnh,
          cnh_verso: versoCnh,
          selfie_cnh: selfieCnh,
          crlv: crlv,
          certidao_antecedentes: certidaoAntecedentes
        },
        endereco: {
          cep: cep.replace(/\D/g, ''),
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado
        },
        contrato_aceito: true,
        contrato_aceito_em: new Date().toISOString()
      })
      if (insertMotoristaError) throw insertMotoristaError

      toast.success('Cadastro realizado com sucesso! Aguarde a aprovação.', {
        duration: 5000,
        icon: '✅'
      })
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const buscarCep = async (cepValue: string) => {
    const cepLimpo = cepValue.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setLogradouro(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.localidade || '')
        setEstado(data.uf || '')
      }
    } catch {
      // Silêncio em caso de erro
    }
  }

  const formatarCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatarCep = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const renderEtapa1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <User size={28} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-lg text-white font-bold">Dados Pessoais</h2>
        <p className="text-xs text-[#A0A0B0]">Suas informações de identificação</p>
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <User size={18} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder="Nome completo" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <User size={18} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder="CPF" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required maxLength={14} />
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <Home size={18} className="text-[#F4D03F] shrink-0" />
        <input type="date" placeholder="Data de nascimento" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm [color-scheme:dark]" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} required />
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <Phone size={18} className="text-[#F4D03F] shrink-0" />
        <input type="tel" placeholder="Telefone / WhatsApp" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <Mail size={18} className="text-[#F4D03F] shrink-0" />
        <input type="email" placeholder="E-mail" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <Lock size={18} className="text-[#F4D03F] shrink-0" />
        <input type={showPassword ? 'text' : 'password'} placeholder="Senha (mín. 6 caracteres)" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <Lock size={18} className="text-[#F4D03F] shrink-0" />
        <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar senha" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </motion.div>
  )

  const renderEtapa2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <MapPin size={28} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-lg text-white font-bold">Endereço</h2>
        <p className="text-xs text-[#A0A0B0]">Seu endereço residencial</p>
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <MapPin size={18} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder="CEP" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={cep} onChange={e => { setCep(formatarCep(e.target.value)); if (e.target.value.replace(/\D/g, '').length === 8) buscarCep(e.target.value) }} required maxLength={9} />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
          <Home size={18} className="text-[#F4D03F] shrink-0" />
          <input type="text" placeholder="Logradouro" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={logradouro} onChange={e => setLogradouro(e.target.value)} required />
        </div>
        <div className="w-24 flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
          <input type="text" placeholder="Nº" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={numero} onChange={e => setNumero(e.target.value)} required />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <Home size={18} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder="Complemento (opcional)" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={complemento} onChange={e => setComplemento(e.target.value)} />
      </div>

      <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
        <MapPin size={18} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder="Bairro" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={bairro} onChange={e => setBairro(e.target.value)} required />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
          <MapPin size={18} className="text-[#F4D03F] shrink-0" />
          <input type="text" placeholder="Cidade" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={cidade} onChange={e => setCidade(e.target.value)} required />
        </div>
        <div className="w-20 flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
          <input type="text" placeholder="UF" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm uppercase" value={estado} onChange={e => setEstado(e.target.value.toUpperCase().slice(0, 2))} required maxLength={2} />
        </div>
      </div>
    </motion.div>
  )

  const renderEtapa3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <FileText size={28} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-lg text-white font-bold">Documentos</h2>
        <p className="text-xs text-[#A0A0B0]">Envie os documentos para aprovação</p>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-3 flex items-start gap-3">
        <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-400 text-xs font-medium">Importante</p>
          <p className="text-yellow-300/70 text-xs mt-1">
            Tire fotos nítidas e legíveis dos documentos. Isso acelera a aprovação do seu cadastro.
          </p>
        </div>
      </div>

      <DocumentUpload
        label="CNH - Frente"
        description="Foto nítida da frente da sua CNH"
        acceptedFiles="image/png,image/jpeg,image/jpg"
        value={frenteCnh}
        onChange={setFrenteCnh}
      />

      <DocumentUpload
        label="CNH - Verso"
        description="Foto nítida do verso da sua CNH"
        acceptedFiles="image/png,image/jpeg,image/jpg"
        value={versoCnh}
        onChange={setVersoCnh}
      />

      <DocumentUpload
        label="Selfie com a CNH"
        description="Uma selfie segurando a CNH ao lado do rosto"
        acceptedFiles="image/png,image/jpeg,image/jpg"
        value={selfieCnh}
        onChange={setSelfieCnh}
      />

      <DocumentUpload
        label="CRLV (Documento do Veículo)"
        description="Certificado de Registro e Licenciamento do Veículo"
        acceptedFiles="image/png,image/jpeg,image/jpg,.pdf"
        value={crlv}
        onChange={setCrlv}
      />

      <DocumentUpload
        label="Certidão de Antecedentes Criminais (opcional)"
        description="Acelera a aprovação do cadastro"
        acceptedFiles="image/png,image/jpeg,image/jpg,.pdf"
        value={certidaoAntecedentes}
        onChange={setCertidaoAntecedentes}
      />

      <div className="border-t border-white/10 pt-4 mt-4">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Car size={18} className="text-[#F4D03F]" />
          Dados do Veículo
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Car size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="Modelo do veículo (ex: Toyota Corolla 2024)" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={modeloVeiculo} onChange={e => setModeloVeiculo(e.target.value)} required />
          </div>

          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
              <Car size={18} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Placa" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm uppercase" value={placaVeiculo} onChange={e => setPlacaVeiculo(e.target.value.toUpperCase())} required />
            </div>
            <div className="w-20 flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
              <input type="text" placeholder="Ano" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={anoVeiculo} onChange={e => setAnoVeiculo(e.target.value.replace(/\D/g, '').slice(0, 4))} required maxLength={4} />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Car size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="Cor do veículo" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={corVeiculo} onChange={e => setCorVeiculo(e.target.value)} required />
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderEtapa4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <div className="w-14 h-14 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Shield size={28} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-lg text-white font-bold">Revisão e Contrato</h2>
        <p className="text-xs text-[#A0A0B0]">Revise seus dados e aceite o contrato</p>
      </div>

      {/* Resumo dos dados */}
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-4 space-y-2 text-sm">
        <h3 className="text-white font-semibold mb-2">📌 Resumo do Cadastro</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#A0A0B0]">Nome:</span>
            <p className="text-white">{nome}</p>
          </div>
          <div>
            <span className="text-[#A0A0B0]">CPF:</span>
            <p className="text-white">{cpf}</p>
          </div>
          <div>
            <span className="text-[#A0A0B0]">E-mail:</span>
            <p className="text-white">{email}</p>
          </div>
          <div>
            <span className="text-[#A0A0B0]">Veículo:</span>
            <p className="text-white">{modeloVeiculo}</p>
          </div>
          <div>
            <span className="text-[#A0A0B0]">Placa:</span>
            <p className="text-white">{placaVeiculo}</p>
          </div>
          <div>
            <span className="text-[#A0A0B0]">Cidade:</span>
            <p className="text-white">{cidade}/{estado}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
          <Check size={14} className="text-green-400" />
          <span className="text-green-400 text-xs">
            {frenteCnh && versoCnh && selfieCnh && crlv ? 'Todos os documentos enviados' : 'Documentos pendentes'}
          </span>
        </div>
      </div>

      <DriverContract aceito={contratoAceito} onAcceptChange={setContratoAceito} />

      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-3 flex items-start gap-3">
        <Shield size={18} className="text-[#F4D03F] shrink-0 mt-0.5" />
        <p className="text-xs text-[#A0A0B0]">
          Seus dados estão seguros conosco. Após o envio, nossa equipe analisará 
          seus documentos e você receberá um e-mail de confirmação.
        </p>
      </div>
    </motion.div>
  )

  const etapas: { num: Etapa; label: string }[] = [
    { num: 1, label: 'Dados' },
    { num: 2, label: 'Endereço' },
    { num: 3, label: 'Docs' },
    { num: 4, label: 'Contrato' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] py-5 px-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[520px] mx-auto p-5"
      >
        {/* Header */}
        <div className="flex items-center mb-4">
          {etapa > 1 ? (
            <button onClick={() => setEtapa((etapa - 1) as Etapa)} className="btn-outline-dark p-2" type="button">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <button onClick={() => navigate('/')} className="btn-outline-dark p-2" type="button">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              Cadastro Motorista
            </h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Progresso */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {etapas.map((e, i) => (
            <div key={e.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                etapa > e.num ? 'bg-green-500 text-white' :
                etapa === e.num ? 'bg-[#F4D03F] text-[#1E1E2F]' :
                'bg-[#0F0B1A] text-[#A0A0B0] border border-white/10'
              }`}>
                {etapa > e.num ? <Check size={16} /> : e.num}
              </div>
              {i < etapas.length - 1 && (
                <div className={`w-8 h-0.5 rounded transition-all ${
                  etapa > e.num ? 'bg-green-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={etapa === 4 ? handleRegister : (e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            {etapa === 1 && renderEtapa1()}
            {etapa === 2 && renderEtapa2()}
            {etapa === 3 && renderEtapa3()}
            {etapa === 4 && renderEtapa4()}
          </AnimatePresence>

          <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
            {etapa < 4 ? (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => {
                  if (etapa === 1 && validarEtapa1()) setEtapa(2)
                  else if (etapa === 2 && validarEtapa2()) setEtapa(3)
                  else if (etapa === 3 && validarEtapa3()) setEtapa(4)
                }}
                className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3 text-sm"
              >
                Próximo <ArrowRight size={18} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !contratoAceito}
                className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando cadastro...
                  </>
                ) : (
                  <><Check size={18} /> Finalizar Cadastro</>
                )}
              </motion.button>
            )}
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#A0A0B0]">
            Já tem conta? <Link to="/login" className="text-[#F4D03F] font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}