export interface VideoInfo {
  source: string;
  thumbnailUrl: string;
  embedUrl: string;
}

export function detectVideoSource(url: string): string {
  if (!url) return 'unknown';
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('vimeo.com')) return 'vimeo';
  if (u.includes('facebook.com') || u.includes('fb.watch')) return 'facebook';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('twitter.com') || u.includes('x.com')) return 'x';
  if (u.includes('linkedin.com')) return 'linkedin';
  if (u.includes('drive.google.com')) return 'googledrive';
  return 'unknown';
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getVideoEmbedUrl(url: string, source: string): string | null {
  switch (source) {
    case 'youtube': {
      const id = getYouTubeId(url);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    case 'vimeo': {
      const id = getVimeoId(url);
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    default:
      return null;
  }
}

export function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    youtube: 'Youtube',
    vimeo: 'Video',
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'Music2',
    x: 'Twitter',
    linkedin: 'Linkedin',
    googledrive: 'HardDrive',
    unknown: 'ExternalLink',
  };
  return icons[source] || icons.unknown;
}