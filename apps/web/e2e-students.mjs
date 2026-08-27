// E2E Students & Enrollment (T047-T048): admin tạo học viên → chi tiết → ghi danh vào lớp
import { chromium } from 'playwright';

const BASE = 'http://localhost:5517';
const API = 'http://localhost:4001/api';
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
  // login qua UI
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', 'admin@educenter.vn');
  await page.fill('#loginPass', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // nav → /students
  await page.click('text=Học viên & Ghi danh');
  await page.waitForURL('**/students', { timeout: 8000 });
  step('nav → /students', page.url().includes('/students'));

  // thêm học viên
  const code = `E2E${TS}`;
  await page.click('text=Thêm học viên');
  await page.waitForTimeout(400);
  await page.fill('input[placeholder="SV2026-001"]', code);
  await page.fill('input[placeholder="Nguyễn Văn A"]', `Học viên E2E ${TS}`);
  await page.fill('input[placeholder="001202012345"]', `001${TS}`);
  // chọn chi nhánh trong modal (select đầu tiên có option "" — của modal, không phải filter bar)
  await page.waitForFunction(() => {
    const s = Array.from(document.querySelectorAll('.card select')).find((x) => x.options.length >= 2 && x.options[0].value === '');
    return !!s;
  }, { timeout: 8000 });
  await page.locator('.card select:has(option[value=""])').first().selectOption({ index: 1 });
  await page.click('button:has-text("Lưu thay đổi")');
  const created = await waitToast(page, 'Đã tạo hồ sơ học viên');
  step('tạo học viên → toast', created, `code=${code}`);

  // tìm thấy trong bảng
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="🔍 Tìm theo tên / mã học viên..."]', code);
  await page.waitForTimeout(600);
  const rowVisible = await page.locator(`#studentsTable tbody tr:has-text("${code}")`).count();
  step('bảng tìm thấy học viên', rowVisible >= 1, `rows=${rowVisible}`);

  // mở chi tiết → ghi danh
  await page.click(`#studentsTable tbody tr:has-text("${code}") button:has-text("Chi tiết")`);
  await page.waitForTimeout(600);
  const detailVisible = await page.locator('text=Hồ sơ học viên').count();
  step('modal chi tiết hiển thị', detailVisible >= 1);
  await page.click('button:has-text("Ghi danh")');
  await page.waitForTimeout(400);
  const optCount = await page.locator('#enrollModal select option').count().catch(() => 0);
  // chọn option đầu tiên (lớp còn chỗ)
  const sel = page.locator('#enrollModal select');
  await sel.selectOption({ index: 1 });
  await page.click('#enrollModal button:has-text("Ghi danh")');
  const enrolled = await waitToast(page, 'Đã ghi danh');
  step('ghi danh → toast', enrolled, `lớp còn chỗ=${optCount - 1}`);

  // bảng ghi danh có dòng
  await page.waitForTimeout(600);
  const enrRow = await page.locator('#enrollTable tbody tr').count();
  step('bảng ghi danh có dòng', enrRow >= 1, `rows=${enrRow}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
  await page.screenshot({ path: `e2e-students-fail-${TS}.png`, fullPage: true }).catch(() => undefined);
}
await browser.close();
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
