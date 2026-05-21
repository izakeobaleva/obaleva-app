-- ============================================
-- SQL COMPLETO - FUNCIONALIDADES DO MOTORISTA
-- ============================================

-- 1. Colunas necessárias na tabela motoristas
ALTER TABLE motoristas ADD COLUMN IF NOT EXISTS online BOOLEAN DEFAULT false;
ALTER TABLE motoristas ADD COLUMN IF NOT EXISTS ultima_localizacao JSONB;
ALTER TABLE motoristas ADD COLUMN IF NOT EXISTS ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_motoristas_online ON motoristas(online);
CREATE INDEX IF NOT EXISTS idx_corridas_status ON corridas(status);
CREATE INDEX IF NOT EXISTS idx_corridas_motorista ON corridas(motorista_id);

-- 3. Habilitar Realtime
ALTER TABLE corridas REPLICA IDENTITY FULL;
ALTER TABLE motoristas REPLICA IDENTITY FULL;

-- 4. Função Haversine para calcular distância entre coordenadas
CREATE OR REPLACE FUNCTION calcular_distancia_km(lat1 DECIMAL, lng1 DECIMAL, lat2 DECIMAL, lng2 DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371;
  dlat DECIMAL := RADIANS(lat2 - lat1);
  dlng DECIMAL := RADIANS(lng2 - lng1);
  a DECIMAL := SIN(dlat/2)^2 + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlng/2)^2;
  c DECIMAL := 2 * ASIN(SQRT(a));
BEGIN
  RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- 5. Função para buscar motoristas próximos (RPC)
CREATE OR REPLACE FUNCTION buscar_motoristas_proximos(
  passageiro_lat DECIMAL,
  passageiro_lng DECIMAL,
  raio_km DECIMAL DEFAULT 10
)
RETURNS TABLE(
  motorista_id UUID,
  nome_completo TEXT,
  distancia_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    u.nome_completo,
    ROUND(calcular_distancia_km(passageiro_lat, passageiro_lng, 
      (m.ultima_localizacao->>'lat')::DECIMAL, 
      (m.ultima_localizacao->>'lng')::DECIMAL)::DECIMAL, 2) as distancia_km
  FROM motoristas m
  JOIN usuarios u ON u.id = m.id
  WHERE m.online = true
    AND m.ultima_localizacao IS NOT NULL
    AND calcular_distancia_km(passageiro_lat, passageiro_lng,
      (m.ultima_localizacao->>'lat')::DECIMAL,
      (m.ultima_localizacao->>'lng')::DECIMAL) <= raio_km
  ORDER BY distancia_km ASC;
END;
$$ LANGUAGE plpgsql;

-- 6. Função para auto-aceitar corrida (para testes)
CREATE OR REPLACE FUNCTION auto_aceitar_corrida()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'buscando_motorista' THEN
    PERFORM pg_sleep(3);
    UPDATE corridas
    SET motorista_id = (SELECT id FROM motoristas WHERE online = true LIMIT 1),
        status = 'motorista_em_rota',
        updated_at = NOW()
    WHERE id = NEW.id AND status = 'buscando_motorista';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Remover trigger antigo e criar novo
DROP TRIGGER IF EXISTS auto_aceitar_corrida_trigger ON corridas;
CREATE TRIGGER auto_aceitar_corrida_trigger
  AFTER INSERT ON corridas
  FOR EACH ROW
  EXECUTE FUNCTION auto_aceitar_corrida();

-- 8. Políticas RLS para motoristas
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "motoristas_select_policy" ON motoristas;
CREATE POLICY "motoristas_select_policy" ON motoristas
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "motoristas_update_policy" ON motoristas;
CREATE POLICY "motoristas_update_policy" ON motoristas
  FOR UPDATE USING (auth.uid() = id);