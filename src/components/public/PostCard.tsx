```tsx
'use client';

import { useState } from 'react';
import { Share2, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Linkify from 'linkify-react';
import type { Post } from '@/lib/types';
import { getRelativeTime, formatFullDate } from '@/lib/timeUtils';
import VideoEmbed from './VideoEmbed';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [copiedToast, setCopiedToast] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const shareUrl = `${
    typeof window !== 'undefined' ? window.location.origin : ''
  }/post/${post.slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.text_content.substring(0, 60),
          text: post.text_content.substring(0, 120),
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const images = post.image_urls || [];
  const videos = post.video_links || [];

  const linkifyOptions = {
    target: '_blank',
    rel: 'noopener noreferrer',
    className:
      'text-accent-primary dark:text-accent-secondary underline break-all hover:opacity-80 transition-opacity',
  };

  return (
    <article className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-bg-secondary/50 dark:border-dark-bg/50">
      {/* Images */}
      {images.length > 0 && (
        <div className="relative">
          <img
            src={images[currentImage]}
            alt={`Post image ${currentImage + 1}`}
            className="w-full h-auto object-contain"
            loading="lazy"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImage((p) =>
                    p === 0 ? images.length - 1 : p - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() =>
                  setCurrentImage((p) =>
                    p === images.length - 1 ? 0 : p + 1
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentImage
                        ? 'bg-accent-secondary'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Text Content */}
        {post.text_content && (
          <Linkify options={linkifyOptions}>
            <div className="text-text-main dark:text-dark-text text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-4">
              {post.text_content}
            </div>
          </Linkify>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="space-y-3 mb-4">
            {videos.map((video, i) => (
              <VideoEmbed key={i} video={video} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-bg-secondary/50 dark:border-dark-bg/30">
          <div
            className="flex items-center gap-1.5 text-xs text-text-main/50 dark:text-dark-text/40"
            title={formatFullDate(post.created_at)}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{getRelativeTime(post.created_at)}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-accent-primary dark:text-accent-secondary hover:bg-bg-secondary dark:hover:bg-dark-bg rounded-lg transition-colors min-h-[44px]"
            aria-label="Share post"
          >
            {copiedToast ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
```
