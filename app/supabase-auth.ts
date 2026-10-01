// Talks to Supabase's login service over plain web requests (fetch),
// so the site does not need an extra Supabase package installed.
// The saved login ("session") is kept in the browser's localStorage,
// which survives closing the tab.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const STORAGE_KEY = "study-tasks-session";

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // seconds since 1970, when accessToken stops working
  email: string;
};

export function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

type AuthResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: { email?: string };
  email?: string;
  msg?: string;
  message?: string;
  error_description?: string;
  error?: string;
};

async function authRequest(
  path: string,
  body?: object,
  accessToken?: string,
): Promise<{ ok: boolean; status: number; data: AuthResponse }> {
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY ?? "",
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: AuthResponse = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

function errorText(data: AuthResponse): string {
  return (
    data.msg ||
    data.message ||
    data.error_description ||
    data.error ||
    "Something went wrong. Please try again."
  );
}

function toSession(data: AuthResponse): Session | null {
  if (!data.access_token || !data.refresh_token) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    email: data.user?.email ?? "",
  };
}

function saveSession(session: Session | null) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export async function signUp(email: string, password: string): Promise<Session> {
  const { ok, data } = await authRequest("signup", { email, password });
  if (!ok) throw new Error(errorText(data));
  const session = toSession(data);
  if (!session) {
    // Supabase only skips this when email confirmation is turned off.
    throw new Error("Account created, but Supabase wants the email confirmed before logging in.");
  }
  saveSession(session);
  return session;
}

export async function logIn(email: string, password: string): Promise<Session> {
  const { ok, data } = await authRequest("token?grant_type=password", { email, password });
  const session = ok ? toSession(data) : null;
  if (!session) throw new Error(errorText(data));
  saveSession(session);
  return session;
}

export async function logOut(session: Session): Promise<void> {
  // Forget the login in this browser even if the request to Supabase fails.
  saveSession(null);
  await authRequest("logout", {}, session.accessToken).catch(() => undefined);
}

// Called when the page opens: checks whether a saved login is still valid,
// swapping in a fresh one if the old one has expired.
export async function restoreSession(): Promise<Session | null> {
  const saved = loadSession();
  if (!saved) return null;

  const now = Math.floor(Date.now() / 1000);
  if (saved.expiresAt - 60 > now) {
    const { ok, data } = await authRequest("user", undefined, saved.accessToken);
    if (ok && data.email) {
      return { ...saved, email: data.email };
    }
  }

  const { ok, data } = await authRequest("token?grant_type=refresh_token", {
    refresh_token: saved.refreshToken,
  });
  const fresh = ok ? toSession(data) : null;
  saveSession(fresh);
  return fresh;
}
