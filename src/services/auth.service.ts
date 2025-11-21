import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const AuthService = {
  register: async (email: string, password: string) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return NextResponse.json({ success: false, error: error.message });


    return NextResponse.json({ success: true, data: data.user });
  },

  login: async (email: string, password: string, rememberMe: boolean) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return NextResponse.json({ success: false, error: error.message });

    if (!data.user?.email_confirmed_at) {
      return NextResponse.json({ success: false, error: "Please confirm your email first." });
    }

    const response = NextResponse.json({ success: true });
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
    const response = NextResponse.json({ success: true });
    response.cookies.delete({
      name: "sb_session",
      path: "/",
    });
    return response;
  }
}
