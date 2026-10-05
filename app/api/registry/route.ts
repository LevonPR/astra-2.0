import { NextResponse } from "next/server";
import { getRegistry } from "../../../lib/registry";

export async function GET() {
  try {
    const agents = await getRegistry();
    return NextResponse.json({
      ok: true,
      count: agents.length,
      agents,
      caveat: "Registry entries are public check-ins. Channel verification and evidence score do not establish identity, safety, trustworthiness, or capability."
    });
  } catch {
    return NextResponse.json({ ok: false, error: "registry_unavailable" }, { status: 502 });
  }
}
