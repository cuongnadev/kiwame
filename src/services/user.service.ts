import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type ProfileUpsertPayload = {
  id: string;
  username: string;
  full_name: string;
  updated_at: string;
  avatar_url?: string;
};

export const UserService = {
  completeProfile: async (formData: FormData) => {
    const supabase = await createSupabaseServerClient();

    const { data, error: userError } = await supabase.auth.getUser();

    const user = data?.user;

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const usernameEntry = formData.get("username");
    const fullNameEntry = formData.get("full_name");
    const avatarEntry = formData.get("avatar");

    if (
      typeof usernameEntry !== "string" ||
      typeof fullNameEntry !== "string"
    ) {
      return NextResponse.json({
        success: false,
        error: "Invalid form data",
      }, { status: 400 });
    }

    const username = usernameEntry.trim();
    const fullName = fullNameEntry.trim();

    if (!username || !fullName) {
      return NextResponse.json({
        success: false,
        error: "Username and Fullname are required",
      }, { status: 400 });
    }

    const { data: existedUser, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({
        success: false,
        error: "Failed to validate username",
      },  { status: 500 });
    }

    if (existedUser) {
      return NextResponse.json({
        success: false,
        error: "Username already exists",
      }, { status: 409 });
    }

    let avatarUrl: string | undefined;

    if (avatarEntry instanceof File) {
      const ext = avatarEntry.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("Images")
        .upload(fileName, avatarEntry, {
          contentType: avatarEntry.type,
        });

      if (uploadError) {
        return NextResponse.json({
          success: false,
          error: "Avatar upload failed.",
        }, { status: 500 });
      }

      const { data: publicUrl } = supabase.storage
        .from("Images")
        .getPublicUrl(fileName);

      avatarUrl = publicUrl.publicUrl;
    }

    const payload: ProfileUpsertPayload = {
      id: user.id,
      username,
      full_name: fullName,
      updated_at: new Date().toISOString(),
      ...(avatarUrl && { avatar_url: avatarUrl }),
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(payload);

    if (profileError) {
      return NextResponse.json({
        success: false,
        error: profileError.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    }, { status: 200 });
  },
};
