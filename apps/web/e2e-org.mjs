// E2E trình duyệt thật (msedge) — T030/T031 trang /org
// Login admin → /org → verify form org + CRUD branch
import { chromium } from 'playwright';

const waitToastGone = () => page.waitForFunction(() => document.getElementById('toast')?.classList.contains('hidden'), null, { timeout: 8000 });
const BASE = 'http://localhost:5517';
const BR_CODE = 'T31' + String(Date.now()).slice(-5);
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('dialog', (d) => d.accept());

try {
  // 1. Login
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', 'admin@educenter.vn');
  await page.fill('#loginPass', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  step('login admin', true);

  // 2. Nav → /org
  await page.click('text=Tổ chức & Chi nhánh');
  await page.waitForURL('**/org', { timeout: 10000 });
  await page.waitForSelector('#paneOrg .input-field', { timeout: 10000 });
  step('nav → /org + form load', true);

  const header = await page.textContent('h2');
  step('header title', header.includes('Tổ chức & Chi nhánh'), `"${header}"`);

  const nameField = page.locator('#paneOrg .input-field').nth(0);
  const tzField = page.locator('#paneOrg .input-field').nth(1);
  const periodField = page.locator('#paneOrg .input-field').nth(2);
  const origName = (await nameField.inputValue()).trim();
  const origTz = (await tzField.inputValue()).trim();
  const origPeriod = (await periodField.inputValue()).trim();
  step('org form có dữ liệu API', origName.length > 0 && origTz.length > 0, `name="${origName}" tz="${origTz}" period="${origPeriod}"`);

  // 3. Sửa org → lưu → toast → reload vẫn hiển thị (DoD T030)
  const testName = origName + ' [T30-test]';
  await nameField.fill(testName);
  await page.click('#paneOrg .btn-primary');
  await page.waitForSelector('#toast:not(.hidden)', { timeout: 8000 });
  const toast1 = (await page.textContent('#toast')) || '';
  step('lưu org → toast', toast1.includes('Đã lưu cấu hình'), `"${toast1}"`);
  await waitToastGone();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#paneOrg .input-field', { timeout: 10000 });
  const reloadedName = (await page.locator('#paneOrg .input-field').nth(0).inputValue()).trim();
  step('reload → tên mới hiển thị (DoD)', reloadedName === testName, `"${reloadedName}"`);

  // 4. Tab Chi nhánh
  await page.click('#tabBranches');
  await page.waitForSelector('#paneBranches table tbody tr', { timeout: 8000 });
  const rowCount = await page.locator('#paneBranches table tbody tr').count();
  step('bảng chi nhánh có dữ liệu', rowCount >= 2, `${rowCount} rows`);

  // 5. Tạo branch
  await page.click('text=Thêm chi nhánh');
  await page.waitForSelector('#branchModal:not(.hidden)', { timeout: 5000 });
  await page.fill('#branchModal input.input-field >> nth=0', BR_CODE);
  await page.fill('#branchModal input.input-field >> nth=1', 'Chi nhánh Test T31');
  await page.fill('#branchModal input.input-field >> nth=2', 'Số 999 Test');
  await page.click('#branchModal .btn-primary');
  await page.waitForSelector('#toast:not(.hidden)', { timeout: 8000 });
  const toast2 = (await page.textContent('#toast')) || '';
  step('tạo branch → toast', toast2.includes('Đã tạo chi nhánh'), `"${toast2}"`);
  await waitToastGone();
  await page.waitForSelector(`#paneBranches tbody tr:has-text("${BR_CODE}")`, { timeout: 8000 });
  const badge = (await page.locator(`#paneBranches tbody tr:has-text("${BR_CODE}") .badge`).first().textContent()) || '';
  step('row mới xuất hiện + badge code', badge === BR_CODE, badge);

  // 6. Sửa branch
  const editBtn = page.locator(`#paneBranches tbody tr:has-text("${BR_CODE}") button:has-text("Sửa")`);
  await editBtn.click();
  await page.waitForSelector('#branchModal:not(.hidden)', { timeout: 5000 });
  await page.fill('#branchModal input.input-field >> nth=1', 'Chi nhánh Test T31 - Renamed');
  await page.click('#branchModal .btn-primary');
  await page.waitForSelector('#toast:not(.hidden)', { timeout: 8000 });
  const toast3 = (await page.textContent('#toast')) || '';
  step('sửa branch → toast', toast3.includes('Đã cập nhật'), `"${toast3}"`);
  await waitToastGone();
  await page.waitForSelector('#paneBranches tbody tr:has-text("Renamed")', { timeout: 8000 });
  step('tên mới hiển thị', true);

  // 7. Đóng cửa (archive)
  await page.locator(`#paneBranches tbody tr:has-text("${BR_CODE}") button:has-text("Đóng cửa")`).click();
  await page.waitForSelector('#toast:not(.hidden)', { timeout: 8000 });
  const toast4 = (await page.textContent('#toast')) || '';
  await waitToastGone();
  await page.waitForSelector(`#paneBranches tbody tr:has-text("${BR_CODE}") .badge-danger`, { timeout: 8000 });
  const stBadge = (await page.locator(`#paneBranches tbody tr:has-text("${BR_CODE}") .badge-danger`).textContent()) || '';
  step('archive → toast + badge', toast4.includes('Đã đóng cửa') && stBadge.includes('Đã đóng cửa'), `"${toast4}" / "${stBadge}"`);

  // 8. Restore org name về seed value
  await page.click('#tabOrg');
  await page.waitForSelector('#paneOrg .input-field', { timeout: 5000 });
  await page.locator('#paneOrg .input-field').nth(0).fill('EduCenter LMS');
  await page.click('#paneOrg .btn-primary');
  await page.waitForFunction(() => (document.getElementById('toast')?.textContent || '').includes('Đã lưu cấu hình'), null, { timeout: 8000 });
  await waitToastGone();
  step('restore org name', true, '→ "EduCenter LMS"');
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 400));
  await page.screenshot({ path: 'org-fail.png', fullPage: true }).catch(() => {});
} finally {
  await browser.close();
}

const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
