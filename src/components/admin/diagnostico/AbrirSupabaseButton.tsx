import { ExternalLink } from 'lucide-react'

export function AbrirSupabaseButton() {
  return (
    <div className="mt-8 pt-4 border-t border-white/10">
      <button
        onClick={() => window.open('https://supabase.com', '_blank')}
        className="btn-premium px-6 py-3 w-full text-sm flex items-center justify-center gap-2"
      >
        <ExternalLink size={18} />
        Abrir Painel Supabase para configurações manuais
      </button>
    </div>
  )
}