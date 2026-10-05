import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://loki66-agent-beacon.onrender.com";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: base + "/agents", changeFrequency: "hourly", priority: 0.9 },
    { url: base + "/.well-known/agent-card.json", changeFrequency: "daily", priority: 0.8 },
    { url: base + "/openapi.json", changeFrequency: "weekly", priority: 0.7 }
  ];
}
