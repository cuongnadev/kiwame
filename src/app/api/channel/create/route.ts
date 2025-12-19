import { channelSchema } from "@/schema/channel.schema";
import { ChannelService } from "@/services/channel.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const channelName = formData.get("channelName");

    const parsed = channelSchema.safeParse(channelName);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const avatarFile = formData.get("avatar");
    const bannerFile = formData.get("banner");

    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 5 * 1024 * 1024;

    if (avatarFile && avatarFile instanceof File) {
      if (!allowedImageTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          {
            success: false,
            error: { avatar: ["Invalid file type. Only JPEG, PNG, and GIF are allowed."] },
          },
          { status: 400 }
        );
      }

      if (avatarFile.size > maxFileSize) {
        return NextResponse.json(
          {
            success: false,
            error: { avatar: ["File size exceeds the 5MB limit."] },
          },
          { status: 400 }
        );
      }
    }

    if (bannerFile && bannerFile instanceof File) {
      if (!allowedImageTypes.includes(bannerFile.type)) {
        return NextResponse.json(
          {
            success: false,
            error: { banner: ["Invalid file type. Only JPEG, PNG, and GIF are allowed."] },
          },
          { status: 400 }
        );
      }

      if (bannerFile.size > maxFileSize) {
        return NextResponse.json(
          {
            success: false,
            error: { banner: ["File size exceeds the 5MB limit."] },
          },
          { status: 400 }
        );
      }
    }

    return await ChannelService.create(formData);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}
