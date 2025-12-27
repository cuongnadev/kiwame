import { profileSchema } from "@/schema/profile.schema";
import { UserService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const rawData = {
      username: formData.get("username"),
      full_name: formData.get("full_name"),
    };

    const parsed = profileSchema.safeParse(rawData);

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

    if (avatarFile && avatarFile instanceof File) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/webp"];
      const maxFileSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          {
            success: false,
            error: { avatar: ["Invalid file type. Only JPEG, PNG, GIF, JPG, and WEBP are allowed."] },
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

    return await UserService.completeProfile(formData);
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
