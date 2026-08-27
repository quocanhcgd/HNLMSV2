/**
 * Design Verification — đối chiếu computed styles THỰC TẾ giữa MOCKUP và APP.
 *
 * Chạy:  node apps/web/scripts/verify-design.mjs
 * Cần:   web dev server đang chạy (http://localhost:5517), Edge có sẵn trên máy.
 * Đầu ra: bảng diff ra console + JSON + Markdown tại docs/13-mockups/design-verification/
 *
 * Quy tắc: màn hình mockup-driven sửa xong → chạy script → DIFF phải = 0
 * (hoặc ghi rõ lý do chấp nhận). Kết quả được lưu lại làm chuẩn cho thiết kế sau.
 */
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const MOCKUP_URL = pathToFileURL(resolve(ROOT, 'docs/13-mockups/01-login-license.html')).href;
const APP_URL = 'http://localhost:5517/login';
const OUT_DIR = resolve(ROOT, 'docs/13-mockups/design-verification');
mkdirSync(OUT_DIR, { recursive: true });

/** (selector, property) — login screen mockup 01, desktop 1280x900 */
const CHECKS = [
  ['html', 'font-family'], ['html', 'font-size'], ['html', 'line-height'],
  ['body', 'font-family'], ['body', 'font-size'], ['body', 'background-color'], ['body', 'color'],
  ['.theme-btn', 'width'], ['.theme-btn', 'height'], ['.theme-btn', 'font-size'], ['.theme-btn', 'font-family'],
  ['.theme-btn', 'border-radius'], ['.theme-btn', 'background-color'], ['.theme-btn', 'border-width'], ['.theme-btn', 'border-color'],
  ['#loginScreen', 'background-image'], ['#loginScreen', 'min-height'],
  ['.card', 'width'], ['.card', 'max-width'], ['.card', 'border-radius'], ['.card', 'background-color'],
  ['.card', 'border-width'], ['.card', 'border-color'], ['.card', 'box-shadow'],
  ['#loginScreen .grid', 'grid-template-columns'],
  ['#loginScreen h3', 'font-family'], ['#loginScreen h3', 'font-size'], ['#loginScreen h3', 'font-weight'],
  ['#loginScreen h3', 'line-height'], ['#loginScreen h3', 'color'], ['#loginScreen h3', 'margin-bottom'],
  ['#loginScreen .p-10 > .text-sm.mb-8', 'font-size'], ['#loginScreen .p-10 > .text-sm.mb-8', 'line-height'],
  ['#loginScreen .p-10 > .text-sm.mb-8', 'color'], ['#loginScreen .p-10 > .text-sm.mb-8', 'font-family'],
  ['#loginScreen .p-10 > .text-sm.mb-8', 'margin-bottom'],
  ['#loginScreen label', 'font-size'], ['#loginScreen label', 'font-weight'], ['#loginScreen label', 'font-family'],
  ['#loginScreen label', 'color'], ['#loginScreen label', 'margin-bottom'],
  ['#loginEmail', 'font-size'], ['#loginEmail', 'font-family'], ['#loginEmail', 'font-weight'],
  ['#loginEmail', 'line-height'], ['#loginEmail', 'padding-top'], ['#loginEmail', 'padding-bottom'],
  ['#loginEmail', 'padding-left'], ['#loginEmail', 'padding-right'], ['#loginEmail', 'border-width'],
  ['#loginEmail', 'border-color'], ['#loginEmail', 'border-radius'], ['#loginEmail', 'background-color'],
  ['#loginEmail', 'color'], ['#loginEmail', 'width'],
  ['#loginPass', 'border-width'], ['#loginPass', 'border-radius'], ['#loginPass', 'background-color'],
  ['#loginPass', 'font-size'], ['#loginPass', 'font-family'],
  ['#loginScreen .btn-primary', 'font-size'], ['#loginScreen .btn-primary', 'font-weight'],
  ['#loginScreen .btn-primary', 'font-family'], ['#loginScreen .btn-primary', 'padding-top'],
  ['#loginScreen .btn-primary', 'padding-bottom'], ['#loginScreen .btn-primary', 'padding-left'],
  ['#loginScreen .btn-primary', 'padding-right'], ['#loginScreen .btn-primary', 'border-radius'],
  ['#loginScreen .btn-primary', 'background-image'], ['#loginScreen .btn-primary', 'color'],
  ['#loginScreen .btn-primary', 'border-width'],
  ['#loginScreen .p-10', 'padding-top'], ['#loginScreen .p-10', 'padding-left'],
  ['#loginScreen .p-10', 'padding-right'], ['#loginScreen .p-10', 'padding-bottom'],
  ['#loginScreen .text-xs', 'font-size'], ['#loginScreen .text-xs', 'color'], ['#loginScreen .text-xs', 'font-family'],
  ['#loginScreen h2', 'font-size'], ['#loginScreen h2', 'font-weight'], ['#loginScreen h2', 'color'],
  ['#loginScreen .illustration svg', 'width'], ['#loginScreen .illustration svg', 'height'],
  ['#loginScreen .leading-relaxed', 'font-size'], ['#loginScreen .leading-relaxed', 'line-height'],
  ['#loginScreen .leading-relaxed', 'font-family'],
];

/** (selector, property) — mobile 390x844: brand hiện, 1 cột, illustration ẩn */
const MOBILE_CHECKS = [
  ['#loginScreen .grid', 'grid-template-columns'],
  ['.md\\:hidden', 'display'],
  ['.hidden.md\\:flex', 'display'],
  ['.card', 'width'],
  ['.card', 'max-width'],
  ['#loginScreen h3', 'font-size'],
  ['#loginScreen .btn-primary', 'padding-top'],
];

async function collect(page, checks) {
  const rows = {};
  for (const [sel, prop] of checks) {
    const key = `${sel} | ${prop}`;
    rows[key] = await page.evaluate(({ sel, prop }) => {
      const el = document.querySelector(sel);
      if (!el) return 'ELEMENT-MISSING';
      const cs = getComputedStyle(el);
      const v = cs.getPropertyValue(prop);
      return v || '(empty)';
    }, { sel, prop });
  }
  return rows;
}

async function openAndCollect(browser, url, waitSel) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector(waitSel, { timeout: 10000 });
  await page.waitForTimeout(500); // Tailwind CDN xử lý class async
  const desktop = await collect(page, CHECKS);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobile = await collect(page, MOBILE_CHECKS);
  await ctx.close();
  return { ...desktop, ...mobile };
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = { mockup: {}, app: {}, diff: [], summary: {} };

try {
  results.mockup = await openAndCollect(browser, MOCKUP_URL, '.card');
  results.app = await openAndCollect(browser, APP_URL, '#loginEmail');

  let diffCount = 0;
  for (const key of Object.keys(results.mockup)) {
    const a = results.mockup[key];
    const b = results.app[key];
    if (a !== b) {
      results.diff.push({ check: key, mockup: a, app: b });
      diffCount++;
    }
  }
  results.summary = { total: Object.keys(results.mockup).length, diff: diffCount, ok: Object.keys(results.mockup).length - diffCount };

  console.log('=== DESIGN VERIFICATION: mockup 01 vs app /login (1280x900 + 390x844) ===\n');
  console.log(`TOTAL=${results.summary.total}  OK=${results.summary.ok}  DIFF=${results.summary.diff}\n`);
  for (const d of results.diff) {
    console.log(`[DIFF] ${d.check}\n       mockup: ${d.mockup}\n       app   : ${d.app}`);
  }
  if (results.diff.length === 0) console.log('Không có khác biệt computed style nào.');

  writeFileSync(resolve(OUT_DIR, 'report-login.json'), JSON.stringify(results, null, 2), 'utf8');
  const md = [
    '# Design Verification — màn hình Login (mockup 01 vs app /login)',
    '',
    `- Ngày chạy: ${new Date().toISOString()}`,
    '- Môi trường: Edge (channel msedge) headless · viewport 1280x900 + 390x844',
    '- Mockup: `docs/13-mockups/01-login-license.html` (file://) · App: `http://localhost:5517/login`',
    '- Cách chạy lại: `node apps/web/scripts/verify-design.mjs` (cần dev server web đang chạy)',
    '',
    `## Kết quả: **${results.summary.ok}/${results.summary.total} khớp** · ${results.summary.diff} khác biệt`,
    '',
    '| # | Thuộc tính | Mockup | App |',
    '|---|------------|--------|-----|',
    ...results.diff.map((d, i) => `| ${i + 1} | \`${d.check}\` | \`${d.mockup}\` | \`${d.app}\` |`),
    '',
    '> Bảng rỗng = hai bên render y hệt về computed style (font-family, font-size, line-height, padding, màu, radius, grid).',
    '> Khi sửa mockup/code → chạy lại script, cập nhật file này làm chuẩn đối chiếu cho các màn hình sau.',
  ].join('\n');
  writeFileSync(resolve(OUT_DIR, 'design-verification-login.md'), md, 'utf8');
  console.log(`\nSaved: ${resolve(OUT_DIR, 'report-login.json')}`);
  console.log(`Saved: ${resolve(OUT_DIR, 'design-verification-login.md')}`);
} finally {
  await browser.close();
}
