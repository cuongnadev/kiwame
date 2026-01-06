import { VideoService } from "@/services/video.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();

        const video = await VideoService.updateVideo({
            id: form.get("id"),
            title: form.get("title"),
            description: form.get("description"),
            tags: JSON.parse((form.get("tags") as string) || "[]"),
            visibility: form.get("visibility"),
            for_children: form.get("for_children") === "true",
            is_draft: form.get("is_draft") === "true",
            thumbnail_url: form.get("thumbnail_url"),
        });

        return NextResponse.json({
            success: true,
            video,
        });

    } catch (err: unknown) {
        console.error("Update video error:", err);

        const message =
            err instanceof Error ? err.message : "Update video failed";

        return NextResponse.json(
            {
                success: false,
                message,
            },
            { status: 400 }
        );
    }
}
