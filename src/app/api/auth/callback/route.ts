import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createSupabaseServerClient();

  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL("/complete-profile", request.url));
}
