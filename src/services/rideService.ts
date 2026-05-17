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

function calcularValor(distanciaKm: number): number {
  const valorPorKm = 2.50;
  const taxaBase = 3.00;
  return parseFloat((taxaBase + (distanciaKm * valorPorKm)).toFixed(2));
}

// ============================================
// SOLICITAR CORRIDA (VERSÃO DE TESTE)
// ============================================
export async function solicitarCorrida(passageiro_id: string, origem: Location, destino: Location): Promise<Ride | null> {
  try {
    const distanciaKm = calcularDistancia(origem.lat, origem.lng, destino.lat, destino.lng);
    const valorTotal = calcularValor(distanciaKm);

    console.log('📝 Solicitando corrida (teste)...', { pass: passageiro_id, origem: origem.address, destino: destino.address });

    // Inserir corrida já com motorista (teste automático)
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
        status: 'motorista_em_rota',  // Já começa com motorista a caminho
        motorista_id: passageiro_id   // Usa o próprio passageiro como motorista (teste)
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Corrida criada (modo teste):', data.id, 'Status:', data.status);
    return data;
  } catch (error) {
    console.error('❌ Erro ao solicitar corrida:', error);
    throw error;
  }
}

// ============================================
// CANCELAR CORRIDA
// ============================================
export async function cancelarCorrida(corridaId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('corridas')
      .update({ status: 'cancelada' })
      .eq('id', corridaId);
    
    if (error) throw error;
    console.log('✅ Corrida cancelada:', corridaId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao cancelar corrida:', error);
    return false;
  }
}

// ============================================
// BUSCAR CORRIDA ATIVA
// ============================================
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
    console.error('❌ Erro ao buscar corrida ativa:', error);
    return null;
  }
}

// ============================================
// INSCREVER EM ATUALIZAÇÕES DA CORRIDA
// ============================================
export function subscribeToRide(corridaId: string, callback: (ride: Ride) => void) {
  console.log('🔔 Inscrevendo para atualizações da corrida:', corridaId);
  
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
        console.log('🔄 Atualização recebida:', payload.new.status);
        callback(payload.new as Ride);
      }
    )
    .subscribe();

  return subscription;
}