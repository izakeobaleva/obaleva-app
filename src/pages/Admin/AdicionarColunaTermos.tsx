import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import { Database, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdicionarColunaTermos() {
  const [executando, setExecutando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const executarSQL = async () => {
    setExecutando(true);
    setResultado(null);

    try {
      // Tenta adicionar a coluna usando o cliente do Supabase
      const { error } = await supabase.rpc('adicionar_coluna_termos');
      
      if (error) {
        // Se a RPC não existir, tenta via SQL direto
        setResultado(
          'Para adicionar a coluna, execute este SQL no Supabase:\n\n' +
          '```sql\n' +
          'ALTER TABLE usuarios\n' +
          'ADD COLUMN IF NOT EXISTS termos_aceitos BOOLEAN DEFAULT FALSE;\n\n' +
          'ALTER TABLE usuarios\n' +
          'ADD COLUMN IF NOT EXISTS termos_aceito_em TIMESTAMP WITH TIME ZONE;\n\n' +
          'ALTER TABLE usuarios\n' +
          'ADD COLUMN IF NOT EXISTS termos_versao TEXT DEFAULT \'1.0\';\n' +
          '```'
        );
      } else {
        toast.success('Colunas adicionadas com sucesso!');
        setResultado('✅ Colunas adicionadas!');
      }
    } catch (err: any) {
      setResultado(`Erro: ${err.message}`);
    }
    setExecutando(false);
  };

  return (
    <div className="bg-[#1A1528] p-6 rounded-2xl border border-white/10 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
        <Database size={22} className="text-[#F4D03F]" />
        Adicionar Colunas de Termos
      </h2>

      <div className="bg-[#0F0B1A] rounded-xl p-4 border border-yellow-500/30 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 text-sm font-medium">Banco precisa ser atualizado</p>
            <p className="text-[#A0A0B0] text-xs mt-1">
              Para o sistema de termos funcionar, é necessário adicionar as colunas na tabela <strong className="text-white">usuarios</strong> do Supabase.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={executarSQL}
        disabled={executando}
        className="btn-premium px-6 py-3 w-full text-sm"
      >
        {executando ? 'Executando...' : '🔧 Tentar adicionar colunas'}
      </button>

      {resultado && (
        <div className="mt-4 bg-[#0F0B1A] rounded-xl p-4 border border-white/10">
          <p className="text-white text-xs whitespace-pre-line">{resultado}</p>
          {resultado.includes('ALTER TABLE') && (
            <div className="mt-3">
              <p className="text-[#A0A0B0] text-xs mb-2">
                Copie o SQL acima e execute no SQL Editor do Supabase
              </p>
              <button
                onClick={() => {
                  const sql = `ALTER TABLE usuarios\nADD COLUMN IF NOT EXISTS termos_aceitos BOOLEAN DEFAULT FALSE;\n\nALTER TABLE usuarios\nADD COLUMN IF NOT EXISTS termos_aceito_em TIMESTAMP WITH TIME ZONE;\n\nALTER TABLE usuarios\nADD COLUMN IF NOT EXISTS termos_versao TEXT DEFAULT '1.0';`;
                  navigator.clipboard.writeText(sql);
                  toast.success('SQL copiado!');
                }}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition"
              >
                📋 Copiar SQL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}