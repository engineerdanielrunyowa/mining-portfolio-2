const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `API error: ${res.status}`);
  }

  return res.json();
}

// -------------------- PROFILE --------------------
export async function getProfile(): Promise<{ data: any }> {
  return fetchAPI('/api/profile');
}

// -------------------- POSTS --------------------
export async function getPosts(page = 1, limit = 10): Promise<{ data: any }> {
  return fetchAPI(`/api/posts?page=${page}&limit=${limit}`);
}

export async function getPostBySlug(slug: string): Promise<{ data: any }> {
  return fetchAPI(`/api/posts/${slug}`);
}

// -------------------- SPECIALISATIONS --------------------
export async function getSpecialisations(): Promise<{ data: any[] }> {
  return fetchAPI('/api/specialisations');
}

// -------------------- PROJECTS --------------------
export async function getProjects(): Promise<{ data: any[] }> {
  return fetchAPI('/api/projects');
}

// -------------------- CONTACT --------------------
export async function submitContact(data: {
  sender_name: string;
  sender_email: string;
  message: string;
  turnstile_token: string;
}): Promise<{ success: boolean; message: string }> {
  return fetchAPI('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// -------------------- CV --------------------
export function getCVDownloadUrl(): string {
  return `${API_URL}/api/cv/download`;
}
