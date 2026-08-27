// E2E — phone trong form tạo user
import { chromium } from 'playwright';

const BASE = 'http://localhost:5517';
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};
const waitToast = (contains, timeout = 8000) =>
  page.waitForFunction((txt) => (document.getElementById('toast')?.textContent || '').includes(txt), contains, { timeout });
const waitToastGone = () =>
  page.waitForFunction(() => document.getElementById('toast')?.classList.contains('hidden'), null, { timeout: 8000 });

const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('dialog', (d) => d.accept());
const EMAIL = 'e2e.phone' + String(Date.now()).slice(-5) + '@edu.vn';
const PHONE = '0919' + String(Date.now()).slice(-6);

try {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', 'admin@educenter.vn');
  await page.fill('#loginPass', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.click('text=Người dùng & Vai trò');
  await page.waitForURL('**/users', { timeout: 10000 });
  await page.waitForSelector('#usersTable tbody tr', { timeout: 10000 });

  // mở modal tạo + nhập phone
  await page.click('text=Tạo người dùng');
  await page.waitForSelector('#userModal:not(.hidden)', { timeout: 5000 });
  await page.fill('#userModal input >> nth=0', 'Nguyễn Phone E2E');
  await page.fill('#userModal input >> nth=1', EMAIL);
  await page.fill('#userModal input >> nth=2', 'matkhau123');
  await page.fill('#userModal input >> nth=3', PHONE);
  await page.locator('#userModal .chip', { hasText: 'Teacher' }).click();
  await page.click('#userModal .btn-primary');
  await waitToast('Đã tạo');
  step('tạo user kèm phone → toast', true);
  await waitToastGone();

  // tìm user trong bảng → mở chi tiết → phone hiển thị
  await page.waitForSelector(`#usersTable tbody tr:has-text("${EMAIL}")`, { timeout: 8000 });
  await page.locator(`#usersTable tbody tr:has-text("${EMAIL}") button:has-text("Chi tiết")`).click();
  await page.waitForSelector('#detailModal:not(.hidden)', { timeout: 5000 });
  const det = (await page.locator('#detailModal').textContent()) || '';
  step('detail modal hiển thị phone', det.includes(PHONE), det.replace(/\s+/g, ' ').slice(0, 180));
  await page.click('#detailModal button:has-text("✕")');
  await page.waitForFunction(() => document.getElementById('detailModal')?.classList.contains('hidden'), null, { timeout: 5000 });
} catch (e) {
  const toastText = await page.evaluate(() => document.getElementById('toast')?.textContent || '').catch(() => '');
  step('EXCEPTION', false, String(e).slice(0, 300) + ' | toast="' + toastText + '"');
  await page.screenshot({ path: 'userphone-fail.png', fullPage: true }).catch(() => {});
} finally {
  await browser.close();
}
console.log(EMAIL, PHONE);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
