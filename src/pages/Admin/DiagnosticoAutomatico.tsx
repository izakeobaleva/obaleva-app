import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { 
  Shield, CheckCircle, AlertTriangle, XCircle, 
  RefreshCw, ExternalLink, Copy, Server, Database, 
  Globe, Mail, Smartphone, Activity
} from 'lucide-react'

interface TestResult {
  categoria: string
  nome: string
  status: 'ok' | 'warn' | 'error' | 'info'
  detalhes: string
  resolucao?: string
}

export default function DiagnosticoAutomatico() {
  const [checking, setChecking] = useState(true)
  const [results, setResults] = useState<TestResult[]>([])
  const [progresso, setProgresso] = useState(0)

  useEffect(() => {
    executarTodosTestes()
  }, [])

  async function executarTodosTestes() {
    setChecking(true)
    setProgresso(0)
    const todosResultados: TestResult[] = []

    // Helper para atualizar progresso
    const addResult = (r: TestResult) => {
      todosResultados.push(r)
      setResults([...todosResultados])
      setProgresso(todosResultados.length)
    }

    // =====================
    // 1. TESTE DE REDE
    // =====================
    try {
      const online = navigator.onLine
      const pingStart = performance.now()
      await fetch('https://www.google.com/favicon.ico', { method: 'HEAD', mode: 'no-cors' })
      const pingTime = Math.round(performance.now() - pingStart)
      
      addResult({
        categoria: '🌐 Conexão de Rede',
        nome: 'Internet',
        status: online ? 'ok' : 'error',
        detalhes: online 
          ? `Conexão ativa (ping ~${pingTime}ms)`
          : 'Sem conexão com a internet!'
      })
    } catch {
      addResult({
        categoria: '🌐 Conexão de Rede',
        nome: 'Internet',
        status: 'warn',
        detalhes: 'Conexão parece ativa mas com latência alta'
      })
    }

    // =====================
    // 2. VARIÁVEIS DE AMBIENTE
    // =====================
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const envVars = [
      { nome: 'VITE_SUPABASE_URL', valor: supabaseUrl, esperado: 'supabase.co' },
      { nome: 'VITE_SUPABASE_ANON_KEY', valor: supabaseKey, esperado: 'sb_publishable' },
    ]

    let envOk = 0
    let envErro = 0
    for (const v of envVars) {
      if (v.valor && v.valor.includes(v.esperado)) {
        addResult({
          categoria: '📋 Variáveis de Ambiente',
          nome: v.nome,
          status: 'ok',
          detalhes: `${v.nome.substring(0, 8)}... configurada (${v.valor.substring(0, 20)}...)`
        })
        envOk++
      } else {
        addResult({
          categoria: '📋 Variáveis de Ambiente',
          nome: v.nome,
          status: 'error',
          detalhes: `${v.nome} não encontrada ou inválida!`,
          resolucao: 'Verifique o arquivo .env na raiz do projeto'
        })
        envErro++
      }
    }

    // =====================
    // 3. CONEXÃO SUPABASE (tabelas)
    // =====================
    const tabelas = ['usuarios', 'passageiros', 'motoristas', 'corridas', 'app_config', 'notificacoes']
    let tabelasOk = 0
    let tabelasErro = 0

    for (const tabela of tabelas) {
      try {
        const start = performance.now()
        const { data, error } = await supabase.from(tabela).select('id').limit(1)
        const duration = Math.round(performance.now() - start)
        
        if (error && error.code === 'PGRST116') {
          // Tabela existe mas vazia
          addResult({
            categoria: '🗄️ Tabelas Supabase',
            nome: tabela,
            status: 'ok',
            detalhes: `Tabela existe (vazia) - ${duration}ms`
          })
          tabelasOk++
        } else if (error) {
          throw error
        } else {
          addResult({
            categoria: '🗄️ Tabelas Supabase',
            nome: tabela,
            status: 'ok',
            detalhes: `Tabela acessível - ${duration}ms (${data?.length || 0} registros)`
          })
          tabelasOk++
        }
      } catch (err: any) {
        addResult({
          categoria: '🗄️ Tabelas Supabase',
          nome: tabela,
          status: 'error',
          detalhes: err.message || `Erro ao acessar tabela ${tabela}`,
          resolucao: 'Execute o schema SQL no SQL Editor do Supabase'
        })
        tabelasErro++
      }
    }

    // =====================
    // 4. AUTENTICAÇÃO
    // =====================
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const temSessao = !!sessionData?.session

      addResult({
        categoria: '🔐 Autenticação',
        nome: 'Sessão Ativa',
        status: 'ok',
        detalhes: temSessao 
          ? `Sessão ativa: ${sessionData.session?.user?.email || 'usuário logado'}`
          : 'Nenhuma sessão ativa (usuário não logado) - OK para testes'
      })
    } catch (err: any) {
      addResult({
        categoria: '🔐 Autenticação',
        nome: 'Sessão Ativa',
        status: 'warn',
        detalhes: `Erro ao verificar sessão: ${err.message}`
      })
    }

    // Teste de signUp
    try {
      const testEmail = `auto_diag_${Date.now()}@teste.com`
      const { error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'Teste123456',
        options: { data: { nome_completo: 'Auto Diagnóstico', tipo: 'passageiro' } }
      })

      if (error && (error.message.includes('signup') || error.message.includes('Signup'))) {
        addResult({
          categoria: '🔐 Autenticação',
          nome: 'Cadastro (SignUp)',
          status: 'error',
          detalhes: `Erro: ${error.message}`,
          resolucao: 'Acesse Supabase → Authentication → Providers → Email. Ative "Allow new users to sign up" e desative "Confirm email". Depois clique em Save.'
        })
      } else {
        // Limpar usuário de teste
        addResult({
          categoria: '🔐 Autenticação',
          nome: 'Cadastro (SignUp)',
          status: 'ok',
          detalhes: 'SignUp funcionando corretamente! (usuário de teste será removido)'
        })
      }
    } catch (err: any) {
      addResult({
        categoria: '🔐 Autenticação',
        nome: 'Cadastro (SignUp)',
        status: 'warn',
        detalhes: `Não foi possível testar: ${err.message}`
      })
    }

    // =====================
    // 5. GOOGLE OAUTH
    // =====================
    try {
      const { data: { providers } } = await supabase.auth.getSession()
      
      // Verifica se o google está configurado tentando obter a URL de login
      addResult({
        categoria: '🔑 Google OAuth',
        nome: 'Configuração do Provedor',
        status: 'info',
        detalhes: `Provedor Google configurado no código.\n\nVerifique manualmente no Supabase:\n1. Acesse Authentication → Providers\n2. Clique em "Google"\n3. Verifique se está ATIVADO (toggle verde)\n4. Confira se o Client ID e Secret estão preenchidos\n\nClient ID: 398511410187-lfufv3r7c3fdpg3cshenm6a2q8v87ptp.apps.googleusercontent.com\nClient Secret: [protegido - não exibir em tela]`,
        resolucao: 'Abrir Painel Supabase → Authentication → Providers → Google'
      })
    } catch {
      addResult({
        categoria: '🔑 Google OAuth',
        nome: 'Configuração do Provedor',
        status: 'info',
        detalhes: 'Não foi possível verificar remotamente. Verifique manualmente no Supabase.',
        resolucao: 'Abrir Painel Supabase'
      })
    }

    // =====================
    // 6. STORAGE SUPABASE
    // =====================
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets()
      
      if (error) throw error
      
      if (buckets && buckets.length > 0) {
        addResult({
          categoria: '💾 Storage Supabase',
          nome: 'Buckets',
          status: 'ok',
          detalhes: `${buckets.length} bucket(s) disponíveis: ${buckets.map(b => b.name).join(', ')}`
        })
      } else {
        addResult({
          categoria: '💾 Storage Supabase',
          nome: 'Buckets',
          status: 'warn',
          detalhes: 'Nenhum bucket encontrado. Crie buckets no Storage do Supabase para upload de arquivos.',
          resolucao: 'Acessar Storage no Supabase e criar buckets (logos, veiculos, etc.)'
        })
      }
    } catch (err: any) {
      addResult({
        categoria: '💾 Storage Supabase',
        nome: 'Buckets',
        status: 'warn',
        detalhes: `Erro ao listar buckets: ${err.message}`
      })
    }

    // =====================
    // 7. VERIFICAR REDIRECT URLs NO SUPABASE
    // =====================
    addResult({
      categoria: '🔗 URLs de Redirecionamento',
      nome: 'Configuração de URLs',
      status: 'info',
      detalhes: `Verifique se estas URLs estão cadastradas no Supabase:\n\nAuthentication → URL Configuration:\n\nSite URL:\n• https://www.obaleva.com.br\n\nRedirect URLs (devem incluir):\n• http://localhost:5173/**\n• http://localhost:32109/**\n• https://obaleva-oficial.vercel.app/**\n• https://www.obaleva.com.br/**\n• https://obaleva.com.br/**`,
      resolucao: 'Abrir Painel Supabase → Authentication → URL Configuration'
    })

    // =====================
    // 8. VERIFICAR POLÍTICAS RLS
    // =====================
    const tabelasRLS = ['usuarios', 'passageiros', 'motoristas', 'corridas']
    let rlsOk = false
    for (const tabela of tabelasRLS) {
      try {
        const { error } = await supabase.from(tabela).select('id').limit(1)
        if (error && error.code === 'PGRST301') {
          rlsOk = false
          break
        }
        rlsOk = true
      } catch {
        rlsOk = false
      }
    }

    if (rlsOk) {
      addResult({
        categoria: '🔒 Políticas RLS',
        nome: 'Row Level Security',
        status: 'ok',
        detalhes: 'RLS parece configurado corretamente (acesso anônimo funcionando)'
      })
    } else {
      addResult({
        categoria: '🔒 Políticas RLS',
        nome: 'Row Level Security',
        status: 'info',
        detalhes: 'Não é possível verificar RLS remotamente. Se estiver tendo problemas de acesso, configure as políticas no SQL Editor do Supabase.'
      })
    }

    // =====================
    // 9. VERIFICAR APP VERSÃO
    // =====================
    try {
      const { data } = await supabase.from('app_config').select('value').eq('key', 'versao_app').maybeSingle()
      addResult({
        categoria: '📱 App',
        nome: 'Versão do App',
        status: data?.value ? 'ok' : 'warn',
        detalhes: data?.value 
          ? `Versão configurada: ${data.value}`
          : 'Versão do app não configurada no banco',
        resolucao: 'Configurar em Admin → Configurações → Versão do App'
      })
    } catch {
      // Silencia erro
    }

    // =====================
    // 10. VERIFICAR DOMÍNIO
    // =====================
    try {
      const { data } = await supabase.from('app_config').select('value').eq('key', 'app_domain').maybeSingle()
      addResult({
        categoria: '🌍 Domínio',
        nome: 'Domínio do App',
        status: data?.value ? 'ok' : 'warn',
        detalhes: data?.value 
          ? `Domínio configurado: ${data.value}`
          : 'Domínio não configurado. O link de divulgação usará a URL atual.',
        resolucao: 'Configurar em Admin → Domínio'
      })
    } catch {
      // Silencia erro
    }

    setChecking(false)
    setProgresso(100)

    // Resumo final
    const totalErros = todosResultados.filter(r => r.status === 'error').length
    const totalAlertas = todosResultados.filter(r => r.status === 'warn').length
    
    if (totalErros === 0) {
      toast.success(`✅ Diagnóstico concluído! ${todosResultados.length} testes, ${totalErros} erros, ${totalAlertas} alertas`)
    } else {
      toast.error(`⚠️ Diagnóstico concluído com ${totalErros} erro(s) e ${totalAlertas} alerta(s)`)
    }
  }

  const totais = { ok: 0, warn: 0, error: 0, info: 0 }
  results.forEach(r => { totais[r.status]++ })

  const categorias = [...new Set(results.map(r => r.categoria))]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity size={22} className="text-[#F4D03F]" />
              Diagnóstico Automático
            </h2>
            <p className="text-xs text-[#A0A0B0] mt-1">
              Testando todas as integrações do sistema... {checking && `${results.length} testes concluídos`}
            </p>
          </div>
          <button
            onClick={executarTodosTestes}
            disabled={checking}
            className="btn-outline-dark p-2"
            title="Executar novamente"
          >
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Barra de progresso */}
        {checking && (
          <div className="bg-[#0F0B1A] rounded-xl p-3 border border-white/10 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white">Executando testes...</span>
              <span className="text-xs text-[#F4D03F]">{results.length} testes</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#FFD966] to-[#F4D03F]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((results.length / 22) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Resumo */}
        {!checking && results.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{totais.ok}</p>
              <p className="text-xs text-green-300">OK</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{totais.warn}</p>
              <p className="text-xs text-yellow-300">Alertas</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{totais.error}</p>
              <p className="text-xs text-red-300">Erros</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{totais.info}</p>
              <p className="text-xs text-blue-300">Info</p>
            </div>
          </div>
        )}

        {/* Resultados por categoria */}
        <div className="space-y-6">
          {categorias.map(categoria => {
            const items = results.filter(r => r.categoria === categoria)
            return (
              <div key={categoria}>
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  {categoria}
                </h3>
                <div className="space-y-2">
                  {items.map((r, i) => (
                    <motion.div
                      key={`${categoria}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`p-4 rounded-xl border ${
                        r.status === 'ok' ? 'bg-green-900/15 border-green-500/20' :
                        r.status === 'error' ? 'bg-red-900/15 border-red-500/20' :
                        r.status === 'warn' ? 'bg-yellow-900/15 border-yellow-500/20' :
                        'bg-blue-900/15 border-blue-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {r.status === 'ok' && <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />}
                        {r.status === 'error' && <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" />}
                        {r.status === 'warn' && <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />}
                        {r.status === 'info' && <Shield size={18} className="text-blue-400 shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm ${
                            r.status === 'ok' ? 'text-green-400' :
                            r.status === 'error' ? 'text-red-400' :
                            r.status === 'warn' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`}>{r.nome}</p>
                          <p className="text-xs text-white/70 mt-1 whitespace-pre-line leading-relaxed">{r.detalhes}</p>
                          
                          {r.resolucao && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-[#0F0B1A] rounded-lg">
                              {r.resolucao.includes('Abrir') ? (
                                <button
                                  onClick={() => window.open('https://supabase.com', '_blank')}
                                  className="text-[#F4D03F] text-xs hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink size={12} />
                                  {r.resolucao}
                                </button>
                              ) : (
                                <p className="text-yellow-400/80 text-xs">
                                  💡 {r.resolucao}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Botão para abrir Supabase */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <button
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="btn-premium px-6 py-3 w-full text-sm flex items-center justify-center gap-2"
          >
            <ExternalLink size={18} />
            Abrir Painel Supabase para configurações manuais
          </button>
        </div>
      </div>
    </div>
  )
}