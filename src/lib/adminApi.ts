const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function adminFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function adminLogin(password: string) {
  return adminFetch<{ success: boolean; message: string }>('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
}

export async function adminLogout() {
  return adminFetch<{ success: boolean }>('/api/admin/logout', {
    method: 'POST',
  });
}

// Profile
export async function getAdminProfile() {
  return adminFetch<{ data: import('./types').Profile }>('/api/admin/profile');
}

export async function updateAdminProfile(data: Partial<import('./types').Profile>) {
  return adminFetch<{ data: import('./types').Profile }>('/api/admin/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Demo Mode
export async function updateDemoMode(enabled: boolean) {
  return adminFetch<{ success: boolean }>('/api/admin/demo-mode', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demo_mode: enabled }),
  });
}

// Posts
export async function getAdminPosts(page = 1, limit = 20) {
  return adminFetch<{ data: import('./types').PaginatedPosts }>(
    `/api/admin/posts?page=${page}&limit=${limit}`
  );
}

export async function createAdminPost(data: {
  text_content: string;
  image_urls: string[];
  video_links: import('./types').VideoLink[];
}) {
  return adminFetch<{ data: import('./types').Post }>('/api/admin/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateAdminPost(
  id: string,
  data: {
    text_content?: string;
    image_urls?: string[];
    video_links?: import('./types').VideoLink[];
  }
) {
  return adminFetch<{ data: import('./types').Post }>(`/api/admin/posts?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteAdminPost(id: string) {
  return adminFetch<{ success: boolean }>(`/api/admin/posts?id=${id}`, {
    method: 'DELETE',
  });
}

// Specialisations
export async function getAdminSpecialisations() {
  return adminFetch<{ data: import('./types').Specialisation[] }>(
    '/api/admin/specialisations'
  );
}

export async function createAdminSpecialisation(
  data: Omit<import('./types').Specialisation, 'id'>
) {
  return adminFetch<{ data: import('./types').Specialisation }>(
    '/api/admin/specialisations',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

export async function updateAdminSpecialisation(
  id: string,
  data: Partial<import('./types').Specialisation>
) {
  return adminFetch<{ data: import('./types').Specialisation }>(
    `/api/admin/specialisations?id=${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAdminSpecialisation(id: string) {
  return adminFetch<{ success: boolean }>(
    `/api/admin/specialisations?id=${id}`,
    { method: 'DELETE' }
  );
}

// Projects
export async function getAdminProjects() {
  return adminFetch<{ data: import('./types').Project[] }>('/api/admin/projects');
}

export async function createAdminProject(
  data: Omit<import('./types').Project, 'id'>
) {
  return adminFetch<{ data: import('./types').Project }>('/api/admin/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateAdminProject(
  id: string,
  data: Partial<import('./types').Project>
) {
  return adminFetch<{ data: import('./types').Project }>(
    `/api/admin/projects?id=${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
}

export async function deleteAdminProject(id: string) {
  return adminFetch<{ success: boolean }>(`/api/admin/projects?id=${id}`, {
    method: 'DELETE',
  });
}

// File uploads
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/admin/upload/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.url;
}

export async function uploadSVG(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/admin/upload/svg`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.url;
}

export async function uploadCV(
  file: File,
  filename: string
): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('filename', filename);
  const res = await fetch(`${API_URL}/api/admin/cv/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) throw new Error('CV upload failed');
  return res.json();
}

export async function deleteStorageFile(path: string) {
  return adminFetch<{ success: boolean }>('/api/admin/storage/file', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  });
}

// Contact submissions
export async function getContactSubmissions() {
  return adminFetch<{ data: import('./types').ContactSubmission[] }>(
    '/api/admin/contact-submissions'
  );
}

// Video thumbnail
export async function getVideoThumbnail(
  url: string
): Promise<{ thumbnail_url: string; source: string }> {
  return adminFetch<{ thumbnail_url: string; source: string }>(
    `/api/admin/video-thumbnail?url=${encodeURIComponent(url)}`
  );
}