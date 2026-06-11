import type { Env } from '../types';

export function corsHeaders(env: Env, request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = [
    'https://danielrunyowa.pages.dev',
    'https://mining-portfolio-api.danielrunyowa.workers.dev',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  // Allow if origin is in the allowed list or matches ALLOWED_ORIGIN
  const isAllowed = allowedOrigins.includes(origin) || origin.includes('localhost') || origin.includes('127.0.0.1');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
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
