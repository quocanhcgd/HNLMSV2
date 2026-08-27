// Verify Academic API (T040 + T039 conflict) — ma trận CRUD + scope + chống trùng lịch
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

let ids = { dept: null, prog: null, course: null, roomHn: null, classHn: null, classHcm: null };
let ADMIN_TOKEN, BM_TOKEN;

try {
  const admin = await login('admin@educenter.vn', 'admin123');
  ADMIN_TOKEN = admin.token;
  step('admin login', admin.status === 200, `status=${admin.status}`);

  // ---- Departments ----
  const dept = await call(ADMIN_TOKEN, '/departments', 'POST', { code: 'EN', name: 'Tiếng Anh' });
  step('POST /departments 201', dept.status === 201, `status=${dept.status} code=${dept.body?.code}`);
  ids.dept = dept.body?.id;
  const deptDup = await call(ADMIN_TOKEN, '/departments', 'POST', { code: 'EN', name: 'Trùng' });
  step('POST department trùng code → 409', deptDup.status === 409, `status=${deptDup.status}`);
  const depts = await call(ADMIN_TOKEN, '/departments');
  step('GET /departments có EN', depts.status === 200 && (depts.body ?? []).some((d) => d.code === 'EN'), `count=${(depts.body ?? []).length}`);

  // ---- Programs ----
  const prog = await call(ADMIN_TOKEN, '/programs', 'POST', { departmentId: ids.dept, code: 'EN-MASTER', name: 'Tiếng Anh Master', durationMonths: 12 });
  step('POST /programs 201', prog.status === 201, `status=${prog.status}`);
  ids.prog = prog.body?.id;
  const progs = await call(ADMIN_TOKEN, `/programs?department_id=${ids.dept}`);
  step('GET /programs lọc department', (progs.body ?? []).some((p) => p.id === ids.prog), `count=${(progs.body ?? []).length}`);

  // ---- Courses ----
  const course = await call(ADMIN_TOKEN, '/courses', 'POST', { programId: ids.prog, code: 'EN-M1', name: 'Ngữ pháp cơ bản', orderIndex: 1 });
  step('POST /courses 201', course.status === 201, `status=${course.status}`);
  ids.course = course.body?.id;

  // ---- Rooms ----
  const branches = await call(ADMIN_TOKEN, '/organization/branches?page_size=100');
  const hn1 = branches.body.data.find((b) => b.code === 'HN1');
  const hcm1 = branches.body.data.find((b) => b.code === 'HCM1');
  const room = await call(ADMIN_TOKEN, '/rooms', 'POST', { branchId: hn1.id, code: 'P101', name: 'Phòng 101', capacity: 30 });
  step('POST /rooms 201', room.status === 201, `status=${room.status}`);
  ids.roomHn = room.body?.id;

  // ---- Classes ----
  const clsHn = await call(ADMIN_TOKEN, '/classes', 'POST', {
    branchId: hn1.id, programId: ids.prog, courseId: ids.course, code: 'EN-M1-01', name: 'Lớp M1 Ca 1', modality: 'offline', capacity: 20,
  });
  step('POST /classes 201', clsHn.status === 201, `status=${clsHn.status} code=${clsHn.body?.code}`);
  ids.classHn = clsHn.body?.id;
  const clsDup = await call(ADMIN_TOKEN, '/classes', 'POST', {
    branchId: hn1.id, programId: ids.prog, courseId: ids.course, code: 'EN-M1-01', name: 'Trùng',
  });
  step('POST class trùng code trong branch → 409', clsDup.status === 409, `status=${clsDup.status}`);
  const clsHcm = await call(ADMIN_TOKEN, '/classes', 'POST', {
    branchId: hcm1.id, programId: ids.prog, courseId: ids.course, code: 'EN-M1-HCM', name: 'Lớp M1 Sài Gòn',
  });
  ids.classHcm = clsHcm.body?.id;
  step('POST class HCM1 201 (admin)', clsHcm.status === 201, `status=${clsHcm.status}`);

  // ---- Schedules + conflict (T039) ----
  const sched = await call(ADMIN_TOKEN, `/classes/${ids.classHn}/schedules`, 'POST', {
    dayOfWeek: 2, startTime: '18:00', endTime: '19:30', teacherId: admin.user.id, roomId: ids.roomHn, validFrom: '2026-09-01',
  });
  step('POST schedule 201', sched.status === 201, `status=${sched.status}`);
  // trùng giảng viên cùng giờ (class khác) → 409
  const sConfTeacher = await call(ADMIN_TOKEN, `/classes/${ids.classHcm}/schedules`, 'POST', {
    dayOfWeek: 2, startTime: '18:30', endTime: '20:00', teacherId: admin.user.id, validFrom: '2026-09-01',
  });
  step('schedule trùng GV (18:30 chạm 18:00-19:30) → 409', sConfTeacher.status === 409, `status=${sConfTeacher.status} msg=${sConfTeacher.body?.message ?? ''}`);
  // trùng phòng (GV khác) → 409
  const teacher2 = await (await fetch(`${BASE}/users`, {
    method: 'POST', headers: { authorization: `Bearer ${ADMIN_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ email: `e2e.tch${TS}@edu.vn`, password: 'matkhau123', fullName: 'Teacher 2', roleCodes: ['teacher'] }),
  })).json();
  const sConfRoom = await call(ADMIN_TOKEN, `/classes/${ids.classHn}/schedules`, 'POST', {
    dayOfWeek: 2, startTime: '19:00', endTime: '20:30', teacherId: teacher2.id, roomId: ids.roomHn, validFrom: '2026-09-01',
  });
  step('schedule trùng phòng (19:00 chạm 18:00-19:30) → 409', sConfRoom.status === 409, `status=${sConfRoom.status}`);
  // khác giờ khác ngày → 201
  const sOk = await call(ADMIN_TOKEN, `/classes/${ids.classHcm}/schedules`, 'POST', {
    dayOfWeek: 3, startTime: '18:00', endTime: '19:30', teacherId: teacher2.id, validFrom: '2026-09-01',
  });
  step('schedule khác giờ/khác ngày → 201', sOk.status === 201, `status=${sOk.status}`);
  const scheds = await call(ADMIN_TOKEN, `/classes/${ids.classHn}/schedules`);
  step('GET schedules class HN1 có 1', (scheds.body ?? []).length === 1, `count=${(scheds.body ?? []).length}`);
  const schedsHcm = await call(ADMIN_TOKEN, `/classes/${ids.classHcm}/schedules`);
  step('GET schedules class HCM1 có 1', (schedsHcm.body ?? []).length === 1, `count=${(schedsHcm.body ?? []).length}`);

  // ---- Branch scope (branch_manager) ----
  const bmUser = await call(ADMIN_TOKEN, '/users', 'POST', {
    email: `e2e.abm${TS}@edu.vn`, password: 'matkhau123', fullName: 'Acad BM', roleCodes: ['branch_manager'],
  });
  await call(ADMIN_TOKEN, `/users/${bmUser.body?.id}/scope-grants`, 'POST', { branchId: hn1.id });
  const bm = await login(`e2e.abm${TS}@edu.vn`, 'matkhau123');
  BM_TOKEN = bm.token;
  const bmClasses = await call(BM_TOKEN, '/classes');
  const bmClassCodes = (bmClasses.body ?? []).map((c) => c.code);
  step('BM GET /classes → chỉ lớp HN1', bmClasses.status === 200 && bmClassCodes.length === 1 && bmClassCodes[0] === 'EN-M1-01', `codes=${bmClassCodes.join(',')}`);
  const bmHcmClass = await call(BM_TOKEN, `/classes/${ids.classHcm}`);
  step('BM GET class HCM1 → 403', bmHcmClass.status === 403, `status=${bmHcmClass.status}`);
  const bmCreateHcm = await call(BM_TOKEN, '/classes', 'POST', {
    branchId: hcm1.id, programId: ids.prog, courseId: ids.course, code: 'X1', name: 'X1',
  });
  step('BM POST class branch HCM1 → 403', bmCreateHcm.status === 403, `status=${bmCreateHcm.status}`);
  const bmProgs = await call(BM_TOKEN, '/programs');
  step('BM GET /programs 200 (program:read)', bmProgs.status === 200, `status=${bmProgs.status}`);

  // ---- student bị chặn ----
  await call(ADMIN_TOKEN, '/users', 'POST', {
    email: `e2e.stu${TS}@edu.vn`, password: 'matkhau123', fullName: 'Student E2E', roleCodes: ['student'],
  });
  const st = await login(`e2e.stu${TS}@edu.vn`, 'matkhau123');
  const stClasses = await call(st.token, '/classes');
  step('student GET /classes → 403 (không class:read)', stClasses.status === 403, `status=${stClasses.status}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 400));
}
console.log(`TS=${TS} ids=${JSON.stringify(ids)}`);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
