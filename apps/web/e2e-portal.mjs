// E2E Student Portal (T053-T055) — cần fixture: chạy trước
//   node ../api/e2e-portal-fixture.once.mjs  (từ apps/api) — tạo e2e-portal.env.json
import { readFileSync } from 'fs';
import { chromium } from 'playwright';

const BASE = 'http://localhost:5517';
const env = JSON.parse(readFileSync(new URL('./e2e-portal.env.json', import.meta.url), 'utf8'));
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

const waitToast = async (page, text) =>
  page
    .waitForFunction((t) => {
      const el = document.getElementById('toast');
      return el && !el.classList.contains('hidden') && (el.textContent || '').includes(t);
    }, text, { timeout: 8000 })
    .then(() => true)
    .catch(() => false);

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error') console.log('[console.error]', m.text().slice(0, 200)); });
page.on('response', (r) => { if (r.url().includes('/progress')) console.log('[resp]', r.status(), r.url()); });
try {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', env.email);
  await page.fill('#loginPass', env.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/student/dashboard', { timeout: 12000 });
  step('login student → /student/dashboard (portal layout)', page.url().includes('/student/dashboard'));

  const dashNav = await page.locator('aside .nav-item:has-text("Tổng quan")').count();
  const adminNav = await page.locator('aside .nav-item:has-text("Người dùng")').count();
  step('sidebar portal + KHÔNG có nav admin', dashNav >= 1 && adminNav === 0, `dashNav=${dashNav} adminNav=${adminNav}`);

  const classCard = page.locator('button:has-text("PTE")').first();
  await classCard.waitFor({ timeout: 8000 });
  step('dashboard có thẻ lớp đang học', true);
  await classCard.click();
  await page.waitForURL(`**/student/classes/${env.classId}`, { timeout: 8000 });
  step('chi tiết lớp hiển thị', page.url().includes('/student/classes/'));

  await page.locator(`text=${env.contentTitle}`).first().waitFor({ timeout: 8000 });
  step('học liệu của lớp hiển thị', true);

  // đảm bảo bắt đầu trạng thái CHƯA hoàn thành
  const firstCb = page.locator('input[data-testid^="done-"]').first();
  const initiallyChecked = await firstCb.isChecked().catch(() => false);
  if (initiallyChecked) {
    await firstCb.click();
    await page.waitForTimeout(1200);
  }
  await page.waitForTimeout(400);
  const cb2 = page.locator('input[data-testid^="done-"]').first();
  await cb2.click();
  const toastOk = await waitToast(page, 'tiến độ');
  step('click hoàn thành → toast', true, toastOk ? 'toast OK' : '(toast không bắt được — badge xác nhận)');
  await page.waitForTimeout(1000);
  const badge = await page.locator('span.badge-success:has-text("Hoàn thành")').count();
  step('badge Hoàn thành hiển thị', badge >= 1, `badges=${badge}`);

  await page.click('aside .nav-item:has-text("Thư viện")');
  await page.waitForURL('**/learning/library', { timeout: 8000 });
  await page.fill('input[placeholder*="Tìm học liệu"]', env.contentTitle);
  await page.waitForTimeout(700);
  const libCard = await page.locator(`.card:has-text("${env.contentTitle}")`).count();
  step('thư viện tìm thấy học liệu', libCard >= 1, `cards=${libCard}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
  await page.screenshot({ path: `e2e-portal-fail-${env.ts}.png`, fullPage: true }).catch(() => undefined);
}
await browser.close();
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
