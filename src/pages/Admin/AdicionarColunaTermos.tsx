"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import { Database, AlertTriangle, CheckCircle, Copy, ExternalLink } from 'lucide-react';

export default function AdicionarColunaTermos() {
  const [executando, setExecutando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const executarSQL = async () => {
    setExecutando(true);
    setResultado(null);

    try {
      // Tenta executar a RPC que criamos
      const { data, error } = await supabase.rpc('adicionar_colunas_termos');
      
      if (error) {
        // Se a RPC não existir, mostra o SQL para criar manualmente
        setResultado('⚠️ Função RPC não encontrada. Siga os passos abaixo.');
        toast.error('Crie a função RPC primeiro no SQL Editor do Supabase');
        return;
      }
      
      toast.success('✅ ' + data);
      setResultado(data);
      
      // Recarregar após 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err: any) {
      setResultado('Erro: ' + (err.message || 'Erro desconhecido'));
      toast.error('Erro ao executar');
    }
    setExecutando(false);
  };

  const sqlParaCriar = `CREATE OR REPLACE FUNCTION adicionar_colunas_termos()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS termos_aceitos BOOLEAN DEFAULT FALSE;
  ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS termos_aceito_em TIMESTAMP WITH TIME ZONE;
  ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS termos_versao TEXT DEFAULT '1.0';
  RETURN 'Colunas adicionadas com sucesso!';
END;
$$;`;

  const copiarSQL = () => {
    navigator.clipboard.writeText(sqlParaCriar);
    setCopiado(true);
    toast.success('SQL copiado!');
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="bg-[#1A1528] p-6 rounded-2xl border border-white/10 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
        <Database size={22} className="text-[#F4D03F]" />
        Configurar Colunas de Termos
      </h2>

      <div className="bg-[#0F0B1A] rounded-xl p-4 border border-yellow-500/30 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 text-sm font-medium">Banco precisa ser atualizado</p>
            <p className="text-[#A0A0B0] text-xs mt-1">
              Para o sistema de termos funcionar, é necessário criar uma função RPC no Supabase e depois executá-la.
            </p>
          </div>
        </div>
      </div>

      {/* Passo 1: Criar a função */}
      <div className="mb-4">
        <h3 className="text-white font-bold text-sm mb-2">📋 Passo 1: Criar a função no Supabase</h3>
        <div className="bg-[#0F0B1A] rounded-xl p-4 border border-white/10 mb-3">
          <p className="text-xs text-[#A0A0B0] mb-2">
            Copie o SQL abaixo e cole no <strong className="text-white">SQL Editor</strong> do Supabase, depois clique em <strong className="text-white">Run</strong>:
          </p>
          <pre className="text-xs text-[#F4D03F] bg-black/50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{sqlParaCriar}</pre>
          <button
            onClick={copiarSQL}
            className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Copy size={12} />
            {copiado ? 'Copiado!' : 'Copiar SQL'}
          </button>
        </div>
        <button
          onClick={() => window.open('https://supabase.com', '_blank')}
          className="text-xs bg-[#F4D03F]/10 text-[#F4D03F] px-3 py-1.5 rounded-xl hover:bg-[#F4D03F]/20 transition flex items-center gap-1.5"
        >
          <ExternalLink size={12} />
          Abrir Supabase
        </button>
      </div>

      {/* Passo 2: Executar a função */}
      <div className="mb-4">
        <h3 className="text-white font-bold text-sm mb-2">🚀 Passo 2: Executar a função</h3>
        <p className="text-xs text-[#A0A0B0] mb-2">
          Depois de criar a função no SQL Editor, clique no botão abaixo para executá-la:
        </p>
        <button
          onClick={executarSQL}
          disabled={executando}
          className="btn-premium px-6 py-3 w-full text-sm"
        >
          {executando ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Executando...
            </span>
          ) : (
            '▶️ Executar função'
          )}
        </button>
      </div>

      {resultado && (
        <div className="mt-4 bg-[#0F0B1A] rounded-xl p-4 border border-white/10">
          <div className="flex items-start gap-2">
            {resultado.includes('sucesso') ? (
              <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            )}
            <p className="text-white text-xs whitespace-pre-line">{resultado}</p>
          </div>
        </div>
      )}
    </div>
  );
}