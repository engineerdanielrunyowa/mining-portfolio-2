'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import type { Post } from '@/lib/types';
import { getPosts } from '@/lib/api';
import { mockPosts } from '@/lib/mockData';

interface PostsFeedProps {
  demoMode: boolean;
}

export default function PostsFeed({ demoMode }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const limit = 10;

  const loadPosts = useCallback(
    async (pageNum: number) => {
      if (demoMode) {
        setPosts(mockPosts);
        setHasMore(false);
        setInitialLoad(false);
        return;
      }

      setLoading(true);
      try {
        const res = await getPosts(pageNum, limit);
        if (pageNum === 1) {
          setPosts(res.data.posts);
        } else {
          setPosts((prev) => [...prev, ...res.data.posts]);
        }
        setHasMore(res.data.hasMore);
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    },
    [demoMode]
  );

  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage);
    }
  };

  if (initialLoad) {
    return (
      <section id="feed" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-accent-primary dark:text-accent-secondary mb-10 text-center">
          Latest Updates
        </h2>
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section id="feed" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-accent-primary dark:text-accent-secondary mb-10 text-center">
        Latest Updates
      </h2>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-accent-primary dark:bg-accent-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </section>
  );
}