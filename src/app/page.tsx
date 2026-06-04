'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/public/Navbar';
import Landing from '@/components/public/Landing';
import ScrollMorph from '@/components/public/ScrollMorph';
import Specialisations from '@/components/public/Specialisations';
import PostsFeed from '@/components/public/PostsFeed';
import Projects from '@/components/public/Projects';
import Contact from '@/components/public/Contact';
import { useTheme } from '@/hooks/useTheme';
import { getProfile } from '@/lib/api';
import { mockProfile } from '@/lib/mockData';
import type { Profile } from '@/lib/types';

export default function HomePage() {
  const { isDark, toggle, mounted } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getProfile();
        const p = res.data;
        setProfile(p);
        setDemoMode(p.demo_mode);
      } catch {
        // Fallback to mock data
        setProfile(mockProfile);
        setDemoMode(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayProfile = demoMode ? mockProfile : profile;

  if (loading || !displayProfile || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-accent-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-main/50 dark:text-dark-text/40">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar isDark={isDark} toggleTheme={toggle} profileName={displayProfile.name} />
      <main>
        <Landing profile={displayProfile} />
        <ScrollMorph />
        <Specialisations demoMode={demoMode} />
        <PostsFeed demoMode={demoMode} />
        <Projects demoMode={demoMode} />
        <Contact profile={displayProfile} />
      </main>
      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-bg-secondary/50 dark:border-dark-bg-secondary/30">
        <p className="text-xs text-text-main/40 dark:text-dark-text/30">
          &copy; {new Date().getFullYear()} {displayProfile.name}. All rights reserved.
        </p>
      </footer>
    </>
  );
}