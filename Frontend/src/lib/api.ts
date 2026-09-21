export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  const url = base ? `${base}${path}` : path.startsWith("/api") ? path : `/api${path}`;
  // Detect FormData to avoid setting JSON header
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  const headers = new Headers(init.headers || {});
  if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const res = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/admin/login?next=${next}`;
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export type AdminMe = { id: string; name: string; email: string; role: string };
export async function getMe(): Promise<AdminMe> {
  return apiFetch<AdminMe>('/api/auth/me');
}
