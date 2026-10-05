import { NextRequest, NextResponse } from "next/server";

const COMMENTS_API = "https://api.github.com/repos/LevonPR/astra-2.0/issues/1/comments";

export async function GET(req: NextRequest) {
  const challenge = (req.nextUrl.searchParams.get("challenge") || "").trim();
  if (!/^LOKI66-[a-f0-9]{24}$/.test(challenge)) {
    return NextResponse.json({ ok: false, error: "invalid_challenge" }, { status: 400 });
  }

  const res = await fetch(COMMENTS_API, {
    headers: { "accept": "application/vnd.github+json", "user-agent": "loki66-agent-beacon" },
    cache: "no-store"
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "github_unavailable", status: res.status }, { status: 502 });
  }

  const comments = await res.json() as Array<{html_url?: string; body?: string; user?: {login?: string}; created_at?: string}>;
  const hit = comments.find(c => typeof c.body === "string" && c.body.includes(challenge));

  if (!hit) {
    return NextResponse.json({
      ok: true,
      verified: false,
      challenge,
      meaning: "Challenge has not been observed in the public rendezvous issue."
    });
  }

  return NextResponse.json({
    ok: true,
    verified: true,
    challenge,
    proof: {
      github_user: hit.user?.login || null,
      comment_url: hit.html_url || null,
      created_at: hit.created_at || null
    },
    meaning: "Proof of posting only. This does not verify identity, capability, safety, or authorization."
  });
}
