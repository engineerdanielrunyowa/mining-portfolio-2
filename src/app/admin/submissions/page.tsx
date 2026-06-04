'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getContactSubmissions } from '@/lib/adminApi';
import type { ContactSubmission } from '@/lib/types';
import { formatFullDate } from '@/lib/timeUtils';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getContactSubmissions();
        setSubmissions(res.data);
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

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="submissions" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-6">Contact Submissions</h1>

          {submissions.length === 0 ? (
            <p className="text-center text-white/30 py-12 text-sm">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#1A2A3A] rounded-xl border border-[#2A3A4A] overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                    className="w-full p-4 flex items-center gap-4 text-left min-h-[44px]"
                  >
                    <Mail className="w-4 h-4 text-accent-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white">{sub.sender_name}</p>
                        {sub.email_sent ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                      <p className="text-xs text-white/40">{sub.sender_email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30">
                      <Clock className="w-3 h-3" />
                      {formatFullDate(sub.created_at).split(',').slice(0, 2).join(',')}
                    </div>
                    {expanded === sub.id ? (
                      <ChevronUp className="w-4 h-4 text-white/30" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/30" />
                    )}
                  </button>
                  {expanded === sub.id && (
                    <div className="px-4 pb-4 pt-0 border-t border-[#2A3A4A]">
                      <div className="pt-3">
                        <p className="text-xs text-white/50 mb-1">Message:</p>
                        <p className="text-sm text-white/80 whitespace-pre-line">
                          {sub.message}
                        </p>
                        <p className="text-xs text-white/30 mt-3">
                          {formatFullDate(sub.created_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}