import { supabase } from '../lib/supabaseClient';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RideRequest {
  origem: Location;
  destino: Location;
  passageiro_id: string;
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

// Calcular distância entre dois pontos (fórmula de Haversine)
function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dlat = (lat2 - lat1) * Math.PI / 180;
  const dlng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dlng/2) * Math.sin(dlng/2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return R * c;
}

// Calcular valor da corrida baseado na distância
function calcularValor(distanciaKm: number): number {
  const valorPorKm = 2.50;
  const taxaBase = 3.00;
  return parseFloat((taxaBase + (distanciaKm * valorPorKm)).toFixed(2));
}

// Solicitar nova corrida
export async function solicitarCorrida(passageiro_id: string, origem: Location, destino: Location): Promise<Ride | null> {
  try {
    const distanciaKm = calcularDistancia(origem.lat, origem.lng, destino.lat, destino.lng);
    const valorTotal = calcularValor(distanciaKm);

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
        distancia_km: distanciaKm,
        valor_total: valorTotal,
        status: 'buscando_motorista'
      })
      .select()
      .single();

    if (error) throw error;

    // Simular busca de motorista (opcional — não trava se falhar)
    simularBuscaMotorista(data.id);

    return data;
  } catch (error) {
    console.error('Erro ao solicitar corrida:', error);
    throw error;
  }
}

// Simular busca por motorista (tenta encontrar, mas não trava)
async function simularBuscaMotorista(corridaId: string) {
  try {
    const { data: motoristas } = await supabase
      .from('motoristas')
      .select('id')
      .eq('status', 'aprovado')
      .limit(1);

    if (motoristas && motoristas.length > 0) {
      setTimeout(async () => {
        await supabase
          .from('corridas')
          .update({
            motorista_id: motoristas[0].id,
            status: 'motorista_em_rota'
          })
          .eq('id', corridaId);
      }, 3000);
    } else {
      // Se não tiver motorista, mantém como "buscando_motorista"
      console.log('⚠️ Nenhum motorista disponível. Corrida aguardando...');
    }
  } catch (err) {
    console.warn('⚠️ Erro ao simular busca de motorista:', err);
  }
}

// Cancelar corrida
export async function cancelarCorrida(corridaId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('corridas')
      .update({ status: 'cancelada' })
      .eq('id', corridaId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao cancelar corrida:', error);
    return false;
  }
}

// Buscar corrida ativa do passageiro
export async function buscarCorridaAtiva(passageiroId: string): Promise<Ride | null> {
  try {
    const { data, error } = await supabase
      .from('corridas')
      .select('*')
      .eq('passageiro_id', passageiroId)
      .in('status', ['buscando_motorista', 'motorista_em_rota', 'motorista_chegou', 'em_andamento'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar corrida ativa:', error);
    return null;
  }
}

// Atualizar status da corrida (via subscription)
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