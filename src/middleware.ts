import { updateSupabaseSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const response = await updateSupabaseSession(request);
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/studio/channel/")) {
    const channelName = pathname.split("/")[3];

    if (!user) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    const { data: channel } = await supabase
      .from("channels")
      .select("id")
      .eq("name", channelName)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!channel) {
      const url = new URL("/", origin);
      url.searchParams.set("openCreateChannel", "true");
      return NextResponse.redirect(url);
    }

    return response;
  }

  if (pathname.startsWith("/@")) {
    const channelName = pathname.split("/")[1];

    const { data: channel } = await supabase
      .from("channels")
      .select("id")
      .eq("name", channelName)
      .maybeSingle();

    if (!channel) {
      return NextResponse.redirect(new URL("/not-found", origin));
    }

    return response;
  }

  const isSingleSlug =
    pathname.split("/").length === 2 &&
    pathname !== "/" &&
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/complete-profile" &&
    pathname !== "/account" &&
    pathname !== "/playlists" &&
    pathname !== "/shorts" &&
    pathname !== "/subscriptions" &&
    pathname !== "/watch-later" &&
    pathname !== "/settings" &&
    pathname !== "/help" &&
    pathname !== "/feedback" &&
    pathname !== "/report-history" &&
    pathname !== "/not-found";

  if (isSingleSlug) {
    return NextResponse.redirect(new URL("/not-found", origin));
  }

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
