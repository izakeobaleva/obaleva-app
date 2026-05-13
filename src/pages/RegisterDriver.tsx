import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { StepIndicator } from '../components/driver-registration/StepIndicator'
import { PersonalDataStep } from '../components/driver-registration/PersonalDataStep'
import { AddressStep } from '../components/driver-registration/AddressStep'
import { DocumentsStep } from '../components/driver-registration/DocumentsStep'
import { ReviewStep } from '../components/driver-registration/ReviewStep'
import { FormActions } from '../components/driver-registration/FormActions'

export function RegisterDriver() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState(1)
  const totalEtapas = 4
  const [loading, setLoading] = useState(false)

  // Personal data
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Address
  const [cep, setCep] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  // Documents
  const [frenteCnh, setFrenteCnh] = useState<string | null>(null)
  const [versoCnh, setVersoCnh] = useState<string | null>(null)
  const [selfieCnh, setSelfieCnh] = useState<string | null>(null)
  const [crlv, setCrlv] = useState<string | null>(null)
  const [certidaoAntecedentes, setCertidaoAntecedentes] = useState<string | null>(null)
  const [modeloVeiculo, setModeloVeiculo] = useState('')
  const [placaVeiculo, setPlacaVeiculo] = useState('')
  const [anoVeiculo, setAnoVeiculo] = useState('')
  const [corVeiculo, setCorVeiculo] = useState('')

  // Contract
  const [contratoAceito, setContratoAceito] = useState(false)

  const formatarCpf = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }, [])

  const formatarCep = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    return digits.replace(/(\d{5})(\d)/, '$1-$2')
  }, [])

  const buscarCep = useCallback(async (cepValue: string) => {
    try {
      const cleanCep = cepValue.replace(/\D/g, '')
      if (cleanCep.length !== 8) return
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setLogradouro(data.logradouro || '')
        setBairro(data.bairro || '')
        setCidade(data.localidade || '')
        setEstado(data.uf || '')
      }
    } catch {
      console.warn('Erro ao buscar CEP')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contratoAceito) {
      toast.error('Você precisa aceitar o contrato')
      return
    }

    setLoading(true)
    try {
      // Criar auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome_completo: nome, tipo: 'motorista' }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      const userId = authData.user.id

      // Inserir na tabela usuarios
      const { error: userError } = await supabase.from('usuarios').insert({
        id: userId,
        nome_completo: nome,
        cpf,
        data_nascimento: dataNascimento || null,
        email,
        telefone,
        tipo: 'motorista',
        endereco: `${logradouro}, ${numero}${complemento ? ` - ${complemento}` : ''} - ${bairro}, ${cidade}/${estado}`,
        cep: cep || null,
      })

      if (userError) throw userError

      // Inserir na tabela motoristas
      const { error: motoristaError } = await supabase.from('motoristas').insert({
        id: userId,
        status: 'pendente',
        dados_veiculo: {
          modelo: modeloVeiculo,
          placa: placaVeiculo,
          ano: anoVeiculo,
          cor: corVeiculo,
        },
        documentos: {
          frente_cnh: frenteCnh,
          verso_cnh: versoCnh,
          selfie_cnh: selfieCnh,
          crlv: crlv,
          certidao_antecedentes: certidaoAntecedentes,
        },
        endereco: `${logradouro}, ${numero}${complemento ? ` - ${complemento}` : ''} - ${bairro}, ${cidade}/${estado}`,
      })

      if (motoristaError) throw motoristaError

      toast.success('Cadastro enviado para análise! Aguarde aprovação.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
    }
    setLoading(false)
  }

  const validarEtapa = (etapaAtual: number) => {
    switch (etapaAtual) {
      case 1:
        if (!nome || !cpf || !dataNascimento || !email || !telefone || !password) {
          toast.error('Preencha todos os campos obrigatórios')
          return false
        }
        if (password.length < 6) {
          toast.error('A senha deve ter no mínimo 6 caracteres')
          return false
        }
        if (password !== confirmPassword) {
          toast.error('As senhas não conferem')
          return false
        }
        return true
      case 2:
        if (!logradouro || !numero || !bairro || !cidade || !estado) {
          toast.error('Preencha todos os campos de endereço')
          return false
        }
        return true
      case 3:
        if (!frenteCnh || !versoCnh || !selfieCnh || !crlv) {
          toast.error('Envie todos os documentos obrigatórios')
          return false
        }
        if (!modeloVeiculo || !placaVeiculo || !anoVeiculo || !corVeiculo) {
          toast.error('Preencha todos os dados do veículo')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validarEtapa(etapa)) {
      setEtapa(prev => Math.min(prev + 1, totalEtapas))
    }
  }

  const handleBack = () => {
    if (etapa > 1) {
      setEtapa(prev => prev - 1)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBack}
              className="back-button-outline"
              type="button"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-base font-bold text-white">Motorista</h1>
              <p className="text-[10px] text-[#A0A0B0]">Etapa {etapa} de {totalEtapas}</p>
            </div>
          </div>

          <StepIndicator currentStep={etapa} totalSteps={totalEtapas} />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={etapa}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {etapa === 1 && (
                  <PersonalDataStep
                    nome={nome}
                    cpf={cpf}
                    dataNascimento={dataNascimento}
                    email={email}
                    telefone={telefone}
                    password={password}
                    confirmPassword={confirmPassword}
                    onNomeChange={setNome}
                    onCpfChange={setCpf}
                    onDataNascimentoChange={setDataNascimento}
                    onEmailChange={setEmail}
                    onTelefoneChange={setTelefone}
                    onPasswordChange={setPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    formatarCpf={formatarCpf}
                  />
                )}
                {etapa === 2 && (
                  <AddressStep
                    cep={cep}
                    logradouro={logradouro}
                    numero={numero}
                    complemento={complemento}
                    bairro={bairro}
                    cidade={cidade}
                    estado={estado}
                    onCepChange={setCep}
                    onLogradouroChange={setLogradouro}
                    onNumeroChange={setNumero}
                    onComplementoChange={setComplemento}
                    onBairroChange={setBairro}
                    onCidadeChange={setCidade}
                    onEstadoChange={setEstado}
                    buscarCep={buscarCep}
                    formatarCep={formatarCep}
                  />
                )}
                {etapa === 3 && (
                  <DocumentsStep
                    frenteCnh={frenteCnh}
                    versoCnh={versoCnh}
                    selfieCnh={selfieCnh}
                    crlv={crlv}
                    certidaoAntecedentes={certidaoAntecedentes}
                    modeloVeiculo={modeloVeiculo}
                    placaVeiculo={placaVeiculo}
                    anoVeiculo={anoVeiculo}
                    corVeiculo={corVeiculo}
                    onFrenteCnhChange={setFrenteCnh}
                    onVersoCnhChange={setVersoCnh}
                    onSelfieCnhChange={setSelfieCnh}
                    onCrlvChange={setCrlv}
                    onCertidaoChange={setCertidaoAntecedentes}
                    onModeloChange={setModeloVeiculo}
                    onPlacaChange={setPlacaVeiculo}
                    onAnoChange={setAnoVeiculo}
                    onCorChange={setCorVeiculo}
                  />
                )}
                {etapa === 4 && (
                  <ReviewStep
                    nome={nome}
                    cpf={cpf}
                    modeloVeiculo={modeloVeiculo}
                    placaVeiculo={placaVeiculo}
                    temDocumentos={!!frenteCnh && !!versoCnh && !!selfieCnh && !!crlv}
                    contratoAceito={contratoAceito}
                    onContratoChange={setContratoAceito}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <FormActions
              etapa={etapa}
              totalEtapas={totalEtapas}
              loading={loading}
              disabled={etapa === 4 && !contratoAceito}
              onNext={handleNext}
            />
          </form>

          {/* Links */}
          {etapa === 1 && (
            <div className="mt-3 text-center">
              <p className="text-[10px] text-[#A0A0B0]">
                Já tem conta?{' '}
                <button onClick={() => navigate('/login')} className="text-[#F4D03F] hover:underline font-medium">
                  Entrar
                </button>
              </p>
              <p className="text-[10px] text-[#A0A0B0] mt-1">
                É passageiro?{' '}
                <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium">
                  Cadastre-se aqui
                </button>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}