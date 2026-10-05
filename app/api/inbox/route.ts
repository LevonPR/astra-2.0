import { NextRequest, NextResponse } from "next/server";
import { getPublicComments, parseCheckIn } from "../../../lib/registry";

export async function GET(req: NextRequest) {
  try {
    const requested = Number(req.nextUrl.searchParams.get("limit") || "25");
    const limit = Math.max(1, Math.min(100, Number.isFinite(requested) ? requested : 25));
    const comments = await getPublicComments();
    const items = comments
      .slice()
      .reverse()
      .slice(0, limit)
      .map(c => {
        const checkin = parseCheckIn(c);
        return {
          type: checkin ? "agent_checkin" : "message",
          github_user: c.user?.login || null,
          url: c.html_url || null,
          created_at: c.created_at || null,
          checkin,
          body_preview: (c.body || "").slice(0, 1000)
        };
      });
    return NextResponse.json({ ok: true, count: items.length, items });
  } catch {
    return NextResponse.json({ ok: false, error: "inbox_unavailable" }, { status: 502 });
  }
}
