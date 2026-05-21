import { supabase } from '../lib/supabaseClient';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Ride {
  id: string;
  passageiro_id: string;
  motorista_id?: string;
  origem: string;
  origem_lat: number;
  origem_lng: number;
  destino: string;
  destino_lat: number;
  destino_lng: number;
  distancia_km: number;
  valor_total: number;
  status: 'buscando_motorista' | 'motorista_em_rota' | 'motorista_chegou' | 'em_andamento' | 'finalizada' | 'cancelada';
  created_at: string;
}

// Calcular distância e preço usando Google Distance Matrix API
export async function calcularDistanciaPreco(origem: Location, destino: Location): Promise<{ distancia_km: number; valor_total: number }> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const origins = `${origem.lat},${origem.lng}`;
  const destinations = `${destino.lat},${destino.lng}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error('Erro ao calcular distância');
    }

    const element = data.rows[0].elements[0];
    if (element.status !== 'OK') {
      throw new Error('Rota não encontrada');
    }

    const distancia_km = element.distance.value / 1000;
    const valor_total = 3.0 + (distancia_km * 2.5);
    return { distancia_km: parseFloat(distancia_km.toFixed(2)), valor_total: parseFloat(valor_total.toFixed(2)) };
  } catch (error) {
    console.error('Erro ao calcular distância/preço:', error);
    throw error;
  }
}

// Solicitar corrida
export async function solicitarCorrida(passageiro_id: string, origem: Location, destino: Location): Promise<Ride | null> {
  try {
    const { distancia_km, valor_total } = await calcularDistanciaPreco(origem, destino);

    const { data, error } = await supabase
      .from('corridas')
      .insert({
        passageiro_id,
        origem: origem.address,
        origem_lat: origem.lat,
        origem_lng: origem.lng,
        destino: destino.address,
        destino_lat: destino.lat,
        destino_lng: destino.lng,
        distancia_km,
        valor_total,
        status: 'buscando_motorista'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao solicitar corrida:', error);
    throw error;
  }
}

// Buscar corrida ativa do passageiro
export async function buscarCorridaAtiva(passageiroId: string): Promise<Ride | null> {
  const { data, error } = await supabase
    .from('corridas')
    .select('*')
    .eq('passageiro_id', passageiroId)
    .in('status', ['buscando_motorista', 'motorista_em_rota', 'motorista_chegou', 'em_andamento'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar corrida ativa:', error);
    return null;
  }
  return data as Ride | null;
}

// Inscrever para atualizações da corrida (Supabase Realtime)
export function subscribeToRide(corridaId: string, callback: (ride: Ride) => void) {
  const subscription = supabase
    .channel(`corrida_${corridaId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'corridas',
        filter: `id=eq.${corridaId}`
      },
      (payload) => {
        callback(payload.new as Ride);
      }
    )
    .subscribe();

  return subscription;
}

// Cancelar corrida
export async function cancelarCorrida(corridaId: string): Promise<boolean> {
  const { error } = await supabase
    .from('corridas')
    .update({ status: 'cancelada' })
    .eq('id', corridaId);

  if (error) {
    console.error('Erro ao cancelar corrida:', error);
    return false;
  }
  return true;
}