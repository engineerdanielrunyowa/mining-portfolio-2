import type { Env } from '../types';

// Simple HMAC-based token for session management
async function createHMAC(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyHMAC(
  secret: string,
  data: string,
  signature: string
): Promise<boolean> {
  const expected = await createHMAC(secret, data);
  return expected === signature;
}

export async function createSessionToken(env: Env): Promise<string> {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `admin:${expiry}`;
  const sig = await createHMAC(env.SESSION_SECRET, payload);
  return btoa(JSON.stringify({ payload, sig }));
}

export async function validateSession(
  env: Env,
  request: Request
): Promise<boolean> {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return false;

  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;

  try {
    const { payload, sig } = JSON.parse(atob(match[1]));
    const valid = await verifyHMAC(env.SESSION_SECRET, payload, sig);
    if (!valid) return false;

    const [_, expiry] = payload.split(':');
    if (Date.now() > parseInt(expiry)) return false;

    return true;
  } catch {
    return false;
  }
}

export async function verifyPassword(
  env: Env,
  password: string
): Promise<boolean> {
  // Simple approach: the stored hash is SHA-256(password)
  // For production, use a proper bcrypt-compatible approach
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex === env.ADMIN_PASSWORD_HASH;
}

export function sessionCookie(token: string): string {
  return `session=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400`;
}

export function clearSessionCookie(): string {
  return `session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`;
}