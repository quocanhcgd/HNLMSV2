// Verify Students & Enrollment API (T044-T046): CRUD + capacity + duplicate + scope
const BASE = 'http://localhost:4001/api';
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};
const TS = String(Date.now()).slice(-6);

const login = async (email, password) => {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const j = await r.json();
  return { token: j.accessToken, user: j.user, status: r.status };
};
const call = async (token, path, method = 'GET', body) => {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let j = null;
  try { j = JSON.parse(text); } catch { j = text; }
  return { status: r.status, body: j };
};

let ADMIN_TOKEN, BM_TOKEN, ids = {};
try {
  const admin = await login('admin@educenter.vn', 'admin123');
  ADMIN_TOKEN = admin.token;
  step('admin login', admin.status === 200, `status=${admin.status}`);

  const branches = await call(ADMIN_TOKEN, '/organization/branches?page_size=100');
  const hn1 = branches.body.data.find((b) => b.code === 'HN1');
  const hcm1 = branches.body.data.find((b) => b.code === 'HCM1');

  // ---- Students CRUD ----
  const st1 = await call(ADMIN_TOKEN, '/students', 'POST', {
    studentCode: `SV${TS}`, fullName: 'Nguyễn Văn A', dateOfBirth: '2005-03-15', gender: 'male',
    phone: '0901234567', guardianPhone: '0912345678', identityRef: '001202012345', branchId: hn1.id,
  });
  step('POST /students 201', st1.status === 201, `status=${st1.status} code=${st1.body?.studentCode}`);
  ids.student = st1.body?.id;
  const stDup = await call(ADMIN_TOKEN, '/students', 'POST', { studentCode: `SV${TS}`, fullName: 'Trùng' });
  step('POST student trùng code → 409', stDup.status === 409, `status=${stDup.status}`);
  const stList = await call(ADMIN_TOKEN, `/students?page=1&page_size=10&q=${encodeURIComponent('Nguyễn Văn A')}`);
  step('GET /students tìm q', stList.status === 200 && stList.body?.data?.some((s) => s.id === ids.student), `total=${stList.body?.meta?.total}`);
  const stUpd = await call(ADMIN_TOKEN, `/students/${ids.student}`, 'PUT', { fullName: 'Nguyễn Văn A (đổi)', phone: '0900000000' });
  step('PUT /students/:id 200', stUpd.status === 200 && stUpd.body?.fullName?.includes('đổi'), `status=${stUpd.status}`);
  const stGet = await call(ADMIN_TOKEN, `/students/${ids.student}`);
  step('GET /students/:id', stGet.status === 200, `status=${stGet.status}`);

  // ---- Academic fixture: program/course/class ----
  const dept = await call(ADMIN_TOKEN, '/departments', 'POST', { code: 'EN', name: 'Tiếng Anh' });
  ids.dept = dept.body?.id;
  const prog = await call(ADMIN_TOKEN, '/programs', 'POST', { departmentId: ids.dept, code: 'EN-MASTER', name: 'Tiếng Anh Master' });
  ids.prog = prog.body?.id;
  const course = await call(ADMIN_TOKEN, '/courses', 'POST', { programId: ids.prog, code: 'EN-M1', name: 'Ngữ pháp cơ bản' });
  ids.course = course.body?.id;
  const cls = await call(ADMIN_TOKEN, '/classes', 'POST', {
    branchId: hn1.id, programId: ids.prog, courseId: ids.course, code: `CL${TS}`, name: 'Lớp test', capacity: 2,
  });
  ids.class = cls.body?.id;
  step('fixture: tạo class capacity=2', cls.status === 201, `status=${cls.status}`);

  // ---- Enrollments ----
  const enr = await call(ADMIN_TOKEN, '/enrollments', 'POST', { studentId: ids.student, classId: ids.class });
  step('POST /enrollments 201', enr.status === 201 && enr.body?.enrollment?.status === 'pending_payment', `status=${enr.status} invoice=${enr.body?.invoice === null}`);
  ids.enrollment = enr.body?.enrollment?.id;
  const enrDup = await call(ADMIN_TOKEN, '/enrollments', 'POST', { studentId: ids.student, classId: ids.class });
  step('POST enrollment trùng → 409', enrDup.status === 409, `status=${enrDup.status} msg=${enrDup.body?.message ?? ''}`);
  // capacity: class capacity=2, enroll 2 student khác → 3rd phải 409
  const st2 = await call(ADMIN_TOKEN, '/students', 'POST', { studentCode: `SVB${TS}`, fullName: 'Học viên B', branchId: hn1.id });
  const st3 = await call(ADMIN_TOKEN, '/students', 'POST', { studentCode: `SVC${TS}`, fullName: 'Học viên C', branchId: hn1.id });
  await call(ADMIN_TOKEN, '/enrollments', 'POST', { studentId: st2.body?.id, classId: ids.class });
  const enrFull = await call(ADMIN_TOKEN, '/enrollments', 'POST', { studentId: st3.body?.id, classId: ids.class });
  step('lớp đầy (2/2) → 409', enrFull.status === 409, `status=${enrFull.status} msg=${enrFull.body?.message ?? ''}`);
  const clsAfter = await call(ADMIN_TOKEN, `/classes/${ids.class}`);
  step('enrolled_count = 2 (trigger sync)', clsAfter.body?.enrolledCount === 2, `enrolled=${clsAfter.body?.enrolledCount}`);
  // đổi status → dropped → enrolled_count giảm
  const drop = await call(ADMIN_TOKEN, `/enrollments/${enr.body?.enrollment?.id}`, 'PUT', { status: 'dropped' });
  const clsAfterDrop = await call(ADMIN_TOKEN, `/classes/${ids.class}`);
  step('drop 1 enrollment → enrolled_count = 1', drop.status === 200 && clsAfterDrop.body?.enrolledCount === 1, `status=${drop.status} enrolled=${clsAfterDrop.body?.enrolledCount}`);
  // enrollments của student
  const enrs = await call(ADMIN_TOKEN, `/students/${ids.student}/enrollments`);
  step('GET /students/:id/enrollments có 1 (class info)', enrs.status === 200 && enrs.body?.length === 1 && enrs.body?.[0]?.class?.code === `CL${TS}`, `count=${enrs.body?.length}`);
  const enrGet = await call(ADMIN_TOKEN, `/enrollments/${enr.body?.enrollment?.id}`);
  step('GET /enrollments/:id 200', enrGet.status === 200, `status=${enrGet.status}`);

  // ---- Scope: branch_manager ----
  const bm = await call(ADMIN_TOKEN, '/users', 'POST', { email: `e2e.sbm${TS}@edu.vn`, password: 'matkhau123', fullName: 'Stu BM', roleCodes: ['branch_manager'] });
  await call(ADMIN_TOKEN, `/users/${bm.body?.id}/scope-grants`, 'POST', { branchId: hn1.id });
  const bmLogin = await login(`e2e.sbm${TS}@edu.vn`, 'matkhau123');
  BM_TOKEN = bmLogin.token;
  const bmEnrollHcm = await call(ADMIN_TOKEN, '/classes', 'POST', { branchId: hcm1.id, programId: ids.prog, courseId: ids.course, code: `CLH${TS}`, name: 'Lớp HCM' });
  ids.classHcm = bmEnrollHcm.body?.id;
  const stHcm = await call(ADMIN_TOKEN, '/students', 'POST', { studentCode: `SVD${TS}`, fullName: 'Học viên HCM', branchId: hcm1.id });
  const bmEnroll = await call(BM_TOKEN, '/enrollments', 'POST', { studentId: stHcm.body?.id, classId: ids.classHcm });
  step('BM ghi danh vào lớp HCM1 → 403 (scope)', bmEnroll.status === 403, `status=${bmEnroll.status}`);
  // sau khi drop (1/2 chỗ) BM ghi danh stHcm vào lớp HN1 → 201 (có enrollment:create sau migration 0007)
  const bmEnrollOk = await call(BM_TOKEN, '/enrollments', 'POST', { studentId: stHcm.body?.id, classId: ids.class });
  step('BM ghi danh vào lớp HN1 → 201 (guard + scope pass)', bmEnrollOk.status === 201, `status=${bmEnrollOk.status}`);
  // giờ 2/2 → học viên khác vào → 409 full
  const st4 = await call(ADMIN_TOKEN, '/students', 'POST', { studentCode: `SVE${TS}`, fullName: 'Học viên D', branchId: hn1.id });
  const enrFull2 = await call(ADMIN_TOKEN, '/enrollments', 'POST', { studentId: st4.body?.id, classId: ids.class });
  step('lớp đầy lại (2/2) → 409', enrFull2.status === 409, `status=${enrFull2.status}`);

  // ---- student role: có user:read (đọc students 200 — contract B) nhưng KHÔNG có enrollment:create ----
  await call(ADMIN_TOKEN, '/users', 'POST', { email: `e2e.sst${TS}@edu.vn`, password: 'matkhau123', fullName: 'Student E2E', roleCodes: ['student'] });
  const stRole = await login(`e2e.sst${TS}@edu.vn`, 'matkhau123');
  const stListBlocked = await call(stRole.token, '/students');
  step('student GET /students → 200 (user:read theo contract B)', stListBlocked.status === 200, `status=${stListBlocked.status}`);
  const stEnrollBlocked = await call(stRole.token, '/enrollments', 'POST', { studentId: ids.student, classId: ids.class });
  step('student POST /enrollments → 403 (không enrollment:create)', stEnrollBlocked.status === 403, `status=${stEnrollBlocked.status}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
}
console.log(`TS=${TS} ids=${JSON.stringify(ids)}`);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
