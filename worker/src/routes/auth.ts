import type { Env } from '../types';
import { verifyPassword, createSessionToken, sessionCookie, clearSessionCookie } from '../lib/auth';
import { corsHeaders } from '../lib/cors';

// Simple rate limiting using a Map (resets on worker restart — acceptable for single-instance)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function handleAuthRoutes(
  request: Request,
  env: Env,
  pathname: string
): Promise<Response | null> {
  const headers = corsHeaders(env, request);
  const json = (data: any, status = 200, extraHeaders: Record<string, string> = {}) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers, ...extraHeaders },
    });

  // POST /api/admin/login
  if (pathname === '/api/admin/login' && request.method === 'POST') {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (attempts && attempts.count >= 5 && now < attempts.resetAt) {
      return json({ error: 'Too many attempts. Try again later.' }, 429);
    }

    if (attempts && now >= attempts.resetAt) {
      loginAttempts.delete(ip);
    }

    const body = await request.json() as any;
    const valid = await verifyPassword(env, body.password || '');

    if (!valid) {
      const current = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
      current.count += 1;
      loginAttempts.set(ip, current);
      return json({ error: 'Invalid password' }, 401);
    }

    loginAttempts.delete(ip);
    const token = await createSessionToken(env);
    return json(
      { success: true, message: 'Authenticated' },
      200,
      { 'Set-Cookie': sessionCookie(token) }
    );
  }

  // POST /api/admin/logout
  if (pathname === '/api/admin/logout' && request.method === 'POST') {
    return json(
      { success: true },
      200,
      { 'Set-Cookie': clearSessionCookie() }
    );
  }

  return null;
}