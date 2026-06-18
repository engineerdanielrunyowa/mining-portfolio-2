'use client';

import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  MessageCircle,
  Download,
  ChevronDown,
  User,
} from 'lucide-react';
import type { Profile } from '@/lib/types';
import { getCVDownloadUrl } from '@/lib/api';

interface LandingProps {
  profile: Profile;
}

function SocialIcon({
  platform,
  url,
}: {
  platform: string;
  url: string;
}) {
  const icons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  x: <Twitter className="w-5 h-5" />,
  threads: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.278 3.255-.897 1.103-2.07 1.772-3.496 1.99-.93.142-1.94.058-2.85-.238-1.079-.352-1.946-1-2.512-1.878-.6-.93-.842-2.043-.7-3.216.236-1.932 1.628-3.553 3.694-4.301.93-.337 2.009-.49 3.21-.457.83.023 1.623.13 2.381.319.02-.755-.023-1.478-.128-2.095l2.073-.323c.144.844.192 1.78.155 2.788 1.09.65 1.905 1.525 2.422 2.578.791 1.61.895 4.323-1.15 6.34-1.834 1.81-4.07 2.595-7.238 2.615zm1.899-7.667c-.06-1.17-.454-2.043-1.172-2.593-.598-.46-1.394-.693-2.362-.693-.12 0-.243.005-.367.014-1.392.1-2.411.807-2.556 1.986-.097.795.05 1.448.437 1.942.426.544 1.12.876 2.008 1.01 1.27.191 2.496-.212 3.302-1.135.316-.363.567-.82.71-1.531z" />
    </svg>
  ),

  whatsapp: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.47 0 .1 5.37.1 11.95c0 2.1.55 4.15 1.6 5.95L0 24l6.28-1.65a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.94-5.37 11.94-11.95 0-3.18-1.24-6.17-3.48-8.39zM12.06 21.8h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.73.98.99-3.63-.24-.37a9.9 9.9 0 1 1 8.4 4.61zm5.46-7.45c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.23-.66.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.5 0 1.48 1.08 2.91 1.23 3.11.15.2 2.13 3.25 5.16 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z"/>
    </svg>
  ),
};

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-accent-secondary/80 transition-all duration-300 text-white hover:scale-110"
      aria-label={platform}
    >
      {icons[platform]}
    </a>
  );
}

export default function Landing({ profile }: LandingProps) {
  const socialLinks = [
    { platform: 'linkedin', url: profile.linkedin_url, show: profile.show_linkedin },
    { platform: 'facebook', url: profile.facebook_url, show: profile.show_facebook },
    { platform: 'instagram', url: profile.instagram_url, show: profile.show_instagram },
    { platform: 'x', url: profile.x_url, show: profile.show_x },
    { platform: 'threads', url: profile.threads_url, show: profile.show_threads },
    { platform: 'whatsapp', url: profile.whatsapp_url, show: profile.show_whatsapp },
  ].filter((s) => s.show && s.url);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-accent-primary">
        {profile.landing_background_url && (
          <img
            src={profile.landing_background_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F2F40]/85 via-[#1F2F40]/75 to-[#0F1923]/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Profile Image — shown first on mobile */}
          <div className="flex-shrink-0 order-1 md:order-2">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-accent-secondary/50 shadow-2xl">
              {profile.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent-primary/50 flex items-center justify-center">
                  <User className="w-20 h-20 text-accent-secondary/60" />
                </div>
              )}
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
              {profile.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-accent-secondary font-medium mb-4">
              {profile.title}
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl mb-6 leading-relaxed">
              {profile.tagline}
            </p>

            {/* About / Bio — combined with landing */}
            {profile.bio && (
              <div className="hidden md:block mb-6">
                <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                  {profile.bio.split('\n')[0]}
                </p>
              </div>
            )}

            {/* Social Icons */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                {socialLinks.map((s) => (
                  <SocialIcon key={s.platform} platform={s.platform} url={s.url} />
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="#feed"
                className="w-full sm:w-auto px-8 py-3 bg-accent-secondary text-white font-semibold rounded-lg hover:bg-accent-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl text-center min-h-[44px]"
              >
                View My Work
              </a>
              {profile.cv_file_url && (
                <a
                  href={getCVDownloadUrl()}
                  className="w-full sm:w-auto px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:border-accent-secondary hover:text-accent-secondary transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Bio Section */}
        {profile.bio && (
          <div className="md:hidden mt-10 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-accent-secondary font-semibold text-sm uppercase tracking-wider mb-3">
              About Me
            </h2>
            <div className="text-sm text-white/70 leading-relaxed space-y-3">
              {profile.bio.split('\n\n').slice(0, 2).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>
    </section>
  );
}
