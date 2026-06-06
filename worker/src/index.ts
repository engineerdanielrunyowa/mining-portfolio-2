import type { Env } from './types';
import { handleOptions, corsHeaders } from './lib/cors';
import { handlePublicRoutes } from './routes/public';
import { handleAuthRoutes } from './routes/auth';
import { handleAdminRoutes } from './routes/admin';
import { handleUploadRoutes } from './routes/upload';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(env, request);
    }

    try {
      // 1. AUTH routes (login/logout only)
      const authResponse = await handleAuthRoutes(request, env, pathname);
      if (authResponse) return authResponse;

      // 2. PUBLIC routes (NO AUTH EVER)
      const publicResponse = await handlePublicRoutes(request, env, pathname);
      if (publicResponse) return publicResponse;

      // 3. ADMIN routes (protected only here)
      if (pathname.startsWith('/api/admin/')) {
        const adminResponse = await handleAdminRoutes(request, env, pathname);
        if (adminResponse) return adminResponse;
      }

      // 4. UPLOAD routes (admin only)
      const uploadResponse = await handleUploadRoutes(request, env, pathname);
      if (uploadResponse) return uploadResponse;

      // 404 fallback
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(env, request),
        },
      });

    } catch (err: any) {
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: err.message,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(env, request),
          },
        }
      );
    }
  },
};
