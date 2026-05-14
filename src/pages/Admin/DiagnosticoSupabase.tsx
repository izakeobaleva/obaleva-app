import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { Shield, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DiagnosticoSupabase() {
  const [checking, setChecking] = useState(true)
  const [results, setResults] = useState<{ label: string; status: 'ok' | 'warn' | 'error' | 'info'; message: string }[]>([])

  useEffect(() => {
    runChecks()
  }, [])

  async function runChecks() {
    setChecking(true)
    const checks: { label: string; status: 'ok' | 'warn' | 'error' | 'info'; message: string }[] = []

    // 1. Verificar se as env vars existem
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    checks.push({
      label: 'Variáveis de ambiente',
      status: supabaseUrl && supabaseKey ? 'ok' : 'error',
      message: supabaseUrl && supabaseKey 
        ? 'VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas'
        : 'Faltam variáveis de ambiente! Verifique o arquivo .env'
    })

    // 2. Testar signUp na prática
    try {
      const testEmail = `test_${Date.now()}@diagnostico.com`
      const { error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'Teste123456',
      })

      if (error) {
        if (error.message.includes('Signups not allowed') || error.message.includes('signup')) {
          checks.push({
            label: 'Permissão de cadastro',
            status: 'error',
            message: `❌ O Supabase está bloqueando novos cadastros!\n\nAcesse: Authentication → Providers → Email\nAtive "Allow new users to sign up" e desative "Confirm email"\nDepois clique em Save.`
          })
        } else {
          checks.push({
            label: 'Permissão de cadastro',
            status: 'warn',
            message: `⚠️ Erro ao testar: ${error.message}`
          })
        }
      } else {
        checks.push({
          label: 'Permissão de cadastro',
          status: 'ok',
          message: '✅ Cadastro de novos usuários está funcionando!'
        })
      }
    } catch (err: any) {
      checks.push({
        label: 'Teste de cadastro',
        status: 'error',
        message: `Erro: ${err.message}`
      })
    }

    setResults(checks)
    setChecking(false)
  }

  return (
    <div className="bg-[#1A1528] p-6 rounded-2xl border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield size={22} className="text-[#F4D03F]" />
          Diagnóstico Supabase
        </h2>
        <button onClick={runChecks} disabled={checking} className="btn-outline-dark p-2">
          <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
        </button>
      </div>

      {checking ? (
        <div className="text-center py-8 text-[#A0A0B0]">
          <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full mx-auto mb-4" />
          Verificando configurações...
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border ${
                r.status === 'ok' ? 'bg-green-900/20 border-green-500/30' :
                r.status === 'error' ? 'bg-red-900/20 border-red-500/30' :
                r.status === 'warn' ? 'bg-yellow-900/20 border-yellow-500/30' :
                'bg-blue-900/20 border-blue-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {r.status === 'ok' && <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />}
                {r.status === 'error' && <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />}
                {r.status === 'warn' && <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />}
                {r.status === 'info' && <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-medium ${
                    r.status === 'ok' ? 'text-green-400' :
                    r.status === 'error' ? 'text-red-400' :
                    r.status === 'warn' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>{r.label}</p>
                  <p className="text-sm text-white/70 mt-1 whitespace-pre-line">{r.message}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="mt-4 p-4 bg-[#0F0B1A] rounded-xl border border-white/10">
            <h3 className="text-white font-bold text-sm mb-2">📋 Passo a passo para resolver:</h3>
            <ol className="text-[#A0A0B0] text-sm space-y-2 list-decimal list-inside">
              <li>Acesse <strong className="text-white">https://supabase.com</strong> e faça login</li>
              <li>Selecione o projeto do ObaLeva</li>
              <li>Vá em <strong className="text-white">Authentication → Providers</strong></li>
              <li>Clique no provedor <strong className="text-white">Email</strong></li>
              <li><strong className="text-green-400">ATIVE</strong> "Allow new users to sign up"</li>
              <li><strong className="text-red-400">DESATIVE</strong> "Confirm email"</li>
              <li>Clique em <strong className="text-white">Save</strong></li>
              <li>Depois clique em <strong className="text-yellow-400">Restart</strong> aqui no app</li>
            </ol>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open('https://supabase.com', '_blank')}
            className="btn-premium px-6 py-3 w-full text-sm flex items-center justify-center gap-2"
          >
            <Shield size={18} />
            Abrir Painel Supabase
          </motion.button>
        </div>
      )}
    </div>
  )
}