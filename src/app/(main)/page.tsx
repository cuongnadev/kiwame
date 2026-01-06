import UserHome from "@/app/(main)/UserHome";
import GuestHome from "@/app/(main)/GuestHome";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {user ? (
        <UserHome />
      ) : (
        <GuestHome />
      )}
    </>
  );
}
