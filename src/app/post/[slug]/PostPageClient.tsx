'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import PostCard from '@/components/public/PostCard';
import { getPostBySlug } from '@/lib/api';
import { mockPosts } from '@/lib/mockData';
import type { Post } from '@/lib/types';
import { useTheme } from '@/hooks/useTheme';

export default function PostPageClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isDark, toggle, mounted } = useTheme();

  useEffect(() => {
    async function load() {
      try {
        const res = await getPostBySlug(slug);
        setPost(res.data);
      } catch {
        // Try mock data
        const mockPost = mockPosts.find((p) => p.slug === slug);
        if (mockPost) {
          setPost(mockPost);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main dark:bg-dark-bg">
        <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main dark:bg-dark-bg px-4">
        <p className="text-lg text-text-main/60 dark:text-dark-text/50 mb-4">Post not found</p>
        <a
          href="/"
          className="flex items-center gap-2 text-accent-secondary hover:text-accent-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-accent-secondary hover:text-accent-secondary/80 transition-colors mb-8 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>
        <PostCard post={post} />
      </div>
    </div>
  );
}