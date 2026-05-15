import type { TestResult } from './TestRunner'
import { ResultadoItem } from './ResultadoItem'

interface ListaCategoriasProps {
  results: TestResult[]
}

export function ListaCategorias({ results }: ListaCategoriasProps) {
  const categorias = [...new Set(results.map(r => r.categoria))]

  return (
    <div className="space-y-6">
      {categorias.map(categoria => {
        const items = results.filter(r => r.categoria === categoria)
        return (
          <div key={categoria}>
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#F4D03F] rounded-full" />
              {categoria}
            </h3>
            <div className="space-y-2">
              {items.map((r, i) => (
                <ResultadoItem key={`${categoria}-${r.nome}`} resultado={r} index={i} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}