import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { site, absoluteUrl } from './site-data.mjs';

const root = new URL('../', import.meta.url);
const run = promisify(execFile);
const logoBytes = await readFile(new URL('assets/images/app-logo.png', root));
const logoDataUri = `data:image/png;base64,${logoBytes.toString('base64')}`;

const today = site.updatedAt;
const localeKeys = Object.keys(site.locales);
const basePath = new URL(site.baseUrl).pathname.replace(/\/?$/, '/') || '/';

const urls = site.pages.flatMap((page) => localeKeys.map((localeKey) => {
  const alternates = localeKeys.map((alternateLocale) => {
    const hrefLang = alternateLocale === 'zh-Hant' ? 'zh-Hant' : alternateLocale;
    return `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${absoluteUrl(alternateLocale, page.file)}" />`;
  }).join('\n');

  return [
    '  <url>',
    `    <loc>${absoluteUrl(localeKey, page.file)}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
    alternates,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl('zh-Hant', page.file)}" />`,
    '  </url>'
  ].join('\n');
}));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${urls.join('\n')}\n` +
  `</urlset>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${site.baseUrl}/sitemap.xml\n`;

const manifest = {
  name: 'MyFinance',
  short_name: 'MyFinance',
  description: site.locales['zh-Hant'].description,
  start_url: basePath,
  scope: basePath,
  display: 'standalone',
  background_color: '#f8faff',
  theme_color: site.themeColor,
  icons: [
    {
      src: 'assets/images/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png'
    },
    {
      src: 'assets/images/app-logo.png',
      sizes: '256x256',
      type: 'image/png'
    }
  ]
};

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eef2ff"/>
      <stop offset="0.52" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#dbeafe"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#4f46e5" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.38">
    <path d="M0 520 C180 470 250 560 420 500 C640 422 720 316 910 365 C1048 400 1130 355 1200 300 L1200 630 L0 630 Z" fill="#c7d2fe"/>
    <circle cx="1048" cy="116" r="82" fill="#bfdbfe"/>
    <circle cx="88" cy="96" r="42" fill="#c7d2fe"/>
  </g>
  <g filter="url(#shadow)">
    <rect x="86" y="98" width="1028" height="434" rx="34" fill="#ffffff" stroke="#e0e7ff" stroke-width="2"/>
  </g>
  <image href="${logoDataUri}" x="130" y="150" width="112" height="112" preserveAspectRatio="xMidYMid meet"/>
  <text x="270" y="204" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="42" font-weight="800" fill="#0f172a">MyFinance</text>
  <text x="270" y="252" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="24" font-weight="700" fill="#4f46e5">AI-assisted personal finance</text>
  <text x="130" y="352" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="54" font-weight="850" fill="#111827">Track faster. Understand sooner.</text>
  <text x="132" y="414" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="500" fill="#475569">Quick entries, reviewable AI drafts, ledgers, reports, budgets, and assets.</text>
  <rect x="132" y="458" width="278" height="52" rx="14" fill="#4f46e5"/>
  <text x="162" y="492" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="750" fill="#ffffff">Available on App Store</text>
</svg>
`;

await mkdir(new URL('assets/images/', root), { recursive: true });
await writeFile(new URL('sitemap.xml', root), sitemap);
await writeFile(new URL('robots.txt', root), robots);
await writeFile(new URL('site.webmanifest', root), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(new URL('assets/images/og-card.svg', root), ogSvg);

const appleTouchIcon = new URL('assets/images/apple-touch-icon.png', root);
const ogPng = new URL('assets/images/og-card.png', root);

await run('sips', ['-z', '180', '180', new URL('assets/images/app-logo.png', root).pathname, '--out', appleTouchIcon.pathname]);
await run('sips', ['-s', 'format', 'png', new URL('assets/images/og-card.svg', root).pathname, '--out', ogPng.pathname]);

console.log('Generated sitemap.xml, robots.txt, site.webmanifest, apple-touch-icon.png, og-card.svg, and og-card.png');
