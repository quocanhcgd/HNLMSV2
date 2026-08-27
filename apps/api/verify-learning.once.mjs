// Verify Learning Content API (T049-T051): upload/list/download auth + scope + perms
const BASE = 'http://localhost:4001/api';
const results = [];
const step = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ' | ' + extra : ''}`);
  console.log(results[results.length - 1]);
};
const TS = String(Date.now()).slice(-6);
const { Blob } = globalThis;

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
const upload = async (token, fileBuffer, filename, fields) => {
  const fd = new FormData();
  fd.append('file', new Blob([fileBuffer], { type: 'text/plain' }), filename);
  for (const [k, v] of Object.entries(fields ?? {})) {
    if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
    else fd.append(k, String(v));
  }
  const r = await fetch(`${BASE}/learning/content`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: fd,
  });
  const text = await r.text();
  let j = null;
  try { j = JSON.parse(text); } catch { j = text; }
  if (r.status >= 400) console.log(`  [upload ${filename}] ${r.status}: ${text.slice(0, 200)}`);
  return { status: r.status, body: j };
};

let ADMIN, TEACHER, STUDENT, ids = {};
try {
  const admin = await login('admin@educenter.vn', 'admin123');
  ADMIN = admin.token;
  step('admin login', admin.status === 200);

  // fixture academic: dept/program/course/class (2 lớp) + student + enrollment + teacher user
  const dept = await call(ADMIN, '/departments', 'POST', { code: 'EN', name: 'Tiếng Anh' });
  const prog = await call(ADMIN, '/programs', 'POST', { departmentId: dept.body?.id, code: 'EN-MASTER', name: 'Master' });
  const course = await call(ADMIN, '/courses', 'POST', { programId: prog.body?.id, code: 'EN-M1', name: 'Cơ bản' });
  const branches = await call(ADMIN, '/organization/branches?page_size=100');
  const hn1 = branches.body.data.find((b) => b.code === 'HN1');
  const cls = await call(ADMIN, '/classes', 'POST', { branchId: hn1.id, programId: prog.body?.id, courseId: course.body?.id, code: `LC${TS}`, name: 'Lớp học liệu', capacity: 10 });
  ids.class = cls.body?.id;
  const st = await call(ADMIN, '/students', 'POST', { studentCode: `LVS${TS}`, fullName: 'HV học liệu', branchId: hn1.id });
  ids.student = st.body?.id;
  await call(ADMIN, '/enrollments', 'POST', { studentId: st.body?.id, classId: cls.body?.id });

  // tạo user teacher + student (account)
  const tch = await call(ADMIN, '/users', 'POST', { email: `e2e.ltch${TS}@edu.vn`, password: 'matkhau123', fullName: 'GV học liệu', roleCodes: ['teacher'] });
  ids.teacher = tch.body?.id;
  const stu = await call(ADMIN, '/users', 'POST', { email: `e2e.lstu${TS}@edu.vn`, password: 'matkhau123', fullName: 'HV account', roleCodes: ['student'] });
  // gán account student cho student profile + class_teacher
  const { Client } = await import('pg');
  const pg = new Client({ connectionString: 'postgresql://lms:lms_dev@127.0.0.1:5432/educ_lms' });
  await pg.connect();
  await pg.query('UPDATE students SET user_id = $1 WHERE id = $2', [stu.body?.id, st.body?.id]);
  await pg.query('INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [cls.body?.id, tch.body?.id]);
  await pg.end();

  const teacher = await login(`e2e.ltch${TS}@edu.vn`, 'matkhau123');
  TEACHER = teacher.token;
  const student = await login(`e2e.lstu${TS}@edu.vn`, 'matkhau123');
  STUDENT = student.token;

  // ---- upload: public (admin) ----
  const up1 = await upload(ADMIN, Buffer.from('Bài giảng tiếng Anh public'), 'public-lesson.txt', {
    title: `Học liệu public ${TS}`, access_scope: 'public', content_type: 'document',
  });
  step('POST upload (admin, public)', up1.status === 201 && up1.body?.id, `status=${up1.status} type=${up1.body?.contentType}`);
  ids.pub = up1.body?.id;

  // ---- upload: class scope + class_ids (teacher) ----
  const up2 = await upload(TEACHER, Buffer.from('Tài liệu nội bộ lớp'), 'class-material.txt', {
    title: `Học liệu lớp ${TS}`, access_scope: 'class', class_ids: [cls.body?.id],
  });
  step('POST upload (teacher, class scope)', up2.status === 201, `status=${up2.status}`);
  ids.clsC = up2.body?.id;

  // ---- upload: private (teacher) ----
  const up3 = await upload(TEACHER, Buffer.from('Ghi chú riêng'), 'private-notes.txt', {
    title: `Học liệu private ${TS}`, access_scope: 'private',
  });
  step('POST upload (teacher, private)', up3.status === 201, `status=${up3.status}`);
  ids.priv = up3.body?.id;

  // ---- list ----
  const list = await call(ADMIN, '/learning/content?page=1&page_size=10');
  step('GET list: 3 học liệu', list.status === 200 && list.body?.meta?.total === 3, `total=${list.body?.meta?.total}`);
  const listClass = await call(ADMIN, `/learning/content?class_id=${cls.body?.id}`);
  step('GET list lọc class_id: 1', listClass.status === 200 && listClass.body?.meta?.total === 1, `total=${listClass.body?.meta?.total}`);
  const listScope = await call(ADMIN, '/learning/content?access_scope=public');
  step('GET list lọc access_scope=public: 1', listScope.body?.meta?.total === 1, `total=${listScope.body?.meta?.total}`);

  // ---- download auth (T051) ----
  const dPublic = await call(ADMIN, `/learning/content/${ids.pub}/download`);
  step('admin tải public → 200', dPublic.status === 200 && dPublic.body.includes('public'), `status=${dPublic.status}`);
  const dTeacherClass = await call(TEACHER, `/learning/content/${ids.clsC}/download`);
  step('teacher (dạy lớp) tải class → 200', dTeacherClass.status === 200, `status=${dTeacherClass.status}`);
  const dStudentClass = await call(STUDENT, `/learning/content/${ids.clsC}/download`);
  step('student (đang ghi danh) tải class → 200', dStudentClass.status === 200, `status=${dStudentClass.status}`);
  const dStranger = await call(STUDENT, `/learning/content/${ids.priv}/download`);
  step('student tải private của GV → 403', dStranger.status === 403, `status=${dStranger.status}`);
  const dOwner = await call(TEACHER, `/learning/content/${ids.priv}/download`);
  step('chủ sở hữu tải private → 200', dOwner.status === 200, `status=${dOwner.status}`);
  const dPrivateByAdmin = await call(ADMIN, `/learning/content/${ids.priv}/download`);
  step('admin tải private → 200 (*)', dPrivateByAdmin.status === 200, `status=${dPrivateByAdmin.status}`);

  // ---- update (T052) ----
  const upd = await call(ADMIN, `/learning/content/${ids.pub}`, 'PUT', { title: `Học liệu public ${TS} (sửa)`, access_scope: 'class', class_ids: [cls.body?.id] });
  step('PUT sửa title/scope/class', upd.status === 200 && upd.body?.accessScope === 'class' && upd.body?.classLinks?.length === 1, `status=${upd.status}`);

  // ---- perms: student không upload; branch_manager không upload ----
  const stUpload = await upload(STUDENT, Buffer.from('x'), 'x.txt', { title: 'spam' });
  step('student upload → 403 (thiếu content:manage)', stUpload.status === 403, `status=${stUpload.status}`);

  // ---- file thật trên đĩa ----
  const { existsSync } = await import('fs');
  const { join } = await import('path');
  const root = process.env.LMS_UPLOAD_DIR ?? join(process.cwd(), 'uploads');
  step('file tồn tại trên disk', existsSync(join(root, 'learning', ids.pub, 'v1', 'public-lesson.txt')), `root=${root}`);

  // ---- class scope: học viên CHƯA ghi danh không tải được ----
  const st2 = await call(ADMIN, '/students', 'POST', { studentCode: `LVS2${TS}`, fullName: 'HV chưa ghi danh', branchId: hn1.id });
  const stu2 = await call(ADMIN, '/users', 'POST', { email: `e2e.lst2${TS}@edu.vn`, password: 'matkhau123', fullName: 'HV2 account', roleCodes: ['student'] });
  const pg2 = new (await import('pg')).Client({ connectionString: 'postgresql://lms:lms_dev@127.0.0.1:5432/educ_lms' });
  await pg2.connect();
  await pg2.query('UPDATE students SET user_id = $1 WHERE id = $2', [stu2.body?.id, st2.body?.id]);
  await pg2.end();
  const student2 = await login(`e2e.lst2${TS}@edu.vn`, 'matkhau123');
  const dNotEnrolled = await call(student2.token, `/learning/content/${ids.clsC}/download`);
  step('student chưa ghi danh tải class → 403', dNotEnrolled.status === 403, `status=${dNotEnrolled.status}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
}
console.log(`TS=${TS} ids=${JSON.stringify(ids)}`);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
