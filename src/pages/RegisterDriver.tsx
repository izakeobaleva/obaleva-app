import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { StepIndicator } from '../components/driver-registration/StepIndicator'
import { PersonalDataStep } from '../components/driver-registration/PersonalDataStep'
import { AddressStep } from '../components/driver-registration/AddressStep'
import { DocumentsStep } from '../components/driver-registration/DocumentsStep'
import { ReviewStep } from '../components/driver-registration/ReviewStep'
import { FormActions } from '../components/driver-registration/FormActions'
import { useAuth } from '../contexts/AuthContext'

const STORAGE_KEY = 'ovaleva_driver_registration'

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return {}
}

function saveToStorage(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function RegisterDriver() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const mounted = useRef(true)

  const saved = loadFromStorage()
  const savedStep = saved?.etapa || 1

  const [etapa, setEtapa] = useState(savedStep)
  const totalEtapas = 4
  const [loading, setLoading] = useState(false)

  // Personal data
  const [nome, setNome] = useState(saved?.nome || '')
  const [cpf, setCpf] = useState(saved?.cpf || '')
  const [dataNascimento, setDataNascimento] = useState(saved?.dataNascimento || '')
  const [email, setEmail] = useState(saved?.email || '')
  const [telefone, setTelefone] = useState(saved?.telefone || '')
  const [password, setPassword] = useState(saved?.password || '')
  const [confirmPassword, setConfirmPassword] = useState(saved?.confirmPassword || '')

  // Address
  const [cep, setCep] = useState(saved?.cep || '')
  const [logradouro, setLogradouro] = useState(saved?.logradouro || '')
  const [numero, setNumero] = useState(saved?.numero || '')
  const [complemento, setComplemento] = useState(saved?.complemento || '')
  const [bairro, setBairro] = useState(saved?.bairro || '')
  const [cidade, setCidade] = useState(saved?.cidade || '')
  const [estado, setEstado] = useState(saved?.estado || '')

  // Documents
  const [frenteCnh, setFrenteCnh] = useState<string | null>(saved?.frenteCnh || null)
  const [versoCnh, setVersoCnh] = useState<string | null>(saved?.versoCnh || null)
  const [selfieCnh, setSelfieCnh] = useState<string | null>(saved?.selfieCnh || null)
  const [crlv, setCrlv] = useState<string | null>(saved?.crlv || null)
  const [certidaoAntecedentes, setCertidaoAntecedentes] = useState<string | null>(saved?.certidaoAntecedentes || null)
  const [modeloVeiculo, setModeloVeiculo] = useState(saved?.modeloVeiculo || '')
  const [placaVeiculo, setPlacaVeiculo] = useState(saved?.placaVeiculo || '')
  const [anoVeiculo, setAnoVeiculo] = useState(saved?.anoVeiculo || '')
  const [corVeiculo, setCorVeiculo] = useState(saved?.corVeiculo || '')

  // Contract
  const [contratoAceito, setContratoAceito] = useState(saved?.contratoAceito || false)

  // Errors de validação
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    saveToStorage({
      etapa, nome, cpf, dataNascimento, email, telefone, password, confirmPassword,
      cep, logradouro, numero, complemento, bairro, cidade, estado,
      frenteCnh, versoCnh, selfieCnh, crlv, certidaoAntecedentes,
      modeloVeiculo, placaVeiculo, anoVeiculo, corVeiculo, contratoAceito,
    })
  }, [etapa, nome, cpf, dataNascimento, email, telefone, password, confirmPassword,
      cep, logradouro, numero, complemento, bairro, cidade, estado,
      frenteCnh, versoCnh, selfieCnh, crlv, certidaoAntecedentes,
      modeloVeiculo, placaVeiculo, anoVeiculo, corVeiculo, contratoAceito])

  function clearStorage() {
    localStorage.removeItem(STORAGE_KEY)
  }

  const formatarCpf = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
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

  function validarEtapa(etapaAtual: number): boolean {
    const newErrors: Record<string, string> = {}
    
    switch (etapaAtual) {
      case 1:
        if (!nome.trim()) newErrors.nome = 'Nome obrigatório'
        if (cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF inválido'
        if (!dataNascimento) newErrors.dataNascimento = 'Data obrigatória'
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido'
        if (!telefone.trim()) newErrors.telefone = 'Telefone obrigatório'
        if (!password || password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
        if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não conferem'
        break
      case 2:
        if (!logradouro) newErrors.logradouro = 'Logradouro obrigatório'
        if (!numero) newErrors.numero = 'Número obrigatório'
        if (!bairro) newErrors.bairro = 'Bairro obrigatório'
        if (!cidade) newErrors.cidade = 'Cidade obrigatória'
        if (!estado) newErrors.estado = 'UF obrigatório'
        break
      case 3:
        if (!frenteCnh) newErrors.frenteCnh = 'CNH frente obrigatória'
        if (!versoCnh) newErrors.versoCnh = 'CNH verso obrigatório'
        if (!selfieCnh) newErrors.selfieCnh = 'Selfie obrigatória'
        if (!crlv) newErrors.crlv = 'CRLV obrigatório'
        if (!modeloVeiculo) newErrors.modeloVeiculo = 'Modelo obrigatório'
        if (!placaVeiculo) newErrors.placaVeiculo = 'Placa obrigatória'
        if (!anoVeiculo) newErrors.anoVeiculo = 'Ano obrigatório'
        if (!corVeiculo) newErrors.corVeiculo = 'Cor obrigatória'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarEtapa(4)) {
      toast.error('Verifique os campos')
      return
    }

    if (!contratoAceito) {
      toast.error('Você precisa aceitar o contrato')
      return
    }

    const dataParts = dataNascimento.split('/')
    const dataFormatadaBanco = dataParts.length === 3 ? `${dataParts[2]}-${dataParts[1]}-${dataParts[0]}` : ''

    setLoading(true)
    try {
      // 1. Criar no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'motorista' } }
      })
      if (authError) throw authError

      let userId: string

      if (!authData.session && authData.user) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        if (!loginData.user) throw new Error('Usuário não encontrado após login')
        userId = loginData.user.id
      } else if (authData.user) {
        userId = authData.user.id
      } else {
        throw new Error('Erro ao criar usuário')
      }

      // 2. Inserir na tabela usuarios
      const { error: userError } = await supabase.from('usuarios').insert({
        id: userId,
        nome_completo: nome,
        cpf,
        data_nascimento: dataFormatadaBanco || null,
        email,
        telefone,
        tipo: 'motorista',
        endereco: `${logradouro}, ${numero}${complemento ? ` - ${complemento}` : ''} - ${bairro}, ${cidade}/${estado}`,
        cep: cep || null,
      })
      if (userError) throw userError

      // 3. Inserir na tabela motoristas
      const { error: motoristaError } = await supabase.from('motoristas').insert({
        id: userId,
        status: 'pendente',
        dados_veiculo: { modelo: modeloVeiculo, placa: placaVeiculo, ano: anoVeiculo, cor: corVeiculo },
        documentos: { frente_cnh: frenteCnh, verso_cnh: versoCnh, selfie_cnh: selfieCnh, crlv, certidao_antecedentes: certidaoAntecedentes },
        endereco: `${logradouro}, ${numero}${complemento ? ` - ${complemento}` : ''} - ${bairro}, ${cidade}/${estado}`,
      })
      if (motoristaError) throw motoristaError

      clearStorage()
      toast.success('Cadastro realizado com sucesso! Bem-vindo!')
      
      if (!mounted.current) return
      
      // 4. Se o auth não criou sessão, faz login manual
      if (!authData.session) {
        await supabase.auth.signInWithPassword({ email, password })
      }
      
      navigate('/')
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        toast.error('Este e-mail já está cadastrado. Faça login.')
      } else {
        toast.error(err.message || 'Erro ao cadastrar')
      }
    }
    setLoading(false)
  }

  const handleNext = () => {
    if (validarEtapa(etapa)) {
      setEtapa(prev => Math.min(prev + 1, totalEtapas))
    } else {
      toast.error('Preencha todos os campos obrigatórios')
    }
  }

  const handleBack = () => {
    if (etapa > 1) setEtapa(prev => prev - 1)
    else navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={handleBack} className="back-button-outline" type="button"><ArrowLeft size={22} /></button>
            <div>
              <h1 className="text-base font-bold text-white">Motorista</h1>
              <p className="text-[10px] text-[#A0A0B0]">Etapa {etapa} de {totalEtapas}</p>
            </div>
          </div>

          <StepIndicator currentStep={etapa} totalSteps={totalEtapas} />

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div key={etapa} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {etapa === 1 && (
                  <PersonalDataStep
                    nome={nome} cpf={cpf} dataNascimento={dataNascimento} email={email} telefone={telefone} password={password} confirmPassword={confirmPassword}
                    onNomeChange={setNome} onCpfChange={setCpf} onDataNascimentoChange={setDataNascimento} onEmailChange={setEmail} onTelefoneChange={setTelefone}
                    onPasswordChange={setPassword} onConfirmPasswordChange={setConfirmPassword} formatarCpf={formatarCpf}
                    errors={errors}
                  />
                )}
                {etapa === 2 && (
                  <AddressStep
                    cep={cep} logradouro={logradouro} numero={numero} complemento={complemento} bairro={bairro} cidade={cidade} estado={estado}
                    onCepChange={setCep} onLogradouroChange={setLogradouro} onNumeroChange={setNumero} onComplementoChange={setComplemento}
                    onBairroChange={setBairro} onCidadeChange={setCidade} onEstadoChange={setEstado}
                    buscarCep={buscarCep} formatarCep={formatarCep}
                    errors={errors}
                  />
                )}
                {etapa === 3 && (
                  <DocumentsStep
                    frenteCnh={frenteCnh} versoCnh={versoCnh} selfieCnh={selfieCnh} crlv={crlv} certidaoAntecedentes={certidaoAntecedentes}
                    modeloVeiculo={modeloVeiculo} placaVeiculo={placaVeiculo} anoVeiculo={anoVeiculo} corVeiculo={corVeiculo}
                    onFrenteCnhChange={setFrenteCnh} onVersoCnhChange={setVersoCnh} onSelfieCnhChange={setSelfieCnh} onCrlvChange={setCrlv}
                    onCertidaoChange={setCertidaoAntecedentes} onModeloChange={setModeloVeiculo} onPlacaChange={setPlacaVeiculo}
                    onAnoChange={setAnoVeiculo} onCorChange={setCorVeiculo}
                    errors={errors}
                  />
                )}
                {etapa === 4 && (
                  <ReviewStep nome={nome} cpf={cpf} modeloVeiculo={modeloVeiculo} placaVeiculo={placaVeiculo}
                    temDocumentos={!!frenteCnh && !!versoCnh && !!selfieCnh && !!crlv}
                    contratoAceito={contratoAceito} onContratoChange={setContratoAceito}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <FormActions etapa={etapa} totalEtapas={totalEtapas} loading={loading} disabled={etapa === 4 && !contratoAceito} onNext={handleNext} />
          </form>

          {etapa === 1 && (
            <div className="mt-3 text-center space-y-1">
              <p className="text-[10px] text-[#A0A0B0]">Já tem conta? <button onClick={() => navigate('/login')} className="text-[#F4D03F] hover:underline font-medium">Entrar</button></p>
              <p className="text-[10px] text-[#A0A0B0]">É passageiro? <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium">Cadastre-se aqui</button></p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}