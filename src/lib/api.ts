const API_BASE = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || window.location.origin)
  : (process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:5000');

export async function apiFetch<T = any>(path: string, options: RequestInit = {}) {
  const base = API_BASE.replace(/\/$/, '');
  const url = `${base}/${path.replace(/^\//, '')}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers as any || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  // attempt JSON parse, otherwise return text
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json() as Promise<T>;
  return res.text() as unknown as T;
}

export default apiFetch;
