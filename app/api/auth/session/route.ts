import { NextResponse } from "next/server";
import { authenticatedSupabase } from "../../../../data/supabase/server";
export async function GET() { const auth = await authenticatedSupabase(); return NextResponse.json(auth.state === "authenticated" ? { state: auth.state, email: auth.user.email } : { state: auth.state }, { headers: { "Cache-Control": "private, no-store" } }); }
