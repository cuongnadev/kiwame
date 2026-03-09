import { updateSupabaseSession } from "@/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const allowedSingleSlugs = new Set([
  "/login",
  "/register",
  "/complete-profile",
  "/account",
  "/playlists",
  "/shorts",
  "/subscriptions",
  "/watch-later",
  "/settings",
  "/help",
  "/feedback",
  "/report-history",
  "/not-found",
]);

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const lastSegment = pathname.split("/").pop() || "";
  const looksLikeFile = /\.[a-zA-Z0-9]+$/.test(lastSegment);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/.well-known") ||
    pathname.startsWith("/api") ||
    looksLikeFile
  ) {
    return NextResponse.next();
  }

  const { response, user, supabase } = await updateSupabaseSession(request);

  if (pathname === "/studio/channel") {
    if (!user) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    const { data: channel, error } = await supabase
      .from("channels")
      .select("id, name")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error || !channel) {
      const url = new URL("/", origin);
      url.searchParams.set("openCreateChannel", "true");
      return NextResponse.redirect(url);
    }

    return NextResponse.redirect(
      new URL(`/studio/channel/${encodeURIComponent(channel.name)}`, origin)
    );
  }

  if (pathname.startsWith("/studio/channel/")) {
    const segments = pathname.split("/");
    const rawName = segments[3];

    if (!user) {
      return NextResponse.redirect(new URL("/login", origin));
    }

    if (!rawName) {
      const { data: channel, error } = await supabase
        .from("channels")
        .select("id, name")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error || !channel) {
        const url = new URL("/", origin);
        url.searchParams.set("openCreateChannel", "true");
        return NextResponse.redirect(url);
      }

      return NextResponse.redirect(
        new URL(`/studio/channel/${encodeURIComponent(channel.name)}`, origin)
      );
    }

    const channelName = decodeURIComponent(rawName);

    const { data: channel, error } = await supabase
      .from("channels")
      .select("id")
      .eq("name", channelName)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error || !channel) {
      const url = new URL("/", origin);
      url.searchParams.set("openCreateChannel", "true");
      return NextResponse.redirect(url);
    }

    return response;
  }

  if (pathname.startsWith("/@")) {
    const segments = pathname.split("/");

    if (segments.length !== 2) {
      return NextResponse.redirect(new URL("/not-found", origin));
    }

    const rawName = segments[1];

    if (!rawName || rawName.length <= 1) {
      return NextResponse.redirect(new URL("/not-found", origin));
    }

    const channelName = decodeURIComponent(rawName);

    const { data: channel, error } = await supabase
      .from("channels")
      .select("id")
      .eq("name", channelName)
      .maybeSingle();

    if (error || !channel) {
      return NextResponse.redirect(new URL("/not-found", origin));
    }

    return response;
  }

  const isSingleSlug =
    pathname.split("/").length === 2 &&
    pathname !== "/" &&
    !allowedSingleSlugs.has(pathname);

  if (isSingleSlug) {
    return NextResponse.redirect(new URL("/not-found", origin));
  }

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
