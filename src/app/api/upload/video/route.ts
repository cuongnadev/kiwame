import { NextResponse } from "next/server";

import { VideoService } from "@/services/video.service";

export async function POST(req: Request) {
  const form = await req.formData();
  const title = form.get("title");

  const video = await VideoService.createVideo({
    title: title
  })

  return NextResponse.json({
    success: true,
    video: video
  },
    { status: 200 }
  );
}
