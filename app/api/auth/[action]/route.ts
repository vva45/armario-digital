import { NextResponse } from "next/server";
import { clearSession, saveSession } from "../../../../data/supabase/server";
import { getSupabaseConfiguration } from "../../../../data/supabase/config";

const messages: Record<string, string> = { invalid_credentials: "Email o contraseña incorrectos.", email_not_confirmed: "Confirma el email antes de entrar." };
export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params; const config = getSupabaseConfiguration();
  if (!config) return NextResponse.json({ error: "Conexión pendiente" }, { status: 503 });
  if (action === "logout") { await clearSession(); return NextResponse.json({ ok: true }); }
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string; access_token?: string; refresh_token?: string };
  if (action === "login") {
    const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: config.publishableKey, "Content-Type": "application/json" }, body: JSON.stringify({ email: body.email, password: body.password }), cache: "no-store" });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: messages[data.error_code] ?? "No se pudo iniciar sesión." }, { status: response.status });
    await saveSession(data); return NextResponse.json({ ok: true });
  }
  if (action === "recover") {
    const redirectTo = new URL("/restablecer", request.url).toString();
    const response = await fetch(`${config.url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, { method: "POST", headers: { apikey: config.publishableKey, "Content-Type": "application/json" }, body: JSON.stringify({ email: body.email }), cache: "no-store" });
    if (!response.ok) return NextResponse.json({ error: "No se pudo solicitar la recuperación." }, { status: response.status });
    return NextResponse.json({ ok: true });
  }
  if (action === "exchange") {
    if (!body.access_token || !body.refresh_token) return NextResponse.json({ error: "Enlace incompleto." }, { status: 400 });
    const userResponse = await fetch(`${config.url}/auth/v1/user`, { headers: { apikey: config.publishableKey, Authorization: `Bearer ${body.access_token}` } });
    if (!userResponse.ok) return NextResponse.json({ error: "El enlace ha caducado." }, { status: 401 });
    await saveSession({ access_token: body.access_token, refresh_token: body.refresh_token, expires_in: 3600, user: await userResponse.json() });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Operación no disponible." }, { status: 404 });
}
