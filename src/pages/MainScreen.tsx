import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car } from 'lucide-react';

export const MainScreen = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 Iniciando verificação...");
    
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("✅ Supabase conectado!", data);
        setLoading(false);
      } catch (err: any) {
        console.error("❌ Erro:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    testSupabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-4 animate-spin">
            <Car size={32} className="text-[#F4D03F]" />
          </div>
          <p className="text-white text-lg">Carregando...</p>
          <p className="text-gray-500 text-sm mt-2">Verificando conexão...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center p-4">
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-400 text-lg font-bold">❌ Erro de conexão</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 rounded-lg text-white"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="bg-green-500/20 border border-green-500 rounded-xl p-6 max-w-md text-center">
        <Car size={48} className="text-green-400 mx-auto mb-4" />
        <p className="text-green-400 text-lg font-bold">✅ App funcionando!</p>
        <p className="text-gray-400 text-sm mt-2">Supabase conectado com sucesso!</p>
        <p className="text-white text-xs mt-4">Próximo passo: adicionar tela de login</p>
      </div>
    </div>
  );
};