'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, Upload, CheckCircle } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getAdminProfile, updateAdminProfile, uploadImage } from '@/lib/adminApi';
import type { Profile } from '@/lib/types';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getAdminProfile();
        setProfile(res.data);
      } catch {
        window.location.href = '/admin/login';
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (field: keyof Profile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleImageUpload = async (
    field: 'profile_image_url' | 'landing_background_url',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(field);
    try {
      const url = await uploadImage(file);
      setProfile({ ...profile, [field]: url });
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const { id, demo_mode, ...data } = profile;
      await updateAdminProfile(data as any);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#0F1923] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
      </div>
    );
  }

  const socialPlatforms = [
    { key: 'linkedin', label: 'LinkedIn', urlField: 'linkedin_url' as const, showField: 'show_linkedin' as const },
    { key: 'facebook', label: 'Facebook', urlField: 'facebook_url' as const, showField: 'show_facebook' as const },
    { key: 'instagram', label: 'Instagram', urlField: 'instagram_url' as const, showField: 'show_instagram' as const },
    { key: 'x', label: 'X (Twitter)', urlField: 'x_url' as const, showField: 'show_x' as const },
    { key: 'threads', label: 'Threads', urlField: 'threads_url' as const, showField: 'show_threads' as const },
    { key: 'whatsapp', label: 'WhatsApp', urlField: 'whatsapp_url' as const, showField: 'show_whatsapp' as const },
  ];

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="profile" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors disabled:opacity-50 text-sm min-h-[44px]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>

          <div className="space-y-8">
            {/* Identity */}
            <section className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] space-y-4">
              <h2 className="text-sm font-semibold text-accent-secondary uppercase tracking-wider">Identity</h2>
              <InputField label="Name" value={profile.name} onChange={(v) => handleChange('name', v)} />
              <InputField label="Title" value={profile.title} onChange={(v) => handleChange('title', v)} />
              <InputField label="Tagline" value={profile.tagline} onChange={(v) => handleChange('tagline', v)} />
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm resize-none"
                />
              </div>
            </section>

            {/* Media */}
            <section className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] space-y-4">
              <h2 className="text-sm font-semibold text-accent-secondary uppercase tracking-wider">Media</h2>
              <ImageField
                label="Profile Image"
                url={profile.profile_image_url}
                uploading={uploading === 'profile_image_url'}
                onChange={(e) => handleImageUpload('profile_image_url', e)}
                onUrlChange={(v) => handleChange('profile_image_url', v)}
              />
              <ImageField
                label="Landing Background"
                url={profile.landing_background_url}
                uploading={uploading === 'landing_background_url'}
                onChange={(e) => handleImageUpload('landing_background_url', e)}
                onUrlChange={(v) => handleChange('landing_background_url', v)}
              />
            </section>

            {/* Contact */}
            <section className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] space-y-4">
              <h2 className="text-sm font-semibold text-accent-secondary uppercase tracking-wider">Contact</h2>
              <InputField label="Phone" value={profile.phone} onChange={(v) => handleChange('phone', v)} />
              <InputField label="Email (Public)" value={profile.email} onChange={(v) => handleChange('email', v)} />
              <InputField
                label="Notification Email (receives contact form submissions)"
                value={profile.notification_email}
                onChange={(v) => handleChange('notification_email', v)}
              />
            </section>

            {/* Social Links */}
            <section className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] space-y-4">
              <h2 className="text-sm font-semibold text-accent-secondary uppercase tracking-wider">Social Links</h2>
              {socialPlatforms.map((platform) => (
                <div key={platform.key} className="flex items-center gap-3">
                  <div className="flex-1">
                    <InputField
                      label={platform.label}
                      value={(profile as any)[platform.urlField] || ''}
                      onChange={(v) => handleChange(platform.urlField, v)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange(platform.showField, !(profile as any)[platform.showField])}
                    className={`mt-5 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
                      (profile as any)[platform.showField]
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {(profile as any)[platform.showField] ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
      />
    </div>
  );
}

function ImageField({
  label,
  url,
  uploading,
  onChange,
  onUrlChange,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white/70 mb-2">{label}</label>
      <div className="flex items-center gap-3 mb-2">
        {url && (
          <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover" />
        )}
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A3A4A] text-white/70 rounded-lg cursor-pointer hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={onChange} className="hidden" disabled={uploading} />
        </label>
      </div>
      <input
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Or paste image URL"
        className="w-full px-4 py-2 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-xs min-h-[44px]"
      />
    </div>
  );
}