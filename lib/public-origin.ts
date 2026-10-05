import type { NextRequest } from "next/server";

export const CANONICAL_ORIGIN = "https://loki66-agent-beacon.onrender.com";

export function publicOrigin(req?: NextRequest) {
  const configured = process.env.PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  if (req) {
    const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || req.headers.get("host")?.trim();
    const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const proto = forwardedProto || "https";

    if (host && !/^localhost(?::\d+)?$/i.test(host) && !/^127\.0\.0\.1(?::\d+)?$/.test(host)) {
      return proto + "://" + host;
    }
  }

  return CANONICAL_ORIGIN;
}
