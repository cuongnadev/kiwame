import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';
import React from 'react'
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/");

  return <LoginForm />;
}

