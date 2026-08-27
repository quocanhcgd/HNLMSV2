// E2E trình duyệt thật (msedge) — T030/T031 mở rộng: khai báo org/branch đầy đủ
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

const BR_CODE = 'T32' + String(Date.now()).slice(-5);

try {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', 'admin@educenter.vn');
  await page.fill('#loginPass', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.click('text=Tổ chức & Chi nhánh');
  await page.waitForURL('**/org', { timeout: 10000 });
  await page.waitForSelector('#paneOrg .input-field', { timeout: 10000 });

  // ===== Org form đầy đủ =====
  const inp = (i) => page.locator('#paneOrg .input-field').nth(i);
  const orgFields = [
    '', // 0 name (giữ nguyên)
    'EC', // 1 short name
    '0101234567', // 2 tax
    '0107123456', // 3 license
    'Nguyễn Văn A', // 4 representative
    '2010-05-20', // 5 founded
    '', // 6 timezone (giữ)
    '', // 7 period (giữ)
    'Số 1 Tràng Tiền, Hoàn Kiếm', // 8 address
    '02438223344', // 9 phone
    '1900 633 055', // 10 hotline
    'info@educenter.vn', // 11 email
    'https://educenter.vn', // 12 website
    '02438223345', // 13 fax
    'Vietcombank', // 14 bank name
    '0011001234567', // 15 bank account
    'EduCenter JSC', // 16 bank holder
    'https://x.example/logo.png', // 17 logo
    'Học thật - Làm thật', // 18 slogan
    '#0d9488', // 19 brand color
  ];
  for (let i = 0; i < orgFields.length; i++) {
    if (orgFields[i] !== '') await inp(i).fill(orgFields[i]);
  }
  await page.click('#paneOrg .btn-primary');
  await waitToast('Đã lưu cấu hình tổ chức');
  step('lưu org đầy đủ → toast', true);
  await waitToastGone();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('#paneOrg .input-field', { timeout: 10000 });
  await page.waitForTimeout(600); // chờ applyOrg setState sau fetch
  const vShort = await inp(1).inputValue();
  const vTax = await inp(2).inputValue();
  const vAddr = await inp(8).inputValue();
  const vBank = await inp(14).inputValue();
  const vSlogan = await inp(18).inputValue();
  const persist =
    vShort === 'EC' && vTax === '0101234567' && vAddr === 'Số 1 Tràng Tiền, Hoàn Kiếm' && vBank === 'Vietcombank' && vSlogan === 'Học thật - Làm thật';
  step('reload → JSONB persist (short/tax/addr/bank/slogan)', persist, `short="${vShort}" tax="${vTax}" addr="${vAddr}" bank="${vBank}" slogan="${vSlogan}"`);

  // ===== Branch đầy đủ =====
  await page.click('#tabBranches');
  await page.waitForSelector('#paneBranches table tbody tr', { timeout: 8000 });
  await page.click('text=Thêm chi nhánh');
  await page.waitForSelector('#branchModal:not(.hidden)', { timeout: 5000 });
  const bInp = (i) => page.locator('#branchModal .input-field').nth(i);
  await bInp(0).fill(BR_CODE);
  await bInp(1).fill('Chi nhánh E2E Full');
  await bInp(2).fill('Số 99 Láng Hạ');
  await bInp(3).fill('02439998888');
  await bInp(4).fill('e2e.hn@educenter.vn');
  await bInp(5).fill('1800 999 888');
  await bInp(6).fill('0109998888');
  await bInp(7).fill('Trần Thị B');
  await bInp(9).fill('2026-09-01');
  await page.fill('#branchModal textarea', 'Chi nhánh test E2E');
  await page.click('#branchModal .btn-primary');
  await waitToast('Đã tạo chi nhánh');
  step('tạo branch đủ field → toast', true);
  await waitToastGone();
  await page.waitForSelector(`#paneBranches tbody tr:has-text("${BR_CODE}")`, { timeout: 8000 });
  const row = page.locator(`#paneBranches tbody tr:has-text("${BR_CODE}")`);
  const rowText = (await row.textContent()) || '';
  step(
    'row hiển thị đủ: contact/MST/opened',
    rowText.includes('02439998888') && rowText.includes('0109998888') && rowText.includes('2026-09-01'),
    rowText.replace(/\s+/g, ' ').slice(0, 160),
  );

  // sửa phone
  await row.locator('button:has-text("Sửa")').click();
  await page.waitForSelector('#branchModal:not(.hidden)', { timeout: 5000 });
  await bInp(3).fill('02430000000');
  await page.click('#branchModal .btn-primary');
  await waitToast('Đã cập nhật chi nhánh');
  step('sửa branch → toast', true);
  await waitToastGone();
  await page.waitForSelector(`#paneBranches tbody tr:has-text("02430000000")`, { timeout: 8000 });
  step('phone mới hiển thị', true);

  // archive
  await page.locator(`#paneBranches tbody tr:has-text("${BR_CODE}") button:has-text("Đóng cửa")`).click();
  await waitToast('Đã đóng cửa chi nhánh');
  step('archive branch → toast', true);
  await waitToastGone();
  await page.waitForSelector(`#paneBranches tbody tr:has-text("${BR_CODE}") .badge-danger`, { timeout: 8000 });
  step('badge đã đóng cửa', true);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 500));
  await page.screenshot({ path: 'org-full-fail.png', fullPage: true }).catch(() => {});
} finally {
  await browser.close();
}

const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
