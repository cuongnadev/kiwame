import { NextRequest } from "next/server";
import { StreamService } from "@/services/stream.service";

export async function GET(req: NextRequest) {
  return await StreamService.getToken(req);
}
