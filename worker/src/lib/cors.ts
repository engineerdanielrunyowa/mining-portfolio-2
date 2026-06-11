import type { Env } from '../types';

export function corsHeaders(env: Env, request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = [
    'https://danielrunyowa.pages.dev',
    'https://mining-portfolio-api.danielrunyowa.workers.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    env.ALLOWED_ORIGIN || '', // Include ALLOWED_ORIGIN from env
  ].filter(Boolean); // Remove empty strings

  // Check if the origin is allowed
  const isAllowed = allowedOrigins.includes(origin) ||
                   origin.includes('localhost') ||
                   origin.includes('127.0.0.1');

  // Use the first allowed origin as fallback if none match
  const allowedOrigin = isAllowed ? origin : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    // Required for credentials (e.g., cookies, auth headers)
    'Vary': 'Origin',
  };
}

export function handleOptions(env: Env, request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(env, request),
  });
}
