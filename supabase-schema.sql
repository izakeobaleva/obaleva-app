-- Tabela de notificações do sistema
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now(),
  lida BOOLEAN DEFAULT false,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE
);

-- Tabela de configurações do app (se já não existir)
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir configurações padrão
INSERT INTO public.app_config (key, value) VALUES
  ('tarifa_base', '4'),
  ('tarifa_km', '2.5'),
  ('tarifa_min', '0.4'),
  ('multiplicador_pico', '1.2'),
  ('taxa_plataforma', '20'),
  ('horario_inicio_pico', '07:00'),
  ('horario_fim_pico', '09:00'),
  ('suporte_email', 'suporte@obaleva.com'),
  ('versao_app', '1.0.0')
ON CONFLICT (key) DO NOTHING;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON public.notificacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created ON public.notificacoes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corridas_status ON public.corridas(status);
CREATE INDEX IF NOT EXISTS idx_corridas_created ON public.corridas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corridas_motorista ON public.corridas(motorista_id);
CREATE INDEX IF NOT EXISTS idx_corridas_passageiro ON public.corridas(passageiro_id);

-- Política de segurança para notificações
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar notificações" 
  ON public.notificacoes FOR ALL 
  USING (auth.uid() IN (SELECT id FROM public.usuarios WHERE tipo = 'admin'));

CREATE POLICY "Usuários podem ver suas notificações" 
  ON public.notificacoes FOR SELECT 
  USING (usuario_id = auth.uid() OR usuario_id IS NULL);