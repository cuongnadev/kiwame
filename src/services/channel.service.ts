import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server";

type ChannelInsertPayload = {
  owner_id: string;
  name: string;
  avatar_url?: string;
  banner_url?: string;
}

export const ChannelService = {
  create: async (formData: FormData) => {
    const supabase = await createSupabaseServerClient();

    const { data, error: userError } = await supabase.auth.getUser();

    const user = data?.user;

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const channelNameEntry = formData.get('channelName') as string;
    const avatarFileEntry = formData.get('avatar') as File | null;
    const bannerFileEntry = formData.get('banner') as File | null;

    if (typeof channelNameEntry !== 'string') {
      return NextResponse.json({
        success: false,
        error: "Invalid channel name",
      }, { status: 400 });
    }

    const channelName = channelNameEntry.trim();

    if (!channelName) {
      return NextResponse.json({
        success: false,
        error: 'Channel name is required',
      }, { status: 400 });
    }

    const { data: existedChannel, error: checkError } = await supabase
      .from('channels')
      .select('id')
      .eq('name', channelName)
      .neq('owner_id', user.id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({
        success: false,
        error: "Failed to validate channel",
      }, { status: 500 });
    }

    if (existedChannel) {
      return NextResponse.json({
        success: false,
        error: 'Channel name already exists',
      }, { status: 409 })
    }

    const ownerId = user.id;

    let avatarUrl: string | undefined;

    if (avatarFileEntry instanceof File) {
      const ext = avatarFileEntry.name.split(".").pop();
      const fileName = `avatar-${channelName}-${ownerId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("Images")
        .upload(fileName, avatarFileEntry, {
          contentType: avatarFileEntry.type,
        });

      if (uploadError) {
        return NextResponse.json({
          success: false,
          error: 'Avatar upload failed.',
        }, { status: 500 });
      }

      const { data: publicUrl } = supabase.storage
        .from('Images')
        .getPublicUrl(fileName);

      avatarUrl = publicUrl.publicUrl;
    }

    let bannerUrl: string | undefined;

    if (bannerFileEntry instanceof File) {
      const ext = bannerFileEntry.name.split('.').pop();
      const fileName = `banner-${channelName}-${ownerId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('Images')
        .upload(fileName, bannerFileEntry, {
          contentType: bannerFileEntry.type
        });

      if (uploadError) {
        return NextResponse.json({
          success: false,
          error: 'Banner upload failed.',
        }, { status: 500 });
      }

      const { data: publicUrl } = supabase.storage
        .from('Images')
        .getPublicUrl(fileName);

      bannerUrl = publicUrl.publicUrl;
    }

    const payload: ChannelInsertPayload = {
      owner_id: ownerId,
      name: channelName,
      avatar_url: avatarUrl,
      banner_url: bannerUrl
    }

    const { data: channel, error: insertError } = await supabase
      .from('channels')
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: insertError.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      channel
    }, { status: 201 });
  },
}
