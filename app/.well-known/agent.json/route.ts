import { NextRequest, NextResponse } from "next/server";
import { buildAgentCard } from "../../../lib/agent-card";

export function GET(req: NextRequest) {
  return NextResponse.json(buildAgentCard(req.nextUrl.origin), {
    headers: { "cache-control": "public, max-age=300" }
  });
}
