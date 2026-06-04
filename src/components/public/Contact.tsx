'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import type { Profile } from '@/lib/types';
import { submitContact, getCVDownloadUrl } from '@/lib/api';

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const [form, setForm] = useState({ sender_name: '', sender_email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    // Load Turnstile script
    if (typeof window !== 'undefined' && !(window as any).turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.onload = () => {
        renderTurnstile();
      };
      document.head.appendChild(script);
    } else {
      renderTurnstile();
    }
  }, []);

  function renderTurnstile() {
    if (turnstileRef.current && (window as any).turnstile) {
      (window as any).turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
      });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sender_name || !form.sender_email || !form.message) {
      setErrorMsg('Please fill in all fields.');
      setStatus('error');
      return;
    }
    if (!turnstileToken) {
      setErrorMsg('Please complete the security verification.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await submitContact({ ...form, turnstile_token: turnstileToken });
      setStatus('success');
      setForm({ sender_name: '', sender_email: '', message: '' });
    } catch (err) {
      setErrorMsg('Failed to send message. Please try again.');
      setStatus('error');
    }
  };

  const socialLinks = [
    { platform: 'linkedin', url: profile.linkedin_url, show: profile.show_linkedin, icon: Linkedin },
    { platform: 'facebook', url: profile.facebook_url, show: profile.show_facebook, icon: Facebook },
    { platform: 'instagram', url: profile.instagram_url, show: profile.show_instagram, icon: Instagram },
    { platform: 'x', url: profile.x_url, show: profile.show_x, icon: Twitter },
    { platform: 'whatsapp', url: profile.whatsapp_url, show: profile.show_whatsapp, icon: MessageCircle },
  ].filter((s) => s.show && s.url);

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-bg-secondary/50 dark:bg-dark-bg-secondary/30"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-accent-primary dark:text-accent-secondary mb-3 text-center">
          Get In Touch
        </h2>
        <p className="text-text-main/60 dark:text-dark-text/50 text-sm sm:text-base text-center mb-10 max-w-xl mx-auto">
          Interested in collaboration, consulting, or opportunities? Send me a message.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-dark-bg-secondary rounded-xl hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent-secondary" />
                </div>
                <div>
                  <p className="text-xs text-text-main/50 dark:text-dark-text/40">Email</p>
                  <p className="text-sm font-medium text-text-main dark:text-dark-text group-hover:text-accent-secondary transition-colors">
                    {profile.email}
                  </p>
                </div>
              </a>
            )}

            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-dark-bg-secondary rounded-xl hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-accent-secondary" />
                </div>
                <div>
                  <p className="text-xs text-text-main/50 dark:text-dark-text/40">Phone</p>
                  <p className="text-sm font-medium text-text-main dark:text-dark-text group-hover:text-accent-secondary transition-colors">
                    {profile.phone}
                  </p>
                </div>
              </a>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-lg bg-white dark:bg-dark-bg-secondary flex items-center justify-center text-text-main/60 dark:text-dark-text/50 hover:bg-accent-secondary hover:text-white transition-all duration-200"
                    aria-label={s.platform}
                  >
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}

            {/* CV Download */}
            {profile.cv_file_url && (
              <a
                href={getCVDownloadUrl()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-secondary text-white font-medium rounded-lg hover:bg-accent-secondary/90 transition-colors shadow min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            )}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-main dark:text-dark-text mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={form.sender_name}
                onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-bg-secondary dark:border-dark-bg bg-white dark:bg-dark-bg-secondary text-text-main dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 transition-all text-sm min-h-[44px]"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main dark:text-dark-text mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.sender_email}
                onChange={(e) => setForm({ ...form, sender_email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-bg-secondary dark:border-dark-bg bg-white dark:bg-dark-bg-secondary text-text-main dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 transition-all text-sm min-h-[44px]"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-main dark:text-dark-text mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-bg-secondary dark:border-dark-bg bg-white dark:bg-dark-bg-secondary text-text-main dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 transition-all text-sm resize-none"
                placeholder="Your message..."
                required
              />
            </div>

            {/* Turnstile Widget */}
            <div ref={turnstileRef} />

            {/* Status Messages */}
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Message sent successfully!
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-8 py-3 bg-accent-primary dark:bg-accent-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}