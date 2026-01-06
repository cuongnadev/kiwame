import { StreamService } from "@/services/stream.service";

export async function POST(req: Request) {
  return await StreamService.webhook(req);
}
