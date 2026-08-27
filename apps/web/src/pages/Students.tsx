import { useCallback, useEffect, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import { listBranches, type Branch } from '../services/org';
import { listClasses, type SchoolClass } from '../services/academic';
import {
  createEnrollment,
  createStudent,
  getStudent,
  listEnrollmentsByStudent,
  listStudents,
  updateStudent,
  type Enrollment,
  type Student,
} from '../services/students';

/**
 * T047/T048 — Học viên & Ghi danh (route /students = nav mockup 02 nav_enroll).
 * Mockup 02 KHÔNG có screen students → thiết kế theo design system mockup 02/03 + contract
 * api-spec §Students & Enrollment. Danh sách + thêm/sửa học viên + chi tiết (ghi danh + enroll modal).
 */

const apiErr = (e: unknown, fallback: string): string => {
  const ax = e as { response?: { data?: { message?: string | string[] } } };
  const m = ax.response?.data?.message;
  if (Array.isArray(m)) return m.join(', ');
  return m ?? fallback;
};

const studentStatusBadge = (status: string, t: (k: string) => string) => {
  if (status === 'active') return <span className="badge badge-success">{t('st_student_active')}</span>;
  if (status === 'graduated') return <span className="badge badge-warning">{t('st_student_graduated')}</span>;
  if (status === 'dropped') return <span className="badge badge-danger">{t('st_student_dropped')}</span>;
  return <span className="badge">{t('st_student_inactive')}</span>;
};

const enrStatusBadge = (status: string, t: (k: string) => string) => {
  const map: Record<string, string> = {
    pending_payment: 'st_enr_pending',
    active: 'st_enr_active',
    completed: 'st_enr_completed',
    dropped: 'st_enr_dropped',
    suspended: 'st_enr_suspended',
    waitlist: 'st_enr_waitlist',
  };
  const cls = status === 'active' || status === 'completed' ? 'badge-success' : status === 'dropped' || status === 'suspended' ? 'badge-danger' : 'badge-warning';
  return <span className={`badge ${cls}`}>{t(map[status] ?? 'st_enr_pending')}</span>;
};

export function StudentsPage() {
  const { t, toast } = useShell();
  // list
  const [rows, setRows] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  // modal add/edit
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [fCode, setFCode] = useState('');
  const [fName, setFName] = useState('');
  const [fDob, setFDob] = useState('');
  const [fGender, setFGender] = useState('male');
  const [fPhone, setFPhone] = useState('');
  const [fGuardian, setFGuardian] = useState('');
  const [fIdentity, setFIdentity] = useState('');
  const [fBranch, setFBranch] = useState('');
  const [fStatus, setFStatus] = useState('active');
  const [fNotes, setFNotes] = useState('');
  const [busy, setBusy] = useState(false);
  // detail
  const [detail, setDetail] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollClass, setEnrollClass] = useState('');

  const PAGE_SIZE = 20;

  const load = useCallback(() => {
    void listStudents({ page, pageSize: PAGE_SIZE, q: q || undefined, branchId: branchFilter || undefined })
      .then((r) => {
        setRows(r.data);
        setTotal(r.meta.total);
      })
      .catch(() => toast(t('toast_failed')));
    void listBranches(1, 100).then((r) => setBranches(r.data)).catch(() => undefined);
  }, [page, q, branchFilter, toast, t]);
  useEffect(load, [load]);

  const openAdd = () => {
    setEditing(null);
    setFCode(''); setFName(''); setFDob(''); setFGender('male'); setFPhone(''); setFGuardian(''); setFIdentity(''); setFNotes('');
    setFBranch(branchFilter || branches[0]?.id || '');
    setModal(true);
  };
  const openEdit = (s: Student) => {
    setEditing(s);
    setFCode(s.studentCode); setFName(s.fullName); setFDob(s.dateOfBirth ?? ''); setFGender(s.gender ?? 'male');
    setFPhone(s.phone ?? ''); setFGuardian(s.guardianPhone ?? ''); setFIdentity(s.identityRef ?? ''); setFStatus(s.status); setFNotes(s.notes ?? '');
    setModal(true);
  };
  const submit = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateStudent(editing.id, {
          fullName: fName,
          dateOfBirth: fDob || undefined,
          gender: fGender,
          phone: fPhone || undefined,
          guardianPhone: fGuardian || undefined,
          identityRef: fIdentity || undefined,
          status: fStatus,
          notes: fNotes || undefined,
        });
        toast(t('toast_student_updated'));
      } else {
        await createStudent({
          studentCode: fCode,
          fullName: fName,
          dateOfBirth: fDob || undefined,
          gender: fGender,
          phone: fPhone || undefined,
          guardianPhone: fGuardian || undefined,
          identityRef: fIdentity || undefined,
          branchId: fBranch || undefined,
          notes: fNotes || undefined,
        });
        toast(t('toast_student_created'));
      }
      setModal(false);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    } finally {
      setBusy(false);
    }
  };

  const openDetail = async (s: Student) => {
    try {
      const full = await getStudent(s.id);
      setDetail(full);
      setEnrollments(await listEnrollmentsByStudent(s.id));
      const all = await listClasses({});
      setClasses(all);
      setEnrollClass(all.find((c) => c.enrolledCount < c.capacity)?.id ?? '');
    } catch {
      toast(t('toast_failed'));
    }
  };

  const doEnroll = async () => {
    if (!detail || !enrollClass) return;
    try {
      await createEnrollment({ studentId: detail.id, classId: enrollClass });
      toast(t('toast_enrolled'));
      setEnrollModal(false);
      setEnrollments(await listEnrollmentsByStudent(detail.id));
      const all = await listClasses({});
      setClasses(all);
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-5">
        <input className="input-field !w-72" placeholder={t('ph_search_student')} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <select className="input-field !w-52" value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value); setPage(1); }}>
          <option value="">{t('all_branches')}</option>
          {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <span className="flex-1"></span>
        <button className="btn-primary" onClick={openAdd}>+ {t('btn_add_student')}</button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-soft py-4">{t('no_students')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="studentsTable">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_code')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_full_name')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_gender')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_phone')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_guardian_phone')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_status')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3"><span className="badge badge-primary">{s.studentCode}</span></td>
                  <td className="py-3 px-3"><b>{s.fullName}</b>{s.dateOfBirth && <span className="text-xs text-faint block">{s.dateOfBirth}</span>}</td>
                  <td className="py-3 px-3">{t(`gen_${s.gender ?? 'other'}`)}</td>
                  <td className="py-3 px-3">{s.phone || '—'}</td>
                  <td className="py-3 px-3">{s.guardianPhone || '—'}</td>
                  <td className="py-3 px-3">{studentStatusBadge(s.status, t)}</td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => void openDetail(s)}>{t('btn_details')}</button>
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => openEdit(s)}>{t('btn_edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 text-sm text-soft">
            <span>{t('total_students').replace('{n}', String(total))}</span>
            <div className="flex items-center space-x-3">
              <button className="btn-outline text-xs px-3 py-1" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
              <span>{t('page_label').replace('{page}', String(page)).replace('{total}', String(totalPages))}</span>
              <button className="btn-outline text-xs px-3 py-1" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Thêm / Sửa học viên ===== */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-2xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editing ? t('modal_edit_student') : t('modal_add_student')}</h3>
              <button className="text-xl text-faint" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_student_code')}</label>
                <input className="input-field" value={fCode} onChange={(e) => setFCode(e.target.value)} disabled={!!editing} placeholder="SV2026-001" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_full_name')}</label>
                <input className="input-field" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_date_of_birth')}</label>
                <input type="date" className="input-field" value={fDob} onChange={(e) => setFDob(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_gender')}</label>
                <select className="input-field" value={fGender} onChange={(e) => setFGender(e.target.value)}>
                  <option value="male">{t('gen_male')}</option>
                  <option value="female">{t('gen_female')}</option>
                  <option value="other">{t('gen_other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_phone')}</label>
                <input className="input-field" value={fPhone} onChange={(e) => setFPhone(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_guardian_phone')}</label>
                <input className="input-field" value={fGuardian} onChange={(e) => setFGuardian(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">{t('f_identity_ref')}</label>
                <input className="input-field" value={fIdentity} onChange={(e) => setFIdentity(e.target.value)} placeholder="001202012345" />
              </div>
              {!editing && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">{t('f_branch')}</label>
                  <select className="input-field" value={fBranch} onChange={(e) => setFBranch(e.target.value)}>
                    <option value="">{t('opt_none')}</option>
                    {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
              {editing && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">{t('f_status')}</label>
                  <select className="input-field" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                    <option value="active">{t('st_student_active')}</option>
                    <option value="inactive">{t('st_student_inactive')}</option>
                    <option value="graduated">{t('st_student_graduated')}</option>
                    <option value="dropped">{t('st_student_dropped')}</option>
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">{t('f_note')}</label>
                <textarea className="input-field" rows={3} value={fNotes} onChange={(e) => setFNotes(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void submit()} disabled={busy || !fCode.trim() || !fName.trim() || (!editing && !fBranch)}>
                {busy ? t('loading') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Chi tiết học viên + Ghi danh ===== */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-3xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                {t('student_detail')}: <span className="badge badge-primary">{detail.studentCode}</span> {detail.fullName}
              </h3>
              <button className="text-xl text-faint" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              <div><span className="text-soft">{t('f_date_of_birth')}:</span> <b>{detail.dateOfBirth ?? '—'}</b></div>
              <div><span className="text-soft">{t('f_gender')}:</span> <b>{t(`gen_${detail.gender ?? 'other'}`)}</b></div>
              <div><span className="text-soft">{t('f_phone')}:</span> <b>{detail.phone ?? '—'}</b></div>
              <div><span className="text-soft">{t('f_guardian_phone')}:</span> <b>{detail.guardianPhone ?? '—'}</b></div>
              <div className="col-span-2"><span className="text-soft">{t('f_identity_ref')}:</span> <b>{detail.identityRef ?? '—'}</b></div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase text-faint">{t('tab_enrollments')}</p>
              <button className="btn-primary text-xs px-4 py-2" onClick={() => setEnrollModal(true)}>+ {t('btn_enroll')}</button>
            </div>
            {enrollments.length === 0 ? (
              <p className="text-sm text-soft py-2">{t('no_enrollments')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" id="enrollTable">
                  <thead>
                    <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="py-2 px-3 font-semibold">{t('col_class')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_program')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_course')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_branch')}</th>
                      <th className="py-2 px-3 font-semibold">{t('col_status')}</th>
                      <th className="py-2 px-3 font-semibold">{t('col_enrolled_at')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((e) => (
                      <tr key={e.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2 px-3"><b>{e.class?.code ?? e.classId}</b></td>
                        <td className="py-2 px-3 text-soft">{e.class?.program?.code ?? '—'}</td>
                        <td className="py-2 px-3 text-soft">{e.class?.course?.code ?? '—'}</td>
                        <td className="py-2 px-3 text-soft">{branches.find((b) => b.id === e.branchId)?.name ?? '—'}</td>
                        <td className="py-2 px-3">{enrStatusBadge(e.status, t)}</td>
                        <td className="py-2 px-3 text-soft">{e.enrolledAt?.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== MODAL: Ghi danh vào lớp ===== */}
      {enrollModal && detail && (
        <div id="enrollModal" className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('modal_enroll')}: {detail.fullName}</h3>
              <button className="text-xl text-faint" onClick={() => setEnrollModal(false)}>✕</button>
            </div>
            <label className="block text-sm font-semibold mb-1.5">{t('f_class')}</label>
            <select className="input-field" value={enrollClass} onChange={(e) => setEnrollClass(e.target.value)}>
              <option value="">{t('opt_none')}</option>
              {classes
                .filter((c) => c.enrolledCount < c.capacity)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.enrolledCount}/{c.capacity} chỗ)
                  </option>
                ))}
            </select>
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setEnrollModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void doEnroll()} disabled={!enrollClass}>
                {t('btn_enroll')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
