export const site = {
  baseUrl: 'https://nicktim1113.github.io/MyFinance-Official',
  appStoreUrl: 'https://apps.apple.com/us/app/myfinance-go/id6760079032',
  supportEmail: 'nicktim1113@icloud.com',
  updatedAt: '2026-05-24',
  policyUpdatedAt: '2026-05-08',
  themeColor: '#4f46e5',
  locales: {
    'zh-Hant': {
      brand: 'MyFinance',
      pathPrefix: '',
      title: 'MyFinance - AI 輔助記帳與個人財務管理',
      description: 'MyFinance 是已在 App Store 上架的個人財務管理 App，提供快速記帳、AI 交易草稿、多帳本、雲端同步、報表洞察、預算與資產管理。'
    },
    en: {
      brand: 'MyFinance Go',
      pathPrefix: 'en/',
      title: 'MyFinance Go - AI-Assisted Expense Tracking and Personal Finance',
      description: 'MyFinance Go is a personal finance app on the App Store with quick expense tracking, AI-assisted transaction drafts, multiple ledgers, cloud sync, reports, budgets, and asset management.'
    },
    ja: {
      brand: 'MyFinance',
      pathPrefix: 'ja/',
      title: 'MyFinance - AI入力補助つき家計管理アプリ',
      description: 'MyFinanceは、App Storeで公開中の個人向け家計管理アプリです。すばやい記録、AIによる取引下書き、複数帳簿、クラウド同期、レポート、予算、資産管理に対応します。'
    }
  },
  pages: [
    { key: 'home', file: 'index.html', priority: '1.0', changefreq: 'weekly' },
    { key: 'features', file: 'features.html', priority: '0.9', changefreq: 'monthly' },
    { key: 'about', file: 'about.html', priority: '0.7', changefreq: 'monthly' },
    { key: 'privacy', file: 'privacy.html', priority: '0.7', changefreq: 'monthly' }
  ]
};

export function localizedPath(localeKey, file) {
  const locale = site.locales[localeKey];
  if (file === 'index.html') {
    return `${locale.pathPrefix}`;
  }
  return `${locale.pathPrefix}${file}`;
}

export function absoluteUrl(localeKey, file) {
  const path = localizedPath(localeKey, file);
  return `${site.baseUrl}/${path}`;
}
