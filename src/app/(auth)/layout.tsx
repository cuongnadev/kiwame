import React from 'react';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function Authlayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center bg-linear-to-br from-[#0F172A] via-[#581C87] to-[#0F172A] overflow-hidden">
        {children}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
          © 2025 Kiwame — Watch. Stream. Anywhere.
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // If a logged-in user doesn't have a profile yet, render the child pages
    // (e.g. the Complete Profile page) instead of redirecting — this avoids
    // redirect loops when already on /complete-profile.
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center bg-linear-to-br from-[#0F172A] via-[#581C87] to-[#0F172A] overflow-hidden">
        {children}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500">
          © 2025 Kiwame — Watch. Stream. Anywhere.
        </div>
      </div>
    );
  }

  redirect("/");
}

