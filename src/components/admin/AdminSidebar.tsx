'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  Hexagon,
  FolderOpen,
  User,
  FileDown,
  Inbox,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { adminLogout } from '@/lib/adminApi';

interface AdminSidebarProps {
  activePage: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'posts', label: 'Posts', icon: PenSquare, href: '/admin/posts' },
  { id: 'specialisations', label: 'Specialisations', icon: Hexagon, href: '/admin/specialisations' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, href: '/admin/projects' },
  { id: 'profile', label: 'Profile', icon: User, href: '/admin/profile' },
  { id: 'cv', label: 'CV Management', icon: FileDown, href: '/admin/cv' },
  { id: 'submissions', label: 'Submissions', icon: Inbox, href: '/admin/submissions' },
];

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch {
      // continue
    }
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0F1923] border-b border-[#1A2A3A] px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-white/70 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-sm font-semibold text-accent-secondary">Admin</span>
        <a href="/" className="p-2 text-white/50 hover:text-white text-xs min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Site
        </a>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0F1923] border-r border-[#1A2A3A] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#1A2A3A]">
          <h2 className="text-lg font-bold text-accent-secondary">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                activePage === item.id
                  ? 'bg-accent-secondary/10 text-accent-secondary'
                  : 'text-white/60 hover:text-white hover:bg-[#1A2A3A]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#1A2A3A]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors w-full min-h-[44px]"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}