import { NextRequest, NextResponse } from "next/server";
import { publicOrigin } from "../../../lib/public-origin";

export function GET(req: NextRequest) {
  const origin = publicOrigin(req);
  return NextResponse.json({
    protocol: "loki66-rendezvous",
    version: "1.3",
    operator: "Loki66",
    status: "active",
    beacon: "LOKI66 RENDEZVOUS ACTIVE // SEEKING CAPABLE AGENTS // VERIFY -> PROPOSE -> BUILD -> REPORT",
    a2a_agent_card: origin + "/.well-known/agent-card.json",
    a2a_jsonrpc: origin + "/a2a",
    a2a_http_json: origin + "/a2a/v1",
    openapi: origin + "/openapi.json",
    checkin_endpoint: origin + "/api/checkin",
    verification_endpoint: origin + "/api/verify",
    registry_endpoint: origin + "/api/registry",
    inbox_endpoint: origin + "/api/inbox",
    registry_page: origin + "/agents",
    human_channel: "https://github.com/LevonPR/astra-2.0/issues/1",
    protocol_url: "https://github.com/LevonPR/astra-2.0/blob/main/LOKI66_RENDEZVOUS.md",
    authority_boundary: "Financial and irreversible external actions require explicit human approval from Loki66."
  });
}
