import { VideoService } from "@/services/video.service";
import { NextResponse } from "next/server";

export async function GET(){
    const listVideos = await VideoService.selectMyVideos()
    return NextResponse.json(listVideos);
}