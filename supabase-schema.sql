-- =============================================
-- TABELA DE CORRIDAS
-- =============================================
CREATE TABLE IF NOT EXISTS public.corridas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  passageiro_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  motorista_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  origem TEXT NOT NULL,
  origem_lat DECIMAL(10, 7),
  origem_lng DECIMAL(10, 7),
  destino TEXT NOT NULL,
  destino_lat DECIMAL(10, 7),
  destino_lng DECIMAL(10, 7),
  distancia_km DECIMAL(6, 2) DEFAULT 0,
  valor_total DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'motorista_em_rota', 'motorista_chegou', 'em_andamento', 'finalizada', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_corridas_passageiro ON public.corridas(passageiro_id);
CREATE INDEX IF NOT EXISTS idx_corridas_motorista ON public.corridas(motorista_id);
CREATE INDEX IF NOT EXISTS idx_corridas_status ON public.corridas(status);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_corridas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_corridas_updated_at
  BEFORE UPDATE ON public.corridas
  FOR EACH ROW
  EXECUTE FUNCTION update_corridas_updated_at();

-- =============================================
-- POLÍTICAS RLS (Row Level Security)
-- =============================================
ALTER TABLE public.corridas ENABLE ROW LEVEL SECURITY;

-- Passageiro pode criar corridas
CREATE POLICY "Passageiros podem inserir corridas"
  ON public.corridas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = passageiro_id);

-- Ver a própria corrida (passageiro ou motorista)
CREATE POLICY "Ver corridas próprias"
  ON public.corridas FOR SELECT
  TO authenticated
  USING (auth.uid() = passageiro_id OR auth.uid() = motorista_id);

-- Motoristas podem ver corridas pendentes
CREATE POLICY "Motoristas podem ver corridas pendentes"
  ON public.corridas FOR SELECT
  TO authenticated
  USING (status = 'pendente');

-- Motorista pode aceitar/atualizar
CREATE POLICY "Motorista pode atualizar corrida"
  ON public.corridas FOR UPDATE
  TO authenticated
  USING (status IN ('pendente', 'aceita', 'motorista_em_rota', 'motorista_chegou', 'em_andamento'))
  WITH CHECK (auth.uid() = motorista_id);

-- Passageiro pode cancelar a própria corrida pendente
CREATE POLICY "Passageiro pode cancelar"
  ON public.corridas FOR UPDATE
  TO authenticated
  USING (auth.uid() = passageiro_id AND status = 'pendente')
  WITH CHECK (status = 'cancelada');

-- =============================================
-- TABELA DE AVALIAÇÕES
-- =============================================
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corrida_id UUID NOT NULL REFERENCES public.corridas(id) ON DELETE CASCADE,
  avaliador_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  avaliado_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA DE NOTIFICAÇÕES
-- =============================================
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT DEFAULT 'geral',
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA DE CONFIGURAÇÕES DO APP
-- =============================================
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);