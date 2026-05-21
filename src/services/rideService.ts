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
  passageiro_nome?: string;
  distancia_motorista?: number;
}

// ========== CÁLCULO DE PREÇO ==========

export async function calcularDistanciaPreco(origem: Location, destino: Location): Promise<{ distancia_km: number; valor_total: number }> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origem.lat},${origem.lng}&destinations=${destino.lat},${destino.lng}&key=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK' || data.rows[0].elements[0].status !== 'OK') throw new Error('Erro ao calcular rota');
  const distancia_km = data.rows[0].elements[0].distance.value / 1000;
  const valor_total = 3.0 + distancia_km * 2.5;
  return { distancia_km: parseFloat(distancia_km.toFixed(2)), valor_total: parseFloat(valor_total.toFixed(2)) };
}

// ========== PASSAGEIRO ==========

export async function solicitarCorrida(passageiro_id: string, origem: Location, destino: Location): Promise<Ride> {
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
}

export async function buscarCorridaAtiva(passageiroId: string): Promise<Ride | null> {
  const { data } = await supabase
    .from('corridas')
    .select('*')
    .eq('passageiro_id', passageiroId)
    .in('status', ['buscando_motorista', 'motorista_em_rota', 'motorista_chegou', 'em_andamento'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export function subscribeToRide(corridaId: string, callback: (ride: Ride) => void) {
  return supabase
    .channel(`corrida_${corridaId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'corridas', filter: `id=eq.${corridaId}` }, (payload) => callback(payload.new as Ride))
    .subscribe();
}

export function subscribeToRideInsert(passageiroId: string, callback: (ride: Ride) => void) {
  return supabase
    .channel(`minha_corrida_${passageiroId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corridas', filter: `passageiro_id=eq.${passageiroId}` }, (payload) => callback(payload.new as Ride))
    .subscribe();
}

export async function cancelarCorrida(corridaId: string): Promise<boolean> {
  const { error } = await supabase.from('corridas').update({ status: 'cancelada' }).eq('id', corridaId);
  return !error;
}

// ========== MOTORISTA ==========

export async function buscarSolicitacoesPendentes(): Promise<Ride[]> {
  const { data } = await supabase
    .from('corridas')
    .select('*')
    .eq('status', 'buscando_motorista')
    .order('created_at', { ascending: true });
  return data || [];
}

export function subscribeToNewRides(callback: (ride: Ride) => void) {
  return supabase
    .channel('novas_corridas')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corridas', filter: 'status=eq.buscando_motorista' }, (payload) => callback(payload.new as Ride))
    .subscribe();
}

export async function aceitarCorrida(corridaId: string, motoristaId: string): Promise<boolean> {
  const { error } = await supabase
    .from('corridas')
    .update({ motorista_id: motoristaId, status: 'motorista_em_rota', updated_at: new Date().toISOString() })
    .eq('id', corridaId)
    .eq('status', 'buscando_motorista');
  return !error;
}

export async function iniciarCorrida(corridaId: string): Promise<boolean> {
  const { error } = await supabase.from('corridas').update({ status: 'em_andamento', updated_at: new Date().toISOString() }).eq('id', corridaId);
  return !error;
}

export async function finalizarCorrida(corridaId: string): Promise<boolean> {
  const { error } = await supabase.from('corridas').update({ status: 'finalizada', updated_at: new Date().toISOString() }).eq('id', corridaId);
  return !error;
}

export async function atualizarLocalizacaoMotorista(motoristaId: string, lat: number, lng: number): Promise<boolean> {
  const { error } = await supabase
    .from('motoristas')
    .update({ ultima_localizacao: { lat, lng }, ultima_atualizacao: new Date().toISOString() })
    .eq('id', motoristaId);
  return !error;
}

export function subscribeToMotoristaLocation(motoristaId: string, callback: (lat: number, lng: number) => void) {
  return supabase
    .channel(`motorista_loc_${motoristaId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'motoristas', filter: `id=eq.${motoristaId}` }, (payload) => {
      const loc = payload.new.ultima_localizacao;
      if (loc?.lat && loc?.lng) callback(loc.lat, loc.lng);
    })
    .subscribe();
}