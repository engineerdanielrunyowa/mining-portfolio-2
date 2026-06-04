import type { Metadata } from 'next';

// This page handles shared post URLs with OG metadata
// For static export on Cloudflare Pages, we use client-side rendering

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  try {
    const res = await fetch(`${apiUrl}/api/posts/${params.slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const { data } = await res.json();
      const description = data.text_content?.substring(0, 160) || 'Post';
      const ogImage =
        data.image_urls?.[0] || data.video_links?.[0]?.thumbnail_url || '';

      return {
        title: description.substring(0, 60),
        description,
        openGraph: {
          title: description.substring(0, 60),
          description,
          images: ogImage ? [{ url: ogImage }] : [],
          type: 'article',
        },
        twitter: {
          card: 'summary_large_image',
          title: description.substring(0, 60),
          description,
          images: ogImage ? [ogImage] : [],
        },
      };
    }
  } catch {
    // fallback
  }
  return {
    title: 'Post',
    description: 'Mining Engineer Portfolio Post',
  };
}

export default function PostPage({ params }: PageProps) {
  return <PostPageClient slug={params.slug} />;
}

// Client component for the actual rendering
import PostPageClient from './PostPageClient';