import { updateSupabaseSession } from "@/lib/supabase/middleware"
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/live")) {
    return NextResponse.next();
  }

  return await updateSupabaseSession(request);
}
