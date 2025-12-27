import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { kiwameConfig } from "@/config/kiwame.config";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL("/register?error=confirm_failed", kiwameConfig.nextPublicSiteUrl)
    );
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/register?error=confirm_failed", kiwameConfig.nextPublicSiteUrl)
    );
  }

  return NextResponse.redirect(
    new URL("/complete-profile", kiwameConfig.nextPublicSiteUrl)
  );
}
