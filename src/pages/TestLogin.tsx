import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { User, Car, Copy, Eye, EyeOff, RefreshCw, Users } from 'lucide-react'

function generateRandomEmail(prefix: string) {
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${random}@teste.com`
}

function generateRandomPassword() {
  return 'Teste@' + Math.random().toString(36).substring(2, 8)
}

export default function TestLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState<'passageiro' | 'motorista' | 'bulk' | null>(null)
  const [showPassword, setShowPassword] = useState<'passageiro' | 'motorista' | null>(null)
  const [bulkProgress, setBulkProgress] = useState<{ atual: number; total: number } | null>(null)
  const [logins, setLogins] = useState<{
    passageiro: { email: string; password: string } | null
    motorista: { email: string; password: string } | null
  }>({ passageiro: null, motorista: null })

  async function criarPassageiro() {
    setLoading('passageiro')
    const email = generateRandomEmail('passageiro')
    const password = generateRandomPassword()
    const nome = 'Passageiro Teste'

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'passageiro' } }
      })

      if (authError) throw authError

      let userId: string

      if (!authData.session && authData.user) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        userId = loginData.user!.id
      } else if (authData.user) {
        userId = authData.user.id
      } else {
        throw new Error('Erro ao criar usuário')
      }

      const { error: userError } = await supabase.from('usuarios').insert({
        id: userId,
        nome_completo: nome,
        email,
        cpf: '000.000.000-00',
        telefone: '(11) 99999-9999',
        tipo: 'passageiro'
      })
      if (userError) throw userError

      await supabase.from('passageiros').insert({ id: userId })

      setLogins(prev => ({ ...prev, passageiro: { email, password } }))
      toast.success('✅ Conta de passageiro criada!')
    } catch (err: any) {
      toast.error('Erro: ' + (err.message || 'Erro desconhecido'))
    }
    setLoading(null)
  }

  async function criarMotorista() {
    setLoading('motorista')
    const email = generateRandomEmail('motorista')
    const password = generateRandomPassword()
    const nome = 'Motorista Teste'

    try {
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
        userId = loginData.user!.id
      } else if (authData.user) {
        userId = authData.user.id
      } else {
        throw new Error('Erro ao criar usuário')
      }

      const { error: userError } = await supabase.from('usuarios').insert({
        id: userId,
        nome_completo: nome,
        email,
        cpf: '111.111.111-11',
        telefone: '(11) 88888-8888',
        tipo: 'motorista'
      })
      if (userError) throw userError

      await supabase.from('motoristas').insert({
        id: userId,
        status: 'aprovado',
        dados_veiculo: { modelo: 'Toyota Corolla', placa: 'ABC-1234', ano: '2022', cor: 'Preto' }
      })

      setLogins(prev => ({ ...prev, motorista: { email, password } }))
      toast.success('✅ Conta de motorista criada!')
    } catch (err: any) {
      toast.error('Erro: ' + (err.message || 'Erro desconhecido'))
    }
    setLoading(null)
  }

  async function criar20Usuarios() {
    setLoading('bulk')
    setBulkProgress({ atual: 0, total: 20 })
    
    let sucessos = 0
    let erros = 0

    for (let i = 1; i <= 20; i++) {
      const tipo = i <= 10 ? 'passageiro' : 'motorista'
      const index = i <= 10 ? i : i - 10
      const random = Math.random().toString(36).substring(2, 6)
      const email = `${tipo}_teste_${index}_${random}@teste.com`
      const password = 'Teste@123'
      const nome = tipo === 'passageiro' ? `Passageiro Teste ${index}` : `Motorista Teste ${index}`

      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nome_completo: nome, tipo } }
        })

        if (authError) { erros++; setBulkProgress({ atual: i, total: 20 }); continue }

        let userId: string
        if (!authData.session && authData.user) {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password })
          if (loginError) { erros++; setBulkProgress({ atual: i, total: 20 }); continue }
          userId = loginData.user!.id
        } else if (authData.user) {
          userId = authData.user.id
        } else { erros++; setBulkProgress({ atual: i, total: 20 }); continue }

        await supabase.from('usuarios').insert({
          id: userId,
          nome_completo: nome,
          email,
          cpf: `${String(index).padStart(3, '0')}.000.000-${String(index).padStart(2, '0')}`,
          telefone: `(11) 9${String(index).padStart(4, '0')}-0000`,
          tipo,
        })

        if (tipo === 'passageiro') {
          await supabase.from('passageiros').insert({ id: userId })
        } else {
          await supabase.from('motoristas').insert({
            id: userId,
            status: 'aprovado',
            dados_veiculo: { modelo: 'Carro Teste', placa: `ABC-${String(index).padStart(4, '0')}`, ano: '2023', cor: 'Preto' }
          })
        }

        sucessos++
      } catch { erros++ }

      setBulkProgress({ atual: i, total: 20 })
    }

    setLoading(null)
    setBulkProgress(null)
    toast.success(`${sucessos} de 20 usuários criados! Senha: Teste@123`)
  }

  async function copyAndLogin(tipo: 'passageiro' | 'motorista') {
    const login = logins[tipo]
    if (!login) return
    try {
      await navigator.clipboard.writeText(`Email: ${login.email}\nSenha: ${login.password}`)
      toast.success('Login copiado!')
    } catch {}
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
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-white">Logins de Teste</h1>
            <p className="text-sm text-[#A0A0B0]">Crie contas de teste rapidamente</p>
          </div>

          {/* Barra de progresso para criação em massa */}
          {bulkProgress && (
            <div className="bg-[#0F0B1A] rounded-2xl p-3 border border-white/10 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white">Criando {bulkProgress.atual}/{bulkProgress.total}</span>
                <span className="text-xs text-[#F4D03F]">{Math.round((bulkProgress.atual / bulkProgress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FFD966] to-[#F4D03F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(bulkProgress.atual / bulkProgress.total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Criar em massa */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={criar20Usuarios}
              disabled={loading === 'bulk'}
              className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === 'bulk' ? (
                <><RefreshCw size={18} className="animate-spin" /> Criando...</>
              ) : (
                <><Users size={18} /> Criar 10 Passageiros + 10 Motoristas</>
              )}
            </motion.button>

            <div className="border-t border-white/10 pt-4">
              {/* Passageiro */}
              <div className="bg-[#0F0B1A] rounded-2xl border border-white/10 p-4 mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Passageiro</h3>
                    <p className="text-[#A0A0B0] text-xs">Pode solicitar corridas</p>
                  </div>
                </div>

                {logins.passageiro ? (
                  <div className="space-y-2">
                    <div className="bg-[#1A1528] rounded-xl p-3 border border-blue-500/20">
                      <p className="text-xs text-[#A0A0B0]">Email:</p>
                      <p className="text-sm text-white font-medium break-all">{logins.passageiro.email}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-[#A0A0B0]">Senha:</p>
                        <button onClick={() => setShowPassword(showPassword === 'passageiro' ? null : 'passageiro')} className="text-[#A0A0B0] hover:text-white transition">
                          {showPassword === 'passageiro' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <p className={`text-sm text-white font-medium ${showPassword === 'passageiro' ? '' : 'blur-sm select-none'}`}>{logins.passageiro.password}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => copyAndLogin('passageiro')} className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl py-2 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-blue-500/30 transition">
                        <Copy size={14} /> Copiar
                      </button>
                      <button onClick={() => { supabase.auth.signOut(); navigate('/') }} className="flex-1 bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] rounded-2xl py-2 text-xs font-bold">
                        Ir para Login
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={criarPassageiro} disabled={loading === 'passageiro'} className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-500/30 transition disabled:opacity-50">
                    {loading === 'passageiro' ? <RefreshCw size={16} className="animate-spin" /> : <User size={16} />}
                    {loading === 'passageiro' ? 'Criando...' : 'Criar Passageiro Teste'}
                  </button>
                )}
              </div>

              {/* Motorista */}
              <div className="bg-[#0F0B1A] rounded-2xl border border-white/10 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Car size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Motorista</h3>
                    <p className="text-[#A0A0B0] text-xs">Pode aceitar corridas</p>
                  </div>
                </div>

                {logins.motorista ? (
                  <div className="space-y-2">
                    <div className="bg-[#1A1528] rounded-xl p-3 border border-purple-500/20">
                      <p className="text-xs text-[#A0A0B0]">Email:</p>
                      <p className="text-sm text-white font-medium break-all">{logins.motorista.email}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-[#A0A0B0]">Senha:</p>
                        <button onClick={() => setShowPassword(showPassword === 'motorista' ? null : 'motorista')} className="text-[#A0A0B0] hover:text-white transition">
                          {showPassword === 'motorista' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      <p className={`text-sm text-white font-medium ${showPassword === 'motorista' ? '' : 'blur-sm select-none'}`}>{logins.motorista.password}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => copyAndLogin('motorista')} className="flex-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-2xl py-2 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-purple-500/30 transition">
                        <Copy size={14} /> Copiar
                      </button>
                      <button onClick={() => { supabase.auth.signOut(); navigate('/') }} className="flex-1 bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] rounded-2xl py-2 text-xs font-bold">
                        Ir para Login
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={criarMotorista} disabled={loading === 'motorista'} className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-2xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-purple-500/30 transition disabled:opacity-50">
                    {loading === 'motorista' ? <RefreshCw size={16} className="animate-spin" /> : <Car size={16} />}
                    {loading === 'motorista' ? 'Criando...' : 'Criar Motorista Teste'}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button onClick={() => navigate('/')} className="w-full py-2.5 rounded-2xl text-sm text-[#A0A0B0] hover:text-white transition">
              ← Voltar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}