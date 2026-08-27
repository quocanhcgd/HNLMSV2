// E2E trình duyệt thật (msedge) — RBAC thật (B): branch_manager chỉ thấy HN1 trên UI
import { chromium } from 'playwright';

const BASE = 'http://localhost:5517';
const API = 'http://localhost:4001/api';
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

const TS = String(Date.now()).slice(-6);
const BM_EMAIL = `ui.bm${TS}@edu.vn`;

// setup: admin tạo branch_manager + scope HN1
const adminLogin = await (await fetch(`${API}/auth/login`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'admin@educenter.vn', password: 'admin123' }),
})).json();
const A = adminLogin.accessToken;
const branches = await (await fetch(`${API}/organization/branches?page_size=100`, { headers: { authorization: `Bearer ${A}` } })).json();
const hn1 = branches.data.find((b) => b.code === 'HN1');
const bmUser = await (await fetch(`${API}/users`, {
  method: 'POST', headers: { authorization: `Bearer ${A}`, 'content-type': 'application/json' },
  body: JSON.stringify({ email: BM_EMAIL, password: 'matkhau123', fullName: 'UI Branch Manager', roleCodes: ['branch_manager'] }),
})).json();
await fetch(`${API}/users/${bmUser.id}/scope-grants`, {
  method: 'POST', headers: { authorization: `Bearer ${A}`, 'content-type': 'application/json' },
  body: JSON.stringify({ branchId: hn1.id }),
});

const browser = await chromium.launch({ headless: true, channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle' });
  await page.fill('#loginEmail', BM_EMAIL);
  await page.fill('#loginPass', 'matkhau123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  step('BM login qua UI', true);

  // /users — bảng chỉ có user HN1
  await page.click('text=Người dùng & Vai trò');
  await page.waitForURL('**/users', { timeout: 10000 });
  await page.waitForSelector('#usersTable tbody tr', { timeout: 10000 });
  const rowCount = await page.locator('#usersTable tbody tr').count();
  const bodyText = (await page.locator('#usersTable').textContent()) || '';
  step(
    'BM /users: bảng hiển thị (scope filter) + không lộ user lạ',
    rowCount >= 2 && !bodyText.includes('E2E Control HCM1') && !bodyText.includes('admin@educenter.vn'),
    `rows=${rowCount}`,
  );
  // total label
  const totalTxt = (await page.locator('#usersTable').locator('xpath=ancestor::div[contains(@class,"card")]').textContent().catch(() => '')) || '';
  const totalMatch = totalTxt.match(/Tổng (\d+) người dùng/);
  step('BM /users: total label đúng scope (nhỏ)', totalMatch && Number(totalMatch[1]) < 30, `total=${totalMatch?.[1]}`);

  // /org — tab Chi nhánh chỉ HN1
  await page.click('text=Tổ chức & Chi nhánh');
  await page.waitForURL('**/org', { timeout: 10000 });
  await page.click('#tabBranches');
  await page.waitForSelector('#paneBranches table tbody tr', { timeout: 8000 });
  const brRows = await page.locator('#paneBranches tbody tr').count();
  const brText = (await page.locator('#paneBranches').textContent()) || '';
  step('BM /org branches: chỉ 1 chi nhánh HN1', brRows === 1 && brText.includes('HN1') && !brText.includes('HCM1'), `rows=${brRows}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 400));
  await page.screenshot({ path: 'rbac-ui-fail.png', fullPage: true }).catch(() => {});
} finally {
  await browser.close();
}
console.log('BM=' + BM_EMAIL);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
