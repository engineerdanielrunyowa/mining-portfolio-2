'use client';

import { useState } from 'react';
import {
  Plus,
  X,
  Upload,
  Loader2,
  Video,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { uploadImage, getVideoThumbnail } from '@/lib/adminApi';
import type { VideoLink } from '@/lib/types';

interface PostFormProps {
  initialData?: {
    text_content: string;
    image_urls: string[];
    video_links: VideoLink[];
  };
  onSubmit: (data: {
    text_content: string;
    image_urls: string[];
    video_links: VideoLink[];
  }) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function PostForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
}: PostFormProps) {
  const [textContent, setTextContent] = useState(initialData?.text_content || '');
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.image_urls || []);
  const [videoLinks, setVideoLinks] = useState<VideoLink[]>(initialData?.video_links || []);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingThumbnail, setFetchingThumbnail] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        setImageUrls((prev) => [...prev, url]);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addVideoLink = async () => {
    if (!videoUrlInput.trim()) return;
    setFetchingThumbnail(true);
    try {
      const { thumbnail_url, source } = await getVideoThumbnail(videoUrlInput);
      setVideoLinks((prev) => [
        ...prev,
        { url: videoUrlInput, source, thumbnail_url },
      ]);
      setVideoUrlInput('');
    } catch {
      // Add without thumbnail
      setVideoLinks((prev) => [
        ...prev,
        { url: videoUrlInput, source: 'unknown', thumbnail_url: '' },
      ]);
      setVideoUrlInput('');
    } finally {
      setFetchingThumbnail(false);
    }
  };

  const removeVideo = (index: number) => {
    setVideoLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        text_content: textContent,
        image_urls: imageUrls,
        video_links: videoLinks,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">
          Post Content
        </label>
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm resize-none"
          placeholder="Write your post content..."
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Images
        </label>
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A3A4A] text-white/70 rounded-lg cursor-pointer hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload Images'}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Video Links */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Video Links
        </label>
        {videoLinks.length > 0 && (
          <div className="space-y-2 mb-3">
            {videoLinks.map((video, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-[#0F1923] rounded-lg border border-[#2A3A4A]"
              >
                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt=""
                    className="w-16 h-10 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-accent-secondary capitalize font-medium">
                    {video.source}
                  </p>
                  <p className="text-xs text-white/40 truncate">{video.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="url"
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            placeholder="Paste video URL (YouTube, Vimeo, etc.)"
            className="flex-1 px-4 py-2 rounded-lg bg-[#0F1923] border border-[#2A3A4A] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-secondary/50 text-sm min-h-[44px]"
          />
          <button
            type="button"
            onClick={addVideoLink}
            disabled={fetchingThumbnail || !videoUrlInput.trim()}
            className="px-4 py-2 bg-[#2A3A4A] text-white/70 rounded-lg hover:bg-[#3A4A5A] transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {fetchingThumbnail ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-accent-secondary text-white font-medium rounded-lg hover:bg-accent-secondary/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm min-h-[44px]"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            submitLabel
          )}
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