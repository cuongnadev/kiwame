import { loginSchema } from "@/schema/auth.schema";
import { AuthService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      error: parsed.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  const { email, password, rememberMe } = parsed.data;

  return AuthService.login(email, password, rememberMe);
}
