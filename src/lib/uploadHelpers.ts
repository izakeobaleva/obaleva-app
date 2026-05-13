import { supabase } from './supabaseClient';

export async function uploadFile(
  bucket: string,
  file: File,
  pathPrefix: string = ''
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${pathPrefix}${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;
  
  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}

export async function uploadMultipleFiles(
  bucket: string,
  files: File[],
  pathPrefix: string = ''
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await uploadFile(bucket, file, pathPrefix);
    urls.push(url);
  }
  return urls;
}