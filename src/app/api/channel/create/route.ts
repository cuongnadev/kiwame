import { ChannelService } from "@/services/channel.service";

export async function POST(req: Request) {
  const formData = await req.formData();
  return ChannelService.create(formData);
}
