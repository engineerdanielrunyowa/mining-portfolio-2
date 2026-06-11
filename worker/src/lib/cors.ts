import type { Env } from '../types';

export function corsHeaders(env: Env, request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || 'https://danielrunyowa.pages.dev';

  // Allow the configured origin or localhost for dev
  const isAllowed =
    origin === allowed ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions(env: Env, request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(env, request),
  });
}
