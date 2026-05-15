import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { Shield, CheckCircle, AlertTriangle, Info, RefreshCw, ExternalLink, Copy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DiagnosticoCompleto() {
  const [checking, setChecking] = useState(true)
  const [results, setResults] = useState<{ 
    categoria: string; 
    label: string; 
    status: 'ok' | 'warn' | 'error' | 'info'; 
    message: string;
    acao?: string;
  }[]>([])

  useEffect(() => {
    runAllChecks()
  }, [])

  async function runAllChecks() {
    setChecking(true)
    const checks: typeof results = []

    // === 1. VERIFICACAO DAS VARIAVEIS DE AMBIENTE ===
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    checks.push({
      categoria: 'Variaveis de Ambiente',
      label: 'VITE_SUPABASE_URL',
      status: supabaseUrl ? 'ok' : 'error',
      message: supabaseUrl 
        ? `URL configurada: ${supabaseUrl.substring(0, 30)}...`
        : 'VITE_SUPABASE_URL nao encontrada no .env'
    })

    checks.push({
      categoria: 'Variaveis de Ambiente',
      label: 'VITE_SUPABASE_ANON_KEY',
      status: supabaseKey ? 'ok' : 'error',
      message: supabaseKey 
        ? `Chave configurada: ${supabaseKey.substring(0, 20)}...`
        : 'VITE_SUPABASE_ANON_KEY nao encontrada no .env'
    })

    // Verificar se a chave corresponde a documentacao
    const expectedKey = 'sb_publishable_pSXJ7pWJWlX8oe_wjujHnw_FO8K_Rp7'
    if (supabaseKey && supabaseKey !== expectedKey) {
      checks.push({
        categoria: 'Variaveis de Ambiente',
        label: 'Conformidade da chave',
        status: 'warn',
        message: `A chave atual difere da documentacao.\nAtual: ${supabaseKey.substring(0, 20)}...\nEsperado: ${expectedKey.substring(0, 20)}...\n\nRecomendado: atualizar o .env com a chave da documentacao.`,
        acao: 'Atualizar .env'
      })
    }

    // === 2. CONEXAO COM SUPABASE ===
    try {
      const startTime = performance.now()
      const { error } = await supabase.from('usuarios').select('id').limit(1)
      const duration = Math.round(performance.now() - startTime)

      if (error) throw error

      checks.push({
        categoria: 'Conexao Supabase',
        label: 'API Rest',
        status: 'ok',
        message: `Conexao estabelecida em ${duration}ms\nTabela "usuarios" acessivel`
      })
    } catch (err: any) {
      checks.push({
        categoria: 'Conexao Supabase',
        label: 'API Rest',
        status: 'error',
        message: `Erro: ${err.message || 'Nao foi possivel conectar ao Supabase'}`,
        acao: 'Verificar URL e chave no .env'
      })
    }

    // === 3. AUTENTICACAO (SIGNUP) ===
    try {
      const testEmail = `diag_${Date.now()}@teste.com`
      const { error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'Teste123456',
        options: { data: { nome_completo: 'Teste Diagnostico', tipo: 'passageiro' } }
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already')) {
          checks.push({
            categoria: 'Autenticacao',
            label: 'Cadastro de usuarios',
            status: 'ok',
            message: 'SignUp funcionando (email ja existe = normal)'
          })
        } else {
          checks.push({
            categoria: 'Autenticacao',
            label: 'Cadastro de usuarios',
            status: 'error',
            message: `Erro no signUp: ${error.message}\n\nVerifique no Supabase:\nAuthentication - Providers - Email\n"Allow new users to sign up" = ATIVADO\n"Confirm email" = DESATIVADO`,
            acao: 'Abrir Painel Supabase'
          })
        }
      } else {
        checks.push({
          categoria: 'Autenticacao',
          label: 'Cadastro de usuarios',
          status: 'ok',
          message: 'SignUp funcionando perfeitamente!'
        })
      }
    } catch (err: any) {
      checks.push({
        categoria: 'Autenticacao',
        label: 'Cadastro de usuarios',
        status: 'error',
        message: `Erro: ${err.message}`
      })
    }

    // === 4. GOOGLE OAUTH ===
    try {
      await supabase.auth.getSession()
      
      checks.push({
        categoria: 'Google OAuth',
        label: 'Provedor Google',
        status: 'info',
        message: `Nao e possivel verificar via API se o Google OAuth esta configurado.\n\nPara verificar manualmente:\n1. Acesse: https://supabase.com\n2. Selecione o projeto "obaleva"\n3. Va em Authentication - Providers\n4. Verifique se "Google" esta ATIVADO\n\nClient ID esperado:\n350779797269-bl1q3edhanact8e3a2jm7voni7ufs08k.apps.googleusercontent.com`,
        acao: 'Abrir Painel Supabase'
      })

      checks.push({
        categoria: 'Google OAuth',
        label: 'Botao Google no Login',
        status: 'info',
        message: 'O codigo possui botao "Continuar com Google" nas paginas:\n- Index.tsx (tela inicial)\n- Login.tsx (tela de login)\n\nEle chama: supabase.auth.signInWithOAuth({ provider: "google" })'
      })
    } catch (err: any) {
      checks.push({
        categoria: 'Google OAuth',
        label: 'Provedor Google',
        status: 'error',
        message: `Erro ao verificar: ${err.message}`
      })
    }

    // === 5. REDIRECT URLs ===
    checks.push({
      categoria: 'Supabase Config',
      label: 'Redirect URLs',
      status: 'info',
      message: `URLs que devem estar cadastradas no Supabase:\n\nAuthentication - URL Configuration:\n\nSite URL:\nhttps://www.obaleva.com.br\n\nRedirect URLs:\n* http://localhost:3000/**\n* http://localhost:32103/**\n* https://obaleva-oficial.vercel.app/**\n* https://www.obaleva.com.br/**\n* https://obaleva.com.br/**\n\nVerifique se estao todas cadastradas.`,
      acao: 'Abrir Painel Supabase'
    })

    setResults(checks)
    setChecking(false)
  }

  const sucessos = results.filter(r => r.status === 'ok').length
  const erros = results.filter(r => r.status === 'error').length
  const alertas = results.filter(r => r.status === 'warn').length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield size={22} className="text-[#F4D03F]" />
              Diagnostico Completo
            </h2>
            <p className="text-xs text-[#A0A0B0] mt-1">
              Verifica variaveis de ambiente, conexao Supabase e configuracoes
            </p>
          </div>
          <button
            onClick={runAllChecks}
            disabled={checking}
            className="btn-outline-dark p-2"
          >
            <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Resumo */}
        {!checking && results.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{sucessos}</p>
              <p className="text-xs text-green-300">OK</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{alertas}</p>
              <p className="text-xs text-yellow-300">Alertas</p>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{erros}</p>
              <p className="text-xs text-red-300">Erros</p>
            </div>
          </div>
        )}

        {checking ? (
          <div className="text-center py-12 text-[#A0A0B0]">
            <div className="animate-spin h-10 w-10 border-2 border-[#F4D03F] border-t-transparent rounded-full mx-auto mb-4" />
            <p>Executando diagnosticos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Agrupar por categoria */}
            {['Variaveis de Ambiente', 'Conexao Supabase', 'Autenticacao', 'Google OAuth', 'Supabase Config'].map(categoria => {
              const items = results.filter(r => r.categoria === categoria)
              if (items.length === 0) return null

              return (
                <div key={categoria}>
                  <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#F4D03F] rounded-full" />
                    {categoria}
                  </h3>
                  <div className="space-y-2">
                    {items.map((r, i) => (
                      <motion.div
                        key={`${categoria}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-4 rounded-xl border ${
                          r.status === 'ok' ? 'bg-green-900/15 border-green-500/20' :
                          r.status === 'error' ? 'bg-red-900/15 border-red-500/20' :
                          r.status === 'warn' ? 'bg-yellow-900/15 border-yellow-500/20' :
                          'bg-blue-900/15 border-blue-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {r.status === 'ok' && <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />}
                          {r.status === 'error' && <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />}
                          {r.status === 'warn' && <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />}
                          {r.status === 'info' && <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${
                              r.status === 'ok' ? 'text-green-400' :
                              r.status === 'error' ? 'text-red-400' :
                              r.status === 'warn' ? 'text-yellow-400' :
                              'text-blue-400'
                            }`}>{r.label}</p>
                            <p className="text-xs text-white/70 mt-1 whitespace-pre-line leading-relaxed">{r.message}</p>
                            
                            {r.acao && (
                              <button
                                onClick={() => {
                                  if (r.acao === 'Abrir Painel Supabase') {
                                    window.open('https://supabase.com', '_blank')
                                  } else if (r.acao === 'Atualizar .env') {
                                    navigator.clipboard.writeText('VITE_SUPABASE_ANON_KEY=sb_publishable_pSXJ7pWJWlX8oe_wjujHnw_FO8K_Rp7')
                                    toast.success('Chave copiada! Atualize seu .env')
                                  }
                                }}
                                className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
                              >
                                {r.acao === 'Abrir Painel Supabase' ? <ExternalLink size={12} /> : <Copy size={12} />}
                                {r.acao}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Google OAuth - Passo a passo */}
            <div className="mt-6 bg-[#0F0B1A] rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-bold text-sm mb-3">Como verificar o Google OAuth no Supabase:</h3>
              <ol className="text-[#A0A0B0] text-xs space-y-2 list-decimal list-inside">
                <li>Acesse <strong className="text-white">https://supabase.com</strong> e faça login</li>
                <li>Selecione o projeto <strong className="text-white">obaleva</strong></li>
                <li>Va em <strong className="text-white">Authentication - Providers</strong></li>
                <li>Clique no provedor <strong className="text-white">Google</strong></li>
                <li>Verifique se esta <strong className="text-green-400">ATIVADO</strong> (toggle verde)</li>
                <li>Confirme o <strong className="text-white">Client ID</strong>:
                  <code className="block bg-[#1A1528] text-[#F4D03F] p-2 rounded-lg mt-1 text-[10px] break-all">
                    350779797269-bl1q3edhanact8e3a2jm7voni7ufs08k.apps.googleusercontent.com
                  </code>
                </li>
                <li>Confirme o <strong className="text-white">Client Secret</strong>:
                  <code className="block bg-[#1A1528] text-[#F4D03F] p-2 rounded-lg mt-1 text-[10px] break-all">
                    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
                  </code>
                </li>
                <li>Clique em <strong className="text-white">Save</strong> se alterou algo</li>
              </ol>
            </div>

            {/* .env expected values */}
            <div className="mt-4 bg-[#0F0B1A] rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-bold text-sm mb-2">Valores esperados do .env:</h3>
              <div className="bg-[#1A1528] rounded-lg p-3 space-y-1">
                <code className="block text-[#F4D03F] text-xs">VITE_SUPABASE_URL=https://srhwsulafslydpiswpbf.supabase.co</code>
                <code className="block text-[#F4D03F] text-xs">VITE_SUPABASE_ANON_KEY=sb_publishable_pSXJ7pWJWlX8oe_wjujHnw_FO8K_Rp7</code>
              </div>
              <button
                onClick={() => {
                  const text = `VITE_SUPABASE_URL=https://srhwsulafslydpiswpbf.supabase.co\nVITE_SUPABASE_ANON_KEY=sb_publishable_pSXJ7pWJWlX8oe_wjujHnw_FO8K_Rp7`
                  navigator.clipboard.writeText(text)
                  toast.success('Conteudo do .env copiado!')
                }}
                className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
              >
                <Copy size={12} />
                Copiar .env
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}