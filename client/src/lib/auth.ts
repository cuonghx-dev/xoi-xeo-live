const TOKEN_KEY = 'chat_token';

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function parseDisplayName(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.displayName as string) ?? null;
  } catch {
    return null;
  }
}

export async function login(username: string): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    },
  );
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(err.message ?? 'Login failed');
  }
  const data = (await res.json()) as { token: string };
  saveToken(data.token);
}
