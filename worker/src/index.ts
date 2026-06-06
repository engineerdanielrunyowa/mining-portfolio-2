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

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(env, request);
    }

    try {
      // Auth routes (login/logout)
      const authResponse = await handleAuthRoutes(request, env, pathname);
      if (authResponse) return authResponse;

      // Upload routes (admin file uploads)
      const uploadResponse = await handleUploadRoutes(request, env, pathname);
      if (uploadResponse) return uploadResponse;

      // Admin routes (authenticated CRUD)
      if (pathname.startsWith('/api/admin/')) {
        const adminResponse = await handleAdminRoutes(request, env, pathname);
        if (adminResponse) return adminResponse;
      }

      // Public routes
      const publicResponse = await handlePublicRoutes(request, env, pathname);
      if (publicResponse) return publicResponse;

      // 404 fallback
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(env, request) },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: 'Internal server error', details: err.message }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders(env, request) },
        }
      );
    }
  },
};
