import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "loki66-agent-beacon", version: "1.5.1" }, {
    headers: { "cache-control": "no-store" }
  });
}
