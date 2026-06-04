import type { Env } from '../types';
import { supabaseQuery } from '../lib/supabase';
import { sendEmail } from '../lib/email';
import { corsHeaders } from '../lib/cors';

export async function handlePublicRoutes(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response | null> {
  const headers = corsHeaders(env, request);
  const json = (data: any, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    });

  // GET /api/profile
  if (pathname === '/api/profile' && request.method === 'GET') {
    try {
      const data = await supabaseQuery(env, 'profile?id=eq.1&select=*');
      return json({ data: data[0] });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // GET /api/posts
  if (pathname === '/api/posts' && request.method === 'GET') {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    try {
      const countRes = await supabaseQuery(
        env,
        'posts?select=id',
        { headers: { Prefer: 'count=exact', Range: '0-0' } }
      );

      const posts = await supabaseQuery(
        env,
        `posts?select=*&order=created_at.desc&offset=${offset}&limit=${limit}`
      );

      const total = Array.isArray(countRes) ? countRes.length : 0;
      // Workaround: get actual count
      const allPosts = await supabaseQuery(env, 'posts?select=id');
      const totalCount = Array.isArray(allPosts) ? allPosts.length : 0;

      return json({
        data: {
          posts: posts || [],
          total: totalCount,
          page,
          limit,
          hasMore: offset + limit < totalCount,
        },
      });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // GET /api/posts/:slug
  const postSlugMatch = pathname.match(/^\/api\/posts\/(.+)$/);
  if (postSlugMatch && request.method === 'GET') {
    const slug = postSlugMatch[1];
    try {
      const data = await supabaseQuery(
        env,
        `posts?slug=eq.${encodeURIComponent(slug)}&select=*`
      );
      if (!data || data.length === 0) {
        return json({ error: 'Post not found' }, 404);
      }
      return json({ data: data[0] });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // GET /api/specialisations
  if (pathname === '/api/specialisations' && request.method === 'GET') {
    try {
      const data = await supabaseQuery(
        env,
        'specialisations?visible=eq.true&order=display_order.asc&select=*'
      );
      return json({ data: data || [] });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // GET /api/projects
  if (pathname === '/api/projects' && request.method === 'GET') {
    try {
      const data = await supabaseQuery(
        env,
        'projects?visible=eq.true&order=display_order.asc&select=*'
      );
      return json({ data: data || [] });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // GET /api/cv/download
  if (pathname === '/api/cv/download' && request.method === 'GET') {
    try {
      const profile = await supabaseQuery(env, 'profile?id=eq.1&select=cv_file_url,cv_file_name');
      if (!profile?.[0]?.cv_file_url) {
        return json({ error: 'No CV available' }, 404);
      }
      const cvRes = await fetch(profile[0].cv_file_url);
      if (!cvRes.ok) return json({ error: 'CV fetch failed' }, 500);

      const filename = profile[0].cv_file_name || 'CV.pdf';
      return new Response(cvRes.body, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          ...headers,
        },
      });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  // POST /api/contact
  if (pathname === '/api/contact' && request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const { sender_name, sender_email, message, turnstile_token } = body;

      if (!sender_name || !sender_email || !message) {
        return json({ error: 'All fields are required' }, 400);
      }

      // Verify Turnstile
      if (env.TURNSTILE_SECRET_KEY && turnstile_token) {
        const turnstileRes = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: env.TURNSTILE_SECRET_KEY,
              response: turnstile_token,
            }),
          }
        );
        const turnstileData = await turnstileRes.json() as any;
        if (!turnstileData.success) {
          return json({ error: 'Security verification failed' }, 400);
        }
      }

      // Get notification email
      const profile = await supabaseQuery(
        env,
        'profile?id=eq.1&select=notification_email,name'
      );
      const notificationEmail = profile?.[0]?.notification_email;

      // Send email
      let emailSent = false;
      if (notificationEmail && env.RESEND_API_KEY) {
        emailSent = await sendEmail(
          env,
          notificationEmail,
          `New Contact: ${sender_name}`,
          `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${sender_name}</p>
            <p><strong>Email:</strong> ${sender_email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        );
      }

      // Log to database
      await supabaseQuery(env, 'contact_submissions', {
        method: 'POST',
        body: {
          sender_name,
          sender_email,
          message,
          email_sent: emailSent,
        },
      });

      return json({ success: true, message: 'Message sent successfully' });
    } catch (err: any) {
      return json({ error: err.message }, 500);
    }
  }

  return null;
}