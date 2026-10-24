import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\n${process.env.ROBOTSTXT === 'ENABLED' ? 'Allow: /' : 'Disallow: /'}\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
