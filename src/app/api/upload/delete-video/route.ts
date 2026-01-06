import { VideoService } from "@/services/video.service";

export async function DELETE(req: Request) {
    const form = await req.formData();
    const listId = JSON.parse((form.get("listId") as string) || "[]");
    listId.forEach(async (id: string) => {
        await VideoService.deleteVideo({ id });
    })
}