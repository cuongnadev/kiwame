import { kiwameConfig } from "@/config/kiwame.config";
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';

export async function GET() {
  const token = jwt.sign(
    {
      type: "stream-key",
      exp: Math.floor(Date.now() / 1000) + 60 * 30,
    },
    kiwameConfig.streamSecret,
  );

  return NextResponse.json({ success: true, key: token });
}
