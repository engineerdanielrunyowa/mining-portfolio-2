import type { Env } from '../types';

export async function supabaseQuery(
  env: Env,
  path: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<any> {
  const url = `${env.SUPABASE_URL}/rest/v1/${path}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      Prefer: options.method === 'POST' ? 'return=representation' : 'return=representation',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error ${res.status}: ${text}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function supabaseStorageUpload(
  env: Env,
  bucket: string,
  path: string,
  file: ArrayBuffer,
  contentType: string
): Promise<string> {
  const url = `${env.SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Storage upload error: ${text}`);
  }

  return `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function supabaseStorageDelete(
  env: Env,
  bucket: string,
  paths: string[]
): Promise<void> {
  const url = `${env.SUPABASE_URL}/storage/v1/object/${bucket}`;
  await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefixes: paths }),
  });
}