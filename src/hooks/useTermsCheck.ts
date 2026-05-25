import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useTermsCheck(userId: string | undefined) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setHasAcceptedTerms(null);
      setLoading(false);
      return;
    }

    const checkTerms = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('termos_aceitos, termos_aceito_em')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;

        // Verificar se já aceitou e se a aceitação foi recente (últimos 6 meses)
        if (data?.termos_aceitos && data?.termos_aceito_em) {
          const aceitoEm = new Date(data.termos_aceito_em);
          const seisMesesAtras = new Date();
          seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
          
          setHasAcceptedTerms(aceitoEm > seisMesesAtras);
        } else {
          setHasAcceptedTerms(false);
        }
      } catch (err) {
        console.error('Erro ao verificar termos:', err);
        setHasAcceptedTerms(false);
      }
      setLoading(false);
    };

    checkTerms();
  }, [userId]);

  return { hasAcceptedTerms, loading };
}