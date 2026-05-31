-- ============================================
-- CONFIGURAÇÃO DO BUCKET AVATARS
-- ============================================

-- 1. Criar bucket avatars se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- ============================================
-- POLÍTICAS DE SEGURANÇA (RLS) DO BUCKET
-- ============================================

-- 2. Política: Qualquer um pode ver imagens (público)
DROP POLICY IF EXISTS "Imagens públicas - leitura" ON storage.objects;
CREATE POLICY "Imagens públicas - leitura"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 3. Política: Usuário autenticado pode fazer upload
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Política: Usuário pode atualizar apenas suas próprias imagens
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias imagens" ON storage.objects;
CREATE POLICY "Usuários podem atualizar suas próprias imagens"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Política: Usuário pode deletar apenas suas próprias imagens
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias imagens" ON storage.objects;
CREATE POLICY "Usuários podem deletar suas próprias imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);