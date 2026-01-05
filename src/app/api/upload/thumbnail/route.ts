import { createCloudinary } from "@/lib/cloudinary/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

const cloudinary = createCloudinary();
export async function POST(req: NextRequest) {
    const form = await req.formData();
    const thumbnail = form.get("thumbnail") as File;
    if (!thumbnail) {
        return new Response("No thumbnail file", { status: 400 });
    }

    const arrayBuffer = await thumbnail.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: "thumbnails",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                }
            )
            .end(buffer);
    });

    return NextResponse.json({
        success: true,
        thumbnail_url: uploadResult.secure_url
    });

}