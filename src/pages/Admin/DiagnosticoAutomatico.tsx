import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { DiagnosticoHeader } from '../../components/admin/diagnostico/DiagnosticoHeader'
import { ProgressBar } from '../../components/admin/diagnostico/ProgressBar'
import { ResumoCards } from '../../components/admin/diagnostico/ResumoCards'
import { ListaCategorias } from '../../components/admin/diagnostico/ListaCategorias'
import { AbrirSupabaseButton } from '../../components/admin/diagnostico/AbrirSupabaseButton'
import { executarTestes, type TestResult } from '../../components/admin/diagnostico/TestRunner'

export default function DiagnosticoAutomatico() {
  const [checking, setChecking] = useState(true)
  const [results, setResults] = useState<TestResult[]>([])

  useEffect(() => {
    executarTodosTestes()
  }, [])

  async function executarTodosTestes() {
    setChecking(true)
    setResults([])
    
    const testResults: TestResult[] = []

    const addResult = (result: TestResult) => {
      testResults.push(result)
      setResults([...testResults])
    }

    await executarTestes(addResult)

    setChecking(false)

    const totalErros = testResults.filter(r => r.status === 'error').length
    const totalAlertas = testResults.filter(r => r.status === 'warn').length
    
    if (totalErros === 0) {
      toast.success(`✅ Diagnóstico concluído! ${testResults.length} testes, ${totalErros} erros, ${totalAlertas} alertas`)
    } else {
      toast.error(`⚠️ Diagnóstico concluído com ${totalErros} erro(s) e ${totalAlertas} alerta(s)`)
    }
  }

  const totais = { ok: 0, warn: 0, error: 0, info: 0 }
  results.forEach(r => { totais[r.status]++ })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6">
        <DiagnosticoHeader 
          checking={checking}
          totalTestes={results.length}
          onRefresh={executarTodosTestes}
        />

        <ProgressBar visible={checking} total={results.length} />
        <ResumoCards totais={totais} loading={checking} />

        {checking && results.length === 0 ? (
          <div className="text-center py-12 text-[#A0A0B0]">
            <div className="animate-spin h-10 w-10 border-2 border-[#F4D03F] border-t-transparent rounded-full mx-auto mb-4" />
            <p>Iniciando testes...</p>
          </div>
        ) : (
          <ListaCategorias results={results} />
        )}

        <AbrirSupabaseButton />
      </div>
    </div>
  )
}