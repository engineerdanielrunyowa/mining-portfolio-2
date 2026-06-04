'use client';

import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import type { VideoLink } from '@/lib/types';
import { getVideoEmbedUrl, detectVideoSource } from '@/lib/videoUtils';

interface VideoEmbedProps {
  video: VideoLink;
}

export default function VideoEmbed({ video }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const source = video.source || detectVideoSource(video.url);
  const embedUrl = getVideoEmbedUrl(video.url, source);
  const canEmbed = !!embedUrl;

  if (playing && canEmbed) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`${embedUrl}?autoplay=1`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title="Video"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video rounded-lg overflow-hidden bg-accent-primary/10 dark:bg-dark-bg-secondary cursor-pointer group"
      onClick={() => {
        if (canEmbed) {
          setPlaying(true);
        } else {
          window.open(video.url, '_blank', 'noopener,noreferrer');
        }
      }}
    >
      {video.thumbnail_url ? (
        <img
          src={video.thumbnail_url}
          alt="Video thumbnail"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-accent-primary/20 dark:bg-dark-bg-secondary">
          <Play className="w-12 h-12 text-accent-secondary/50" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-accent-secondary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          {canEmbed ? (
            <Play className="w-6 h-6 text-white ml-1" />
          ) : (
            <ExternalLink className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      {/* Source Badge */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-xs text-white font-medium capitalize">
        {source}
      </div>
    </div>
  );
}