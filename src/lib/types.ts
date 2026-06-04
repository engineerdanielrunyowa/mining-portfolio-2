export interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  profile_image_url: string;
  landing_background_url: string;
  phone: string;
  email: string;
  notification_email: string;
  bio: string;
  linkedin_url: string;
  facebook_url: string;
  instagram_url: string;
  x_url: string;
  threads_url: string;
  whatsapp_url: string;
  show_linkedin: boolean;
  show_facebook: boolean;
  show_instagram: boolean;
  show_x: boolean;
  show_threads: boolean;
  show_whatsapp: boolean;
  cv_file_url: string;
  cv_file_name: string;
  demo_mode: boolean;
}

export interface Post {
  id: string;
  created_at: string;
  text_content: string;
  image_urls: string[];
  video_links: VideoLink[];
  slug: string;
}

export interface VideoLink {
  url: string;
  source: string;
  thumbnail_url: string;
}

export interface Specialisation {
  id: string;
  display_order: number;
  title: string;
  description: string;
  icon_url: string;
  visible: boolean;
}

export interface Project {
  id: string;
  display_order: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  start_date: string;
  end_date: string;
  visible: boolean;
}

export interface ContactSubmission {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  message: string;
  email_sent: boolean;
}

export interface PaginatedPosts {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}