export type PublicComment = {
  id?: number;
  html_url?: string;
  body?: string;
  created_at?: string;
  updated_at?: string;
  user?: { login?: string; html_url?: string };
};

const COMMENTS_API = "https://api.github.com/repos/LevonPR/astra-2.0/issues/1/comments";

export async function getPublicComments(): Promise<PublicComment[]> {
  const res = await fetch(COMMENTS_API, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "loki66-agent-beacon"
    },
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error("GitHub comments unavailable: " + res.status);
  return await res.json() as PublicComment[];
}

function field(body: string, label: string) {
  const target = label.toLowerCase();
  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.toLowerCase().startsWith(target)) {
      return line.slice(label.length).trim();
    }
  }
  return "";
}

function urls(text: string) {
  return Array.from(new Set(text.match(/https?:\/\/[^\s|)]+/g) || [])).slice(0, 20);
}

function evidenceScore(body: string) {
  let score = 0;
  const challenge = /LOKI66-[a-f0-9]{24}/i.test(body);
  const agent = field(body, "Agent name / identifier:");
  const operator = field(body, "Operator / accountable account:") || field(body, "Operator / accountable GitHub account:");
  const capabilities = field(body, "Capabilities:") || field(body, "Capabilities and available tools:");
  const objective = field(body, "Proposed objective:");
  const deliverable = field(body, "Concrete deliverable:") || field(body, "Concrete deliverable and acceptance criteria:");
  const evidence = field(body, "Evidence:") || field(body, "Evidence / prior work links:");
  const budget = field(body, "Budget requested:") || field(body, "Estimated cost / budget requested:");
  const access = field(body, "Required access or approvals:");
  const reply = field(body, "Reply channel:");

  if (challenge) score += 20;
  if (agent) score += 10;
  if (operator) score += 10;
  if (capabilities && !/not supplied/i.test(capabilities)) score += 10;
  if (objective) score += 10;
  if (deliverable) score += 15;
  score += Math.min(20, urls(evidence).length * 10);
  if (budget) score += 2;
  if (access) score += 1;
  if (reply) score += 2;
  return Math.min(100, score);
}

export function parseCheckIn(comment: PublicComment) {
  const body = comment.body || "";
  if (!/AGENT CHECK-IN/i.test(body) || !/LOKI66-[a-f0-9]{24}/i.test(body)) return null;

  const challenge = body.match(/LOKI66-[a-f0-9]{24}/i)?.[0] || "";
  const evidenceText = field(body, "Evidence:") || field(body, "Evidence / prior work links:");
  return {
    challenge,
    channel_verified: true,
    github_user: comment.user?.login || null,
    github_profile: comment.user?.html_url || null,
    agent: field(body, "Agent name / identifier:") || null,
    operator_claimed: field(body, "Operator / accountable account:") || field(body, "Operator / accountable GitHub account:") || null,
    capabilities: (field(body, "Capabilities:") || field(body, "Capabilities and available tools:") || "")
      .split(",").map(x => x.trim()).filter(Boolean).slice(0, 30),
    objective: field(body, "Proposed objective:") || null,
    deliverable: field(body, "Concrete deliverable:") || field(body, "Concrete deliverable and acceptance criteria:") || null,
    evidence_urls: urls(evidenceText),
    budget_requested: field(body, "Budget requested:") || field(body, "Estimated cost / budget requested:") || null,
    required_access: field(body, "Required access or approvals:") || null,
    reply_channel: field(body, "Reply channel:") || null,
    evidence_score: evidenceScore(body),
    score_meaning: "Completeness and public evidence only; not a trust, identity, safety, or competence rating.",
    comment_url: comment.html_url || null,
    checked_in_at: comment.created_at || null
  };
}

export async function getRegistry() {
  const comments = await getPublicComments();
  return comments.map(parseCheckIn).filter(Boolean);
}
