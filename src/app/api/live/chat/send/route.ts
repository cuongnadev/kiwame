import { sendChatSchema } from "@/schema/chat.schema";
import { StreamService } from "@/services/stream.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = sendChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await StreamService.sendChat({
      streamId: parsed.data.streamId,
      message: parsed.data.message
    });

    return NextResponse.json({
      success: true,
      data: result.chat,
    });
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "UNAUTHORIZED":
          return NextResponse.json(
            { success: false, error: "Unauthorized." },
            { status: 401 }
          );

        case "INVALID_PAYLOAD":
          return NextResponse.json(
            { success: false, error: "Invalid payload." },
            { status: 400 }
          );

        case "STREAM_NOT_FOUND":
          return NextResponse.json(
            { success: false, error: "Stream not found." },
            { status: 404 }
          );

        case "STREAM_NOT_LIVE":
          return NextResponse.json(
            { success: false, error: "Stream is not live." },
            { status: 403 }
          );

        case "SEND_CHAT_FAILED":
          return NextResponse.json(
            { success: false, error: "Send chat failed." },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
