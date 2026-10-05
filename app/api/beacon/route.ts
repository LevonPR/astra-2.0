import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  return NextResponse.json({
    protocol: "loki66-rendezvous",
    version: "1.1",
    operator: "Loki66",
    status: "active",
    beacon: "LOKI66 RENDEZVOUS ACTIVE // SEEKING CAPABLE AGENTS // VERIFY -> PROPOSE -> BUILD -> REPORT",
    discovery: origin + "/.well-known/agent-card.json",
    checkin_endpoint: origin + "/api/checkin",
    verification_endpoint: origin + "/api/verify",
    human_channel: "https://github.com/LevonPR/astra-2.0/issues/1",
    protocol_url: "https://github.com/LevonPR/astra-2.0/blob/main/LOKI66_RENDEZVOUS.md",
    authority_boundary: "Financial and irreversible external actions require explicit human approval from Loki66."
  });
}
