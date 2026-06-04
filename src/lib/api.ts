const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
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

export async function getProfile() {
  return fetchAPI<{ data: import('./types').Profile }>('/api/profile');
}

export async function getPosts(page = 1, limit = 10) {
  return fetchAPI<{ data: import('./types').PaginatedPosts }>(
    `/api/posts?page=${page}&limit=${limit}`
  );
}

export async function getPostBySlug(slug: string) {
  return fetchAPI<{ data: import('./types').Post }>(`/api/posts/${slug}`);
}

export async function getSpecialisations() {
  return fetchAPI<{ data: import('./types').Specialisation[] }>('/api/specialisations');
}

export async function getProjects() {
  return fetchAPI<{ data: import('./types').Project[] }>('/api/projects');
}

export async function submitContact(data: {
  sender_name: string;
  sender_email: string;
  message: string;
  turnstile_token: string;
}) {
  return fetchAPI<{ success: boolean; message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getCVDownloadUrl(): string {
  return `${API_URL}/api/cv/download`;
}