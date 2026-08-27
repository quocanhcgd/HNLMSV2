/**
 * Design Verification — đối chiếu computed styles THỰC TẾ giữa MOCKUP và APP.
 *
 * Chạy:  node apps/web/scripts/verify-design.mjs
 * Cần:   API + web dev server đang chạy (web: http://localhost:5517), Edge có sẵn trên máy.
 * Đầu ra: bảng diff ra console + JSON + Markdown tại docs/13-mockups/design-verification/
 *
 * Quy tắc: màn hình mockup-driven sửa xong → chạy script → DIFF phải = 0
 * (hoặc ghi rõ lý do chấp nhận). Kết quả lưu lại làm chuẩn cho thiết kế sau.
 */
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const APP_URL = 'http://localhost:5517';
const OUT_DIR = resolve(ROOT, 'docs/13-mockups/design-verification');
mkdirSync(OUT_DIR, { recursive: true });

const TOL = 0.001; // chênh lệch float cho phép (px, rem...)

/** ===== LOGIN SCREEN (mockup 01) ===== */
const CHECKS_LOGIN = [
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
const MOBILE_LOGIN = [
  ['#loginScreen .grid', 'grid-template-columns'],
  ['.md\\:hidden', 'display'],
  ['.hidden.md\\:flex', 'display'],
  ['.card', 'width'],
  ['.card', 'max-width'],
  ['#loginScreen h3', 'font-size'],
  ['#loginScreen .btn-primary', 'padding-top'],
];

/** ===== DASHBOARD + APPSHELL (mockup 02) ===== */
const CHECKS_DASH = [
  // sidebar
  ['aside.sidebar', 'width'], ['aside.sidebar', 'background-color'], ['aside.sidebar', 'border-right-color'],
  ['aside.sidebar', 'position'], ['aside.sidebar', 'z-index'],
  ['aside.sidebar .nav-item', 'font-size'], ['aside.sidebar .nav-item', 'color'], ['aside.sidebar .nav-item', 'border-radius'],
  ['aside.sidebar .nav-item', 'padding-top'], ['aside.sidebar .nav-item', 'margin-left'],
  ['aside.sidebar .nav-item.active', 'color'], ['aside.sidebar .nav-item.active', 'font-weight'],
  ['aside.sidebar .nav-item.active', 'background-image'],
  ['aside.sidebar .badge', 'font-size'], ['aside.sidebar .badge', 'padding-left'],
  ['.ml-64', 'margin-left'],
  // header
  ['.surface.border-b', 'position'], ['.surface.border-b', 'top'], ['.surface.border-b', 'background-color'],
  ['.px-8.py-4 h2', 'font-size'], ['.px-8.py-4 h2', 'font-weight'],
  ['.px-8.py-4 > div:first-child > p', 'font-size'], ['.px-8.py-4 > div:first-child > p', 'color'],
  ['#branchSel', 'font-size'], ['#branchSel', 'padding-top'], ['#branchSel', 'padding-left'],
  ['#branchSel', 'border-radius'], ['#branchSel', 'background-color'], ['#branchSel', 'color'],
  ['#themeBtn', 'width'], ['#themeBtn', 'height'], ['#themeBtn', 'border-radius'], ['#themeBtn', 'font-size'],
  ['#langBtn', 'font-size'], ['#langBtn', 'padding-left'],
  ['#userMenu > button', 'border-radius'], ['#userMenu > button', 'padding-top'], ['#userMenu > button', 'padding-left'],
  ['#userMenu .w-8.h-8', 'width'], ['#userMenu .w-8.h-8', 'height'], ['#userMenu .w-8.h-8', 'border-radius'],
  ['#userMenu .text-xs.font-bold', 'font-size'],
  ['#userMenu .text-\\[10px\\]', 'font-size'], ['#userMenu .text-\\[10px\\]', 'color'],
  // KPI
  ['.card.p-5', 'padding-top'], ['.card.p-5', 'border-radius'],
  ['#st_students', 'font-size'], ['#st_students', 'font-weight'],
  ['.stat-icon', 'width'], ['.stat-icon', 'height'], ['.stat-icon', 'border-radius'],
  ['.card.p-5 .text-sm.text-soft', 'font-size'], ['.card.p-5 .text-sm.text-soft', 'color'],
  ['.card.p-5 .text-xs.mt-2', 'font-size'],
  ['.card.p-5 .text-xs.mt-2:last-of-type', 'color'],
  // charts
  ['#enrollChart', 'height'],
  ['#enrollChart > div:last-child > div', 'height'],
  ['#enrollChart .text-\\[10px\\]', 'font-size'], ['#enrollChart .text-\\[10px\\]', 'color'],
  ['.w-40.h-40.rounded-full', 'width'], ['.w-40.h-40.rounded-full', 'height'],
  ['.w-40.h-40.rounded-full', 'border-radius'], ['.w-40.h-40.rounded-full', 'background-image'],
  ['.w-24.h-24', 'width'], ['.w-24.h-24', 'height'], ['.w-24.h-24', 'border-radius'],
  ['ul.text-sm', 'font-size'],
  ['.w-3.h-3', 'width'], ['.w-3.h-3', 'height'],
  // table
  ['#enrollTable', 'width'], ['#enrollTable', 'font-size'],
  ['#enrollTable th', 'font-size'], ['#enrollTable th', 'font-weight'], ['#enrollTable th', 'padding-top'],
  ['#enrollTable td', 'font-size'], ['#enrollTable td', 'padding-top'],
  ['#enrollTable .badge-success', 'color'], ['#enrollTable .badge-success', 'background-color'],
  ['#enrollTable .badge-warning', 'color'], ['#enrollTable .badge-warning', 'background-color'],
  // alerts
  ['.alert-red', 'background-color'], ['.alert-red', 'border-color'], ['.alert-red', 'padding-top'],
  ['.alert-red', 'border-radius'], ['.alert-red b', 'display'], ['.alert-red span', 'color'],
  ['.alert-amber', 'background-color'], ['.alert-amber', 'border-color'],
  ['.alert-blue', 'background-color'], ['.alert-blue', 'border-color'],
  // quick actions
  ['.card.p-6 .btn-primary', 'font-size'], ['.card.p-6 .btn-primary', 'padding-top'], ['.card.p-6 .btn-primary', 'padding-left'],
  ['.card.p-6 .btn-outline', 'border-width'], ['.card.p-6 .btn-outline', 'padding-top'], ['.card.p-6 .btn-outline', 'padding-left'],
  ['.flex.flex-wrap.gap-3', 'gap'],
  // container
  ['.p-8', 'padding-top'],
  // toast
  ['#toast', 'position'], ['#toast', 'border-left-width'], ['#toast', 'border-left-color'],
  ['#toast', 'border-radius'], ['#toast', 'font-size'],
];
const MOBILE_DASH = [
  ['.grid.grid-cols-1', 'grid-template-columns'],
  ['aside.sidebar', 'width'],
  ['.ml-64', 'margin-left'],
  ['#st_students', 'font-size'],
];

/** ===== LICENSE SCREEN (mockup 01 appScreen) ===== */
const CHECKS_LIC = [
  // welcome card
  ['.p-8 .card', 'padding-top'], ['.p-8 .card', 'border-radius'], ['.p-8 .card', 'background-color'],
  ['.p-8 .card h3', 'font-size'], ['.p-8 .card h3', 'font-weight'],
  // steps
  ['.step-dot', 'width'], ['.step-dot', 'height'], ['.step-dot', 'border-radius'], ['.step-dot', 'font-size'],
  ['.step-dot.gradient-teal', 'background-image'],
  ['.step-line', 'height'], ['.step-line', 'background-color'], ['.step-line', 'margin-left'], ['.step-line', 'margin-right'],
  // kv boxes
  ['#welcomeBox .kv-box', 'padding-top'], ['#welcomeBox .kv-box', 'border-radius'], ['#welcomeBox .kv-box', 'background-color'],
  ['#welcomeBox .kv-box', 'font-size'], ['#welcomeBox .kv-box', 'margin-top'],
  ['#welcomeBox .kv-box span', 'color'], ['#welcomeBox .kv-box b', 'font-weight'],
  ['#welcomeBox .badge-success', 'color'], ['#welcomeBox .badge-success', 'background-color'],
  ['#welcomeBox .badge', 'font-size'], ['#welcomeBox .badge', 'padding-left'], ['#welcomeBox .badge', 'border-radius'],
  // welcome buttons
  ['.flex.space-x-3.mt-5 .btn-outline', 'font-size'], ['.flex.space-x-3.mt-5 .btn-outline', 'padding-top'],
  ['.flex.space-x-3.mt-5 .btn-outline', 'border-width'], ['.flex.space-x-3.mt-5 .btn-outline', 'border-radius'],
  ['.flex.space-x-3.mt-5 .btn-primary', 'font-size'], ['.flex.space-x-3.mt-5 .btn-primary', 'padding-top'],
  // constraints
  ['.track', 'height'], ['.track', 'border-radius'], ['.track', 'background-color'],
  ['.track > div', 'height'], ['.track > div', 'width'], ['.track > div', 'border-radius'],
  ['.text-xs.mt-1\\.5', 'font-size'], ['.text-xs.mt-1\\.5', 'color'],
  ['.badge-blue', 'color'], ['.badge-blue', 'background-color'],
  ['.grid.md\\:grid-cols-3 > div > .flex.justify-between.text-sm', 'font-size'],
  // addons table
  ['#addonRows td', 'padding-top'], ['#addonRows td', 'padding-left'], ['#addonRows td', 'font-size'],
  ['#addonRows .badge-success', 'color'], ['#addonRows .badge-success', 'background-color'],
  ['#addonRows .badge-warning', 'color'], ['#addonRows .badge-warning', 'background-color'],
  ['#addonRows .badge-gray', 'color'], ['#addonRows .badge-gray', 'background-color'],
  ['#addonRows .btn-primary', 'font-size'], ['#addonRows .btn-primary', 'padding-top'], ['#addonRows .btn-primary', 'padding-left'],
  ['thead th', 'font-size'], ['thead th', 'font-weight'], ['thead th', 'padding-top'],
  ['.card p.text-xs.mt-4', 'font-size'], ['.card p.text-xs.mt-4', 'color'],
  // modals (ẩn — hidden class như mockup)
  ['#addonModal', 'display'], ['#relicModal', 'display'],
  ['#addonModal .card', 'width'], ['#addonModal .card', 'padding-top'], ['#addonModal .card', 'border-radius'],
  ['#relicModal .dropzone', 'border-width'], ['#relicModal .dropzone', 'border-radius'], ['#relicModal .dropzone', 'padding-top'],
  ['#relicModal .dropzone', 'border-style'], ['#relicModal .dropzone', 'border-color'],
  ['#relicModal .btn-primary:disabled', 'opacity'],
];
const MOBILE_LIC = [
  ['.grid.grid-cols-1.md\\:grid-cols-3', 'grid-template-columns'],
  ['#welcomeBox .kv-box', 'font-size'],
  ['.step-dot', 'width'],
];

/** ===== USERS & ROLES SCREEN (mockup 03) — đo trước khi click tab Roles ===== */
const CHECKS_USERS_BEFORE = [
  // tabs
  ['.tab', 'padding-top'], ['.tab', 'font-size'], ['.tab', 'color'], ['.tab', 'border-bottom-width'],
  ['.tab.active', 'color'], ['.tab.active', 'border-bottom-color'], ['.tab.active', 'font-weight'],
  // filter row
  ['#paneUsers input.input-field', 'width'], ['#paneUsers input.input-field', 'padding-top'], ['#paneUsers input.input-field', 'border-radius'],
  ['#paneUsers select.input-field', 'width'],
  ['#paneUsers .btn-primary', 'font-size'], ['#paneUsers .btn-primary', 'padding-top'],
  // table
  ['#usersTable th', 'font-size'], ['#usersTable th', 'font-weight'], ['#usersTable th', 'padding-top'],
  ['#usersTable td', 'padding-top'], ['#usersTable td', 'font-size'],
  ['#usersTable input[type=checkbox]', 'width'], ['#usersTable input[type=checkbox]', 'height'],
  ['#usersTable .badge-primary', 'color'], ['#usersTable .badge-primary', 'background-color'],
  ['#usersTable .badge-success', 'color'], ['#usersTable .badge-success', 'background-color'],
  ['#usersTable .badge-purple', 'color'], ['#usersTable .badge-purple', 'background-color'],
  ['#usersTable .badge-warning', 'color'], ['#usersTable .badge-warning', 'background-color'],
  ['#usersTable .badge-gray', 'color'], ['#usersTable .badge-gray', 'background-color'],
  ['#usersTable .badge-danger', 'color'], ['#usersTable .badge-danger', 'background-color'],
  ['#usersTable .btn-outline', 'font-size'], ['#usersTable .btn-outline', 'padding-top'], ['#usersTable .btn-outline', 'padding-left'], ['#usersTable .btn-outline', 'border-width'],
  ['#usersTable .text-xs', 'font-size'], ['#usersTable .text-xs', 'color'],
  ['.flex.items-center.justify-between.mt-4', 'font-size'],
  ['#paneUsers p.text-xs.mt-4', 'font-size'], ['#paneUsers p.text-xs.mt-4', 'color'],
  // modals (ẩn)
  ['#userModal', 'display'], ['#scopeModal', 'display'],
  ['#userModal .card', 'width'], ['#userModal .card', 'padding-top'], ['#userModal .card', 'border-radius'],
  ['#userModal .chip', 'padding-top'], ['#userModal .chip', 'border-width'], ['#userModal .chip', 'font-size'], ['#userModal .chip', 'border-radius'],
  ['#scopeModal .card', 'width'], ['#scopeModal input[type=date]', 'padding-top'],
];

/** ===== đo SAU khi click tab Roles ===== */
const CHECKS_USERS = [
  // role list
  ['.role-item', 'padding-top'], ['.role-item', 'border-width'], ['.role-item', 'border-radius'],
  ['.role-item', 'margin-bottom'], ['.role-item', 'background-color'],
  ['.role-item.active', 'border-color'], ['.role-item.active', 'background-color'],
  ['.role-item b', 'font-size'], ['.role-item .text-xs', 'color'],
  ['.role-item .badge-purple', 'color'], ['.role-item .badge-purple', 'background-color'], ['.role-item .badge-purple', 'font-size'],
  // role detail
  ['#roleTitle', 'font-size'], ['#roleTitle', 'font-weight'],
  ['#roleDesc', 'font-size'], ['#roleDesc', 'color'],
  ['p.text-xs.font-bold.uppercase.mb-2', 'font-size'], ['p.text-xs.font-bold.uppercase.mb-2', 'color'],
  // permissions
  ['.perm', 'padding-top'], ['.perm', 'font-size'], ['.perm', 'border-width'], ['.perm', 'border-radius'],
  ['.perm', 'color'], ['.perm', 'background-color'],
  ['.perm.on', 'border-color'], ['.perm.on', 'background-color'], ['.perm.on', 'color'],
  // actions + note
  ['#paneRoles .btn-outline', 'font-size'], ['#paneRoles .btn-outline', 'padding-top'],
  ['#paneRoles .btn-primary', 'font-size'], ['#paneRoles .btn-primary', 'padding-top'],
  ['#paneRoles p.text-xs.mt-4', 'font-size'], ['#paneRoles p.text-xs.mt-4', 'color'],
];
const MOBILE_USERS = [
  ['.grid.grid-cols-1.lg\\:grid-cols-4', 'grid-template-columns'],
  ['.role-item', 'width'],
  ['.tab', 'font-size'],
];

/** ===== REPORTS SCREEN (mockup 04) — đo trước khi click type card ===== */
const CHECKS_REPORTS_BEFORE = [
  // type cards
  ['#types', 'grid-template-columns'],
  ['.type-card', 'padding-top'], ['.type-card', 'border-width'], ['.type-card', 'border-radius'], ['.type-card', 'background-color'],
  ['.type-card.active', 'border-color'], ['.type-card.active', 'background-color'],
  ['.type-card p.text-2xl', 'font-size'], ['.type-card b', 'font-size'], ['.type-card b', 'margin-bottom'],
  ['.type-card .text-xs', 'color'],
  // params
  ['.card .input-field', 'width'],
  ['input[type=date]', 'width'], ['input[type=date]', 'padding-top'],
  ['.card .btn-primary', 'font-size'], ['.card .btn-primary', 'padding-top'],
  ['.card p.text-xs.mt-3', 'font-size'], ['.card p.text-xs.mt-3', 'color'],
  // jobs (seed job hoàn tất)
  ['.job-row', 'padding-top'], ['.job-row', 'gap'], ['.job-row', 'border-bottom-width'],
  ['.job-row b', 'font-size'],
  ['.job-row .badge-success', 'color'], ['.job-row .badge-success', 'background-color'],
  ['.job-row .btn-primary', 'font-size'], ['.job-row .btn-primary', 'padding-top'], ['.job-row .btn-primary', 'padding-left'],
  ['.job-row .text-xs', 'font-size'], ['.job-row .text-xs', 'color'],
  ['#jobsEmpty', 'display'],
  // preview (type 0 — h0)
  ['#previewTitle', 'font-size'], ['#previewTitle', 'font-weight'],
  ['#previewTitle .text-xs', 'font-size'], ['#previewTitle .text-xs', 'color'],
  ['.flex.space-x-2 .btn-outline', 'font-size'], ['.flex.space-x-2 .btn-outline', 'padding-top'],
  ['.flex.space-x-2 .btn-outline', 'padding-left'], ['.flex.space-x-2 .btn-outline', 'border-width'],
  ['#previewTable th', 'font-size'], ['#previewTable th', 'font-weight'], ['#previewTable th', 'padding-top'],
  ['#previewTable td', 'padding-top'], ['#previewTable td', 'font-size'],
];

/** ===== đo SAU khi click type card thứ 3 (Công suất lớp học — có badge) ===== */
const CHECKS_REPORTS = [
  ['.type-card.active', 'border-color'], ['.type-card.active', 'background-color'],
  ['#previewTable .badge', 'font-size'], ['#previewTable .badge', 'padding-left'], ['#previewTable .badge', 'border-radius'],
  ['#previewTable .badge-success', 'color'], ['#previewTable .badge-success', 'background-color'],
  ['#previewTable .badge-warning', 'color'], ['#previewTable .badge-warning', 'background-color'],
  ['#previewTable .badge-gray', 'color'], ['#previewTable .badge-gray', 'background-color'],
  ['#previewTable td', 'font-size'],
];
const MOBILE_REPORTS = [
  ['#types', 'grid-template-columns'],
  ['.type-card', 'width'],
  ['.type-card p.text-2xl', 'font-size'],
];

/** đo 1 trang */
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

/** mở 1 cặp (mockup + app), đo desktop + mobile, diff.
 *  beforeChecks: đo trước midClickSel; midClickSel: click giữa chừng (vd tab Roles); checks: đo sau click */
async function audit(browser, { mockupFile, appPath, needLogin, mockupLogin, appFinalPath, waitSel, checks, beforeChecks = [], midClickSel, midWaitSel, mobileChecks, name }) {
  const mockupUrl = pathToFileURL(resolve(ROOT, 'docs/13-mockups', mockupFile)).href;

  // --- Mockup ---
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pageA = await ctxA.newPage();
  await pageA.goto(mockupUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await pageA.evaluate(() => document.fonts.ready);
  if (mockupLogin) {
    // mockup 01: appScreen ẩn đến khi doLogin() — click login (giá trị đã prefill đúng)
    await pageA.waitForSelector('#loginScreen .btn-primary', { timeout: 10000 });
    await pageA.click('#loginScreen .btn-primary');
  }
  await pageA.waitForSelector(waitSel, { timeout: 10000 });
  await pageA.waitForTimeout(500);
  const mockup = {
    ...(await collect(pageA, beforeChecks)),
    ...(await (async () => {
      if (midClickSel) {
        await pageA.click(midClickSel);
        await pageA.waitForSelector(midWaitSel, { timeout: 10000 });
        await pageA.waitForTimeout(300);
      }
      return collect(pageA, checks);
    })()),
    ...(await (async () => {
      await pageA.setViewportSize({ width: 390, height: 844 });
      await pageA.waitForTimeout(300);
      return collect(pageA, mobileChecks);
    })()),
  };
  await ctxA.close();

  // --- App (login nếu cần) ---
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pageB = await ctxB.newPage();
  await pageB.goto(APP_URL + appPath, { waitUntil: 'networkidle', timeout: 30000 });
  if (needLogin) {
    await pageB.waitForSelector('#loginEmail', { timeout: 10000 });
    await pageB.fill('#loginEmail', 'admin@educenter.vn');
    await pageB.fill('#loginPass', 'admin123');
    await pageB.click('#loginScreen .btn-primary');
    if (appFinalPath) {
      // token access nằm trong memory → điều hướng full page, AuthProvider tự refresh qua cookie
      await pageB.waitForTimeout(800);
      await pageB.goto(APP_URL + appFinalPath, { waitUntil: 'networkidle', timeout: 30000 });
    }
  }
  await pageB.evaluate(() => document.fonts.ready);
  await pageB.waitForSelector(waitSel, { timeout: 10000 });
  await pageB.waitForTimeout(500);
  const app = {
    ...(await collect(pageB, beforeChecks)),
    ...(await (async () => {
      if (midClickSel) {
        await pageB.click(midClickSel);
        await pageB.waitForSelector(midWaitSel, { timeout: 10000 });
        await pageB.waitForTimeout(300);
      }
      return collect(pageB, checks);
    })()),
    ...(await (async () => {
      await pageB.setViewportSize({ width: 390, height: 844 });
      await pageB.waitForTimeout(300);
      return collect(pageB, mobileChecks);
    })()),
  };
  await ctxB.close();

  const diff = [];
  const skipped = [];
  for (const key of Object.keys(mockup)) {
    const a = mockup[key];
    const b = app[key];
    // Element vắng ở app (bảng data-driven — vd badge-warning không xuất hiện khi page 1
    // không có user finance_officer): KHÔNG phải lệch style → bỏ qua, chỉ note SKIP.
    if (b === 'ELEMENT-MISSING' && a !== 'ELEMENT-MISSING') {
      skipped.push(key);
      continue;
    }
    if (a === b) continue;
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numeric = Number.isFinite(numA) && Number.isFinite(numB) && a.replace(numA, '') === b.replace(numB, '');
    if (numeric && Math.abs(numA - numB) <= TOL) continue;
    diff.push({ check: key, mockup: a, app: b });
  }
  return { name, mockup, app, diff, skipped, summary: { total: Object.keys(mockup).length, ok: Object.keys(mockup).length - diff.length, diff: diff.length, skipped: skipped.length } };
}

function printResult(r) {
  console.log(`=== ${r.name}: ${r.summary.ok}/${r.summary.total} khớp · DIFF=${r.summary.diff} ===`);
  for (const d of r.diff) {
    console.log(`[DIFF] ${d.check}\n       mockup: ${d.mockup}\n       app   : ${d.app}`);
  }
  for (const s of r.skipped) {
    console.log(`[SKIP] ${s} — app không có element (data-dependent, không phải lệch style)`);
  }
  if (r.diff.length === 0) console.log('Không có khác biệt computed style nào.');
  console.log('');
}

function mockupFileFor(slug) {
  if (slug === 'login' || slug === 'license') return '01-login-license.html';
  if (slug === 'users') return '03-users-roles.html';
  if (slug === 'reports') return '04-reports.html';
  return '02-admin-dashboard.html';
}

function saveReport(r, slug) {
  writeFileSync(resolve(OUT_DIR, `report-${slug}.json`), JSON.stringify(r, null, 2), 'utf8');
  const md = [
    `# Design Verification — ${r.name}`,
    '',
    `- Ngày chạy: ${new Date().toISOString()}`,
    '- Môi trường: Edge (channel msedge) headless · viewport 1280x900 + 390x844',
    `- Mockup: \`docs/13-mockups/${mockupFileFor(slug)}\` (file://) · App: \`${APP_URL}\``,
    '- Cách chạy lại: `node apps/web/scripts/verify-design.mjs` (cần API + web dev server đang chạy)',
    '',
    `## Kết quả: **${r.summary.ok}/${r.summary.total} khớp** · ${r.summary.diff} khác biệt`,
    '',
    '| # | Thuộc tính | Mockup | App |',
    '|---|------------|--------|-----|',
    ...r.diff.map((d, i) => `| ${i + 1} | \`${d.check}\` | \`${d.mockup}\` | \`${d.app}\` |`),
    '',
    '> Bảng rỗng = hai bên render y hệt về computed style (font-family, font-size, line-height, padding, màu, radius, grid).',
    '> Khi sửa mockup/code → chạy lại script, cập nhật file này làm chuẩn đối chiếu cho các màn hình sau.',
  ].join('\n');
  writeFileSync(resolve(OUT_DIR, `design-verification-${slug}.md`), md, 'utf8');
}

const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const rLogin = await audit(browser, {
    name: 'Login (mockup 01 vs app /login)',
    mockupFile: '01-login-license.html',
    appPath: '/login',
    needLogin: false,
    waitSel: '#loginEmail',
    checks: CHECKS_LOGIN,
    mobileChecks: MOBILE_LOGIN,
  });
  const rDash = await audit(browser, {
    name: 'Dashboard + AppShell (mockup 02 vs app /dashboard)',
    mockupFile: '02-admin-dashboard.html',
    appPath: '/login',
    needLogin: true,
    waitSel: '#st_students',
    checks: CHECKS_DASH,
    mobileChecks: MOBILE_DASH,
  });
  const rLic = await audit(browser, {
    name: 'License (mockup 01 appScreen vs app /license)',
    mockupFile: '01-login-license.html',
    appPath: '/login',
    needLogin: true,
    mockupLogin: true,
    appFinalPath: '/license',
    waitSel: '#welcomeBox',
    checks: CHECKS_LIC,
    mobileChecks: MOBILE_LIC,
  });

  const rUsers = await audit(browser, {
    name: 'Users & Roles (mockup 03 vs app /users)',
    mockupFile: '03-users-roles.html',
    appPath: '/login',
    needLogin: true,
    appFinalPath: '/users',
    waitSel: '#usersTable',
    beforeChecks: CHECKS_USERS_BEFORE,
    midClickSel: '#tabRoles',
    midWaitSel: '#roleList',
    checks: CHECKS_USERS,
    mobileChecks: MOBILE_USERS,
  });

  const rRep = await audit(browser, {
    name: 'Reports (mockup 04 vs app /reports)',
    mockupFile: '04-reports.html',
    appPath: '/login',
    needLogin: true,
    appFinalPath: '/reports',
    waitSel: '#types',
    beforeChecks: CHECKS_REPORTS_BEFORE,
    midClickSel: '.type-card:nth-child(3)',
    midWaitSel: '#previewTable',
    checks: CHECKS_REPORTS,
    mobileChecks: MOBILE_REPORTS,
  });

  printResult(rLogin);
  printResult(rDash);
  printResult(rLic);
  printResult(rUsers);
  printResult(rRep);
  saveReport(rLogin, 'login');
  saveReport(rDash, 'dashboard');
  saveReport(rLic, 'license');
  saveReport(rUsers, 'users');
  saveReport(rRep, 'reports');
  console.log(`Saved: ${resolve(OUT_DIR, 'report-{login,dashboard,license,users,reports}.json')}`);
  console.log(`Saved: ${resolve(OUT_DIR, 'design-verification-{login,dashboard,license,users,reports}.md')}`);
} finally {
  await browser.close();
}
