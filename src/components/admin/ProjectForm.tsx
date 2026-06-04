'use client';

import { useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/adminApi';
import type { Project } from '@/lib/types';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Omit<Project, 'id'>) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [startDate, setStartDate] = useState(initialData?.start_date || '');
  const [endDate, setEndDate] = useState(initialData?.end_date || '');
  const [visible, setVisible] = useState(initialData?.visible ?? true);
  const [displayOrder, setDisplayOrder] = useState(initialData?.display_order || 0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        category,
        image_url: imageUrl,
        start_date: startDate,
        end_date: endDate,
        visible,
        display_order: displayOrder,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm resize-none"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Open Pit"
            className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Start Date</label>
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Jan 2022"
            className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">End Date</label>
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Present"
            className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">Image</label>
        <div className="flex items-center gap-3">
          {imageUrl && (
            <div className="relative w-24 h-16 rounded-lg overflow-hidden">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A3A4A] text-white/70 rounded-lg cursor-pointer hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Display Order</label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Visibility</label>
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
              visible
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {visible ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-accent-secondary text-white font-medium rounded-lg hover:bg-accent-secondary/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm min-h-[44px]"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-[#2A3A4A] text-white/70 font-medium rounded-lg hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}