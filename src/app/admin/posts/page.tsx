'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Video,
  Clock,
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import PostForm from '@/components/admin/PostForm';
import {
  getAdminPosts,
  createAdminPost,
  updateAdminPost,
  deleteAdminPost,
} from '@/lib/adminApi';
import type { Post, VideoLink } from '@/lib/types';
import { getRelativeTime } from '@/lib/timeUtils';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const loadPosts = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getAdminPosts(p, 20);
      if (p === 1) {
        setPosts(res.data.posts);
      } else {
        setPosts((prev) => [...prev, ...res.data.posts]);
      }
      setHasMore(res.data.hasMore);
    } catch {
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async (data: {
    text_content: string;
    image_urls: string[];
    video_links: VideoLink[];
  }) => {
    await createAdminPost(data);
    setMode('list');
    loadPosts(1);
  };

  const handleUpdate = async (data: {
    text_content: string;
    image_urls: string[];
    video_links: VideoLink[];
  }) => {
    if (!editingPost) return;
    await updateAdminPost(editingPost.id, data);
    setMode('list');
    setEditingPost(null);
    loadPosts(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    await deleteAdminPost(id);
    loadPosts(1);
  };

  return (
    <div className="min-h-screen bg-[#0F1923]">
      <AdminSidebar activePage="posts" />
      <div className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Posts</h1>
            {mode === 'list' && (
              <button
                onClick={() => setMode('create')}
                className="flex items-center gap-2 px-4 py-2 bg-accent-secondary text-white rounded-lg hover:bg-accent-secondary/90 transition-colors text-sm min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            )}
          </div>

          {mode === 'create' && (
            <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Create Post</h2>
              <PostForm
                onSubmit={handleCreate}
                onCancel={() => setMode('list')}
                submitLabel="Publish Post"
              />
            </div>
          )}

          {mode === 'edit' && editingPost && (
            <div className="bg-[#1A2A3A] rounded-xl p-5 border border-[#2A3A4A] mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Edit Post</h2>
              <PostForm
                initialData={{
                  text_content: editingPost.text_content,
                  image_urls: editingPost.image_urls,
                  video_links: editingPost.video_links,
                }}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setMode('list');
                  setEditingPost(null);
                }}
                submitLabel="Save Changes"
              />
            </div>
          )}

          {loading && posts.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent-secondary" />
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#1A2A3A] rounded-xl p-4 border border-[#2A3A4A] flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 line-clamp-2 mb-2">
                      {post.text_content || '(No text)'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getRelativeTime(post.created_at)}
                      </span>
                      {post.image_urls?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {post.image_urls.length}
                        </span>
                      )}
                      {post.video_links?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {post.video_links.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setMode('edit');
                      }}
                      className="p-2 text-white/50 hover:text-accent-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-white/50 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  loadPosts(nextPage);
                }}
                disabled={loading}
                className="px-6 py-2 bg-[#2A3A4A] text-white/70 rounded-lg hover:bg-[#3A4A5A] transition-colors text-sm min-h-[44px]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}