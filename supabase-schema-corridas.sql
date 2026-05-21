-- ============================================
-- ESQUEMA COMPLETO PARA CORRIDAS - OBALEVALe
-- ============================================

-- 1. Adicionar colunas na tabela motoristas (se não existirem)
ALTER TABLE motoristas ADD COLUMN IF NOT EXISTS online BOOLEAN DEFAULT false;
ALTER TABLE motoristas ADD COLUMN IF NOT EXISTS ultima_localizacao JSONB;

-- 2. Garantir que a tabela corridas existe
CREATE TABLE IF NOT EXISTS corridas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passageiro_id UUID REFERENCES usuarios(id),
  motorista_id UUID REFERENCES usuarios(id),
  origem TEXT NOT NULL,
  origem_lat DECIMAL(10,8),
  origem_lng DECIMAL(11,8),
  destino TEXT NOT NULL,
  destino_lat DECIMAL(10,8),
  destino_lng DECIMAL(11,8),
  distancia_km DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  status TEXT DEFAULT 'buscando_motorista',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_corridas_status ON corridas(status);
CREATE INDEX IF NOT EXISTS idx_corridas_passageiro ON corridas(passageiro_id);
CREATE INDEX IF NOT EXISTS idx_corridas_motorista ON corridas(motorista_id);
CREATE INDEX IF NOT EXISTS idx_motoristas_online ON motoristas(online);

-- 4. Políticas RLS para a tabela corridas
ALTER TABLE corridas ENABLE ROW LEVEL SECURITY;

-- Passageiros podem ver suas próprias corridas
DROP POLICY IF EXISTS "Passageiros veem suas corridas" ON corridas;
CREATE POLICY "Passageiros veem suas corridas" ON corridas
  FOR SELECT
  USING (auth.uid() = passageiro_id);

-- Motoristas podem ver corridas pendentes
DROP POLICY IF EXISTS "Motoristas veem corridas pendentes" ON corridas;
CREATE POLICY "Motoristas veem corridas pendentes" ON corridas
  FOR SELECT
  USING (status = 'buscando_motorista' OR motorista_id = auth.uid());

-- Usuários autenticados podem inserir corridas (como passageiro)
DROP POLICY IF EXISTS "Usuários podem inserir corridas" ON corridas;
CREATE POLICY "Usuários podem inserir corridas" ON corridas
  FOR INSERT
  WITH CHECK (auth.uid() = passageiro_id);

-- Motorista pode atualizar corridas que aceitou
DROP POLICY IF EXISTS "Motorista atualiza corridas" ON corridas;
CREATE POLICY "Motorista atualiza corridas" ON corridas
  FOR UPDATE
  USING (motorista_id = auth.uid() OR passageiro_id = auth.uid())
  WITH CHECK (motorista_id = auth.uid() OR passageiro_id = auth.uid());

-- 5. Habilitar Realtime para a tabela corridas (via dashboard do Supabase)

-- 6. Trigger para auto-aceitar corrida (opcional, para testes)
-- Remove se não quiser auto-aceitação
CREATE OR REPLACE FUNCTION auto_accept_ride()
RETURNS TRIGGER AS $$
DECLARE
  motorista_aleatorio UUID;
BEGIN
  IF NEW.status = 'buscando_motorista' THEN
    -- Encontra um motorista online aleatório
    SELECT id INTO motorista_aleatorio
    FROM motoristas
    WHERE online = true
    ORDER BY RANDOM()
    LIMIT 1;
    
    IF motorista_aleatorio IS NOT NULL THEN
      -- Aguarda 3 segundos (simula tempo de resposta)
      PERFORM pg_sleep(3);
      
      UPDATE corridas
      SET motorista_id = motorista_aleatorio,
          status = 'motorista_em_rota',
          updated_at = NOW()
      WHERE id = NEW.id AND status = 'buscando_motorista';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_accept_ride_trigger ON corridas;
CREATE TRIGGER auto_accept_ride_trigger
  AFTER INSERT ON corridas
  FOR EACH ROW
  WHEN (NEW.status = 'buscando_motorista')
  EXECUTE FUNCTION auto_accept_ride();

-- 7. Função para calcular distância (pode ser usada no frontend)
CREATE OR REPLACE FUNCTION calcular_tarifa_km(distancia_km DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN 3.00 + (distancia_km * 2.50);
END;
$$ LANGUAGE plpgsql;