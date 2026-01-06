import { LikeService } from "@/services/like.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {video_id, user_id, status} =await req.json()
    const data =await LikeService.likeVideo(video_id, user_id, status)
    console.log("Like video route: ",data)
    return NextResponse.json({
        status: "success"
    })
}