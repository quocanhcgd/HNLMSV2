// E2E Academic (T041–T043): admin tạo ngành → chương trình → khóa học → lớp → lịch; chống trùng lịch 409 hiện toast
import { chromium } from 'playwright';

const BASE = 'http://localhost:5517';
const TS = String(Date.now()).slice(-6);
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

const waitToast = async (page, text) => {
  return page
    .waitForFunction(
      (t) => {
        const el = document.getElementById('toast');
        return el && !el.classList.contains('hidden') && (el.textContent || '').includes(t);
      },
      text,
      { timeout: 8000 },
    )
    .then(() => true)
    .catch(() => false);
};

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage();

try {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', 'admin@educenter.vn');
  await page.fill('#loginPass', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // nav Đào tạo → /academic
  await page.click('text=Đào tạo');
  await page.waitForURL('**/academic', { timeout: 8000 });
  step('nav → /academic', page.url().includes('/academic'));

  // Tab Ngành
  await page.click('button:has-text("Ngành")', { timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(400);
  await page.click('button:has-text("Thêm ngành")');
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="EN"]', `EN${TS}`);
  await page.fill('input[placeholder="Tiếng Anh"]', `Ngành ${TS}`);
  await page.click('button:has-text("Lưu thay đổi")');
  const deptToast = await waitToast(page, 'Đã tạo ngành');
  step('tạo ngành → toast', deptToast, `code=EN${TS}`);

  // Tab Chương trình
  await page.click('button:has-text("Chương trình")');
  await page.waitForTimeout(400);
  await page.click('button:has-text("Thêm chương trình")');
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="EN-MASTER"]', `PR${TS}`);
  await page.fill('input[placeholder="Tiếng Anh Master"]', `Chương trình ${TS}`);
  await page.fill('input[placeholder="12"]', '12');
  await page.click('button:has-text("Lưu thay đổi")');
  const progToast = await waitToast(page, 'Đã tạo chương trình');
  step('tạo chương trình → toast', progToast, `code=PR${TS}`);

  // Tab Khóa học
  await page.click('button:has-text("Khóa học")');
  await page.waitForTimeout(400);
  await page.click('button:has-text("Thêm khóa học")');
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="EN-M1"]', `CR${TS}`);
  await page.fill('input[placeholder="Ngữ pháp cơ bản"]', `Khóa học ${TS}`);
  await page.click('button:has-text("Lưu thay đổi")');
  const courseToast = await waitToast(page, 'Đã tạo khóa học');
  step('tạo khóa học → toast', courseToast, `code=CR${TS}`);

  // Tab Lớp học
  await page.click('button:has-text("Lớp học")');
  await page.waitForTimeout(400);
  await page.click('button:has-text("Thêm lớp")');
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="EN-M1-01"]', `CL${TS}`);
  await page.fill('input[placeholder="Lớp Anh văn M1 - Ca 1"]', `Lớp ${TS}`);
  await page.click('button:has-text("Lưu thay đổi")');
  const classToast = await waitToast(page, 'Đã tạo lớp');
  step('tạo lớp → toast', classToast, `code=CL${TS}`);

  // Mở chi tiết lớp → thêm lịch
  await page.waitForTimeout(500);
  await page.click(`text=CL${TS}`);
  await page.waitForTimeout(600);
  await page.click('text=Lịch học', { timeout: 5000 }).catch(() => undefined);
  await page.click('text=Thêm buổi học', { timeout: 5000 }).catch(() => undefined);
  // nút + Thêm buổi học (trong form) — dùng locator cụ thể hơn
  const addBtn = page.locator('button:has-text("Thêm buổi học")').last();
  await addBtn.click();
  const schedToast = await waitToast(page, 'Đã thêm buổi học');
  step('thêm lịch → toast', schedToast);

  // Thêm lịch trùng (cùng giờ) → toast 409
  await page.waitForTimeout(400);
  const addBtn2 = page.locator('button:has-text("Thêm buổi học")').last();
  await addBtn2.click();
  const conflictToast = await waitToast(page, 'Trùng lịch');
  step('lịch trùng → toast 409', conflictToast);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
  await page.screenshot({ path: `e2e-academic-fail-${TS}.png`, fullPage: true }).catch(() => undefined);
}
await browser.close();
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
