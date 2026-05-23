import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { site } from './site-data.mjs';

const files = Object.values(site.locales).flatMap((locale) =>
  site.pages.map((page) => `${locale.pathPrefix}${page.file}`)
);

const missing = [];
const badAnchors = [];
const pageIssues = [];
let checkedRefs = 0;

function stripQuery(value) {
  return value.split('?')[0].split('#')[0];
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:|#|data:|javascript:)/.test(value);
}

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
  const isNestedPage = file.includes('/');
  const assetPrefix = isNestedPage ? '../' : '';

  [
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta property="og:image" content="https://nicktim1113.github.io/MyFinance-Official/assets/images/og-card.png">',
    `<link rel="apple-touch-icon" href="${assetPrefix}assets/images/apple-touch-icon.png">`,
    `<link rel="manifest" href="${assetPrefix}site.webmanifest">`,
    '<meta name="theme-color" content="#4f46e5">'
  ].forEach((snippet) => {
    if (!html.includes(snippet)) {
      pageIssues.push(`${file}: missing ${snippet}`);
    }
  });

  if (html.includes('id="mobile-menu-btn"') && !html.includes('aria-controls="mobile-menu"')) {
    pageIssues.push(`${file}: mobile menu button missing aria-controls`);
  }

  if (file.endsWith('index.html')) {
    if (!html.includes('id="plans"')) {
      pageIssues.push(`${file}: missing plans FAQ section`);
    }

    const structuredData = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    if (!structuredData) {
      pageIssues.push(`${file}: missing structured data`);
    } else {
      try {
        JSON.parse(structuredData);
      } catch (error) {
        pageIssues.push(`${file}: invalid structured data JSON (${error.message})`);
      }
    }
  }

  if (file.endsWith('privacy.html') && !html.includes('aria-label="Privacy summary"') && !html.includes('aria-label="隱私摘要"') && !html.includes('aria-label="プライバシー概要"')) {
    pageIssues.push(`${file}: missing privacy summary`);
  }

  for (const attr of ['href', 'src']) {
    const re = new RegExp(`${attr}=["']([^"']+)["']`, 'g');
    for (const match of html.matchAll(re)) {
      const value = match[1];
      if (isExternal(value)) {
        if (value.startsWith('#') && value.length > 1 && !ids.has(value.slice(1))) {
          badAnchors.push(`${file}: missing local anchor ${value}`);
        }
        continue;
      }

      const targetNoHash = stripQuery(value);
      if (!targetNoHash) continue;

      const target = path.normalize(path.join(path.dirname(file), targetNoHash));
      checkedRefs += 1;
      if (!existsSync(target)) {
        missing.push(`${file}: ${value} -> ${target}`);
      }

      const hash = value.includes('#') ? value.split('#').pop() : '';
      if (hash && existsSync(target) && target.endsWith('.html')) {
        const targetHtml = readFileSync(target, 'utf8');
        const targetIds = new Set([...targetHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
        if (!targetIds.has(hash)) {
          badAnchors.push(`${file}: ${value} missing #${hash} in ${target}`);
        }
      }
    }
  }
}

if (missing.length || badAnchors.length || pageIssues.length) {
  console.error('Missing files:', missing);
  console.error('Bad anchors:', badAnchors);
  console.error('Page issues:', pageIssues);
  process.exit(1);
}

console.log(`checked ${files.length} html files, ${checkedRefs} local href/src refs`);
