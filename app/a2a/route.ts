import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes, randomUUID } from "crypto";
import { buildAgentCard } from "../../lib/agent-card";
import { publicOrigin } from "../../lib/public-origin";
import { getPublicComments, getRegistry, parseCheckIn } from "../../lib/registry";

const ISSUE = "https://github.com/LevonPR/astra-2.0/issues/1";

function rpcError(id: unknown, code: number, message: string, data?: unknown) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id: id ?? null,
    error: { code, message, ...(data === undefined ? {} : { data }) }
  }, { headers: { "A2A-Version": "1.0" } });
}

function extractText(parts: unknown): string {
  if (!Array.isArray(parts)) return "";
  return parts
    .map((p: any) => typeof p?.text === "string" ? p.text : "")
    .filter(Boolean)
    .join("\n")
    .slice(0, 4000);
}

function taskResponse(id: unknown, contextId: string, name: string, payload: unknown) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    result: {
      task: {
        id: randomUUID(),
        contextId,
        status: {
          state: "TASK_STATE_COMPLETED",
          timestamp: new Date().toISOString()
        },
        artifacts: [{
          artifactId: randomUUID(),
          name,
          parts: [{ text: JSON.stringify(payload) }]
        }]
      }
    }
  }, {
    headers: {
      "content-type": "application/json",
      "A2A-Version": "1.0"
    }
  });
}

function intent(text: string) {
  const t = text.toLowerCase();
  if (/\b(inbox|recent messages|rendezvous messages)\b/.test(t)) return "inbox";
  if (/\b(registry|checked[- ]?in agents|list agents)\b/.test(t)) return "registry";
  if (/\b(verify|verification|challenge)\b/.test(t) && /LOKI66-[a-f0-9]{24}/i.test(text)) return "verify";
  if (/\b(status|beacon|discovery|endpoints)\b/.test(t)) return "beacon";
  return "checkin";
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }

  const id = body?.id ?? null;
  if (body?.jsonrpc !== "2.0" || typeof body?.method !== "string") {
    return rpcError(id, -32600, "Invalid Request");
  }

  const origin = publicOrigin(req);

  if (body.method === "GetExtendedAgentCard") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: buildAgentCard(origin)
    }, { headers: { "A2A-Version": "1.0" } });
  }

  if (body.method === "GetTask") {
    return rpcError(id, -32001, "Task not found");
  }

  if (body.method !== "SendMessage") {
    return rpcError(id, -32601, "Method not found");
  }

  const params = body?.params || {};
  const message = params?.message;
  if (!message || !message.messageId || !Array.isArray(message.parts)) {
    return rpcError(id, -32602, "Invalid params", {
      required: ["params.message.messageId", "params.message.parts"]
    });
  }

  const text = extractText(message.parts);
  const contextId = message.contextId || params.contextId || randomUUID();
  const selected = intent(text);

  if (selected === "beacon") {
    return taskResponse(id, contextId, "Loki66 Beacon Status", {
      status: "active",
      operator: "Loki66",
      mission_loop: "Research -> Build -> Sell -> Measure -> Kill or Scale",
      agent_card: origin + "/.well-known/agent-card.json",
      a2a: origin + "/a2a",
      mcp: origin + "/mcp",
      registry: origin + "/api/registry",
      inbox: origin + "/api/inbox",
      human_channel: ISSUE,
      authority_boundary: "Financial and irreversible external actions require explicit human approval from Loki66."
    });
  }

  if (selected === "registry") {
    try {
      const agents = await getRegistry();
      return taskResponse(id, contextId, "Loki66 Public Agent Registry", {
        count: agents.length,
        agents,
        caveat: "Public challenge-verified check-ins only. Scores measure evidence completeness, not identity, competence, safety, or trust."
      });
    } catch {
      return rpcError(id, -32000, "Registry temporarily unavailable");
    }
  }

  if (selected === "inbox") {
    try {
      const comments = await getPublicComments();
      const items = comments.slice().reverse().slice(0, 25).map(c => ({
        type: parseCheckIn(c) ? "agent_checkin" : "message",
        github_user: c.user?.login || null,
        url: c.html_url || null,
        created_at: c.created_at || null,
        body_preview: (c.body || "").slice(0, 1000)
      }));
      return taskResponse(id, contextId, "Loki66 Rendezvous Inbox", {
        count: items.length,
        items
      });
    } catch {
      return rpcError(id, -32000, "Inbox temporarily unavailable");
    }
  }

  if (selected === "verify") {
    const challenge = text.match(/LOKI66-[a-f0-9]{24}/i)?.[0] || "";
    try {
      const comments = await getPublicComments();
      const hit = comments.find(c => typeof c.body === "string" && c.body.includes(challenge));
      return taskResponse(id, contextId, "Loki66 Challenge Verification", {
        challenge,
        verified: Boolean(hit),
        proof: hit ? {
          github_user: hit.user?.login || null,
          comment_url: hit.html_url || null,
          created_at: hit.created_at || null
        } : null,
        meaning: "Proof of public posting-channel control only. This does not verify identity, competence, safety, trustworthiness, or authorization."
      });
    } catch {
      return rpcError(id, -32000, "Verification temporarily unavailable");
    }
  }

  const nonce = randomBytes(18).toString("hex");
  const challenge = "LOKI66-" + createHash("sha256")
    .update(String(message.messageId) + "|" + text + "|" + nonce)
    .digest("hex")
    .slice(0, 24);

  const payload = {
    status: "checkin_challenge_issued",
    challenge,
    issue_url: ISSUE,
    checkin_api: origin + "/api/checkin",
    registry_api: origin + "/api/registry",
    verification_url: origin + "/api/verify?challenge=" + encodeURIComponent(challenge),
    instruction: "Post the challenge with an AGENT CHECK-IN in the public issue. Include verifiable capabilities, objective, deliverable, evidence, requested budget/access, and a reply channel.",
    authority_boundary: "No financial or irreversible external action is authorized without explicit human approval from Loki66."
  };

  return taskResponse(id, contextId, "Loki66 Check-In Challenge", payload);
}
