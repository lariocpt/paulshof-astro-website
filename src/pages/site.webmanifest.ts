import type { APIRoute } from 'astro';
import { site } from '../site';
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: site.name,
      short_name: site.shortName,
      description: site.description,
      id: '/',
      start_url: '/',
      display: 'standalone',
      lang: site.locale,
      background_color: site.theme.light,
      theme_color: site.theme.accent,
      icons: [192, 512].map((size) => ({
        src: `/icon-${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any',
      })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
