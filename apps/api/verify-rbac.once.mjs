// Verify RBAC thật (B) — ma trận quyền admin / branch_manager / student
const BASE = 'http://localhost:4001/api';
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

async function login(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  return { token: j.accessToken, user: j.user, status: r.status };
}

async function call(token, path, method = 'GET', body) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let j = null;
  try { j = JSON.parse(text); } catch { j = text; }
  return { status: r.status, body: j };
}

const ADMIN = { email: 'admin@educenter.vn', password: 'admin123' };
const TS = String(Date.now()).slice(-6);
const BM_EMAIL = `e2e.bm${TS}@edu.vn`;
const ST_EMAIL = `e2e.st${TS}@edu.vn`;

try {
  const admin = await login(ADMIN.email, ADMIN.password);
  step('admin login', admin.status === 201 || admin.status === 200, `status=${admin.status}`);
  const orgs = await call(admin.token, '/organization');
  step('admin GET /organization 200', orgs.status === 200, `status=${orgs.status}`);
  const roles = await call(admin.token, '/roles');
  step('admin GET /roles 200', roles.status === 200, `status=${roles.status}`);
  const users = await call(admin.token, '/users?page=1&page_size=5');
  step('admin GET /users 200 + total>0', users.status === 200 && users.body?.meta?.total > 0, `total=${users.body?.meta?.total}`);

  const branches = await call(admin.token, '/organization/branches?page_size=100');
  const hn1 = (branches.body?.data ?? []).find((b) => b.code === 'HN1');
  const hcm1 = (branches.body?.data ?? []).find((b) => b.code === 'HCM1');
  step('tìm HN1/HCM1', !!hn1 && !!hcm1);
  const roleId = roles.body?.data?.[0]?.id ?? roles.body?.[0]?.id;

  // control user chỉ có scope HCM1 — phải KHÔNG xuất hiện trong list của BM/student
  const ctlUser = await call(admin.token, '/users', 'POST', {
    email: `e2e.ctl${TS}@edu.vn`, password: 'matkhau123', fullName: 'E2E Control HCM1', roleCodes: ['student'],
  });
  await call(admin.token, `/users/${ctlUser.body?.id}/scope-grants`, 'POST', { branchId: hcm1.id });

  // ---- branch_manager ----
  const bmUser = await call(admin.token, '/users', 'POST', {
    email: BM_EMAIL, password: 'matkhau123', fullName: 'E2E Branch Manager', roleCodes: ['branch_manager'],
  });
  step('tạo branch_manager', bmUser.status === 201, `status=${bmUser.status}`);
  const bmId = bmUser.body?.id;
  await call(admin.token, `/users/${bmId}/scope-grants`, 'POST', { branchId: hn1.id });
  const bm = await login(BM_EMAIL, 'matkhau123');
  step('branch_manager login', bm.status === 201 || bm.status === 200, `status=${bm.status}`);

  const bmBranches = await call(bm.token, '/organization/branches?page_size=100');
  const bmCodes = (bmBranches.body?.data ?? []).map((b) => b.code);
  step('BM branches → chỉ HN1', bmBranches.status === 200 && bmCodes.length === 1 && bmCodes[0] === 'HN1', `codes=${bmCodes.join(',')}`);
  const bmHcm1 = await call(bm.token, `/organization/branches/${hcm1.id}`);
  step('BM GET HCM1 → 403 (ngoài scope)', bmHcm1.status === 403, `status=${bmHcm1.status}`);
  const bmUsers = await call(bm.token, '/users?page=1&page_size=200');
  const bmEmails = (bmUsers.body?.data ?? []).map((u) => u.email);
  step(
    'BM GET /users → lọc đúng scope (>=2 user HN1, KHÔNG có control HCM1)',
    bmUsers.status === 200 && bmEmails.length >= 2 && !bmEmails.includes(`e2e.ctl${TS}@edu.vn`),
    `count=${bmEmails.length} cóControl=${bmEmails.includes(`e2e.ctl${TS}@edu.vn`)}`,
  );
  const bmUpdateOrg = await call(bm.token, '/organization', 'PUT', { name: 'HACK' });
  step('BM PUT /organization → 403 (org:update)', bmUpdateOrg.status === 403, `status=${bmUpdateOrg.status}`);
  const bmRoles = await call(bm.token, '/roles');
  step('BM GET /roles → 200 (user:read, không nhạy cảm)', bmRoles.status === 200, `status=${bmRoles.status}`);
  const bmPatchRole = await call(bm.token, `/roles/${roleId}`, 'PATCH', { name: 'HACK ROLE' });
  step('BM PATCH /roles/:id → 403 (role:manage)', bmPatchRole.status === 403, `status=${bmPatchRole.status}`);
  const bmCreate = await call(bm.token, '/organization/branches', 'POST', { code: 'BMX' + TS, name: 'BM Test' });
  step('BM POST branch → 201 (branch:create)', bmCreate.status === 201, `status=${bmCreate.status}`);
  if (bmCreate.status === 201) await call(admin.token, `/organization/branches/${bmCreate.body.id}`, 'PUT', { status: 'inactive' });

  // ---- student (scope HN1) ----
  const stUser = await call(admin.token, '/users', 'POST', {
    email: ST_EMAIL, password: 'matkhau123', fullName: 'E2E Student', roleCodes: ['student'],
  });
  step('tạo student (role student)', stUser.status === 201, `status=${stUser.status}`);
  const stId = stUser.body?.id;
  await call(admin.token, `/users/${stId}/scope-grants`, 'POST', { branchId: hn1.id });
  const st = await login(ST_EMAIL, 'matkhau123');
  step('student login', st.status === 201 || st.status === 200, `status=${st.status}`);
  const stUsers = await call(st.token, '/users?page=1&page_size=200');
  const stEmails = (stUsers.body?.data ?? []).map((u) => u.email);
  step(
    'student GET /users → lọc đúng scope (>=2, KHÔNG có control HCM1)',
    stUsers.status === 200 && stEmails.length >= 2 && !stEmails.includes(`e2e.ctl${TS}@edu.vn`),
    `count=${stEmails.length} cóControl=${stEmails.includes(`e2e.ctl${TS}@edu.vn`)}`,
  );
  const stBranches = await call(st.token, '/organization/branches');
  step('student GET branches → 403 (branch:read)', stBranches.status === 403, `status=${stBranches.status}`);
  const stRoles = await call(st.token, '/roles');
  step('student GET /roles → 200 (user:read)', stRoles.status === 200, `status=${stRoles.status}`);
  const stPatchRole = await call(st.token, `/roles/${roleId}`, 'PATCH', { name: 'X' });
  step('student PATCH /roles/:id → 403 (role:manage)', stPatchRole.status === 403, `status=${stPatchRole.status}`);
  const stAdminDetail = await call(st.token, `/users/${admin.user.id}`);
  step('student GET admin detail → 403 (ngoài scope)', stAdminDetail.status === 403, `status=${stAdminDetail.status}`);
  const stGrantScope = await call(st.token, `/users/${stId}/scope-grants`, 'POST', { branchId: hcm1.id });
  step('student POST scope-grant → 403 (scope:grant)', stGrantScope.status === 403, `status=${stGrantScope.status}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 400));
}
console.log(`BM=${BM_EMAIL} ST=${ST_EMAIL}`);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
