export type ApiError = { error: string };

const JSON_HEADERS = { "Content-Type": "application/json" };

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = { ...(init?.headers || {}), ...JSON_HEADERS };
  if (token) (headers as any).Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = (await res.json()) as ApiError;
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return (await res.json()) as T;
}
