# MyFinance Official Website

MyFinance official static website for GitHub Pages. The site introduces the released iOS app, feature set, developer background, support paths, and the Terms of Use / Privacy Policy in Traditional Chinese, English, and Japanese.

## Brand Naming

- All website locales use the `MyFinance` brand.
- The English App Store listing is `MyFinance: Expense Tracker` (App ID `6760079032`). Website FAQs and structured data use the same product identity.
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

GitHub Pages is published from `origin/main`. For content-only changes, run:

```bash
node tools/check-site.mjs
git diff --check
```

Run `node tools/build-site-assets.mjs` only when intentionally regenerating the sitemap, manifest, icons, or social preview assets, and inspect those changes before publishing.

## Content Notes

- Keep all three locales aligned when adding public-facing sections.
- Privacy policy last-updated copy is intentionally visible near the top of each privacy page.
- Purchases, subscriptions, purchase restoration, and refunds should be described as handled by Apple App Store / StoreKit.
- AI copy should say that AI creates reviewable drafts, not final saved transactions or financial advice.
