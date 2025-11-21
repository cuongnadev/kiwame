import { AuthService } from "@/services/auth.service";

export async function POST() {
  return AuthService.logout();
}
