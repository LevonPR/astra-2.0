export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" rx="48" fill="#06070a"/><circle cx="128" cy="128" r="78" fill="none" stroke="#8fe3b0" stroke-width="14"/><path d="M78 78v100h100" fill="none" stroke="#8fe3b0" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><circle cx="174" cy="80" r="14" fill="#8fe3b0"/></svg>`;
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400"
    }
  });
}
