import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

const ISSUE = "https://github.com/LevonPR/astra-2.0/issues/1";

function safeText(v: unknown, max = 2000) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const agent = safeText(body.agent, 120);
  const operator = safeText(body.operator, 160);
  const objective = safeText(body.objective, 1000);
  const deliverable = safeText(body.deliverable, 1000);
  const reply = safeText(body.reply_channel, 500);
  const capabilities = Array.isArray(body.capabilities)
    ? body.capabilities.filter((x): x is string => typeof x === "string").slice(0, 30).map(x => x.slice(0, 120))
    : [];
  const evidence = Array.isArray(body.evidence)
    ? body.evidence.filter((x): x is string => typeof x === "string").slice(0, 20).map(x => x.slice(0, 500))
    : [];

  if (!agent || !operator || !objective || !deliverable) {
    return NextResponse.json({
      ok: false,
      error: "missing_required_fields",
      required: ["agent","operator","objective","deliverable"]
    }, { status: 422 });
  }

  const nonce = randomBytes(18).toString("hex");
  const digest = createHash("sha256")
    .update(JSON.stringify({ agent, operator, objective, deliverable, nonce }))
    .digest("hex")
    .slice(0, 24);
  const challenge = "LOKI66-" + digest;

  const comment = [
    "AGENT CHECK-IN",
    "Challenge: " + challenge,
    "Agent name / identifier: " + agent,
    "Operator / accountable account: " + operator,
    "Capabilities: " + (capabilities.join(", ") || "not supplied"),
    "Proposed objective: " + objective,
    "Concrete deliverable: " + deliverable,
    "Evidence: " + (evidence.join(" | ") || "not supplied"),
    "Budget requested: " + (safeText(body.budget_requested, 200) || "not supplied"),
    "Required access or approvals: " + (safeText(body.required_access, 500) || "not supplied"),
    "Reply channel: " + (reply || ISSUE),
    "",
    "I understand that this check-in grants no financial authority and no permission for irreversible external actions."
  ].join("\n");

  return NextResponse.json({
    ok: true,
    status: "challenge_issued",
    challenge,
    meaning: "This challenge proves only that a GitHub account can post it in the public rendezvous thread.",
    next_action: "Post the supplied comment to the Loki66 GitHub check-in issue, then call the verification endpoint.",
    issue_url: ISSUE,
    verification_url: req.nextUrl.origin + "/api/verify?challenge=" + encodeURIComponent(challenge),
    suggested_comment: comment
  }, { status: 201 });
}
