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
      // Auth routes
      const authResponse = await handleAuthRoutes(
        request,
        env,
        pathname
      );
      if (authResponse) return authResponse;

      // Only process upload routes for upload endpoints
      const isUploadRoute =
        pathname === '/api/admin/upload/image' ||
        pathname === '/api/admin/upload/svg' ||
        pathname === '/api/admin/cv/upload' ||
        pathname === '/api/admin/storage/file';

      if (isUploadRoute) {
        const uploadResponse = await handleUploadRoutes(
          request,
          env,
          pathname
        );

        if (uploadResponse) return uploadResponse;
      }

      // Admin routes
      if (pathname.startsWith('/api/admin/')) {
        const adminResponse = await handleAdminRoutes(
          request,
          env,
          pathname
        );

        if (adminResponse) return adminResponse;
      }

      // Public routes
      const publicResponse = await handlePublicRoutes(
        request,
        env,
        pathname
      );

      if (publicResponse) return publicResponse;

      // 404
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(env, request),
          },
        }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: err?.message || 'Unknown error',
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
