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

export async function solicitarCorrida(passageiro_id: string, origem: Location, destino: Location): Promise<Ride | null> {
  try {
    const distanciaKm = calcularDistancia(origem.lat, origem.lng, destino.lat, destino.lng);
    const valorTotal = calcularValor(distanciaKm);

    console.log('📝 Solicitando corrida...', { pass: passageiro_id, origem: origem.address, destino: destino.address });

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

    console.log('✅ Corrida criada:', data.id);

    // Simular busca de motorista
    simularBuscaMotorista(data.id);

    return data;
  } catch (error) {
    console.error('❌ Erro ao solicitar corrida:', error);
    throw error;
  }
}

async function simularBuscaMotorista(corridaId: string) {
  try {
    console.log('🔍 Buscando motoristas disponíveis...');
    
    const { data: motoristas, error } = await supabase
      .from('motoristas')
      .select('id, status, online')
      .eq('status', 'aprovado')
      .limit(1);

    console.log('📊 Motoristas encontrados:', motoristas);

    if (error) {
      console.error('❌ Erro ao buscar motoristas:', error);
      return;
    }

    if (motoristas && motoristas.length > 0) {
      console.log('✅ Motorista encontrado! ID:', motoristas[0].id, 'Status:', motoristas[0].status, 'Online:', motoristas[0].online);
      
      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('corridas')
          .update({
            motorista_id: motoristas[0].id,
            status: 'motorista_em_rota'
          })
          .eq('id', corridaId);

        if (updateError) {
          console.error('❌ Erro ao associar motorista:', updateError);
        } else {
          console.log('✅ Motorista atribuído à corrida!');
        }
      }, 3000);
    } else {
      console.log('⚠️ Nenhum motorista aprovado disponível.');
      console.log('💡 Dica: Verifique se existe um motorista com status = "aprovado" na tabela motoristas');
    }
  } catch (err) {
    console.warn('⚠️ Erro ao simular busca de motorista:', err);
  }
}

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