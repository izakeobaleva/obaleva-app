-- Script SQL completo para o OBALEVA
-- Execute no SQL Editor do Supabase

-- Tabela de usuários (unificada)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  nome_completo TEXT NOT NULL,
  cpf TEXT,
  telefone TEXT,
  email TEXT,
  tipo TEXT CHECK (tipo IN ('passageiro', 'motorista', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de passageiros
CREATE TABLE IF NOT EXISTS passageiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES usuarios(id),
  total_corridas INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de motoristas
CREATE TABLE IF NOT EXISTS motoristas (
  id UUID PRIMARY KEY REFERENCES usuarios(id),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'reprovado', 'suspenso')),
  documentos_urls JSONB DEFAULT '{}',
  dados_veiculo JSONB DEFAULT '{}',
  conta_bancaria_pix TEXT,
  avaliacao_media DECIMAL(2,1) DEFAULT 0,
  total_corridas INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de corridas
CREATE TABLE IF NOT EXISTS corridas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passageiro_id UUID REFERENCES usuarios(id),
  motorista_id UUID REFERENCES usuarios(id),
  origem TEXT NOT NULL,
  destino TEXT NOT NULL,
  valor DECIMAL(10,2),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'em_andamento', 'finalizada', 'cancelada')),
  metodo_pagamento TEXT,
  distancia_km DECIMAL(10,2),
  tempo_min INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corrida_id UUID REFERENCES corridas(id),
  avaliador_id UUID REFERENCES usuarios(id),
  avaliado_id UUID REFERENCES usuarios(id),
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corrida_id UUID REFERENCES corridas(id),
  motorista_id UUID REFERENCES usuarios(id),
  valor DECIMAL(10,2),
  taxa_plataforma DECIMAL(10,2) DEFAULT 0,
  valor_liquido DECIMAL(10,2),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'concluido', 'cancelado')),
  metodo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de solicitações de saque
CREATE TABLE IF NOT EXISTS saques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorista_id UUID REFERENCES usuarios(id),
  valor DECIMAL(10,2),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'concluido')),
  chave_pix TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de aluguel de veículos
CREATE TABLE IF NOT EXISTS alugueis_veiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motorista_id UUID REFERENCES usuarios(id),
  veiculo_placa TEXT,
  veiculo_modelo TEXT,
  data_inicio DATE,
  data_fim DATE,
  valor_diaria DECIMAL(10,2),
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'finalizado', 'cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas de segurança RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE passageiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE motoristas ENABLE ROW LEVEL SECURITY;
ALTER TABLE corridas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE saques ENABLE ROW LEVEL SECURITY;
ALTER TABLE alugueis_veiculos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver seus próprios dados" ON usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os usuários" ON usuarios
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND tipo = 'admin')
  );

-- Políticas para corridas
CREATE POLICY "Passageiros veem suas corridas" ON corridas
  FOR SELECT USING (auth.uid() = passageiro_id);

CREATE POLICY "Motoristas veem corridas atribuídas" ON corridas
  FOR SELECT USING (auth.uid() = motorista_id);

CREATE POLICY "Admins veem todas as corridas" ON corridas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND tipo = 'admin')
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_corridas_updated_at
  BEFORE UPDATE ON corridas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();