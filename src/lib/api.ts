const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // 🔥 CRITICAL FIX
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
  const res = await fetchAPI<{ data: any }>('/api/profile');
  return res.data;
}

export async function getPosts(page = 1, limit = 10) {
  const res = await fetchAPI<{ data: any }>(
    `/api/posts?page=${page}&limit=${limit}`
  );
  return res.data;
}

export async function getPostBySlug(slug: string) {
  const res = await fetchAPI<{ data: any }>(`/api/posts/${slug}`);
  return res.data;
}

export async function getSpecialisations() {
  const res = await fetchAPI<{ data: any[] }>('/api/specialisations');
  return res.data;
}

export async function getProjects() {
  const res = await fetchAPI<{ data: any[] }>('/api/projects');
  return res.data;
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
