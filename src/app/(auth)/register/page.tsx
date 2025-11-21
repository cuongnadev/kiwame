import React from 'react'
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server'
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/");

  return <RegisterForm />;
}
