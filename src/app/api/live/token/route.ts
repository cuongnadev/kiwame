import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { kiwameConfig } from "@/config/kiwame.config";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room")!;

  const token = new AccessToken(
    kiwameConfig.livekitApiKey,
    kiwameConfig.livekitApiSecret,
    { identity: "viewer-" + Math.random() }
  );

  token.addGrant({
    room,
    roomJoin: true,
    canPublish: false,
    canSubscribe: true,
    canPublishData: true,
  });

  return NextResponse.json({ token: await token.toJwt() });
}
