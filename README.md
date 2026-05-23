# MyFinance Official Website

MyFinance official static website for GitHub Pages. The site introduces the released iOS app, feature set, developer background, support paths, and the Terms of Use / Privacy Policy in Traditional Chinese, English, and Japanese.

## Brand Naming

- Traditional Chinese and Japanese pages use `MyFinance`.
- English pages and the App Store listing use `MyFinance Go` to avoid naming conflicts in the English/App Store market.
- The logo asset is shared across all locales and should not be recolored unless the app icon itself changes.

## Site Structure

- `index.html`, `features.html`, `about.html`, `privacy.html`: Traditional Chinese pages.
- `en/`: English pages.
- `ja/`: Japanese pages.
- `assets/css/style.css`: shared visual system and responsive behavior.
- `assets/js/main.js`: shared mobile navigation behavior for marketing pages.
- `assets/images/`: app icon, Apple touch icon, and Open Graph preview assets.
- `tools/`: small maintenance scripts for generated site assets and link checks.

## Useful Commands

Generate sitemap, robots file, web manifest, Apple touch icon, and social preview assets:

```bash
node tools/build-site-assets.mjs
```

Check local links, anchors, required metadata, structured data, and key launch sections:

```bash
node tools/check-site.mjs
```

Preview locally:

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000/index.html`.

## Publishing

GitHub Pages is published from `origin/main`. Before pushing, run:

```bash
node tools/build-site-assets.mjs
node tools/check-site.mjs
git diff --check
```

## Content Notes

- Keep all three locales aligned when adding public-facing sections.
- Privacy policy last-updated copy is intentionally visible near the top of each privacy page.
- Purchases, subscriptions, purchase restoration, and refunds should be described as handled by Apple App Store / StoreKit.
- AI copy should say that AI creates reviewable drafts, not final saved transactions or financial advice.
