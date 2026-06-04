export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  ALLOWED_ORIGIN: string;
}