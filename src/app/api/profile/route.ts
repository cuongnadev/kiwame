import { UserService } from "@/services/user.service";

export async function POST(req: Request) {
  const formData = await req.formData();
  return UserService.completeProfile(formData);
}
