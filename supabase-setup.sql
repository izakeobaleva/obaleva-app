-- ============================================
-- LIMPAR TUDO E RECRIAR
-- ============================================

-- Limpar tabelas existentes
TRUNCATE TABLE passageiros CASCADE;
TRUNCATE TABLE motoristas CASCADE;
TRUNCATE TABLE usuarios CASCADE;
TRUNCATE TABLE corridas CASCADE;

-- Recriar estrutura (se necessário)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY,
  nome_completo TEXT,
  email TEXT UNIQUE,
  telefone TEXT,
  cpf TEXT,
  tipo TEXT DEFAULT 'passageiro',
  data_cadastro TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passageiros (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS motoristas (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pendente',
  online BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS corridas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passageiro_id UUID REFERENCES usuarios(id),
  motorista_id UUID REFERENCES usuarios(id),
  origem TEXT,
  destino TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CRIAR USUÁRIOS DE TESTE
-- ============================================

-- Usuário 1: Passageiro
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'passageiro@obaleva.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nome_completo":"João Passageiro"}',
  NOW(),
  NOW()
);

-- Usuário 2: Motorista
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'motorista@obaleva.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nome_completo":"Carlos Motorista"}',
  NOW(),
  NOW()
);

-- Usuário 3: Passageiro extra
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'teste@obaleva.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"nome_completo":"Maria Teste"}',
  NOW(),
  NOW()
);

-- ============================================
-- INSERIR NA TABELA USUARIOS
-- ============================================

INSERT INTO usuarios (id, nome_completo, email, tipo, data_cadastro)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'João Passageiro', 'passageiro@obaleva.com', 'passageiro', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Carlos Motorista', 'motorista@obaleva.com', 'motorista', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Maria Teste', 'teste@obaleva.com', 'passageiro', NOW());

-- ============================================
-- INSERIR NA TABELA PASSAGEIROS
-- ============================================

INSERT INTO passageiros (id) VALUES 
  ('11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333');

-- ============================================
-- INSERIR NA TABELA MOTORISTAS
-- ============================================

INSERT INTO motoristas (id, status, online) VALUES 
  ('22222222-2222-2222-2222-222222222222', 'aprovado', true);

-- ============================================
-- VERIFICAR
-- ============================================

SELECT 'Usuarios:' as tipo, COUNT(*) FROM usuarios
UNION ALL
SELECT 'Passageiros:', COUNT(*) FROM passageiros
UNION ALL
SELECT 'Motoristas:', COUNT(*) FROM motoristas;