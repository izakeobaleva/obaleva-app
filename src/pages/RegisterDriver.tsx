"use client";

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { 
  User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, 
  ArrowRight, Check, Car, Home, MapPin, FileText, 
  Shield, AlertTriangle
} from 'lucide-react'
import { DocumentUpload } from '../components/DocumentUpload'
import { DriverContract } from '../components/DriverContract'

type Etapa = 1 | 2 | 3 | 4

export function RegisterDriver() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState<Etapa>(1)
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [frenteCnh, setFrenteCnh] = useState<string | null>(null)
  const [versoCnh, setVersoCnh] = useState<string | null>(null)
  const [selfieCnh, setSelfieCnh] = useState<string | null>(null)
  const [crlv, setCrlv] = useState<string | null>(null)
  const [certidaoAntecedentes, setCertidaoAntecedentes] = useState<string | null>(null)
  const [modeloVeiculo, setModeloVeiculo] = useState('')
  const [placaVeiculo, setPlacaVeiculo] = useState('')
  const [anoVeiculo, setAnoVeiculo] = useState('')
  const [corVeiculo, setCorVeiculo] = useState('')
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'motorista', cpf: cpf.replace(/\D/g, '') } }
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        cpf: cpf.replace(/\D/g, ''),
        email,
        telefone,
        tipo: 'motorista'
      })

      await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente',
        dados_veiculo: { modelo: modeloVeiculo, placa: placaVeiculo.toUpperCase(), ano: anoVeiculo, cor: corVeiculo },
        documentos: { cnh_frente: frenteCnh, cnh_verso: versoCnh, selfie_cnh: selfieCnh, crlv: crlv, certidao_antecedentes: certidaoAntecedentes },
        endereco: { cep: cep.replace(/\D/g, ''), logradouro, numero, complemento, bairro, cidade, estado },
        contrato_aceito: true,
        contrato_aceito_em: new Date().toISOString()
      })

      toast.success('Cadastro realizado com sucesso! Aguarde a aprovação.', { duration: 5000, icon: '✅' })
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
    } catch {}
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
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <User size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Dados Pessoais</h2>
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <User size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="text" 
          placeholder="Nome completo" 
          autoComplete="name"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
        />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <User size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="text" 
          placeholder="CPF" 
          autoComplete="off"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={cpf} 
          onChange={e => setCpf(formatarCpf(e.target.value))} 
          required 
          maxLength={14} 
        />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Home size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="date" 
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs [color-scheme:dark]" 
          autoComplete="bday"
          value={dataNascimento} 
          onChange={e => setDataNascimento(e.target.value)} 
          required 
        />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Phone size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="tel" 
          placeholder="Telefone / WhatsApp" 
          autoComplete="tel"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={telefone} 
          onChange={e => setTelefone(e.target.value)} 
          required 
        />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Mail size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="email" 
          placeholder="E-mail" 
          autoComplete="email"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Lock size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type={showPassword ? 'text' : 'password'} 
          placeholder="Senha (mín. 6 caracteres)" 
          autoComplete="new-password"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          minLength={6} 
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
          {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Lock size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type={showConfirm ? 'text' : 'password'} 
          placeholder="Confirmar senha" 
          autoComplete="new-password"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={confirmPassword} 
          onChange={e => setConfirmPassword(e.target.value)} 
          required 
          minLength={6} 
        />
        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
          {showConfirm ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      </div>
    </motion.div>
  )

  const renderEtapa2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <MapPin size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Endereço</h2>
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <MapPin size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="text" 
          placeholder="CEP" 
          autoComplete="postal-code"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={cep} 
          onChange={e => { 
            setCep(formatarCep(e.target.value)); 
            if (e.target.value.replace(/\D/g, '').length === 8) buscarCep(e.target.value) 
          }} 
          required 
          maxLength={9} 
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <Home size={14} className="text-[#F4D03F] shrink-0" />
          <input 
            type="text" 
            placeholder="Logradouro" 
            autoComplete="street-address"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
            value={logradouro} 
            onChange={e => setLogradouro(e.target.value)} 
            required 
          />
        </div>
        <div className="w-16 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <input 
            type="text" 
            placeholder="Nº" 
            autoComplete="address-line2"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
            value={numero} 
            onChange={e => setNumero(e.target.value)} 
            required 
          />
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Home size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="text" 
          placeholder="Complemento (opcional)" 
          autoComplete="address-line3"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={complemento} 
          onChange={e => setComplemento(e.target.value)} 
        />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <MapPin size={14} className="text-[#F4D03F] shrink-0" />
        <input 
          type="text" 
          placeholder="Bairro" 
          autoComplete="address-level4"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
          value={bairro} 
          onChange={e => setBairro(e.target.value)} 
          required 
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <MapPin size={14} className="text-[#F4D03F] shrink-0" />
          <input 
            type="text" 
            placeholder="Cidade" 
            autoComplete="address-level2"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
            value={cidade} 
            onChange={e => setCidade(e.target.value)} 
            required 
          />
        </div>
        <div className="w-14 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <input 
            type="text" 
            placeholder="UF" 
            autoComplete="address-level1"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs uppercase" 
            value={estado} 
            onChange={e => setEstado(e.target.value.toUpperCase().slice(0, 2))} 
            required 
            maxLength={2} 
          />
        </div>
      </div>
    </motion.div>
  )

  const renderEtapa3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <FileText size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Documentos</h2>
      </div>
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-2.5 flex items-start gap-2">
        <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-300/70 text-[10px]">Tire fotos nítidas dos documentos. Isso acelera a aprovação.</p>
      </div>
      <DocumentUpload label="CNH - Frente" description="Foto nítida da frente da sua CNH" acceptedFiles="image/png,image/jpeg,image/jpg" value={frenteCnh} onChange={setFrenteCnh} />
      <DocumentUpload label="CNH - Verso" description="Foto nítida do verso da sua CNH" acceptedFiles="image/png,image/jpeg,image/jpg" value={versoCnh} onChange={setVersoCnh} />
      <DocumentUpload label="Selfie com a CNH" description="Selfie segurando a CNH ao lado do rosto" acceptedFiles="image/png,image/jpeg,image/jpg" value={selfieCnh} onChange={setSelfieCnh} />
      <DocumentUpload label="CRLV" description="Certificado de Registro e Licenciamento do Veículo" acceptedFiles="image/png,image/jpeg,image/jpg,.pdf" value={crlv} onChange={setCrlv} />
      <DocumentUpload label="Antecedentes Criminais (opcional)" description="Acelera a aprovação" acceptedFiles="image/png,image/jpeg,image/jpg,.pdf" value={certidaoAntecedentes} onChange={setCertidaoAntecedentes} />
      <div className="border-t border-white/10 pt-3 mt-3">
        <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Car size={14} className="text-[#F4D03F]" /> Dados do Veículo
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Car size={14} className="text-[#F4D03F] shrink-0" />
            <input 
              type="text" 
              placeholder="Modelo (ex: Toyota Corolla)" 
              autoComplete="off"
              className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
              value={modeloVeiculo} 
              onChange={e => setModeloVeiculo(e.target.value)} 
              required 
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
              <Car size={14} className="text-[#F4D03F] shrink-0" />
              <input 
                type="text" 
                placeholder="Placa" 
                autoComplete="off"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs uppercase" 
                value={placaVeiculo} 
                onChange={e => setPlacaVeiculo(e.target.value.toUpperCase())} 
                required 
              />
            </div>
            <div className="w-16 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
              <input 
                type="text" 
                placeholder="Ano" 
                autoComplete="off"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
                value={anoVeiculo} 
                onChange={e => setAnoVeiculo(e.target.value.replace(/\D/g, '').slice(0, 4))} 
                required 
                maxLength={4} 
              />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Car size={14} className="text-[#F4D03F] shrink-0" />
            <input 
              type="text" 
              placeholder="Cor do veículo" 
              autoComplete="off"
              className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
              value={corVeiculo} 
              onChange={e => setCorVeiculo(e.target.value)} 
              required 
            />
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderEtapa4 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <Shield size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Revisão e Contrato</h2>
      </div>
      <div className="bg-[#0F0B1A] rounded-2xl border border-white/10 p-3 space-y-1.5 text-xs">
        <h3 className="text-white font-semibold mb-1">📌 Resumo</h3>
        <div className="grid grid-cols-2 gap-1">
          <div><span className="text-[#A0A0B0]">Nome:</span> <span className="text-white">{nome}</span></div>
          <div><span className="text-[#A0A0B0]">CPF:</span> <span className="text-white">{cpf}</span></div>
          <div><span className="text-[#A0A0B0]">Veículo:</span> <span className="text-white">{modeloVeiculo}</span></div>
          <div><span className="text-[#A0A0B0]">Placa:</span> <span className="text-white">{placaVeiculo}</span></div>
        </div>
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
          <Check size={12} className="text-green-400" />
          <span className="text-green-400 text-[10px]">{frenteCnh && versoCnh && selfieCnh && crlv ? 'Documentos OK' : 'Documentos pendentes'}</span>
        </div>
      </div>
      <DriverContract aceito={contratoAceito} onAcceptChange={setContratoAceito} />
    </motion.div>
  )

  const etapas = [{ num: 1, label: 'Dados' }, { num: 2, label: 'Endereço' }, { num: 3, label: 'Docs' }, { num: 4, label: 'Contrato' }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm mx-auto p-4"
      >
        <div className="flex items-center mb-3">
          <button onClick={() => etapa > 1 ? setEtapa((etapa - 1) as Etapa) : navigate('/login')} className="btn-outline-dark" type="button"
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center -ml-12">
            <h1 className="text-base font-bold text-white">Motorista</h1>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-3">
          {etapas.map((e, i) => (
            <div key={e.num} className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                etapa > e.num ? 'bg-green-500 text-white' :
                etapa === e.num ? 'bg-[#F4D03F] text-[#1E1E2F]' :
                'bg-[#0F0B1A] text-[#A0A0B0] border border-white/10'
              }`}>{etapa > e.num ? <Check size={12} /> : e.num}</div>
              {i < etapas.length - 1 && <div className={`w-5 h-0.5 rounded ${etapa > e.num ? 'bg-green-500' : 'bg-white/10'}`} />}
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

          <div className="mt-3 pt-3 border-t border-white/10">
            {etapa < 4 ? (
              <motion.button whileTap={{ scale: 0.97 }} type="button"
                onClick={() => {
                  if (etapa === 1 && validarEtapa1()) setEtapa(2)
                  else if (etapa === 2 && validarEtapa2()) setEtapa(3)
                  else if (etapa === 3 && validarEtapa3()) setEtapa(4)
                }}
                className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2.5 text-xs"
              >
                Próximo <ArrowRight size={14} />
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading || !contratoAceito}
                className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2.5 text-xs disabled:opacity-50"
              >
                {loading ? 'Enviando...' : <><Check size={14} /> Finalizar Cadastro</>}
              </motion.button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}