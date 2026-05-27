import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { calcularPrecoCorrida } from '../lib/priceCalculator';

interface RideRequestParams {
  userId: string | undefined;
  origem: string;
  destino: string;
}

export function useRideRequest() {
  const [solicitando, setSolicitando] = useState(false);

  const solicitarCorrida = async ({ userId, origem, destino }: RideRequestParams) => {
    if (!destino) { toast.error('Digite o destino'); return false; }
    if (!userId) { toast.error('Faça login primeiro'); return false; }

    setSolicitando(true);
    const preco = calcularPrecoCorrida({ distanciaKm: 5.2, tempoMin: 15 });

    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: userId,
        origem: origem || 'Local atual',
        destino,
        status: 'pendente',
        valor: preco || 20,
      });
      if (error) throw error;
      toast.success('✅ Corrida solicitada! Aguardando motorista...');
      return true;
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
      return false;
    } finally {
      setSolicitando(false);
    }
  };

  return { solicitando, solicitarCorrida };
}