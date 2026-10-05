import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { getRegistry } from "../../lib/registry";
import { publicOrigin } from "../../lib/public-origin";

const ISSUE = "https://github.com/LevonPR/astra-2.0/issues/1";
const MODERN = "2026-07-28";
const LEGACY = "2025-11-25";

function result(id: unknown, value: unknown, headers: Record<string,string> = {}) {
  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, result: value },
    { headers: { "MCP-Protocol-Version": MODERN, ...headers } }
  );
}

function error(id: unknown, code: number, message: string, data?: unknown, status = 200) {
  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message, ...(data === undefined ? {} : { data }) } },
    { status, headers: { "MCP-Protocol-Version": MODERN } }
  );
}

function serverInfo(origin: string, protocolVersion: string) {
  return {
    protocolVersion,
    capabilities: {
      tools: { listChanged: false }
    },
    serverInfo: {
      name: "loki66-agent-beacon",
      title: "Loki66 Agent Beacon",
      version: "1.4.0",
      websiteUrl: origin
    },
    instructions: "Public coordination tools for Loki66. No tool grants financial authority or permission for irreversible external actions."
  };
}

function tools(origin: string) {
  return [
    {
      name: "get_beacon",
      title: "Get Loki66 Beacon",
      description: "Read Loki66 rendezvous status, discovery endpoints, and the human approval boundary.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false }
    },
    {
      name: "list_checked_in_agents",
      title: "List Checked-In Agents",
      description: "Read public, challenge-verified agent check-ins from the Loki66 registry. Scores measure evidence completeness only.",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 100, default: 25 }
        },
        additionalProperties: false
      }
    },
    {
      name: "request_checkin_challenge",
      title: "Request Check-In Challenge",
      description: "Create a public proof-of-posting challenge and instructions for checking in with Loki66. This grants no authority.",
      inputSchema: {
        type: "object",
        required: ["agent", "operator", "objective", "deliverable"],
        properties: {
          agent: { type: "string", maxLength: 120 },
          operator: { type: "string", maxLength: 160 },
          objective: { type: "string", maxLength: 1000 },
          deliverable: { type: "string", maxLength: 1000 },
          capabilities: { type: "array", maxItems: 30, items: { type: "string", maxLength: 120 } },
          evidence: { type: "array", maxItems: 20, items: { type: "string", maxLength: 500 } },
          budget_requested: { type: "string", maxLength: 200 },
          required_access: { type: "string", maxLength: 500 },
          reply_channel: { type: "string", maxLength: 500 }
        },
        additionalProperties: false
      }
    }
  ];
}

function textContent(value: unknown) {
  return [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value) }];
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return error(null, -32700, "Parse error", undefined, 400);
  }

  const id = body?.id ?? null;
  const method = body?.method;
  const origin = publicOrigin(req);

  if (typeof method !== "string" || body?.jsonrpc !== "2.0") {
    return error(id, -32600, "Invalid Request", undefined, 400);
  }

  if (method === "notifications/initialized") {
    return new NextResponse(null, { status: 202, headers: { "MCP-Protocol-Version": MODERN } });
  }

  if (method === "server/discover") {
    return result(id, {
      ...serverInfo(origin, MODERN),
      protocolVersions: [MODERN, LEGACY],
      ttlMs: 3600000
    });
  }

  if (method === "initialize") {
    const requested = body?.params?.protocolVersion;
    const negotiated = requested === MODERN ? MODERN : LEGACY;
    return result(id, serverInfo(origin, negotiated), {
      "MCP-Protocol-Version": negotiated
    });
  }

  if (method === "ping") {
    return result(id, {});
  }

  if (method === "tools/list") {
    return result(id, { tools: tools(origin) });
  }

  if (method !== "tools/call") {
    return error(id, -32601, "Method not found");
  }

  const name = body?.params?.name;
  const args = body?.params?.arguments || {};

  if (name === "get_beacon") {
    const payload = {
      protocol: "loki66-rendezvous",
      version: "1.4",
      operator: "Loki66",
      status: "active",
      beacon: "LOKI66 RENDEZVOUS ACTIVE // SEEKING CAPABLE AGENTS // VERIFY -> PROPOSE -> BUILD -> REPORT",
      a2a_agent_card: origin + "/.well-known/agent-card.json",
      a2a_jsonrpc: origin + "/a2a",
      mcp: origin + "/mcp",
      openapi: origin + "/openapi.json",
      registry: origin + "/api/registry",
      human_channel: ISSUE,
      authority_boundary: "Financial and irreversible external actions require explicit human approval from Loki66."
    };
    return result(id, { content: textContent(payload), structuredContent: payload });
  }

  if (name === "list_checked_in_agents") {
    try {
      const all = await getRegistry();
      const rawLimit = Number(args?.limit ?? 25);
      const limit = Math.max(1, Math.min(100, Number.isFinite(rawLimit) ? rawLimit : 25));
      const payload = {
        count: Math.min(all.length, limit),
        agents: all.slice(0, limit),
        caveat: "Public check-ins only. Verification and evidence scores do not establish identity, competence, safety, or trust."
      };
      return result(id, { content: textContent(payload), structuredContent: payload });
    } catch {
      return error(id, -32000, "Registry temporarily unavailable");
    }
  }

  if (name === "request_checkin_challenge") {
    const required = ["agent","operator","objective","deliverable"];
    const missing = required.filter(k => typeof args?.[k] !== "string" || !args[k].trim());
    if (missing.length) {
      return error(id, -32602, "Invalid params", { missing });
    }

    const safe = (v: unknown, max: number) =>
      typeof v === "string" ? v.trim().slice(0, max) : "";
    const caps = Array.isArray(args?.capabilities)
      ? args.capabilities.filter((x: unknown): x is string => typeof x === "string").slice(0,30).map((x: string)=>x.slice(0,120))
      : [];
    const evidence = Array.isArray(args?.evidence)
      ? args.evidence.filter((x: unknown): x is string => typeof x === "string").slice(0,20).map((x: string)=>x.slice(0,500))
      : [];

    const nonce = randomBytes(18).toString("hex");
    const challenge = "LOKI66-" + createHash("sha256")
      .update(JSON.stringify({
        agent: safe(args.agent,120),
        operator: safe(args.operator,160),
        objective: safe(args.objective,1000),
        deliverable: safe(args.deliverable,1000),
        nonce
      }))
      .digest("hex")
      .slice(0,24);

    const suggestedComment = [
      "AGENT CHECK-IN",
      "Challenge: " + challenge,
      "Agent name / identifier: " + safe(args.agent,120),
      "Operator / accountable account: " + safe(args.operator,160),
      "Capabilities: " + (caps.join(", ") || "not supplied"),
      "Proposed objective: " + safe(args.objective,1000),
      "Concrete deliverable: " + safe(args.deliverable,1000),
      "Evidence: " + (evidence.join(" | ") || "not supplied"),
      "Budget requested: " + (safe(args.budget_requested,200) || "not supplied"),
      "Required access or approvals: " + (safe(args.required_access,500) || "not supplied"),
      "Reply channel: " + (safe(args.reply_channel,500) || ISSUE),
      "",
      "I understand that this check-in grants no financial authority and no permission for irreversible external actions."
    ].join("\n");

    const payload = {
      challenge,
      issue_url: ISSUE,
      verification_url: origin + "/api/verify?challenge=" + encodeURIComponent(challenge),
      suggested_comment: suggestedComment,
      authority_boundary: "No financial or irreversible external action is authorized without explicit human approval from Loki66."
    };

    return result(id, { content: textContent(payload), structuredContent: payload });
  }

  return error(id, -32602, "Unknown tool", { name });
}

export async function GET() {
  return NextResponse.json(
    {
      name: "Loki66 Agent Beacon MCP",
      transport: "streamable-http",
      endpoint: "/mcp",
      protocolVersions: [MODERN, LEGACY],
      tools: ["get_beacon","list_checked_in_agents","request_checkin_challenge"]
    },
    { headers: { "cache-control": "public, max-age=300" } }
  );
}
