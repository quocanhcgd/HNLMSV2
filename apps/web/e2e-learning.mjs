// E2E Learning Contents (T052): tab Học liệu → upload file → thấy dòng + nút tải
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
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', 'admin@educenter.vn');
  await page.fill('#loginPass', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  await page.goto(`${BASE}/academic`, { waitUntil: 'networkidle' });
  await page.click('text=Học liệu');
  await page.waitForTimeout(600);
  const uploadBtn = await page.locator('button:has-text("Tải lên học liệu")').count();
  step('tab Học liệu hiển thị nút upload', uploadBtn >= 1);

  await page.click('button:has-text("Tải lên học liệu")').catch(async () => {
    await page.locator('button:has-text("Tải lên học liệu")').first().click();
  });
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="Ví dụ: Bài giảng ngữ pháp tuần 3"]', `Bài giảng E2E ${TS}`);
  await page.setInputFiles('[data-testid="contentFile"]', {
    name: 'e2e-bai-giang.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Nội dung bài giảng e2e'),
  });
  await page.locator('.card button:has-text("Tải lên học liệu")').click();
  const uploaded = await waitToast(page, 'Đã tải lên học liệu');
  step('upload → toast', uploaded);

  await page.waitForTimeout(600);
  const row = await page.locator(`#contentTable tbody tr:has-text("Bài giảng E2E ${TS}")`).count();
  step('bảng có dòng học liệu mới', row >= 1, `rows=${row}`);
  const dlBtn = await page.locator(`#contentTable tbody tr:has-text("Bài giảng E2E ${TS}") button:has-text("Tải xuống")`).count();
  step('dòng có nút Tải về', dlBtn >= 1);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
  await page.screenshot({ path: `e2e-learning-fail-${TS}.png`, fullPage: true }).catch(() => undefined);
}
await browser.close();
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
