import { registerSchema } from "@/schema/auth.schema";
import { AuthService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = registerSchema.safeParse(body)

  if(!parsed.success) {
    return NextResponse.json({
      success: false,
      error: parsed.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  const { email, password } = parsed.data;

  return AuthService.register(email, password);
}
