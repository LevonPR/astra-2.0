import { NextRequest, NextResponse } from "next/server";
import { buildAgentCard } from "../../../lib/agent-card";
import { publicOrigin } from "../../../lib/public-origin";

export function GET(req: NextRequest) {
  return NextResponse.json(buildAgentCard(publicOrigin(req)), {
    headers: { "cache-control": "public, max-age=300" }
  });
}
