import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { kiwameConfig } from "@/config/kiwame.config";

export const AuthService = {
  register: async (email: string, password: string) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${kiwameConfig.nextPublicSiteUrl}/api/auth/callback`
      }
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });


    return NextResponse.json({ success: true, data: data.user }, { status: 201 });
  },

  login: async (email: string, password: string, rememberMe: boolean) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 401 });

    if (!data.user?.email_confirmed_at) {
      return NextResponse.json({ success: false, error: "Please confirm your email first." }, { status: 403 });
    }

    const response = NextResponse.json({ success: true }, { status: 200 });
    if (rememberMe) {
      response.cookies.set({
        name: "sb_session",
        value: data.session?.access_token || "",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    } else {
      response.cookies.set({
        name: "sb_session",
        value: data.session?.access_token || "",
        httpOnly: true,
        path: "/",
        maxAge: 0,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }
    return response;
  },

  logout: async () => {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete({
      name: "sb_session",
      path: "/",
    });
    return response;
  }
}
