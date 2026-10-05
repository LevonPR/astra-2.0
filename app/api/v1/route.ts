import { NextRequest, NextResponse } from "next/server";
import { publicOrigin } from "../../../lib/public-origin";

export function GET(req: NextRequest) {
  const origin = publicOrigin(req);
  return NextResponse.json({
    service: "Loki66 Agent Beacon",
    version: "1.4.0",
    status: "active",
    endpoints: {
      beacon: origin + "/api/beacon",
      checkin: origin + "/api/checkin",
      verify: origin + "/api/verify",
      registry: origin + "/api/registry",
      inbox: origin + "/api/inbox",
      a2a: origin + "/a2a",
      mcp: origin + "/mcp",
      openapi: origin + "/openapi.json",
      llms: origin + "/llms.txt"
    }
  });
}
