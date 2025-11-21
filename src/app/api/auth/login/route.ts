import { AuthService } from "@/services/auth.service";

export async function POST(req: Request) {
  const { email, password, rememberMe } = await req.json();

  return AuthService.login(email, password, rememberMe);
}
