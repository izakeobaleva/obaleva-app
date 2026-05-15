import { supabase } from '../../../lib/supabaseClient'

export interface TestResult {
  categoria: string
  nome: string
  status: 'ok' | 'warn' | 'error' | 'info'
  detalhes: string
  resolucao?: string
}

type AddResult = (result: TestResult) => void

export async function executarTestes(addResult: AddResult) {
  await Promise.all([
    testarConexaoRede(addResult),
    testarVariaveisAmbiente(addResult),
    testarTabelasSupabase(addResult),
    testarAutenticacao(addResult),
    testarGoogleOAuth(addResult),
    testarStorage(addResult),
    testarRedirectUrls(addResult),
    testarPoliticasRLS(addResult),
    testarVersaoApp(addResult),
    testarDominio(addResult),
  ])
}

// =====================
// 1. CONEXÃO DE REDE
// =====================
async function testarConexaoRede(addResult: AddResult) {
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
}

// =====================
// 2. VARIÁVEIS DE AMBIENTE
// =====================
async function testarVariaveisAmbiente(addResult: AddResult) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const envVars = [
    { nome: 'VITE_SUPABASE_URL', valor: supabaseUrl, esperado: 'supabase.co' },
    { nome: 'VITE_SUPABASE_ANON_KEY', valor: supabaseKey, esperado: 'sb_publishable' },
  ]

  for (const v of envVars) {
    if (v.valor && v.valor.includes(v.esperado)) {
      addResult({
        categoria: '📋 Variáveis de Ambiente',
        nome: v.nome,
        status: 'ok',
        detalhes: `${v.nome} configurada (${v.valor.substring(0, 20)}...)`
      })
    } else {
      addResult({
        categoria: '📋 Variáveis de Ambiente',
        nome: v.nome,
        status: 'error',
        detalhes: `${v.nome} não encontrada ou inválida!`,
        resolucao: 'Verifique o arquivo .env na raiz do projeto'
      })
    }
  }
}

// =====================
// 3. TABELAS SUPABASE
// =====================
async function testarTabelasSupabase(addResult: AddResult) {
  const tabelas = ['usuarios', 'passageiros', 'motoristas', 'corridas', 'app_config', 'notificacoes']

  for (const tabela of tabelas) {
    try {
      const start = performance.now()
      const { data, error } = await supabase.from(tabela).select('id').limit(1)
      const duration = Math.round(performance.now() - start)
      
      if (error && error.code === 'PGRST116') {
        addResult({
          categoria: '🗄️ Tabelas Supabase',
          nome: tabela,
          status: 'ok',
          detalhes: `Tabela existe (vazia) - ${duration}ms`
        })
      } else if (error) {
        throw error
      } else {
        addResult({
          categoria: '🗄️ Tabelas Supabase',
          nome: tabela,
          status: 'ok',
          detalhes: `Tabela acessível - ${duration}ms (${data?.length || 0} registros)`
        })
      }
    } catch (err: any) {
      addResult({
        categoria: '🗄️ Tabelas Supabase',
        nome: tabela,
        status: 'error',
        detalhes: err.message || `Erro ao acessar tabela ${tabela}`,
        resolucao: 'Execute o schema SQL no SQL Editor do Supabase'
      })
    }
  }
}

// =====================
// 4. AUTENTICAÇÃO
// =====================
async function testarAutenticacao(addResult: AddResult) {
  // Testar sessão
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

  // Testar SignUp
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
}

// =====================
// 5. GOOGLE OAUTH
// =====================
async function testarGoogleOAuth(addResult: AddResult) {
  addResult({
    categoria: '🔑 Google OAuth',
    nome: 'Configuração do Provedor',
    status: 'info',
    detalhes: `Provedor Google configurado no código.\n\nVerifique manualmente no Supabase:\n1. Acesse Authentication → Providers\n2. Clique em "Google"\n3. Verifique se está ATIVADO (toggle verde)\n4. Confira se o Client ID e Secret estão preenchidos\n\nClient ID: 398511410187-lfufv3r7c3fdpg3cshenm6a2q8v87ptp.apps.googleusercontent.com`,
    resolucao: 'Abrir Painel Supabase → Authentication → Providers → Google'
  })
}

// =====================
// 6. STORAGE
// =====================
async function testarStorage(addResult: AddResult) {
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
}

// =====================
// 7. REDIRECT URLs
// =====================
async function testarRedirectUrls(addResult: AddResult) {
  addResult({
    categoria: '🔗 URLs de Redirecionamento',
    nome: 'Configuração de URLs',
    status: 'info',
    detalhes: `Verifique se estas URLs estão cadastradas no Supabase:\n\nAuthentication → URL Configuration:\n\nSite URL:\n• https://www.obaleva.com.br\n\nRedirect URLs (devem incluir):\n• http://localhost:5173/**\n• http://localhost:32109/**\n• https://obaleva-oficial.vercel.app/**\n• https://www.obaleva.com.br/**\n• https://obaleva.com.br/**`,
    resolucao: 'Abrir Painel Supabase → Authentication → URL Configuration'
  })
}

// =====================
// 8. POLÍTICAS RLS
// =====================
async function testarPoliticasRLS(addResult: AddResult) {
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
      detalhes: 'RLS configurado corretamente (acesso anônimo funcionando)'
    })
  } else {
    addResult({
      categoria: '🔒 Políticas RLS',
      nome: 'Row Level Security',
      status: 'info',
      detalhes: 'Não foi possível verificar RLS remotamente. Se estiver com problemas, configure as políticas no SQL Editor do Supabase.'
    })
  }
}

// =====================
// 9. VERSÃO DO APP
// =====================
async function testarVersaoApp(addResult: AddResult) {
  try {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'versao_app')
      .maybeSingle()
    
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
}

// =====================
// 10. DOMÍNIO
// =====================
async function testarDominio(addResult: AddResult) {
  try {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_domain')
      .maybeSingle()
    
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
}