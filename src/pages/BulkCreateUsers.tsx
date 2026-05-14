import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { Users, Car, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function generateInfo(tipo: 'passageiro' | 'motorista', index: number) {
  const random = Math.random().toString(36).substring(2, 6)
  return {
    email: `${tipo}_teste_${index}_${random}@teste.com`,
    password: 'Teste@123',
    nome: tipo === 'passageiro' 
      ? `Passageiro Teste ${index}` 
      : `Motorista Teste ${index}`,
    cpf: `${String(index).padStart(3, '0')}.${String(index + 100).padStart(3, '0')}.${String(index + 200).padStart(3, '0')}-${String(index).padStart(2, '0')}`,
    telefone: `(11) 9${String(index).padStart(4, '0')}-${String(index + 1000).padStart(4, '0')}`,
  }
}

export default function BulkCreateUsers() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ tipo: string; email: string; status: 'ok' | 'error'; message: string }[]>([])
  const [progresso, setProgresso] = useState({ atual: 0, total: 20 })

  async function criarTodos() {
    setLoading(true)
    setResults([])
    
    const usuarios: { tipo: 'passageiro' | 'motorista'; email: string; password: string; nome: string; cpf: string; telefone: string }[] = []

    // 10 passageiros
    for (let i = 1; i <= 10; i++) {
      usuarios.push({ tipo: 'passageiro', ...generateInfo('passageiro', i) })
    }

    // 10 motoristas
    for (let i = 1; i <= 10; i++) {
      usuarios.push({ tipo: 'motorista', ...generateInfo('motorista', i) })
    }

    setProgresso({ atual: 0, total: usuarios.length })
    const novosResults: typeof results = []

    for (let i = 0; i < usuarios.length; i++) {
      const u = usuarios[i]
      
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: u.email,
          password: u.password,
          options: { data: { nome_completo: u.nome, tipo: u.tipo } }
        })

        if (authError) {
          novosResults.push({ tipo: u.tipo, email: u.email, status: 'error', message: authError.message })
          setResults([...novosResults])
          setProgresso({ atual: i + 1, total: usuarios.length })
          continue
        }

        let userId: string

        if (!authData.session && authData.user) {
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email: u.email, password: u.password })
          if (loginError) {
            novosResults.push({ tipo: u.tipo, email: u.email, status: 'error', message: loginError.message })
            setResults([...novosResults])
            setProgresso({ atual: i + 1, total: usuarios.length })
            continue
          }
          userId = loginData.user!.id
        } else if (authData.user) {
          userId = authData.user.id
        } else {
          novosResults.push({ tipo: u.tipo, email: u.email, status: 'error', message: 'Usuário não criado' })
          setResults([...novosResults])
          setProgresso({ atual: i + 1, total: usuarios.length })
          continue
        }

        const { error: userError } = await supabase.from('usuarios').insert({
          id: userId,
          nome_completo: u.nome,
          email: u.email,
          cpf: u.cpf,
          telefone: u.telefone,
          tipo: u.tipo,
        })

        if (userError) {
          novosResults.push({ tipo: u.tipo, email: u.email, status: 'error', message: userError.message })
          setResults([...novosResults])
          setProgresso({ atual: i + 1, total: usuarios.length })
          continue
        }

        if (u.tipo === 'passageiro') {
          const { error: passError } = await supabase.from('passageiros').insert({ id: userId })
          if (passError) console.warn(passError)
        } else {
          const { error: motError } = await supabase.from('motoristas').insert({
            id: userId,
            status: 'aprovado',
            dados_veiculo: { modelo: 'Carro Teste', placa: `ABC-${String(i).padStart(4, '0')}`, ano: '2023', cor: 'Preto' }
          })
          if (motError) console.warn(motError)
        }

        novosResults.push({ tipo: u.tipo, email: u.email, status: 'ok', message: '✅ Criado com sucesso!' })
        setResults([...novosResults])
        setProgresso({ atual: i + 1, total: usuarios.length })
      } catch (err: any) {
        novosResults.push({ tipo: u.tipo, email: u.email, status: 'error', message: err.message || 'Erro desconhecido' })
        setResults([...novosResults])
        setProgresso({ atual: i + 1, total: usuarios.length })
      }
    }

    setLoading(false)
    const sucessos = novosResults.filter(r => r.status === 'ok').length
    toast.success(`${sucessos} de ${usuarios.length} usuários criados!`)
  }

  const sucessos = results.filter(r => r.status === 'ok').length
  const erros = results.filter(r => r.status === 'error').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] p-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/')} className="back-button-outline" type="button">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-xl font-bold text-white">Criar Usuários em Massa</h1>
        </div>

        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
              <Users size={24} className="text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-xs text-[#A0A0B0]">Passageiros</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 text-center">
              <Car size={24} className="text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-xs text-[#A0A0B0]">Motoristas</p>
            </div>
          </div>

          {loading && (
            <div className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Progresso</span>
                <span className="text-sm text-[#F4D03F]">{progresso.atual}/{progresso.total}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FFD966] to-[#F4D03F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(progresso.atual / progresso.total) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={criarTodos}
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Criando usuários...
              </>
            ) : (
              <>
                <Users size={20} />
                Criar 20 Usuários de Teste
              </>
            )}
          </motion.button>

          {results.length > 0 && (
            <div className="bg-[#0F0B1A] rounded-2xl border border-white/10 p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Resultados</h3>
                <div className="flex gap-3 text-xs">
                  <span className="text-green-400">✅ {sucessos}</span>
                  <span className="text-red-400">❌ {erros}</span>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-white/5 last:border-0">
                    {r.status === 'ok' 
                      ? <CheckCircle size={12} className="text-green-400 shrink-0" />
                      : <XCircle size={12} className="text-red-400 shrink-0" />
                    }
                    <span className="text-white/60 w-16 shrink-0">{r.tipo === 'passageiro' ? '🚶' : '🚗'}</span>
                    <span className="text-white/80 truncate flex-1">{r.email}</span>
                    {r.status === 'error' && <span className="text-red-400 truncate max-w-[120px]">{r.message}</span>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#A0A0B0] mt-3 text-center">
                Senha padrão: <strong className="text-white">Teste@123</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}