import type { Env } from '../types';

export async function sendEmail(
  env: Env,
  to: string,
  subject: string,
  htmlBody: string
): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <noreply@resend.dev>',
        to: [to],
        subject,
        html: htmlBody,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}