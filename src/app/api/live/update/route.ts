import { validateImage } from "@/helper/validateImage";
import { streamSchema } from "@/schema/stream.schema";
import { StreamService } from "@/services/stream.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
    };

    const parsed = streamSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const thumbnail = formData.get("thumbnail");

    if (thumbnail instanceof File) {
      const error = validateImage(thumbnail, "thumbnail");
      if (error) {
        return NextResponse.json(
          { success: false, error },
          { status: 400 }
        );
      }
    }

    await StreamService.update(formData);

    return NextResponse.json({
      success: true,
      message: "Stream updated successfully.",
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "UNAUTHORIZED":
          return NextResponse.json(
            { success: false, error: "Unauthorized." },
            { status: 401 }
          );

        case "CHANNEL_NOT_FOUND":
          return NextResponse.json(
            { success: false, error: "User does not have channel." },
            { status: 403 }
          );

        case "STREAM_NOT_FOUND":
          return NextResponse.json(
            { success: false, error: "Stream not found." },
            { status: 404 }
          );

        case "THUMBNAIL_UPLOAD_FAILED":
          return NextResponse.json(
            { success: false, error: "Thumbnail upload failed." },
            { status: 500 }
          );

        case "UPDATE_STREAM_FAILED":
          return NextResponse.json(
            { success: false, error: "Update stream failed." },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    )
  }
}
