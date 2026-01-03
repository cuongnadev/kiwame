import { NextResponse } from "next/server";

import { VideoService } from "@/services/video.service";

export async function GET() {
  const listVideos = await VideoService.selectMyVideos()
  return NextResponse.json(listVideos);
}
