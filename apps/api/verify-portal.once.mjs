// Verify Student Portal (T053-T055): /students/me, /students/me/classes/:id, /learning/library, PATCH progress
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
  return { status: r.status, body: j };
};

let ADMIN, STUDENT, ids = {};
try {
  const admin = await login('admin@educenter.vn', 'admin123');
  ADMIN = admin.token;
  step('admin login', admin.status === 200);

  // fixture: dept/program/course/class + student + enrollment + teacher + content class-scoped + content public
  const dept = await call(ADMIN, '/departments', 'POST', { code: 'EN', name: 'Tiếng Anh' });
  const prog = await call(ADMIN, '/programs', 'POST', { departmentId: dept.body?.id, code: 'EN-MASTER', name: 'Master' });
  const course = await call(ADMIN, '/courses', 'POST', { programId: prog.body?.id, code: 'EN-M1', name: 'Cơ bản' });
  const branches = await call(ADMIN, '/organization/branches?page_size=100');
  const hn1 = branches.body.data.find((b) => b.code === 'HN1');
  const cls = await call(ADMIN, '/classes', 'POST', { branchId: hn1.id, programId: prog.body?.id, courseId: course.body?.id, code: `PT${TS}`, name: 'Lớp portal', capacity: 10 });
  ids.class = cls.body?.id;
  // lịch + phòng
  const room = await call(ADMIN, '/rooms', 'POST', { branchId: hn1.id, code: `R${TS}`, name: 'Phòng portal', capacity: 20 });
  ids.room = room.body?.id;
  const teacherUser = await call(ADMIN, '/users', 'POST', { email: `e2e.ptt${TS}@edu.vn`, password: 'matkhau123', fullName: 'GV portal', roleCodes: ['teacher'] });
  ids.teacher = teacherUser.body?.id;
  await call(ADMIN, `/classes/${cls.body?.id}/teachers`, 'PUT', { teacherIds: [teacherUser.body?.id] }).catch(() => undefined);
  await call(ADMIN, '/classes/' + cls.body?.id + '/schedules', 'POST', {
    dayOfWeek: 2, startTime: '18:00', endTime: '19:30', roomId: room.body?.id, teacherId: teacherUser.body?.id, validFrom: '2026-09-01',
  }).catch(() => undefined);
  // student profile + account + enrollment
  const st = await call(ADMIN, '/students', 'POST', { studentCode: `PTS${TS}`, fullName: 'HV portal', branchId: hn1.id });
  ids.student = st.body?.id;
  const stuUser = await call(ADMIN, '/users', 'POST', { email: `e2e.ps${TS}@edu.vn`, password: 'matkhau123', fullName: 'HV portal account', roleCodes: ['student'] });
  ids.stuUser = stuUser.body?.id;
  const { Client } = await import('pg');
  const pg = new Client({ connectionString: 'postgresql://lms:lms_dev@127.0.0.1:5432/educ_lms' });
  await pg.connect();
  await pg.query('UPDATE students SET user_id = $1 WHERE id = $2', [stuUser.body?.id, st.body?.id]);
  await pg.query('INSERT INTO class_teachers (class_id, teacher_id, role) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [cls.body?.id, teacherUser.body?.id, 'primary']);
  await pg.end();
  await call(ADMIN, '/enrollments', 'POST', { studentId: st.body?.id, classId: cls.body?.id });
  // học liệu class + public
  const mat = await upload(ADMIN, Buffer.from('Tài liệu lớp portal'), 'portal-mat.txt', { title: `Học liệu lớp ${TS}`, access_scope: 'class', class_ids: [cls.body?.id] });
  ids.mat = mat.body?.id;
  const pub = await upload(ADMIN, Buffer.from('Tài liệu công khai'), 'portal-pub.txt', { title: `Học liệu public ${TS}`, access_scope: 'public' });
  ids.pub = pub.body?.id;

  const student = await login(`e2e.ps${TS}@edu.vn`, 'matkhau123');
  STUDENT = student.token;
  step('student login', student.status === 200);

  // ---- T053 /students/me ----
  const me = await call(STUDENT, '/students/me');
  step('GET /students/me: student + 1 enrollment', me.status === 200 && me.body?.student?.studentCode === `PTS${TS}` && me.body?.enrollments?.length === 1, `status=${me.status}`);
  step('enrollment có class + program/course', me.body?.enrollments?.[0]?.class?.program?.code === 'EN-MASTER', `prog=${me.body?.enrollments?.[0]?.class?.program?.code}`);

  // ---- T054 /students/me/classes/:id ----
  const det = await call(STUDENT, `/students/me/classes/${cls.body?.id}`);
  step('GET chi tiết lớp: class + teachers + schedules + materials',
    det.status === 200 && det.body?.class?.code === `PT${TS}` && det.body?.teachers?.length === 1 && det.body?.schedules?.length >= 1 && det.body?.materials?.length === 1,
    `status=${det.status} teachers=${det.body?.teachers?.length} sched=${det.body?.schedules?.length} mats=${det.body?.materials?.length}`);
  step('schedule có teacherName + roomName', det.body?.schedules?.[0]?.teacherName?.includes('GV portal') && det.body?.schedules?.[0]?.roomName === 'Phòng portal', `t=${det.body?.schedules?.[0]?.teacherName} r=${det.body?.schedules?.[0]?.roomName}`);

  // ---- PATCH progress ----
  const progUpd = await call(STUDENT, `/learning/content/${mat.body?.id}/progress`, 'PATCH', { progress_percent: 50 });
  step('PATCH progress 50%', progUpd.status === 200 && Number(progUpd.body?.progressPercent) === 50, `status=${progUpd.status}`);
  const progUpd2 = await call(STUDENT, `/learning/content/${mat.body?.id}/progress`, 'PATCH', { is_completed: true });
  step('PATCH is_completed → true (percent giữ 50)', progUpd2.status === 200 && progUpd2.body?.isCompleted === true && Number(progUpd2.body?.progressPercent) === 50, `st=${progUpd2.status} done=${progUpd2.body?.isCompleted}`);
  const det2 = await call(STUDENT, `/students/me/classes/${cls.body?.id}`);
  step('chi tiết lớp: material có myProgress=100%', det2.body?.materials?.[0]?.myProgress?.isCompleted === true, `p=${det2.body?.materials?.[0]?.myProgress?.isCompleted}`);

  // ---- T055 /learning/library ----
  const lib = await call(STUDENT, '/learning/library?q=' + encodeURIComponent('Học liệu lớp'));
  step('library tìm "Học liệu lớp": 1 (class của tôi)', lib.status === 200 && lib.body?.meta?.total === 1, `total=${lib.body?.meta?.total}`);
  const libAll = await call(STUDENT, '/learning/library?page_size=50');
  step('library: public + class của tôi (≥2)', libAll.body?.meta?.total >= 2, `total=${libAll.body?.meta?.total}`);
  // học viên CHƯA ghi danh → chỉ thấy public
  const st2 = await call(ADMIN, '/students', 'POST', { studentCode: `PTS2${TS}`, fullName: 'HV khác', branchId: hn1.id });
  const stu2 = await call(ADMIN, '/users', 'POST', { email: `e2e.ps2${TS}@edu.vn`, password: 'matkhau123', fullName: 'HV2 account', roleCodes: ['student'] });
  const pg2 = new (await import('pg')).Client({ connectionString: 'postgresql://lms:lms_dev@127.0.0.1:5432/educ_lms' });
  await pg2.connect();
  await pg2.query('UPDATE students SET user_id = $1 WHERE id = $2', [stu2.body?.id, st2.body?.id]);
  await pg2.end();
  const student2 = await login(`e2e.ps2${TS}@edu.vn`, 'matkhau123');
  const libStranger = await call(student2.token, `/learning/library?q=${encodeURIComponent('Học liệu lớp')}`);
  step('library: HV chưa ghi danh KHÔNG thấy class content', libStranger.body?.meta?.total === 0, `total=${libStranger.body?.meta?.total}`);
  const det403 = await call(student2.token, `/students/me/classes/${cls.body?.id}`);
  step('HV chưa ghi danh xem chi tiết lớp → 403', det403.status === 403, `status=${det403.status}`);
} catch (e) {
  step('EXCEPTION', false, String(e).slice(0, 300));
}
console.log(`TS=${TS} ids=${JSON.stringify(ids)}`);
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`\n===== ${results.length - failed.length}/${results.length} PASS =====`);
process.exit(failed.length ? 1 : 0);
