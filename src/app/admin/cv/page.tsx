'use client';

import { useEffect, useState } from 'react';
import { Loader2, FileDown, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAdminProfile, uploadCV, updateAdminProfile } from '@/lib/adminApi';

export default function AdminCVPage() {
  const [cvUrl, setCvUrl] = useState('');
  const [cvName, setCvName] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'view' | 'choose-name' | 'upload'>('view');
  const [newFilename, setNewFilename] = useState('');
  const [keepFilename, setKeepFilename] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAdminProfile();
        setCvUrl(res.data.cv_file_url || '');
        setCvName(res.data.cv_file_name || '');
      } catch {
        window.location.href = '/admin/login';
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filename = keepFilename ? cvName : newFilename;
    try {
      const result = await uploadCV(file, filename);
      setCvUrl(result.url);
      setCvName(result.filename);
      setSuccess(true);
      setStep('view');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('CV upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1923] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="cv" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-white mb-6">CV Management</h1>

          <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] space-y-6">
            {/* Current CV Info */}
            <div>
              <h2 className="text-sm font-semibold text-accent-secondary uppercase tracking-wider mb-3">
                Current CV
              </h2>
              {cvUrl ? (
                <div className="flex items-center gap-3 p-3 bg-[#0F1923] rounded-lg border border-[#2A3A4A]">
                  <FileDown className="w-5 h-5 text-accent-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{cvName || 'CV.pdf'}</p>
                    <p className="text-xs text-white/30 truncate">{cvUrl}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/40">No CV uploaded yet.</p>
              )}
            </div>

            {success && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                CV updated successfully!
              </div>
            )}

            {/* Upload Flow */}
            {step === 'view' && (
              <button
                onClick={() => setStep(cvName ? 'choose-name' : 'upload')}
                className="flex items-center gap-2 px-5 py-2.5 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors text-sm min-h-[44px]"
              >
                <Upload className="w-4 h-4" />
                Upload New CV
              </button>
            )}

            {step === 'choose-name' && (
              <div className="space-y-4">
                <p className="text-sm text-white/70">
                  Keep the existing filename <span className="text-accent-secondary font-medium">&quot;{cvName}&quot;</span>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setKeepFilename(true); setStep('upload'); }}
                    className="px-5 py-2.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm min-h-[44px]"
                  >
                    Yes, keep it
                  </button>
                  <button
                    onClick={() => { setKeepFilename(false); setStep('upload'); }}
                    className="px-5 py-2.5 bg-[#2A3A4A] text-white/70 rounded-lg hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]"
                  >
                    No, change it
                  </button>
                </div>
              </div>
            )}

            {step === 'upload' && (
              <div className="space-y-4">
                {!keepFilename && (
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      New Filename
                    </label>
                    <input
                      type="text"
                      value={newFilename}
                      onChange={(e) => setNewFilename(e.target.value)}
                      placeholder="e.g., John_Doe_CV_2024.pdf"
                      className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-secondary text-white rounded-lg cursor-pointer hover:bg-accent-secondary/90 transition-colors text-sm min-h-[44px]">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? 'Uploading...' : 'Select PDF'}
                    <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" disabled={uploading} />
                  </label>
                  <button
                    onClick={() => { setStep('view'); setKeepFilename(true); }}
                    className="px-4 py-2.5 bg-[#2A3A4A] text-white/70 rounded-lg hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}