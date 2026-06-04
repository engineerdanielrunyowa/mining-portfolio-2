import type { Env } from '../types';
import { validateSession } from '../lib/auth';
import { supabaseQuery } from '../lib/supabase';
import { corsHeaders } from '../lib/cors';
import { detectVideoSource, getVideoThumbnail } from '../lib/video';

export async function handleAdminRoutes(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response | null> {
  // Validate session for all admin routes
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

  const url = new URL(request.url);

  // --- PROFILE ---
  if (pathname === '/api/admin/profile') {
    if (request.method === 'GET') {
      const data = await supabaseQuery(env, 'profile?id=eq.1&select=*');
      return json({ data: data[0] });
    }
    if (request.method === 'PUT') {
      const body = await request.json();
      await supabaseQuery(env, 'profile?id=eq.1', {
        method: 'PATCH',
        body,
      });
      const updated = await supabaseQuery(env, 'profile?id=eq.1&select=*');
      return json({ data: updated[0] });
    }
  }

  // --- DEMO MODE ---
  if (pathname === '/api/admin/demo-mode' && request.method === 'PUT') {
    const body = await request.json() as any;
    await supabaseQuery(env, 'profile?id=eq.1', {
      method: 'PATCH',
      body: { demo_mode: body.demo_mode },
    });
    return json({ success: true });
  }

  // --- POSTS ---
  if (pathname === '/api/admin/posts') {
    if (request.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      const posts = await supabaseQuery(
        env,
        `posts?select=*&order=created_at.desc&offset=${offset}&limit=${limit}`
      );
      const allPosts = await supabaseQuery(env, 'posts?select=id');
      const total = Array.isArray(allPosts) ? allPosts.length : 0;

      return json({
        data: {
          posts: posts || [],
          total,
          page,
          limit,
          hasMore: offset + limit < total,
        },
      });
    }

    if (request.method === 'POST') {
      const body = await request.json() as any;
      const slug =
        (body.text_content || '')
          .substring(0, 50)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        Date.now().toString(36);

      const data = await supabaseQuery(env, 'posts', {
        method: 'POST',
        body: {
          text_content: body.text_content || '',
          image_urls: body.image_urls || [],
          video_links: body.video_links || [],
          slug,
        },
      });
      return json({ data: data[0] }, 201);
    }

    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'ID required' }, 400);
      const body = await request.json();
      await supabaseQuery(env, `posts?id=eq.${id}`, {
        method: 'PATCH',
        body,
      });
      const updated = await supabaseQuery(env, `posts?id=eq.${id}&select=*`);
      return json({ data: updated[0] });
    }

    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'ID required' }, 400);

      // Get post to find image URLs for cleanup
      const post = await supabaseQuery(env, `posts?id=eq.${id}&select=image_urls`);
      // Delete images from storage (best effort)
      if (post?.[0]?.image_urls?.length) {
        for (const imageUrl of post[0].image_urls) {
          try {
            const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/(.+)/);
            if (pathMatch) {
              const [bucket, ...rest] = pathMatch[1].split('/');
              const path = rest.join('/');
              await fetch(`${env.SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` },
              });
            }
          } catch {
            // continue
          }
        }
      }

      await supabaseQuery(env, `posts?id=eq.${id}`, { method: 'DELETE' });
      return json({ success: true });
    }
  }

  // --- SPECIALISATIONS ---
  if (pathname === '/api/admin/specialisations') {
    if (request.method === 'GET') {
      const data = await supabaseQuery(
        env,
        'specialisations?select=*&order=display_order.asc'
      );
      return json({ data: data || [] });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const data = await supabaseQuery(env, 'specialisations', {
        method: 'POST',
        body,
      });
      return json({ data: data[0] }, 201);
    }

    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'ID required' }, 400);
      const body = await request.json();
      await supabaseQuery(env, `specialisations?id=eq.${id}`, {
        method: 'PATCH',
        body,
      });
      const updated = await supabaseQuery(env, `specialisations?id=eq.${id}&select=*`);
      return json({ data: updated[0] });
    }

    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'ID required' }, 400);
      await supabaseQuery(env, `specialisations?id=eq.${id}`, { method: 'DELETE' });
      return json({ success: true });
    }
  }

  // --- PROJECTS ---
  if (pathname === '/api/admin/projects') {
    if (request.method === 'GET') {
      const data = await supabaseQuery(
        env,
        'projects?select=*&order=display_order.asc'
      );
      return json({ data: data || [] });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const data = await supabaseQuery(env, 'projects', {
        method: 'POST',
        body,
      });
      return json({ data: data[0] }, 201);
    }

    if (request.method === 'PUT') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'ID required' }, 400);
      const body = await request.json();
      await supabaseQuery(env, `projects?id=eq.${id}`, {
        method: 'PATCH',
        body,
      });
      const updated = await supabaseQuery(env, `projects?id=eq.${id}&select=*`);
      return json({ data: updated[0] });
    }

    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return json({ error: 'ID required' }, 400);
      await supabaseQuery(env, `projects?id=eq.${id}`, { method: 'DELETE' });
      return json({ success: true });
    }
  }

  // --- CONTACT SUBMISSIONS ---
  if (pathname === '/api/admin/contact-submissions' && request.method === 'GET') {
    const data = await supabaseQuery(
      env,
      'contact_submissions?select=*&order=created_at.desc'
    );
    return json({ data: data || [] });
  }

  // --- VIDEO THUMBNAIL ---
  if (pathname === '/api/admin/video-thumbnail' && request.method === 'GET') {
    const videoUrl = url.searchParams.get('url') || '';
    const source = detectVideoSource(videoUrl);
    const thumbnailUrl = getVideoThumbnail(videoUrl, source);
    return json({ source, thumbnail_url: thumbnailUrl });
  }

  return null;
}