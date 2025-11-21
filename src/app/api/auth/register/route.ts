import { AuthService } from "@/services/auth.service";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  
  return AuthService.register(email, password);
}
