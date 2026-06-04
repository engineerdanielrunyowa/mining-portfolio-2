'use client';

import { useEffect, useState } from 'react';
import { Loader2, PenSquare, Hexagon, FolderOpen, Inbox } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DemoModeToggle from '@/components/admin/DemoModeToggle';
import { getAdminProfile, getAdminPosts, getAdminSpecialisations, getAdminProjects, getContactSubmissions } from '@/lib/adminApi';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [stats, setStats] = useState({ posts: 0, specialisations: 0, projects: 0, submissions: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, postsRes, specsRes, projRes, subsRes] = await Promise.all([
          getAdminProfile(),
          getAdminPosts(1, 1),
          getAdminSpecialisations(),
          getAdminProjects(),
          getContactSubmissions(),
        ]);
        setDemoMode(profileRes.data.demo_mode);
        setStats({
          posts: postsRes.data.total,
          specialisations: specsRes.data.length,
          projects: projRes.data.length,
          submissions: subsRes.data.length,
        });
      } catch {
        window.location.href = '/admin/login';
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1923] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Posts', value: stats.posts, icon: PenSquare, href: '/admin/posts' },
    { label: 'Specialisations', value: stats.specialisations, icon: Hexagon, href: '/admin/specialisations' },
    { label: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects' },
    { label: 'Submissions', value: stats.submissions, icon: Inbox, href: '/admin/submissions' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="dashboard" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

          {/* Demo Mode Toggle */}
          <div className="mb-8">
            <DemoModeToggle initialValue={demoMode} onToggle={setDemoMode} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <a
                key={stat.label}
                href={stat.href}
                className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] hover:border-accent-secondary/30 transition-colors group"
              >
                <stat.icon className="w-5 h-5 text-accent-secondary mb-3" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}