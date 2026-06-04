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

export function getVideoThumbnail(url: string, source: string): string {
  if (source === 'youtube') {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
  }
  // For other platforms, return empty — real implementation would use oEmbed APIs
  return '';
}