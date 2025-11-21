import { createSupabaseServerClient } from "@/lib/supabase/server";
import UserHome from "./UserHome";
import GuestHome from "./GuestHome";

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
