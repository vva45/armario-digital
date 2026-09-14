import { cookies } from "next/headers.js";
import { getSupabaseConfiguration } from "./config.ts";

const ACCESS = "armario_access";
const REFRESH = "armario_refresh";
type SessionPayload = { access_token: string; refresh_token: string; expires_in: number; user: { id: string; email?: string } };

export async function saveSession(session: SessionPayload) {
  const jar = await cookies();
  const common = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
  jar.set(ACCESS, session.access_token, { ...common, maxAge: session.expires_in });
  jar.set(REFRESH, session.refresh_token, { ...common, maxAge: 60 * 60 * 24 * 30 });
}
export async function clearSession() { const jar = await cookies(); jar.delete(ACCESS); jar.delete(REFRESH); }

async function refreshSession(refreshToken: string, url: string, key: string) {
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, { method: "POST", headers: { apikey: key, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: refreshToken }), cache: "no-store" });
  if (!response.ok) return null;
  const session = await response.json() as SessionPayload; await saveSession(session); return session.access_token;
}
export async function authenticatedSupabase() {
  const config = getSupabaseConfiguration(); if (!config) return { state: "unconfigured" as const };
  const jar = await cookies(); let token = jar.get(ACCESS)?.value;
  const verify = async (value: string) => fetch(`${config.url}/auth/v1/user`, { headers: { apikey: config.publishableKey, Authorization: `Bearer ${value}` }, cache: "no-store" });
  let verification = token ? await verify(token) : null;
  if ((!verification || !verification.ok) && jar.get(REFRESH)?.value) {
    token = await refreshSession(jar.get(REFRESH)!.value, config.url, config.publishableKey) ?? undefined;
    verification = token ? await verify(token) : null;
  }
  if (!token || !verification?.ok) { if (token) await clearSession(); return { state: "anonymous" as const }; }
  const user = await verification.json() as { id: string; email?: string };
  const request = (path: string, init: RequestInit = {}) => fetch(`${config.url}${path}`, { ...init, headers: { apikey: config.publishableKey, Authorization: `Bearer ${token}`, ...init.headers }, cache: "no-store" });
  return { state: "authenticated" as const, user, request };
}
