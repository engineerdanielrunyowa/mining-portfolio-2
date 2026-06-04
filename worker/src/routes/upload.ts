import type { Env } from '../types';
import { validateSession } from '../lib/auth';
import { supabaseStorageUpload, supabaseQuery } from '../lib/supabase';
import { corsHeaders } from '../lib/cors';

export async function handleUploadRoutes(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response | null> {
  const isValid = await validateSession(env, request);
  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(env, request) },
    });
  }

  const headers = corsHeaders(env, request);
  const json = (data: any, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    });

  // POST /api/admin/upload/image
  if (pathname === '/api/admin/upload/image' && request.method === 'POST') {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) return json({ error: 'No file provided' }, 400);

      const ext = file.name.split('.').pop() || 'jpg';
      const path = `$${Date.now()}-$${Math.random().toString(36).substring(7)}.${ext}`;
      const buffer = await file.arrayBuffer();
      const url = await supabaseStorageUpload(env, 'post-images', path, buffer, file.type);
      return json({ url });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // POST /api/admin/upload/svg
  if (pathname === '/api/admin/upload/svg' && request.method === 'POST') {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      if (!file) return json({ error: 'No file provided' }, 400);

      const path = `$${Date.now()}-$${Math.random().toString(36).substring(7)}.svg`;
      const buffer = await file.arrayBuffer();
      const url = await supabaseStorageUpload(
        env,
        'specialisation-icons',
        path,
        buffer,
        'image/svg+xml'
      );
      return json({ url });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // POST /api/admin/cv/upload
  if (pathname === '/api/admin/cv/upload' && request.method === 'POST') {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const filename = (formData.get('filename') as string) || file.name;
      if (!file) return json({ error: 'No file provided' }, 400);

      // Delete old CV (best effort)
      const profile = await supabaseQuery(env, 'profile?id=eq.1&select=cv_file_url');
      if (profile?.[0]?.cv_file_url) {
        try {
          const match = profile[0].cv_file_url.match(
            /\/storage\/v1\/object\/public\/cv\/(.+)/
          );
          if (match) {
            await fetch(`$${env.SUPABASE_URL}/storage/v1/object/cv/$${match[1]}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` },
            });
          }
        } catch {
          // continue
        }
      }

      // Upload new
      const path = `$${Date.now()}-$${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const buffer = await file.arrayBuffer();
      const url = await supabaseStorageUpload(env, 'cv', path, buffer, 'application/pdf');

      // Update profile
      await supabaseQuery(env, 'profile?id=eq.1', {
        method: 'PATCH',
        body: { cv_file_url: url, cv_file_name: filename },
      });

      return json({ url, filename });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // DELETE /api/admin/storage/file
  if (pathname === '/api/admin/storage/file' && request.method === 'DELETE') {
    try {
      const body = (await request.json()) as any;
      const fullPath = body.path;
      if (!fullPath) return json({ error: 'Path required' }, 400);

      const match = fullPath.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      if (match) {
        await fetch(`$${env.SUPABASE_URL}/storage/v1/object/$${match[1]}/${match[2]}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` },
        });
      }
      return json({ success: true });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  return null;
}