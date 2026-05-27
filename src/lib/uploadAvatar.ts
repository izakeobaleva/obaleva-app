import { supabase } from './supabaseClient';

/**
 * Faz upload de uma imagem de avatar para o Supabase Storage
 * @param userId - ID do usuário
 * @param file - Arquivo de imagem selecionado
 * @returns URL pública da imagem
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // Valida o tipo do arquivo
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecione apenas imagens (JPG, PNG, etc.)');
  }

  // Valida o tamanho (máx 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error(`Imagem muito grande! Máximo 5MB (enviou ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
  }

  // Gera nome único: userId/timestamp_nome_aleatorio.ext
  const fileExt = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const fileName = `${userId}/${timestamp}_${random}.${fileExt}`;

  // Faz upload para o bucket 'avatars'
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true, // Sobrescreve se já existir
    });

  if (error) {
    console.error('Erro no upload:', error);
    throw new Error(error.message || 'Erro ao fazer upload da imagem');
  }

  // Obtém a URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Remove um avatar antigo do Storage
 * @param userId - ID do usuário
 * @param url - URL completa da imagem antiga (opcional)
 */
export async function deleteOldAvatar(userId: string, url?: string | null) {
  if (!url) return;
  
  try {
    // Extrai o path da URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // O path no storage é: avatars/userId/arquivo
    const bucketIndex = pathParts.findIndex(p => p === 'avatars');
    if (bucketIndex >= 0) {
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      await supabase.storage.from('avatars').remove([filePath]);
    }
  } catch (err) {
    // Se não conseguir remover, apenas ignora (não é crítico)
    console.warn('Não foi possível remover avatar antigo:', err);
  }
}