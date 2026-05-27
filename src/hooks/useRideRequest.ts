import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface RideRequestParams {
  userId: string | undefined;
  origem: string;
  destino: string;
  origemLat?: number;
  origemLng?: number;
  destinoLat?: number;
  destinoLng?: number;
}

export function useRideRequest() {
  const [solicitando, setSolicitando] = useState(false);
  const [precoEstimado, setPrecoEstimado] = useState<number | null>(null);
  const [distanciaKm, setDistanciaKm] = useState<number | null>(null);
  const [tempoMin, setTempoMin] = useState<number | null>(null);

  // Calcular preço usando Google Distance Matrix API
  const calcularPreco = async (origem: string, destino: string) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !origem || !destino) {
      setPrecoEstimado(null);
      setDistanciaKm(null);
      setTempoMin(null);
      return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origem)}&destinations=${encodeURIComponent(destino)}&key=${apiKey}&units=metric&language=pt-BR`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK' || !data.rows[0]?.elements[0]) {
        setPrecoEstimado(null);
        return;
      }

      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        setPrecoEstimado(null);
        return;
      }

      const distanciaMetros = element.distance.value;
      const distanciaKm = distanciaMetros / 1000;
      const tempoSegundos = element.duration.value;
      const tempoMin = Math.round(tempoSegundos / 60);

      // Cálculo do preço: R$ 3,00 base + R$ 2,50 por km + R$ 0,40 por minuto
      const precoBase = 3.0;
      const precoPorKm = 2.5;
      const precoPorMin = 0.4;
      
      const preco = precoBase + (distanciaKm * precoPorKm) + (tempoMin * precoPorMin);

      setDistanciaKm(parseFloat(distanciaKm.toFixed(2)));
      setTempoMin(tempoMin);
      setPrecoEstimado(parseFloat(preco.toFixed(2)));

    } catch (err) {
      console.error('Erro ao calcular preço:', err);
      setPrecoEstimado(null);
    }
  };

  const solicitarCorrida = async ({ userId, origem, destino }: RideRequestParams) => {
    if (!destino) { toast.error('Digite o destino'); return false; }
    if (!userId) { toast.error('Faça login primeiro'); return false; }

    setSolicitando(true);

    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: userId,
        origem: origem || 'Local atual',
        destino,
        status: 'pendente',
        valor: precoEstimado || 20,
        distancia_km: distanciaKm,
        tempo_min: tempoMin,
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

  return { solicitando, precoEstimado, distanciaKm, tempoMin, solicitarCorrida, calcularPreco };
}