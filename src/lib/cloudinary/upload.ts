import { UploadApiResponse } from "cloudinary";
import { createCloudinary } from "./cloudinary";

const cloudinary = createCloudinary();
export async function uploadVideo(file: File, video_id: string) {
    const buffer = Buffer.from(await file.arrayBuffer())
    const MAX = 90 * 1024 * 1024;
    const totalPart = Math.ceil(buffer.length / MAX)

    for (let i = 0; i < totalPart; i++) {
        const start = i * MAX;
        const end = Math.min(start + MAX, buffer.byteLength)
        const chunk = buffer.subarray(start, end)

        const uploadRes: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'video',
                    folder: "videos",
                    public_id: `${video_id}_part_${i}`,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse)
                }
            ).end(chunk)
        });
        const res = await fetch("/api/upload/video-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                video_id,
                part_index: i,
                cloud_url: uploadRes.secure_url,
            }),
        });
        const data = await res.json();
        console.log(data)
    }
}   